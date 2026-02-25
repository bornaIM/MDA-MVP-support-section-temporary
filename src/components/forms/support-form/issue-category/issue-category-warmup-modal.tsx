import { Button } from '@chakra-ui/button';
import { Text, ModalDialog } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { RefObject } from 'react';
import { FocusableElement } from '@chakra-ui/utils';
import { useDelayedInteractable } from '@lib/common/use-delayed-interactable';

export default function IssueCategoryWarmupModal({
    isOpen,
    handleFlags,
    onClose,
    finalFocusRef,
}: {
    isOpen: boolean;
    handleFlags: (value: {
        issueDuringWarmup: boolean;
        skipInsertionDate: boolean;
    }) => void;
    onClose: () => void;
    finalFocusRef: RefObject<FocusableElement>
}) {
    const { t } = useTranslation();

    // Fix: Pressing enter on issue category would also immediately close this modal
    const { isInteractable } = useDelayedInteractable();

    return (
        <ModalDialog
            size="lg"
            isOpen={isOpen}
            onClose={() => isInteractable.current && onClose()}
            heading={{
                children: t(`support:issues.dialogs.sensor-failed.title`),
                style: 'h3',
            }}
            finalFocusRef={finalFocusRef}
        >
            <Text textStyle="b2" fontWeight={800} pb={4}>
                {t(`support:issues.dialogs.sensor-failed.text`)}
            </Text>
            <Button
                variant="secondary"
                justifyContent="center"
                mr={8}
                onClick={() => {
                    if (!isInteractable.current) return;
                    handleFlags({
                        issueDuringWarmup: true,
                        skipInsertionDate: true,
                    });
                    onClose();
                }}
            >
                {t(
                    `support:issues.dialogs.sensor-failed.buttons.during-warmup`
                )}
            </Button>
            <Button
                variant="secondary"
                justifyContent="center"
                onClick={() => {
                    if (!isInteractable.current) return;
                    handleFlags({
                        issueDuringWarmup: false,
                        skipInsertionDate: false,
                    });
                    onClose();
                }}
            >
                {t('support:issues.dialogs.sensor-failed.buttons.after-warmup')}
            </Button>
        </ModalDialog>
    );
}
