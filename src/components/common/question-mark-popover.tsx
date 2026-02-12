import {
    IconButton,
    IconQuestion,
    Popover,
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';

export default function QuestionMarkPopover({content}: { content: string | React.ReactNode }) {
    const { t } = useTranslation();
    return (
        <Popover content={content}>
            <IconButton aria-label={t('common:popover.ariaLabel')} icon={<IconQuestion color="var(--chakra-colors-black)" />} />
        </Popover>
    );
}
