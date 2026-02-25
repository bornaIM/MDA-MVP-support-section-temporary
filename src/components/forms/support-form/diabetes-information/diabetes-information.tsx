import {
    Box,
    Text,
    Flex,
    Heading,
    FormControlInput,
    FormControlSelect,
    FormControlCheckbox,
    IconButton,
    IconQuestion, FormControlOptionProps,
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { unitOptions } from './picklist-options/units-options';
import {
    Field,
    FieldInputProps,
    FieldMetaProps,
    FormikProps,
    useFormikContext,
} from 'formik';

export interface DiabetesInformationFormData {
    patientWeightUnit: string;
    patientWeight: string;
    preferNotToAnswerWeight: boolean;
    connectedDevice: string;
}

interface FormikFieldProps {
    field: FieldInputProps<string | number>;
    meta: FieldMetaProps<string | number>;
    form: FormikProps<DiabetesInformationFormData>;
}

export function DiabetesInformation() {
    const { t } = useTranslation();

    const devices = t("support:diabetesInformation.fields.connectedDevice.options", undefined, { returnObjects: true }) as FormControlOptionProps[];

    const { values } = useFormikContext<DiabetesInformationFormData>();

    function validateRequired(
        value: string | number,
        errorMessage: string
    ): string | undefined {
        if (!value) return errorMessage;
    }

    function validateWeight(value: number): string | undefined {
        if (values.preferNotToAnswerWeight) return;
        if (value < 0)
            return t('support:diabetesInformation.error.patientWeight.minimum');
        return validateRequired(
            value,
            t('support:diabetesInformation.error.patientWeight.required')
        );
    }

    function validateWeightUnit(value: string): string | undefined {
        if (values.preferNotToAnswerWeight) return;
        return validateRequired(
            value,
            t('support:diabetesInformation.error.patientWeightUnit.required')
        );
    }

    function validateConnectedDevice(value: string): string | undefined {
        return validateRequired(
            value,
            t('support:diabetesInformation.error.connectedDevice.required')
        );
    }

    return (
        <Flex flexDir="column">
            <Heading size="lg" mt={5}>
                {t('support:diabetesInformation.title')}
            </Heading>
            <Text mb={5}>
                {t('support:diabetesInformation.subtitle')}
            </Text>
            <Flex flexDir="column" gap="1.5rem">
                <Flex gap="0.5rem">
                    <Box flex="0 0">
                        <Field
                            name="patientWeightUnit"
                            validate={validateWeightUnit}
                        >
                            {({ field, form, meta }: FormikFieldProps) => (
                                <FormControlSelect
                                    {...field}
                                    label={t(
                                        'support:diabetesInformation.fields.patientWeightUnit.label'
                                    )}
                                    options={unitOptions}
                                    minW="6rem"
                                    isDisabled={
                                        form.values.preferNotToAnswerWeight
                                    }
                                    isInvalid={!!meta.error}
                                    errorMessage={meta.error && meta.error}
                                />
                            )}
                        </Field>
                    </Box>
                    <Box flex="1 1">
                        <Field name="patientWeight" validate={validateWeight}>
                            {({ field, form, meta }: FormikFieldProps) => (
                                <FormControlInput
                                    {...field}
                                    type="number"
                                    label={t(
                                        'support:diabetesInformation.fields.patientWeight.label'
                                    )}
                                    isDisabled={
                                        form.values.preferNotToAnswerWeight
                                    }
                                    popover={{
                                        children: (
                                            <IconButton aria-label={t('common:popover.ariaLabel')}>
                                                <IconQuestion color="var(--chakra-colors-black)" />
                                            </IconButton>
                                        ),
                                        content: t(
                                            'support:diabetesInformation.fields.patientWeight.popover'
                                        ),
                                    }}
                                    isInvalid={!!meta.error}
                                    errorMessage={meta.error && meta.error}
                                />
                            )}
                        </Field>
                    </Box>
                </Flex>
                <Field name="preferNotToAnswerWeight">
                    {({ field }: FormikFieldProps) => (
                        <FormControlCheckbox
                            {...field}
                            checkboxLabel={t(
                                'support:diabetesInformation.fields.preferNotToAnswerWeight.label'
                            )}
                        />
                    )}
                </Field>

                <Field
                    name="connectedDevice"
                    validate={validateConnectedDevice}
                >
                    {({ field, meta }: FormikFieldProps) => (
                        <FormControlSelect
                            {...field}
                            label={t(
                                'support:diabetesInformation.fields.connectedDevice.label'
                            )}
                            isInvalid={!!meta.error}
                            options={devices}
                            errorMessage={meta.error && meta.error}
                        />
                    )}
                </Field>
            </Flex>
        </Flex>
    );
}
