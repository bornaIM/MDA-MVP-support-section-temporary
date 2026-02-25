import {
    Stack,
    Text,
    IconButton,
    IconQuestion,
    Grid,
    Heading,
} from "@dexcomit/web-ui-lib";
import useTranslation from "next-translate/useTranslation";
import { DateInputManual } from "@components/forms/date-input/date-input-form-field/date-input-manual";
import useDateInputFormFieldHelpers from "@/utils/use-date-input-form-field-helpers";
import { useFeatureFlags } from "@dexcomit/web-vendor-framework/feature/vendor/local";
import { useProvider } from "@/context/components-context";

export interface PatientInformationFormData {
    reporterType: string;
    username?: string;
    title: string;
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    secondaryEmail: string;
    phone: string;
    secondaryPhone: string;
    languageCode: string;
    gender: string;
    birthDate: string;
}

export function PatientInformation({
    handleFormChange,
    formData,
    disabledFields,
    isMyself,
    disablePrefilledFields,
    handleBlur,
    errors,
    isGuest,
    phoneExceptions,
}: {
    handleFormChange: (event: React.ChangeEvent<any>) => void;
    formData: PatientInformationFormData;
    disabledFields?: Partial<Record<keyof PatientInformationFormData, boolean>>;
    disablePrefilledFields: boolean;
    isMyself: boolean;
    handleBlur: (event: React.FocusEvent<any>) => void;
    errors: { [key: string]: string | undefined };
    isGuest?: boolean;
    phoneExceptions?: {
        phone: boolean;
        secondaryPhone: boolean;
    };
}) {
    const { t } = useTranslation();
    const { useCustomPhoneFormat } = useFeatureFlags();
    const useCustomPhoneFormatForPhone =
        useCustomPhoneFormat && !phoneExceptions?.phone;
    const useCustomPhoneFormatForSecondaryPhone =
        useCustomPhoneFormat && !phoneExceptions?.secondaryPhone;
    const { FieldFormControl, FieldFormControlSelect } = useProvider();

    function isValid(name: string) {
        return (
            !errors[name] &&
            !!formData[name as keyof PatientInformationFormData]
        );
    }

    const {
        convertString,
        validateString,
        dateStandardFormat,
        dateSimpleFormat,
        dateStandardPattern,
    } = useDateInputFormFieldHelpers();

    function validateBirthDate(value: string) {
        const birthDate = convertString(
            value,
            dateSimpleFormat,
            dateStandardFormat,
        );
        const isValid = validateString(birthDate, dateStandardPattern);
        if (!isValid)
            return t("support:patientInformation.error.birthDate.pattern");
    }

    return (
        <>
            <Heading size="lg" mt={10}>
                {t("support:patientInformation.header")}
            </Heading>
            <Text mb={5} fontSize={18}>
                {t("support:patientInformation.subheader")}
            </Text>
            <Stack spacing={4}>
                {isMyself && (
                    <FieldFormControl
                        name="reporterType"
                        value="Myself"
                        i18nField={
                            "support:patientInformation.form.reporterType"
                        }
                        onChange={handleFormChange}
                        type="text"
                        isDisabled={isMyself}
                        isValid={!errors.reporter}
                        onBlur={handleBlur}
                    />
                )}
                {!isGuest && (
                    <FieldFormControl
                        name="username"
                        value={formData.username}
                        i18nField={"support:patientInformation.form.username"}
                        type="text"
                        onChange={handleFormChange}
                        // TODO: see why this is throwing error
                        // @ts-ignore
                        popover={{
                            children: (
                                <IconButton
                                    aria-label={t("common:popover.ariaLabel")}
                                >
                                    <IconQuestion color="var(--chakra-colors-black)" />
                                </IconButton>
                            ),
                            content: t(
                                "support:patientInformation.form.username.popover",
                            ),
                        }}
                        isDisabled={
                            disablePrefilledFields && disabledFields?.username
                        }
                        isValid={isValid("username")}
                        onBlur={handleBlur}
                    />
                )}
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "20% 1fr",
                    }}
                    gap={4}
                >
                    <FieldFormControlSelect
                        name="title"
                        w={"100%"}
                        value={formData.title}
                        i18nField={"support:patientInformation.form.title"}
                        onChange={handleFormChange}
                        isValid={isValid("title")}
                        onBlur={handleBlur}
                    />
                    <FieldFormControl
                        w={"100%"}
                        name="firstName"
                        value={formData.firstName}
                        i18nField={"support:patientInformation.form.firstName"}
                        onChange={handleFormChange}
                        type="text"
                        isDisabled={
                            disablePrefilledFields && disabledFields?.firstName
                        }
                        isValid={isValid("firstName")}
                        onBlur={handleBlur}
                    />
                </Grid>

                <FieldFormControl
                    name="lastName"
                    value={formData.lastName}
                    i18nField={"support:patientInformation.form.lastName"}
                    onChange={handleFormChange}
                    type="text"
                    isDisabled={
                        disablePrefilledFields && disabledFields?.lastName
                    }
                    isValid={isValid("lastName")}
                    onBlur={handleBlur}
                />
                <FieldFormControl
                    name="nickName"
                    value={formData.nickName}
                    i18nField={"support:patientInformation.form.nickName"}
                    onChange={handleFormChange}
                    type="text"
                    isValid={isValid("nickName")}
                    onBlur={handleBlur}
                />
                <FieldFormControl
                    name="email"
                    value={formData.email}
                    i18nField={"support:patientInformation.form.email"}
                    onChange={handleFormChange}
                    type="email"
                    isDisabled={disablePrefilledFields && disabledFields?.email}
                    isValid={isValid("email")}
                    onBlur={handleBlur}
                />
                <FieldFormControl
                    name="secondaryEmail"
                    value={formData.secondaryEmail}
                    i18nField={"support:patientInformation.form.secondaryEmail"}
                    onChange={handleFormChange}
                    type="email"
                    isValid={isValid("secondaryEmail")}
                    onBlur={handleBlur}
                />
                <FieldFormControl
                    name="phone"
                    value={formData.phone}
                    i18nField={"support:patientInformation.form.phone"}
                    ignorePhoneHelpers={!!phoneExceptions?.phone}
                    onChange={handleFormChange}
                    isDisabled={disablePrefilledFields && disabledFields?.phone}
                    isValid={isValid("phone")}
                    onBlur={handleBlur}
                    type={useCustomPhoneFormatForPhone ? "text" : "tel"}
                    autoComplete={useCustomPhoneFormatForPhone ? "off" : "on"}
                />
                <FieldFormControl
                    name="secondaryPhone"
                    value={formData.secondaryPhone}
                    i18nField={"support:patientInformation.form.secondaryPhone"}
                    onChange={handleFormChange}
                    ignorePhoneHelpers={!!phoneExceptions?.secondaryPhone}
                    isValid={isValid("secondaryPhone")}
                    onBlur={handleBlur}
                    type={
                        useCustomPhoneFormatForSecondaryPhone ? "text" : "tel"
                    }
                    autoComplete={useCustomPhoneFormat ? "off" : "on"}
                />
                <FieldFormControlSelect
                    name="languageCode"
                    value={formData.languageCode}
                    i18nField={"support:patientInformation.form.languageCode"}
                    onChange={handleFormChange}
                    // TODO: see why this is throwing error
                    // @ts-ignore
                    popover={{
                        children: (
                            <IconButton
                                aria-label={t("common:popover.ariaLabel")}
                            >
                                <IconQuestion color="var(--chakra-colors-black)" />
                            </IconButton>
                        ),
                        content: t(
                            "support:patientInformation.form.languageCode.popover",
                        ),
                    }}
                    isValid={isValid("languageCode")}
                    onBlur={handleBlur}
                />

                <FieldFormControlSelect
                    name="gender"
                    value={formData.gender}
                    i18nField={"support:patientInformation.form.gender"}
                    onChange={handleFormChange}
                    // TODO: see why this is throwing error
                    // @ts-ignore
                    popover={{
                        children: (
                            <IconButton
                                aria-label={t("common:popover.ariaLabel")}
                            >
                                <IconQuestion color="var(--chakra-colors-black)" />
                            </IconButton>
                        ),
                        content: t(
                            "support:patientInformation.form.gender.popover",
                        ),
                    }}
                    isValid={isValid("gender")}
                    onBlur={handleBlur}
                />
                <DateInputManual
                    name="birthDate"
                    isDisabled={
                        disablePrefilledFields && disabledFields?.birthDate
                    }
                    labelFunction={() =>
                        t("support:patientInformation.form.dob.label")
                    }
                    w={{ base: "100%", md: "30%" }}
                    sx={{ input: { textTransform: "uppercase" } }}
                    validate={validateBirthDate}
                />
            </Stack>
        </>
    );
}
