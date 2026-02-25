import { useEffect, useMemo, useState } from "react";

import { Address, useAddresses } from "@dexcomit/web-vendor-framework/account";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import {
    Box,
    Link,
    Text,
    useTheme,
    LoadingWrapper,
    Heading,
} from "@dexcomit/web-ui-lib";
import { SupportAddressForm } from "./support-address-form";
import { useProfile } from "@dexcomit/web-vendor-framework/customer";
import { Profile } from "@dexcomit/web-vendor-framework/dist/esm/customer/types/customer";

import { RadioState } from "@context/types/addressTypes";

import {
    normalizeAddressForUI,
    SupportSelectShippingAddressProps,
    ViewMode,
} from "./helpers";
import { useProvider } from "@/context/components-context";

export const SupportSelectShippingAddress = ({
    mode: defaultMode,
    onModeChange,
    onSelect,
    onValuesChange,
    onValidChange,
    showSaveAddressCheckbox,
    validationFailures,
    setCurrentAddressHandler,
    disableHeaders = false,
    submitAddressButtonRef,
    manageValidationFailures,
}: SupportSelectShippingAddressProps) => {
    const { data: addresses, isLoading: addresesLoading } = useAddresses();

    const {
        mapOptionalValues,
        TooManyAddressesAlert,
        AddressSelectRadio,
        MAX_ADDRESS_NUMBER,
        AddressValidationFailures
    } = useProvider();

    const { space } = useTheme();
    const { t } = useTranslation();

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null,
    );
    const [hasSavedAddresses, setHasSavedAddresses] = useState<boolean>();
    const [hasMaxAddresses, setHasMaxAddresses] = useState<boolean>();
    const [mode, setMode] = useState<ViewMode>(
        defaultMode || ViewMode.ReadOnly,
    );

    const [radioSelected, setRadioSelected] = useState<
        RadioState.Saved | RadioState.New
    >(RadioState.New);

    const { data: profile } = useProfile() as {
        data: Profile;
    };

    function updateMode(mode: ViewMode): void {
        setMode(mode);
        onModeChange?.(mode);
    }

    // useEffect used for initialization of the component
    useEffect(() => {
        if (!addresesLoading) {
            const hasAddresses = (addresses?.length ?? 0) > 0;
            const hasMaxAddresses =
                (addresses?.length ?? 0) >= MAX_ADDRESS_NUMBER;

            if (!selectedAddress) {
                const address =
                    addresses?.find((a) => a.isPrimary) ??
                    addresses?.[0] ??
                    null;
                setSelectedAddress(address);
            }

            setHasSavedAddresses(hasAddresses);
            setHasMaxAddresses(hasMaxAddresses);
            updateMode(
                hasAddresses ? ViewMode.ReadOnly : ViewMode.ShowNewAddressForm,
            );
            setRadioSelected(hasAddresses ? RadioState.Saved : RadioState.New);
        }
    }, [addresses?.length]);

    useEffect(() => {
        onSelect(selectedAddress);
    }, [selectedAddress]);

    const getAddressById = (id: string | null) =>
        addresses?.find((a: Address) => a.id === id) ?? null;

    const selectAddress = async (id: string | null) => {
        const targetAddress = id ? getAddressById(id) : null;

        if (targetAddress) {
            setSelectedAddress(targetAddress);
            updateMode(ViewMode.ReadOnly);
        } else {
            setSelectedAddress(null);
        }
    };

    // create address options for the saved address select
    const customerAddressOptions = useMemo(
        () => [
            ...(addresses?.map((a) => ({
                label: `${a.address1}${a.address2 ? ", " + a.address2 : ""}${
                    a.address3 ? ", " + a.address3 : ""
                }, ${a.city}, ${a.stateProvince} ${a.postalCode}`,
                value: a.id,
            })) ?? []),
        ],
        [addresses],
    );

    const handleRadioChange = (value: RadioState) => {
        setRadioSelected(value);
        if (value === RadioState.New) {
            selectAddress(null);
            updateMode(ViewMode.ShowNewAddressForm);
        }
    };

    const isRadioAddressValid = useMemo(() => {
        if (radioSelected === RadioState.Saved) {
            return !!selectedAddress;
        }
        return true;
    }, [radioSelected, selectedAddress]);

    useEffect(() => {
        manageValidationFailures("selectAddress", () => isRadioAddressValid);
    }, [radioSelected, selectedAddress]);

    const handleSavedOptionChange = (value: string) => {
        selectAddress(value);
    };

    function getNormalizedSelectedAddressForUI() {
        const address =
            selectedAddress?.id === "not-saved"
                ? selectedAddress
                : getAddressById(selectedAddress?.id ?? null);

        return mapOptionalValues(normalizeAddressForUI(address), [
            "address1",
            "address2",
            "address3",
            "city",
            "stateProvince",
            "postalCode",
        ]);
    }

    useEffect(() => {
        if (!profile) {
            updateMode(ViewMode.ShowNewAddressForm);
        }
    }, [profile]);

    return (
        <LoadingWrapper
            isLoading={addresesLoading && !!profile}
            variant="white"
        >
            {!disableHeaders && (
                <>
                    <Heading size={"lg"} mt={10}>
                        {t("support:address-select.title")}
                    </Heading>
                    <Text mb="6">{t("support:address-select.subtitle")}</Text>
                </>
            )}
            <Box>
                {mode === ViewMode.ReadOnly && (
                    <>
                        <Box mb={space.s} textStyle="b2">
                            <Trans
                                i18nKey="support:address-select.markup.addressOnly"
                                components={[
                                    <div />,
                                    <span style={{ display: "block" }} />,
                                ]}
                                values={getNormalizedSelectedAddressForUI()}
                            />

                            <Link
                                as="button"
                                variant="greenText"
                                mb={space.m}
                                textStyle="b3"
                                onClick={() => {
                                    updateMode(
                                        hasSavedAddresses
                                            ? ViewMode.RadioInput
                                            : ViewMode.ShowNewAddressForm,
                                    );
                                    setRadioSelected(
                                        hasSavedAddresses
                                            ? RadioState.Saved
                                            : RadioState.New,
                                    );
                                }}
                            >
                                {t(
                                    "support:address-select.button.changeAddress",
                                )}
                            </Link>
                        </Box>
                    </>
                )}
                {mode >= ViewMode.RadioInput && hasSavedAddresses && (
                    <AddressSelectRadio
                        name={"support-form"}
                        radioSelected={radioSelected}
                        addresses={addresses}
                        selectedAddressId={selectedAddress?.id ?? ""}
                        handleRadioChange={handleRadioChange}
                        handleSavedOptionChange={handleSavedOptionChange}
                    />
                )}
                {mode === ViewMode.ShowNewAddressForm &&
                    ((!hasMaxAddresses && radioSelected === RadioState.New) ||
                        !profile) && (
                        <SupportAddressForm
                            addressCount={addresses?.length ?? 0}
                            name="addAddress"
                            type="Shipping"
                            submitAction={(address: Address) => {
                                setSelectedAddress(address);
                                setRadioSelected(RadioState.Saved);
                                updateMode(ViewMode.ReadOnly);
                            }}
                            onValidChange={onValidChange}
                            onValuesChange={onValuesChange}
                            showSaveAddressCheckbox={showSaveAddressCheckbox}
                            setCurrentAddressHandler={setCurrentAddressHandler}
                            validationFailures={validationFailures}
                            submitAddressButtonRef={submitAddressButtonRef}
                        />
                    )}
                <AddressValidationFailures failures={validationFailures} />
                {mode === ViewMode.ShowNewAddressForm &&
                    hasMaxAddresses &&
                    radioSelected === RadioState.New && (
                        <TooManyAddressesAlert />
                    )}
            </Box>
        </LoadingWrapper>
    );
};
