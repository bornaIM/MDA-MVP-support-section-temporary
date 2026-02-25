// Removes healthcare professional for all users except guest

import { useMemo } from "react";
import { ReporterType } from "./reporter-information";
import useTranslation from "next-translate/useTranslation";
import { SUPPORT_FORM_MODE } from '@lib/forms/support-form/support-form-enums';

function useReporterOptions(mode?: SUPPORT_FORM_MODE){
    const {t} = useTranslation();
    const reporterOptions = useMemo(() => {
        const options = t(
            `support:reporterInformation.form.reporterType.options`,
            [],
            {
                returnObjects: true,
            }
        ) as Array<{ key: keyof ReporterType; value: string }>;
        const formattedOptions = options.map((option) => {
            const [key, value] = Object.entries(option)[0];
            return { value: key, label: value as string }; 
        });
        if (mode === SUPPORT_FORM_MODE.DEPENDENT) {
            return formattedOptions.filter(
                (option) => !['healthcareProfessional', 'partner', 'patient'].includes(option.value));
        }
        return formattedOptions;
    }, [mode]);
    return reporterOptions;
}

export default useReporterOptions;