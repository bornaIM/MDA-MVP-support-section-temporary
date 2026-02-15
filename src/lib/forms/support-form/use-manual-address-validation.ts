import { useCallback, useEffect, useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import type { FormikValues } from 'formik';
import type { Address } from '@dexcomit/web-vendor-framework/account';
import useValidation from '@lib/forms/use-validation';
import { useFeatureFlags } from '@dexcomit/web-vendor-framework/feature/vendor/local';
import validateShippingAddressPattern from '@lib/forms/address/validation';

export function useManualAddressValidation({ type }: { type: string }) {
    const { lang } = useTranslation();
    const { schema: addressSchema } = useValidation({ locale: lang, params: { schemaName: 'addresses', }, });
    const { dontAllowPOBox } = useFeatureFlags();

    const [editingAddress, setEditingAddress] = useState<Partial<Address>>({});
    const [validationFailures, setValidationFailures] = useState<string[]>([]);

    const manageValidationFailures = useCallback((failure: string, test: () => boolean) => {
        setValidationFailures((prev) => {
            const failed = !test();
            const exists = prev.includes(failure);
            if (failed && !exists) return [...prev, failure];
            if (!failed && exists) return prev.filter((f) => f !== failure);
            return prev;
        });
    }, []);

    const meetsPOBoxRequirements = useMemo(() => {
        if (!dontAllowPOBox || (!editingAddress.address1 && !editingAddress.address2)) return true;
        return validateShippingAddressPattern(editingAddress, addressSchema);
    }, [editingAddress]);

    useEffect(() => {
        if (type !== 'Billing') {
            manageValidationFailures('addressPOBox', () => meetsPOBoxRequirements);
        }
    }, [meetsPOBoxRequirements, type, manageValidationFailures]);

    const setCurrentAddressHandler = useCallback((values: FormikValues): void => {
        setEditingAddress({ ...values?.address });
    }, []);

    return { validationFailures, setCurrentAddressHandler, manageValidationFailures };
}
