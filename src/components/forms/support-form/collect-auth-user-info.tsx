import { Button, Grid, Text } from '@dexcomit/web-ui-lib';
import { Form, Formik } from 'formik';
import {
    PatientInformation,
    PatientInformationFormData,
} from './patient-information';
import { useFramework } from '@dexcomit/web-vendor-framework';
import useTranslation from 'next-translate/useTranslation';
import { Profile } from '@dexcomit/web-vendor-framework/dist/esm/customer/types/customer';
import {
    DiabetesInformation,
    DiabetesInformationFormData,
} from './diabetes-information/diabetes-information';
import ReporterInformation, {
    ReporterInformationFormData,
    ReporterType,
} from './reporter-information';
import {
    SupportAddressForm,
    SupportSelectShippingAddress,
} from './select-shipping-address';
import { useMemo, useRef, useState } from 'react';
import { Address } from '@dexcomit/web-vendor-framework/account';
import { ConfigErrors } from 'json-schema-yup-transformer/dist/yup';
import useReporterOptions from './use-reporter-options';
import { ReturnProduct } from './return-product';
import { SUPPORT_FORM_MODE } from '@lib/forms/support-form/support-form-enums';
import { useSupportForm } from '@lib/forms/support-form/support-form-provider';
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';
import { useFeatureFlags } from '@dexcomit/web-vendor-framework/feature/vendor/local';
import { convertPhoneToInternational } from '@lib/common/phone-converters/phone-number-converters';
import { SFDC_GENDER } from '@lib/forms/support-form/support-form-dictionaries';
import { getInitialPhoneValueWithException } from '@lib/forms/support-form/helpers/get-initial-phone-value';
import { ProfileWithSentinelData } from '@lib/forms/support-form/types';
import { DATE_INPUT_MIN_DATE, DATE_INPUT_MAX_DATE } from '../date-input/date-input-form-field/constants';
import { useComponents } from '@/context/components-context';

export type SupportAuthInfoProps = PatientInformationFormData &
    DiabetesInformationFormData &
    ReporterInformationFormData & {
        selectedAddress: Address | null;
        productReturn: boolean;
    };

type CollectAuthUserInfoProps = {
    patient: ProfileWithSentinelData | null;
    reporter: Profile | null;
    onSubmit: (val: SupportAuthInfoProps) => void;
    mode: SUPPORT_FORM_MODE;
};

export default function CollectAuthUserInfo({
    reporter,
    patient,
    onSubmit,
    mode,
}: CollectAuthUserInfoProps) {
    const { t } = useTranslation();
    const { uiState } = useSupportForm();
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );
    const [productReturn, setProductReturn] = useState<boolean>(false);
    const showReporterForm = useMemo(() => {
        return mode !== SUPPORT_FORM_MODE.CAREGIVER;
    }, [mode]);

    const submitAddressButtonRef = useRef<HTMLButtonElement>(null);

    const { useValidation, AddressProvider, useManualAddressValidation } = useComponents();
    const { validationFailures, setCurrentAddressHandler, manageValidationFailures } = useManualAddressValidation({ type: "shipping" });
    const { convertString, dateStandardFormat, dateSimpleFormat, dateStandardPattern } = useDateInputFormFieldHelpers();

    const { useCustomPhoneFormat } = useFeatureFlags();

    const {
        localeConfig: { locale },
    } = useFramework();


    const existingUserInfo = uiState?.collectedData.userInfo;

    const birthDate = existingUserInfo?.birthDate
        ? convertString(existingUserInfo.birthDate, dateStandardFormat, dateSimpleFormat)
        : patient?.birthDate
            ? convertString(patient.birthDate, dateStandardFormat, dateSimpleFormat)
            : "";

    const [ reporterPhone, reporterPhoneException] = getInitialPhoneValueWithException(existingUserInfo?.reporterPhone, reporter?.phone, useCustomPhoneFormat, locale);
    const [ patientPhone, patientPhoneException ] = getInitialPhoneValueWithException(existingUserInfo?.phone, patient?.phone, useCustomPhoneFormat, locale);
    const [ patientSecondaryPhone, patientSecondaryPhoneException] = getInitialPhoneValueWithException(existingUserInfo?.secondaryPhone, "", useCustomPhoneFormat, locale);
    const patientGender = SFDC_GENDER[(existingUserInfo?.gender || patient?.gender) as keyof typeof SFDC_GENDER] || '';
    const devices = t("support:diabetesInformation.fields.connectedDevice.options", undefined, { returnObjects: true }) as {value: string; label: string}[];

    const isDOBFieldDisabled = (date: string | undefined) => { 
        if (
            !date || 
            new Date(date) < DATE_INPUT_MIN_DATE || 
            new Date(date) > DATE_INPUT_MAX_DATE
        ) return false;
        return true
    }

    const getBirthday = () => {
        // TODO: Only for testing to be removed
        if(process.env.NEXT_PUBLIC_SIMULATE_INVALID_DOB !== undefined) {
            return process.env.NEXT_PUBLIC_SIMULATE_INVALID_DOB;
        }
        return birthDate
    }

    const reporterFormData = {
        reporterType: existingUserInfo?.reporterType || (showReporterForm
            ? ReporterType.default
            : ReporterType.myself),
        healthcareProfessional: existingUserInfo?.healthcareProfessional || '',
        familyType: existingUserInfo?.familyType || '',
        reporterTitle: existingUserInfo?.reporterTitle || '',
        reporterFirstName: existingUserInfo?.reporterFirstName || reporter?.firstName || '',
        reporterLastName: existingUserInfo?.reporterLastName || reporter?.lastName || '',
        organization: existingUserInfo?.organization || '',
        reporterEmail: existingUserInfo?.email || reporter?.email || '',
        reporterPhone: reporterPhone,
    };

    const patientFormData = {
        username: existingUserInfo?.username || patient?.username || '',
        firstName: existingUserInfo?.firstName || patient?.firstName || '',
        lastName: existingUserInfo?.lastName || patient?.lastName || '',
        nickName: existingUserInfo?.nickName || patient?.nickName || '',
        email: existingUserInfo?.email || patient?.email || '',
        phone: patientPhone,
        languageCode: existingUserInfo?.languageCode || patient?.languageCode || '',
        gender: patientGender,
        birthDate: getBirthday(), 
        title: existingUserInfo?.title || '',
        secondaryEmail: existingUserInfo?.secondaryEmail || '',
        secondaryPhone: patientSecondaryPhone,
    };

    
    const getConnectedDevice = (connectedDevice: string | undefined) => {
        if(connectedDevice === 'None') {
            return devices.at(-1)?.value || ''; // 'I don't have a connected device' Option
        }
        return connectedDevice || '';
    }

    const diabetesFormData = {
        patientWeightUnit: existingUserInfo?.patientWeightUnit || patient?.patientWeightUnit || '',
        patientWeight: existingUserInfo?.patientWeight || patient?.patientWeight || '',
        preferNotToAnswerWeight: existingUserInfo?.preferNotToAnswerWeight || false,
        connectedDevice: getConnectedDevice(existingUserInfo?.connectedDevice || patient?.connectedDevice)
    };

    const patientDisabledFields = {
        username: !!patient?.username,
        firstName: !!patient?.firstName,
        lastName: !!patient?.lastName,
        email: !!patient?.email,
        phone: !!patient?.phone && !(process.env.NEXT_PUBLIC_UNLOCK_LEGACY_PHONE && patientPhoneException),
        languageCode: !!patient?.languageCode,
        birthDate: isDOBFieldDisabled(patientFormData.birthDate),
    };

    const reporterDisabledFields = {
        reporterFirstName: !!reporter?.firstName,
        reporterLastName: !!reporter?.lastName,
        reporterEmail: !!reporter?.email,
        reporterPhone: !!reporter?.phone && !(process.env.NEXT_PUBLIC_UNLOCK_LEGACY_PHONE && reporterPhoneException),
    };

    const patientInformationErrors = t(
        `support:patientInformation.error`,
        null,
        {
            returnObjects: true,
        }
    ) as ConfigErrors;

    const reporterInformationErrors = t(
        `support:reporterInformation.error`,
        null,
        {
            returnObjects: true,
        }
    ) as ConfigErrors;

    const { validationSchema: reporterInformationSchema } = useValidation({
        locale,
        params: {
            schemaName: 'reporter-information',
            config: { errors: reporterInformationErrors },
            modifications: {
                omit: reporterPhoneException? [ 'reporterPhone'] : []
            }
        }
    });

    const { validationSchema: patientValidationSchema } = useValidation({
        locale,
        params: {
            schemaName: 'patient-information',
            config: { errors: patientInformationErrors },
            modifications: {
                omit: [
                    patientPhoneException && 'phone' || '',
                    patientSecondaryPhoneException && 'secondaryPhone' || ''
                ]
            }
        },
    });

    function handleFormSubmit(
        values: DiabetesInformationFormData &
            PatientInformationFormData &
            ReporterInformationFormData
    ) {
        if (validationFailures.length || !selectedAddress) return;

        const { birthDate, phone, reporterPhone, secondaryPhone, ...rest } = values;

        const birthDateConverted = convertString(birthDate, dateSimpleFormat, dateStandardFormat);

        const phoneConverted = !patientPhoneException && useCustomPhoneFormat ? convertPhoneToInternational(phone, locale) : phone;
        const reporterPhoneConverted = !reporterPhoneException && useCustomPhoneFormat ? convertPhoneToInternational(reporterPhone, locale) : reporterPhone;
        const secondaryPhoneConverted = !patientSecondaryPhoneException && useCustomPhoneFormat ? convertPhoneToInternational(secondaryPhone, locale) : secondaryPhone;

        onSubmit({
            ...rest,
            birthDate: birthDateConverted,
            phone: phoneConverted,
            reporterPhone: reporterPhoneConverted,
            secondaryPhone: secondaryPhoneConverted,
            selectedAddress,
            productReturn,
        });
    }

    const reporterOptions = useReporterOptions(mode);

    function handleSubmitButtonClick(): void {
        // To validate address form which is within its own <form> element
        submitAddressButtonRef.current?.click();
    }

    return (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
            <Formik
                validationSchema={
                    showReporterForm
                        ? reporterInformationSchema.concat(
                              patientValidationSchema
                          )
                        : patientValidationSchema
                }
                initialValues={{
                    ...reporterFormData,
                    ...patientFormData,
                    ...diabetesFormData,
                }}
                validateOnMount={false}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                onSubmit={handleFormSubmit}
            >
                {({ values, handleBlur, handleChange, errors }) => {
                    return (
                        <Form noValidate>
                            {showReporterForm && (
                                <ReporterInformation
                                    disablePrefilledFields={true}
                                    handleFormChange={handleChange}
                                    formData={values}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    reporterOptions={reporterOptions}
                                    disabledFields={reporterDisabledFields}
                                    phoneExceptions={{
                                        reporterPhone: reporterPhoneException
                                    }}
                                />
                            )}
                            <PatientInformation
                                disablePrefilledFields={true}
                                handleFormChange={handleChange}
                                formData={values}
                                isMyself={!showReporterForm}
                                handleBlur={handleBlur}
                                errors={errors}
                                disabledFields={patientDisabledFields}
                                phoneExceptions={{
                                    phone: patientPhoneException,
                                    secondaryPhone: patientSecondaryPhoneException
                                }}
                            />
                            <AddressProvider context="support-form">
                                {mode === SUPPORT_FORM_MODE.GUEST && (
                                    <SupportAddressForm
                                        type="shipping"
                                        addressCount={0}
                                        name="address"
                                        submitAction={setSelectedAddress}
                                        showSaveAddressCheckbox={false}
                                        setCurrentAddressHandler={
                                            setCurrentAddressHandler
                                        }
                                        validationFailures={validationFailures}
                                        submitAddressButtonRef={submitAddressButtonRef}
                                    />
                                )}
                                {mode !== SUPPORT_FORM_MODE.GUEST && (
                                    <SupportSelectShippingAddress
                                        onSelect={setSelectedAddress}
                                        setCurrentAddressHandler={
                                            setCurrentAddressHandler
                                        }
                                        validationFailures={validationFailures}
                                        submitAddressButtonRef={submitAddressButtonRef}
                                        showSaveAddressCheckbox
                                        manageValidationFailures={manageValidationFailures}
                                    />
                                )}
                            </AddressProvider>
                            <DiabetesInformation />
                            <ReturnProduct
                                setIsProductReturn={setProductReturn}
                                productReturn={productReturn}
                            />
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
                                isDisabled={!!validationFailures.length && validationFailures.includes('addressPOBox')}
                                onClick={handleSubmitButtonClick}
                            >
                                {t('support:collectUserInfo.submit')}
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Grid>
    );
}
