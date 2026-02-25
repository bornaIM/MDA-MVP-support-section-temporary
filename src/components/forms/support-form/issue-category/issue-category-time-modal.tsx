import { Button } from '@chakra-ui/button';
import { Text, ModalDialog, HStack } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { SFDC_ISSUE_CODES } from '@lib/forms/support-form/support-form-dictionaries';
import { IssueFlags } from './types';
import { RefObject } from 'react';
import { FocusableElement } from '@chakra-ui/utils';
import { useDelayedInteractable } from '@lib/common/use-delayed-interactable';
import { useProvider } from '@/context/components-context';

export default function IssueCategoryTimeModal({
    issue,
    isOpen,
    onClose,
    handleFlags,
    finalFocusRef,
}: {
    issue: string;
    isOpen: boolean;
    handleFlags: (value: Partial<IssueFlags>) => void;
    onClose: () => void;
    finalFocusRef: RefObject<FocusableElement>
}) {
    const { OpenChatbotTrigger } = useProvider();
    const { t } = useTranslation();

    // Fix: Pressing enter on issue category would also immediately close this modal
    const { isInteractable } = useDelayedInteractable();

    const issueKey =
        issue === SFDC_ISSUE_CODES.SignalLoss
            ? 'signal-loss'
            : 'brief-sensor-issue';

    return (
        <ModalDialog
            size="lg"
            isOpen={isOpen}
            onClose={() => isInteractable.current && onClose()}
            heading={{
                children: t(`support:issues.dialogs.${issueKey}.title`),
                style: 'h3',
            }}
            finalFocusRef={finalFocusRef}
        >
            <Text textStyle="b2" fontWeight={800} pb={4}>
                {t(`support:issues.dialogs.${issueKey}.text`)}
            </Text>
            <HStack>
                <OpenChatbotTrigger>
                    <Button
                        variant="secondary"
                        justifyContent="center"
                        mr={8}
                        onClick={() => {
                            if (!isInteractable.current) return;
                            handleFlags({});
                            onClose();
                        }}
                    >
                        {t(
                            `support:issues.dialogs.${issueKey}.buttons.under-an-hour`
                        )}
                    </Button>
                </OpenChatbotTrigger>
                <Button
                    variant="secondary"
                    justifyContent="center"
                    onClick={() => {
                        if (!isInteractable.current) return;
                        handleFlags({ issueLastsOverAnHour: true });
                        onClose();
                    }}
                >
                    {t(
                        `support:issues.dialogs.${issueKey}.buttons.over-an-hour`
                    )}
                </Button>
            </HStack>
        </ModalDialog>
    );
}
