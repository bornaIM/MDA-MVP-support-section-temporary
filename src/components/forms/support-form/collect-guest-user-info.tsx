import { Button, Text, Grid, Heading, Box } from '@dexcomit/web-ui-lib';
import { Form, Formik } from 'formik';
import { PatientInformation, PatientInformationFormData } from "./patient-information";
import { useFramework } from "@dexcomit/web-vendor-framework";
import useTranslation from "next-translate/useTranslation";
import { DiabetesInformation, DiabetesInformationFormData } from "./diabetes-information/diabetes-information";
import { SupportAddressForm } from "./select-shipping-address";
import { useRef, useState } from 'react';
import { Address } from '@dexcomit/web-vendor-framework/account';
import { ConfigErrors } from "json-schema-yup-transformer/dist/yup";
import ReporterInformation, { ReporterInformationFormData, ReporterType } from "./reporter-information";
import useReporterOptions from "./use-reporter-options";
import { ReturnProduct } from "./return-product";
import { useSupportForm } from "@lib/forms/support-form/support-form-provider";
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';
import { convertPhoneToInternational } from '@lib/common/phone-converters/phone-number-converters';

import { useFeatureFlags } from '@dexcomit/web-vendor-framework/feature/vendor/local';
import { SFDC_GENDER } from '@lib/forms/support-form/support-form-dictionaries';
import { getInitialPhoneValue } from '@lib/forms/support-form/helpers/get-initial-phone-value';
import { useComponents } from '@/context/components-context';

export type SupportGuestInfoProps = PatientInformationFormData &
    DiabetesInformationFormData & ReporterInformationFormData & {
        selectedAddress: Address | null;
        productReturn: boolean;
    };



type CollectGuestUserInfoProps = {
    onSubmit: (val: SupportGuestInfoProps) => void;
}

export default function CollectGuestUserInfo({ onSubmit }: CollectGuestUserInfoProps) {
    const { t } = useTranslation();
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );
    const [productReturn, setProductReturn] = useState(false);
    const { uiState } = useSupportForm();

    const submitAddressButtonRef = useRef<HTMLButtonElement>(null);

    const {
        localeConfig: { locale },
    } = useFramework();

    const { useValidation, AddressProvider, useManualAddressValidation } = useComponents();

    const { validationFailures, setCurrentAddressHandler } = useManualAddressValidation({ type: "shipping" });

    const { convertString, dateStandardFormat, dateSimpleFormat } = useDateInputFormFieldHelpers();

    const { useCustomPhoneFormat } = useFeatureFlags();


    const patientInformationErrors = t(`support:patientInformation.error`, null, {
        returnObjects: true,
    }) as ConfigErrors;

    const reporterInformationErrors = t(`support:reporterInformation.error`, null, {
        returnObjects: true,
    }) as ConfigErrors;

    const { validationSchema: reporterInformationSchema } = useValidation({
        locale,
        params: {
            schemaName: 'reporter-information',
            config: { errors: reporterInformationErrors },
        },
    });
    const { validationSchema: patientValidationSchema } = useValidation({
        locale,
        params: {
            schemaName: 'patient-information-guest',
            config: { errors: patientInformationErrors },
        },
    });

    const { canUserEditSuggestedAddress } = useFeatureFlags(); //TODO: maybe move context, so that is is available on all components

    const existingUserInfo = uiState?.collectedData?.userInfo
    const patientGender = SFDC_GENDER[existingUserInfo?.gender as keyof typeof SFDC_GENDER] || '';

    const reporterPhone = getInitialPhoneValue(existingUserInfo?.reporterPhone, "", useCustomPhoneFormat, locale);

    const reporterFormData = {
        reporterType: ReporterType.default,
        healthcareProfessional: existingUserInfo?.healthcareProfessional || '',
        familyType: existingUserInfo?.familyType || '',
        reporterTitle: existingUserInfo?.reporterTitle || '',
        reporterFirstName: existingUserInfo?.reporterFirstName || '',
        reporterLastName: existingUserInfo?.reporterLastName || '',
        organization: existingUserInfo?.organization || '',
        reporterEmail: existingUserInfo?.reporterEmail || '',
        reporterPhone: reporterPhone,
    };

    const birthDate = existingUserInfo?.birthDate
        ? convertString(existingUserInfo.birthDate, dateStandardFormat, dateSimpleFormat)
        : "";

    const phone = getInitialPhoneValue(existingUserInfo?.phone, "", useCustomPhoneFormat, locale);
    const secondaryPhone = getInitialPhoneValue(existingUserInfo?.secondaryPhone, "", useCustomPhoneFormat, locale);

    const patientFormData = {
        firstName: existingUserInfo?.firstName || '',
        lastName: existingUserInfo?.lastName || '',
        nickName: existingUserInfo?.nickName || '',
        email: existingUserInfo?.email || '',
        phone: phone,
        languageCode: existingUserInfo?.languageCode || '',
        gender: patientGender,
        birthDate: birthDate,
        title: existingUserInfo?.title || '',
        secondaryEmail: existingUserInfo?.secondaryEmail || '',
        secondaryPhone: secondaryPhone
    };

    const diabetesFormData = {
        patientWeightUnit: existingUserInfo?.patientWeightUnit || '',
        patientWeight: existingUserInfo?.patientWeight || '',
        preferNotToAnswerWeight: existingUserInfo?.preferNotToAnswerWeight || false,
        connectedDevice: existingUserInfo?.connectedDevice || '',
    };


    function handleFormSubmit(
        values: DiabetesInformationFormData & PatientInformationFormData & ReporterInformationFormData
    ) {
        if (validationFailures.length || !selectedAddress) return;

        const { birthDate, phone, reporterPhone, secondaryPhone, ...rest } = values;

        const birthDateConverted = convertString(birthDate, dateSimpleFormat, dateStandardFormat);
        const phoneConverted = useCustomPhoneFormat ? convertPhoneToInternational(phone, locale) : phone;
        const reporterPhoneConverted = useCustomPhoneFormat ? convertPhoneToInternational(reporterPhone, locale) : reporterPhone;
        const secondaryPhoneConverted = useCustomPhoneFormat ? convertPhoneToInternational(secondaryPhone, locale) : secondaryPhone;

        onSubmit({
            ...rest,
            birthDate: birthDateConverted,
            phone: phoneConverted,
            reporterPhone: reporterPhoneConverted,
            secondaryPhone: secondaryPhoneConverted,
            selectedAddress,
            productReturn
        });
    }

    function handleSubmitButtonClick(): void {
        // To validate address form which is within its own <form> element
        submitAddressButtonRef.current?.click();
    }

    const reporterOptions = useReporterOptions();
    return (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
            <Formik
                validationSchema={reporterInformationSchema.concat(patientValidationSchema)}
                initialValues={{ ...reporterFormData, ...patientFormData, ...diabetesFormData }}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                enableReinitialize={true}
                onSubmit={handleFormSubmit}
            >
                {({
                    values,
                    handleBlur,
                    handleSubmit,
                    handleChange,
                    errors,
                }) => {
                    return (
                        <AddressProvider context='support-form-guest'>
                            <Form onSubmit={handleSubmit} noValidate>
                                <ReporterInformation
                                    disablePrefilledFields={false}
                                    handleFormChange={handleChange}
                                    formData={values}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    reporterOptions={reporterOptions}
                                />
                                <PatientInformation
                                    disablePrefilledFields={false}
                                    handleFormChange={handleChange}
                                    formData={values}
                                    isMyself={false}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    isGuest
                                />
                                <Box>
                                    <Heading size="lg" mt={10}>
                                        {t('support:address-select.title')}
                                    </Heading>
                                    <Text mb={5} fontSize={18}>
                                        {t('support:address-select.subtitle')}
                                    </Text>
                                    <SupportAddressForm
                                        type="shipping"
                                        addressCount={0}
                                        name="address"
                                        submitAction={setSelectedAddress}
                                        onValidChange={(valid) => {
                                            // if address is not valid reset selected address
                                            if (
                                                !canUserEditSuggestedAddress &&
                                                !valid
                                            ) {
                                                setSelectedAddress(null);
                                            }
                                        }}
                                        showSaveAddressCheckbox={false}
                                        setCurrentAddressHandler={
                                            setCurrentAddressHandler
                                        }
                                        validationFailures={validationFailures}
                                        submitAddressButtonRef={
                                            submitAddressButtonRef
                                        }
                                    />
                                </Box>
                                <DiabetesInformation />
                                <ReturnProduct setIsProductReturn={(val) => setProductReturn(val as boolean)} productReturn={productReturn} />
                                {(Object.values(errors).length > 0 || validationFailures.length > 0) && (
                                    <Text color="notification.error" mt={10}>
                                        {t(
                                            'support:collectUserInfo.invalidFormMessage'
                                        )}
                                    </Text>
                                )}
                                <Button
                                    width={{ base: "100%", md: "10rem" }}
                                    justifyContent="center"
                                    alignItems="center"
                                    type="submit"
                                    variant="primary"
                                    mt={5}
                                    onClick={handleSubmitButtonClick}
                                >
                                    {t('support:collectUserInfo.submit')}
                                </Button>
                            </Form>
                        </AddressProvider>
                    );
                }}
            </Formik>
        </Grid>
    )
}