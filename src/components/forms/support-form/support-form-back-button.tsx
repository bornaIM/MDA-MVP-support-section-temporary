import { Link, useTheme } from "@dexcomit/web-ui-lib";
import useTranslation from "next-translate/useTranslation";

type SupportFormBackButtonProps = {
    onClick: () => void;
}

export function SupportFormBackButton({onClick}: SupportFormBackButtonProps){
    const { t } = useTranslation();
    const { space } = useTheme();

    return (<Link
        variant="back"
        children={t('common:link-back')}
        me={space.m}
        onClick={onClick}
    />)
}