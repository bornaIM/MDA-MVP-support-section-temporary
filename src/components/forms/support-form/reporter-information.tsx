import { Stack, Text, Grid, Heading } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { useFeatureFlags } from '@dexcomit/web-vendor-framework/feature/vendor/local';
import { useProvider } from '@/context/components-context';

export interface ReporterInformationFormData {
    reporterType: ReporterType;
    healthcareProfessional: string;
    familyType: string;
    reporterTitle: string;
    reporterFirstName: string;
    reporterLastName: string;
    organization: string;
    reporterEmail: string;
    reporterPhone: string;
}

export enum ReporterType {
    patient = 'patient',
    parent = 'parent',
    familyMember = 'familyMember',
    healthcareProfessional = 'healthcareProfessional',
    spouse = 'spouse',
    other = 'other',
    myself = 'Myself',
    thirdPartyApp = 'partner',
    default = '',
}

export default function ReporterInformation({
    handleFormChange,
    formData,
    disabledFields,
    disablePrefilledFields,
    handleBlur,
    errors,
    reporterOptions,
    phoneExceptions
}: {
    handleFormChange: (event: React.ChangeEvent<any>) => void;
    formData: ReporterInformationFormData;
    disabledFields?: Partial<Record<keyof ReporterInformationFormData, boolean>>;
    disablePrefilledFields: boolean;
    handleBlur: (event: React.FocusEvent<any>) => void;
    errors: { [key: string]: string | undefined };
    reporterOptions: Array<{ label: string; value: string }>;
    phoneExceptions?: {
        reporterPhone: boolean;
    }
}) {
    const { FieldFormControl, FieldFormControlSelect } = useProvider()
    const { t } = useTranslation();

    const { useCustomPhoneFormat } = useFeatureFlags();
    const useCustomPhoneFormatForReporterPhone = useCustomPhoneFormat && !phoneExceptions?.reporterPhone;

    function isValid(name: string) {
        return (
            !errors[name] &&
            !!formData[name as keyof ReporterInformationFormData]
        );
    }

    return (
        <>
            <Heading size="lg">
                {t('support:reporterInformation.header')}
            </Heading>
            <Text mb={5} fontSize={18}>
                {t('support:reporterInformation.subheader')}
            </Text>
            <Stack spacing={4}>
                <FieldFormControlSelect
                    name="reporterType"
                    value="Myself"
                    i18nField={'support:reporterInformation.form.reporterType'}
                    onChange={handleFormChange}
                    type="text"
                    isValid={isValid('reporterType')}
                    onBlur={handleBlur}
                    // TODO: see why this is throwing error
                    // @ts-ignore
                    options={reporterOptions}
                />
                {formData.reporterType ===
                    ReporterType.healthcareProfessional && (
                    <FieldFormControlSelect
                        name="healthcareProfessional"
                        w={'100%'}
                        value={formData.healthcareProfessional}
                        type="text"
                        i18nField={
                            'support:reporterInformation.form.healthcareProfessional'
                        }
                        onChange={handleFormChange}
                        isValid={isValid('healthcareProfessional')}
                        onBlur={handleBlur}
                    />
                )}
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: '20% 1fr',
                    }}
                    gap={4}
                >
                    <FieldFormControlSelect
                        name="reporterTitle"
                        w={'100%'}
                        value={formData.reporterTitle}
                        i18nField={'support:reporterInformation.form.reporterTitle'}
                        onChange={handleFormChange}
                        isValid={isValid('reporterTitle')}
                        onBlur={handleBlur}
                    />
                    <FieldFormControl
                        w={'100%'}
                        name="reporterFirstName"
                        value={formData.reporterFirstName}
                        i18nField={'support:reporterInformation.form.reporterFirstName'}
                        onChange={handleFormChange}
                        type="text"
                        isDisabled={
                            disablePrefilledFields && disabledFields?.reporterFirstName
                        }
                        isValid={isValid('reporterFirstName')}
                        onBlur={handleBlur}
                    />
                </Grid>

                <FieldFormControl
                    name="reporterLastName"
                    value={formData.reporterLastName}
                    i18nField={'support:reporterInformation.form.reporterLastName'}
                    onChange={handleFormChange}
                    type="text"
                    isDisabled={
                        disablePrefilledFields && disabledFields?.reporterLastName
                    }
                    isValid={isValid('reporterLastName')}
                    onBlur={handleBlur}
                />
                {formData.reporterType ===
                    ReporterType.healthcareProfessional && (
                    <FieldFormControl
                        name="organization"
                        value={formData.organization}
                        i18nField={t(
                            'support:reporterInformation.form.organization'
                        )}
                        onChange={handleFormChange}
                        type="text"
                        isValid={isValid('organization')}
                        onBlur={handleBlur}
                    />
                )}
                <FieldFormControl
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    i18nField={'support:reporterInformation.form.reporterEmail'}
                    onChange={handleFormChange}
                    type="email"
                    isDisabled={disablePrefilledFields && disabledFields?.reporterEmail}
                    isValid={isValid('reporterEmail')}
                    onBlur={handleBlur}
                />
                <FieldFormControl
                    name="reporterPhone"
                    value={formData.reporterPhone}
                    i18nField={'support:reporterInformation.form.phoneNumber'}
                    onChange={handleFormChange}
                    ignorePhoneHelpers={!!phoneExceptions?.reporterPhone}
                    isDisabled={disablePrefilledFields && disabledFields?.reporterPhone}
                    isValid={isValid('reporterPhone')}
                    onBlur={handleBlur}
                    type={useCustomPhoneFormatForReporterPhone ? "text" : "tel"}
                    autoComplete={useCustomPhoneFormatForReporterPhone ? "off" : "on"}
                />
            </Stack>
        </>
    );
}
