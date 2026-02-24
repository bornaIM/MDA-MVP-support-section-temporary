import { useMemo } from 'react';
import { Form, Formik, type FormikValues } from 'formik';
import { Button, VStack, Text, Box } from '@dexcomit/web-ui-lib';
import { TsgInterviewField } from './tsg-interview-field';
import type { SalesforceApiTemplate, TsgFormSubmitData } from './types';
import {
    createTemplatesMap,
    getTsgFieldError,
    getTsgFieldTouched,
    getTsgInitialValues,
    normalizeTsgQuestion,
    OPTED_OUT_ANSWER_VALUE,
    parseSfOptions,
    sortTemplates,
} from './helpers';
import useTranslation from 'next-translate/useTranslation';
import { Translate } from 'next-translate';
import { useSupportForm } from '@lib/forms/support-form/support-form-provider';
import { useDynamicTSGForm } from './use-dynamic-tsg-form';
import { IssueFlags } from '../issue-category/types';
import { SFDC_ISSUE_CODES } from '@lib/forms/support-form/support-form-dictionaries';
import { trimISOString } from '@lib/forms/support-form/helpers/format-dates';
import { useComponents } from '@/context/components-context';

interface TsgInterviewFormProps {
    templates: SalesforceApiTemplate[];
    onSubmit?: (data: TsgFormSubmitData) => void | Promise<void>;
    code: string;
    flags: IssueFlags;
}

const validation = (
    templatesMap: Record<string, SalesforceApiTemplate>,
    values: FormikValues,
    t: Translate
): Record<string, string> => {
    const errors: Record<string, string> = {};
    Object.values(templatesMap).forEach((template) => {
        if (template.questionRef.questionType === 'Display') return;

        // 1) Check did user opt out of answering current question
        const questionId = template.questionId;

        // 2) Check does value exist
        const value = values[questionId];

        if (value === OPTED_OUT_ANSWER_VALUE) return;

        if (
            !value ||
            (typeof value === 'string' && !value?.trim()) ||
            (Array.isArray(value) && !value.length)
        ) {
            errors[questionId] = t('support:tsgInterview.error.required');
            return;
        }

        // 2) Validate value if validation is provided
        const validationPattern = template.validationPattern;
        const validationErrorMessage = template.validationMismatchMessage;

        if (validationPattern) {
            const regex = new RegExp(validationPattern);
            if (!regex.test(value)) {
                errors[questionId] = validationErrorMessage || t('support:tsgInterview.error.invalidFormat');
            }
        }
    });

    return errors;
};

/**
 * UI component which takes data about the TSG form from SF and dynamically renders input components.
 *
 * @param templateHeader Pass in SF data
 * @param onSubmit Called when user enters valid data in the form and submits
 */
export function TsgInterviewForm({
    templates,
    onSubmit,
    flags,
    code
}: TsgInterviewFormProps) {
    const { t } = useTranslation();

    const { uiState } = useSupportForm();
    const { useDateInputFormFieldHelpers } = useComponents();

    // Sort templates and memoize
    const sortedTemplates = useMemo(
        () => sortTemplates(templates),
        [templates.map((t) => t.questionId).join('|')]
    );

    // Filtered tsg questions according to the constraints
    const { questionsToRender, addNewAnswerToDynamicForm, touchedFields } =
        useDynamicTSGForm(sortedTemplates, uiState?.collectedData?.tsgInterview);

    // Map created and memoized here so that it doesn't have to be calculated again in the validation function
    const templatesMap = useMemo(
        () => createTemplatesMap(questionsToRender),
        [questionsToRender]
    );

    const sensorIssueWarmupQuestion = useMemo(
        () =>
            questionsToRender.find(
                (question: SalesforceApiTemplate) =>
                    normalizeTsgQuestion(question.questionRef?.customerQuestionText || '') ===
                    normalizeTsgQuestion(t('support:tsgInterview.sensorIssueWarmup.questionText'))
            ),
        [questionsToRender]
    );
    const {stringToDate} = useDateInputFormFieldHelpers;
    const initialValues = useMemo(() => {
        const baseFormValues = getTsgInitialValues(questionsToRender);

        if ((code === SFDC_ISSUE_CODES.SensorFailedG6 || code === SFDC_ISSUE_CODES.SensorFailedG7) && sensorIssueWarmupQuestion) {
            const sensorIssueOptions = sensorIssueWarmupQuestion.questionRef?.value ? parseSfOptions(sensorIssueWarmupQuestion.questionRef.value) : null;

            const duringWarmupOptionIdentifier = t("support:tsgInterview.sensorIssueWarmup.duringWarmup").toLowerCase();
            const afterWarmupOptionIdentifier = t("support:tsgInterview.sensorIssueWarmup.afterWarmup").toLowerCase();

            const duringWarmupOption = sensorIssueOptions?.find(option => option.value.toLowerCase() === duringWarmupOptionIdentifier);
            const afterWarmupOption = sensorIssueOptions?.find(option => option.value.toLowerCase() === afterWarmupOptionIdentifier);

            if (flags.issueDuringWarmup && duringWarmupOption) baseFormValues[sensorIssueWarmupQuestion.questionId] = duringWarmupOption.value;
            else if (!flags.issueDuringWarmup && afterWarmupOption) baseFormValues[sensorIssueWarmupQuestion.questionId] = afterWarmupOption.value;
        }
        return baseFormValues;
    }, [questionsToRender, uiState?.collectedData?.tsgInterview, sensorIssueWarmupQuestion]);

    const initialErrors = useMemo(() => {

        const initialErrors: Record<string, string> = validation(
            templatesMap,
            initialValues,
            t
        );

        return initialErrors;
    }, [initialValues]);

    const handleSubmit = (values: FormikValues): void => {
        const data: TsgFormSubmitData = Object.entries(values).map(
            ([key, value]) => {
                let formattedValue = value
                if(templatesMap[key].questionRef.questionType === 'Date') {
                    formattedValue = trimISOString(stringToDate(value).toISOString())
                }
                return  ({ questionId: key, response: formattedValue,
                    salesforceApiTemplate: templatesMap[key],});
            })
        onSubmit?.(data);
    };

    return (
        // TODO: Formik does not gives us much value here anymore, evaluate if we can safely remove it
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={(values) => validation(templatesMap, values, t)}
            initialTouched={touchedFields}
            initialErrors={initialErrors}
            // TODO:deprecated property isInitialValid, find a better way
            isInitialValid={Object.values(initialErrors).length === 0}
        >
            {({
                values,
                handleBlur,
                handleChange,
                errors,
                isValid,
                touched,
                setFieldValue,
            }) => (
                <Form>
                    <VStack alignItems="stretch" gap="3rem">
                        {questionsToRender.map((t) => (
                            <TsgInterviewField
                                key={t.questionId}
                                template={t}
                                value={
                                    initialValues[t.questionId] ||
                                    values[t.questionId]
                                }
                                onChange={(e: React.ChangeEvent<any>) => {
                                    handleChange(e);
                                    addNewAnswerToDynamicForm(
                                        t.questionId,
                                        t.questionCode!,
                                        e.target.value
                                    );
                                }}
                                onBlur={handleBlur}
                                error={getTsgFieldError(
                                    values,
                                    errors,
                                    t.questionId
                                )}
                                touched={getTsgFieldTouched(
                                    touched,
                                    t.questionId
                                )}
                                onCheckedChange={async (val) => {
                                    await setFieldValue(t.questionId, val);
                                    addNewAnswerToDynamicForm(
                                        t.questionId,
                                        t.questionCode!,
                                        val as string[]
                                    );
                                }}
                                onOptOutChange={(isOptedOut) => {
                                    let answer = '';
                                    if (isOptedOut) {
                                        answer = OPTED_OUT_ANSWER_VALUE;
                                    }

                                    setFieldValue(t.questionId, answer);
                                    addNewAnswerToDynamicForm(
                                        t.questionId,
                                        t.questionCode!,
                                        answer
                                    );
                                }}
                                isDisabled={
                                    sensorIssueWarmupQuestion?.questionId === t.questionId
                                     && !!initialValues[t.questionId]
                                }
                                flags={uiState?.flags}
                                issueDate={new Date(uiState?.collectedData.issueDate!)}
                            />
                        ))}
                        <Box>
                            <Text textStyle={'b2'} pb={'1rem'}>{t('support:tsgInterview.reminderMessage')}</Text>
                            <Button
                                width={{ base: "100%", md: "10rem" }}
                                justifyContent="center"
                                alignItems="center"
                                isDisabled={!isValid}
                                type="submit"
                                alignSelf="start"
                            >
                                {t('support:tsgInterview.next')}
                            </Button>
                        </Box>
                        </VStack>
                </Form>
            )}
        </Formik>
    );
}
