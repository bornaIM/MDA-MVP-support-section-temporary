import {
    Modal,
    Box,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    AnimationBox,
    Text
} from '@dexcomit/web-ui-lib';
import { css, ModalOverlay } from '@chakra-ui/react';
import { useProfile } from '@dexcomit/web-vendor-framework/customer';

const ModalOverlayWrapper = ModalOverlay

interface SupportSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    isError: boolean;
}

export function SupportSubmitModal({
    isOpen,
    onClose,
    isError,
}: SupportSubmitModalProps) {
    const { data: profile } = useProfile();

    const modalStyling = css({
        '& a': {
            color: 'var(--chakra-colors-brand-secondary) !important',
            fontWeight: '700',
        },
    });

    return (
        <>
            {isError ? (
                <div style={{position:'fixed', top: 0, left: 0, width:'100%', zIndex: 100}} onClick={(e) => onClose?.()}>
                    {/* <RenderSlot id={'mda-support-submission-failed-banner'}/> */}
                    <Text>Render Amplince slot <code>mda-support-submission-failed-banner</code></Text>
                </div>
            ) : (
                <Modal
                    size="md"
                    preserveScrollBarGap
                    isOpen={isOpen}
                    onClose={() => onClose?.()}
                >
                    <ModalOverlayWrapper
                        as={AnimationBox}
                        animationStyle="fadeInOverlay"
                    />
                    <ModalContent
                        px={0}
                        aria-labelledby="support-modal-header"
                        aria-describedby="support-modal-description"
                    >
                        <ModalHeader id="support-modal-header">
                            <ModalCloseButton />
                        </ModalHeader>
                        <Box
                            sx={{ padding: 0 }}
                            css={modalStyling}
                            id="support-modal-description"
                        >
                            {profile && (
                                // <RenderSlot id={'support-ticket-submit-modal'}/>
                                <Text>Render Amplince slot <code>support-ticket-submit-modal</code></Text>
                            )}
                            {!profile && (
                                // <RenderSlot id={'support-ticket-submit-modal-anonymous'}/>
                                <Text>Render Amplince slot <code>support-ticket-submit-modal-anonymous</code></Text>
                            )}
                        </Box>
                    </ModalContent>
                </Modal>
            )}
            ;
        </>
    );
}
