import type { SalesforceApiTemplate } from './types';
import type { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { IssueFlags } from '../issue-category/types';
import { Translate } from 'next-translate';

export const OPTED_OUT_ANSWER_VALUE = "NI"

export function createTemplatesMap(
    templates: SalesforceApiTemplate[]
): Record<string, SalesforceApiTemplate> {
    const templatesMap: Record<string, SalesforceApiTemplate> = {};

    templates.forEach((t) => {
        templatesMap[t.questionId] = t;
    });

    return templatesMap;
}

export function sortTemplates(
    templates: SalesforceApiTemplate[]
): SalesforceApiTemplate[] {
    return templates.sort((a, b) => a.order - b.order);
}

/**
 * For parsing options for questions of type 'Checkboxes' and 'Picklist'
 * @param optionsStr String containing options separated by pipe character (e.g. Yes|No|Other)
 */
export function parseSfOptions(
    optionsStr: string
): { label: string; value: string }[] {
    return optionsStr.split('|').map((option) => ({
        label: option,
        value: option,
    }));
}

/** This is used in testing environments to prefill TSG fields */
function getPrefillValueForTsgQuestion(template: SalesforceApiTemplate): string | string[] {
    switch (template.questionRef.questionType) {
        case 'Checkboxes':
        case 'Picklist':
            const optionsStr = template.questionRef.value;
            const parsedOptions = optionsStr ? parseSfOptions(optionsStr) : [];
            if (!parsedOptions.length) return "";

            const prefillOption = parsedOptions.at(0)?.value;

            if (template.questionRef.questionType === "Checkboxes") {
                if (prefillOption) return [prefillOption];
                else return [];
            } else {
                return prefillOption || "";
            }
        case 'Date':
        case 'Time':
            return new Date().toISOString();
        case 'Text':
            return "Lorem ipsum dolor sit amet"
        default:
            return "";
    }
}

// TODO: prefill option is not supported now when TSG is dynamic, kept here as an option add fix that part
export function getTsgInitialValues(
    templates: SalesforceApiTemplate[],
    options?: { prefill?: boolean }
): Record<string, string | string[]> {
    return Object.fromEntries(
        templates
            .filter((t) => t.questionRef.questionType !== 'Display') // Display isn't an input
            .map((t) => [t.questionRef.id, options?.prefill ? getPrefillValueForTsgQuestion(t) : t.userEnteredAnswer || ''])
    );
}

export function getTsgFieldError(
    values: FormikValues,
    errors: FormikErrors<FormikValues>,
    id: string
): string | null {
    const value = values[id];
    if(value === OPTED_OUT_ANSWER_VALUE) return null;
    
    const error = errors[id];
    if (!error) return null;

    if (typeof error === 'string') return error;

    return 'Field is required';
}

export function getTsgFieldTouched(
    touched: FormikTouched<FormikValues>,
    fieldId: string
): boolean {
    const fieldTouched = touched[fieldId];
    if (!fieldTouched) return false;

    if (typeof fieldTouched === 'boolean') return fieldTouched;

    return false;
}

/** Normalize strings coming from SF and our JSONs to avoid comparrison issues (e.g. two spaces but with different char codes) */
export function normalizeTsgQuestion(option: string): string {
    return option.normalize("NFD").toLowerCase().trim().replace(/\s+/g, " ")
}

/**
 * Function for getting options for picklists and checkboxes.
 * Handles edge-cases for displaying option values, e.g. not showing options that
 * are less than 1h if user has already selected that the issue is over an hour
 */
export function getTsgQuestionOptions(
    template: SalesforceApiTemplate,
    flags: IssueFlags | undefined,
    t: Translate
): { label: string; value: string }[] {
    const parasedOptions = template.questionRef.value ? parseSfOptions(template.questionRef.value) : null;
    if (!parasedOptions?.length) return [];

    const questionText = normalizeTsgQuestion(template.questionRef.customerQuestionText);

    const signalLossDurationQuestionText = normalizeTsgQuestion(t('support:tsgInterview.signalLossDuration.questionText'));
    const isSignalLossDurationQuestion = questionText === signalLossDurationQuestionText;
    const briefSensorIssueQuestionText = normalizeTsgQuestion(t('support:tsgInterview.briefSensorIssue.questionText'));
    const isBriefSensorIssueQuestion = questionText === briefSensorIssueQuestionText;
    
    // Edge case: Signal loss over an hour
    // - In this case we shouldn't display any options that are less than an hour (e.g. Less than 30mins, 30min to 1 hour)
    if ((isSignalLossDurationQuestion || isBriefSensorIssueQuestion) && flags?.issueLastsOverAnHour) {
        
        const optionsLessThan1h = t("support:tsgInterview.optionsLessThan1h", {}, { returnObjects: true }) as string[];
        const optionsLessThan1hNormalized = optionsLessThan1h.map(o => normalizeTsgQuestion(o));

        const filteredOptions = parasedOptions.filter(
            (option) => {
                const normalizedOption = normalizeTsgQuestion(option.value);
                const isLessThan1h = optionsLessThan1hNormalized.includes(normalizedOption);
                return !isLessThan1h;
            }
        );

        return filteredOptions;
    }

    // Default case
    return parasedOptions;
}