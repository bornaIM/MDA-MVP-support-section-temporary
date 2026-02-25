import { RefObject, useContext, useEffect } from "react";
import type { Address } from "@dexcomit/web-vendor-framework/account";
import useTranslation from "next-translate/useTranslation";
import {
    Form,
    Formik,
    FormikHelpers,
    FormikValues,
    useFormikContext,
} from "formik";
import { useCreateAddress } from "@dexcomit/web-vendor-framework/account";
import { useProfile } from "@dexcomit/web-vendor-framework/customer";
import { UtilProviderContext } from "@dexcomit/web-util-lib";
import { GridItem, LoadingWrapper } from "@dexcomit/web-ui-lib";

import { FormValues, AddressValues, AddressFormProps } from "@context/types/addressTypes";

import { useSupportForm } from "@lib/forms/support-form/support-form-provider";

import { useFeatureFlags } from "@dexcomit/web-vendor-framework/feature/vendor/local";
import { useComponents } from "@/context/components-context";

export type SupportFormValues = Omit<FormValues, "selectedAddress">;
type SupportAddressFormProps = Omit<AddressFormProps, "submitAction"> & {
    submitAction: (address: Address) => void;
    onValidChange?: (isValid: boolean) => void;
    onValuesChange?: (values: any) => void;
    showSaveAddressCheckbox?: boolean;
    countryCode?: string;
    setCurrentAddressHandler: (values: FormikValues) => void;
    validationFailures: string[];
    submitAddressButtonRef?: RefObject<HTMLButtonElement>;
};

interface FormikContextConsumerProps {
    onValidChange?: (isValid: boolean) => void;
    onValuesChange?: (values: { address: AddressValues }) => void;
}
const POSTAL_CODE_AUTOSUBMIT_TIMEOUT = 500;

// In SupportAddressForm <Formik> is used and it holds form state, this is the way
// to access values and isValid from parent component.
function FormikContextConsumer({
    onValuesChange,
    onValidChange,
}: FormikContextConsumerProps) {
    const { isValid, values } = useFormikContext();

    useEffect(() => {
        onValidChange?.(isValid);
    }, [isValid]);

    useEffect(() => {
        onValuesChange?.(values as { address: AddressValues });
    }, [values]);

    return null;
}

export function SupportAddressForm({
    submitAction,
    addressCount,
    type,
    onValidChange,
    onValuesChange,
    showSaveAddressCheckbox,
    countryCode,
    setCurrentAddressHandler,
    validationFailures,
    submitAddressButtonRef,
}: SupportAddressFormProps) {
    const createAddress = useCreateAddress();
    const {
        AddressContext,
        NewAddressInputForm,
        AddressFormProps,
        MAX_ADDRESS_NUMBER,
        TooManyAddressesAlert,
        AddressValidationFailures,
        useGetStateProvinceFromCode
    } = useComponents();
    
    const formatProvinceCode = useGetStateProvinceFromCode();
    const { logger } = useContext(UtilProviderContext);
    const { data: profile } = useProfile();

    const {
        validationSchema,
        isLoqateOptionSelected,
        autoSubmit,
        runValidation,
    } = useContext(AddressContext);

    const { lang } = useTranslation();
    const country = countryCode || lang.split("-")[1]; // Country based on locale
    const { uiState } = useSupportForm();
    const existingAddress = uiState?.collectedData.userInfo?.selectedAddress;

    const { canUserEditSuggestedAddress } = useFeatureFlags(); //TODO: maybe move context, so that is is available on all components

    // Formik setup initial values, form submit handler
    const initialValues: SupportFormValues = {
        address: {
            address1: existingAddress?.address1 || "",
            address2: existingAddress?.address2 || "",
            address3: existingAddress?.address3 || "",
            city: existingAddress?.city || "",
            stateProvince: existingAddress?.stateProvince || "",
            postalCode: existingAddress?.postalCode || "",
            countryCode: existingAddress?.countryCode || "",
            isPrimary: addressCount === 0,
        },
        saveAddress: false,
    };

    const submitForm = async ({
        address: {
            address1,
            address2,
            address3,
            city,
            stateProvince,
            postalCode,
        },
        saveAddress,
    }: SupportFormValues) => {
        if (validationFailures.length) return;

        // Standard Add New Address Handling
        const addressCurrent = {
            address1,
            address2: address2.length ? address2 : undefined,
            address3: address3.length ? address3 : undefined,
            city,
            stateProvince: stateProvince.length
                ? formatProvinceCode(stateProvince)
                : undefined,
            postalCode: postalCode,
            countryCode: country,
            isPrimary: false,
        };

        // create newly entered addresss
        const newId = !saveAddress
            ? "not-saved"
            : await createAddress(addressCurrent);
        if (!newId || newId === "error") {
            logger?.error(
                `Address creation failed | GCAID: ${profile?.gcaid}}`,
                {
                    address: addressCurrent,
                },
            );
        }

        if (!!submitAction) {
            submitAction({ id: newId, type, ...addressCurrent });
        }
    };

    return (
        <GridItem colSpan={{ base: 6 }}>
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={runValidation}
                validateOnChange={runValidation}
                validateOnBlur={runValidation}
                onSubmit={submitForm}
            >
                {({
                    setFieldValue,
                    isSubmitting,
                    setFieldTouched,
                    submitForm,
                    values,
                }) => {
                    /*
                        HACK: autoSubmit functionality is not triggered on field1 and field 2
                        in case of support form, after we get the loqate response, address
                        form is only submitted after we blur out of address2
                        To avoid this, we force the submit as soon as postalCode is filled in 
                        (which in this case happens only after loqate response)
                    */
                    const setFieldValueWrapper = (
                        field: string,
                        value: any,
                        shouldValidate?: boolean,
                    ) => {
                        return setFieldValue(field, value, shouldValidate).then(
                            (result) => {
                                if (field === "address.postalCode") {
                                    setTimeout(
                                        submitForm,
                                        POSTAL_CODE_AUTOSUBMIT_TIMEOUT,
                                    );
                                }
                                return result;
                            },
                        );
                    };

                    useEffect(() => {
                        if (
                            !canUserEditSuggestedAddress &&
                            !isLoqateOptionSelected
                        ) {
                            setFieldValue("address.address2", "");
                            setFieldValue("address.address3", "");
                            setFieldValue("address.city", "");
                            setFieldValue("address.countryCode", "");
                            setFieldValue("address.isPrimary", false);
                            setFieldValue("address.postalCode", "");
                            setFieldValue("address.stateProvince", "");
                        }
                    }, [isLoqateOptionSelected, canUserEditSuggestedAddress]);

                    return (
                        <>
                            <FormikContextConsumer
                                onValidChange={onValidChange}
                                onValuesChange={onValuesChange}
                            />
                            <LoadingWrapper isLoading={isSubmitting}>
                                <Form
                                    onBlur={() =>
                                        setCurrentAddressHandler(values)
                                    }
                                >
                                    {addressCount < MAX_ADDRESS_NUMBER && (
                                        <NewAddressInputForm
                                            addressCount={addressCount}
                                            country={country}
                                            setFieldValue={
                                                autoSubmit
                                                    ? setFieldValueWrapper
                                                    : setFieldValue
                                            }
                                            setFieldTouched={setFieldTouched}
                                            disableSettingAsPrimary={true}
                                            showSaveAddressCheckbox={
                                                showSaveAddressCheckbox
                                            }
                                        />
                                    )}

                                    <AddressValidationFailures
                                        failures={validationFailures}
                                    />

                                    {addressCount >= MAX_ADDRESS_NUMBER && (
                                        <TooManyAddressesAlert />
                                    )}
                                </Form>
                            </LoadingWrapper>

                            {/* Trick to validate address form fields from CollectAuthInfo to display error messages on
                         submit attempt. This is hidden from the user and screen readers */}
                            <button
                                type="button"
                                style={{
                                    display: "none",
                                    visibility: "hidden",
                                }}
                                onClick={submitForm}
                                ref={submitAddressButtonRef}
                            />
                        </>
                    );
                }}
            </Formik>
        </GridItem>
    );
}
