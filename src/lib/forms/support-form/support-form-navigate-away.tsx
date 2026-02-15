import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
//TODO: handle these slot components
// import { useSlot } from '@cms';
import { AnimationBox, Box, Button, Flex, Modal, ModalContent, ModalOverlay } from '@dexcomit/web-ui-lib';
// import { Slot } from '@components/common';
import { useSupportForm } from '@lib/forms/support-form/support-form-provider';
import { UtilProviderContext } from '@dexcomit/web-util-lib';

interface ConfirmNavigateAwayModalProps {
    isOpen: boolean;
    onClose: (decision: boolean) => void;
}


function ConfirmNavigateAwayModal({ isOpen, onClose}: ConfirmNavigateAwayModalProps) {
    const { t } = useTranslation();
    // const { data: confirmNavigateAwayModal } = useSlot({ id: 'confirm-navigate-away-modal' });
    const confirmNavigateAwayModal = true;


    return (
        <Modal
            size="md"
            preserveScrollBarGap
            isOpen={isOpen}
            onClose={() => onClose?.(false)}
        >
            <ModalOverlay as={AnimationBox} animationStyle="fadeInOverlay" />
            <ModalContent px={0}>
                {confirmNavigateAwayModal && (
                    <Box sx={{ padding: 0 }}>
                        {/* <Slot slot={confirmNavigateAwayModal} /> */}
                        <p>Rendering slot confirm-navigate-away-modal</p>
                    </Box>
                )}
                <Flex>
                    <Button
                        mx="auto"
                        mt={10}
                        w={200}
                        justifyContent="center"
                        sx={{ borderRadius: '0' }}
                        onClick={() => onClose(true)}
                    >
                        {t('support:confirmationModal.actions.confirm')}
                    </Button>
                    <Button
                        mx="auto"
                        mt={10}
                        w={200}
                        variant='outline'
                        justifyContent="center"
                        sx={{ borderRadius: '0' }}
                        onClick={() => onClose(false)}
                    >
                        {t('support:confirmationModal.actions.cancel')}
                    </Button>
                    </Flex>
        
            </ModalContent>
        </Modal>
    );
}

type NavigateAwayState = {
    url: string;
    shallow: boolean;
}
export default function SupportFormNavigateAway(){
        const router = useRouter();
        const { logger } = useContext(UtilProviderContext);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const navigateAwayState = useRef<NavigateAwayState>({
            url: '',
            shallow: false
        });

        const { uiState, uiDispatcher } = useSupportForm();
        
        const handleBrowseAway = useCallback((target: string, { shallow }: { shallow: boolean}) => {
            if (!!navigateAwayState.current.url) return;
            navigateAwayState.current = {
                url: target,
                shallow: shallow
            };
            setIsModalOpen(true);
            throw 'routeChange aborted - waiting user confirmation';
        }, []);

        useEffect(() => {
            router.events.on('routeChangeStart', handleBrowseAway);
            return () => {
                router.events.off('routeChangeStart', handleBrowseAway);
            };
        }, []);

        function handleModalClose(confirmed: boolean) {
            // 1) Case when navigating on guest flow using the back button
            // No url means the user didn't try to navigate away, instead
            // they were clicking the back button and in guest flow we
            // programmatically opened this modal

            if (!navigateAwayState.current.url && confirmed) {
                uiDispatcher?.returnToGuestStart(null);
                logger?.info('Support case abandoned');
                return;
            }

            if (!navigateAwayState.current.url && !confirmed) {
                uiDispatcher?.abandonNavigateAway(null);
                return;
            }

            // 2) Case when user tried to navigate away

            setIsModalOpen(false);

            if (confirmed) {
                router.push(navigateAwayState.current.url, undefined, {shallow: navigateAwayState.current.shallow, locale: ''});
            } else {
                navigateAwayState.current = {
                    url: '',
                    shallow: false
                };
            }
        }
        return (<ConfirmNavigateAwayModal isOpen={isModalOpen || !!uiState?.showNavigateAwayModal} onClose={handleModalClose} />);
}
