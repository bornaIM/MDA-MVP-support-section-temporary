import useTranslation from 'next-translate/useTranslation';
import {

    ModalDialog,
    Box,
    Stack,
    Button
} from '@dexcomit/web-ui-lib';
import { ContinueWithoutSerialModalPromptProps } from './types';
// TODO: handle slots here
// import { useSlot } from '@cms';
// import { Slot } from '@components/common';

export default function ContinueWithoutSerialModalPrompt({ onDecide }: ContinueWithoutSerialModalPromptProps) {
    const { t } = useTranslation();
    // const { data: continueWithoutSerialSlot } = useSlot({ id: 'continue-without-serial-modal' });

    return (<ModalDialog
        isOpen={true}
        onClose={() => {
            onDecide(false);
        }}
    >
        <Box>
            {/* {continueWithoutSerialSlot && <Slot slot={continueWithoutSerialSlot} />} */}
            <Stack direction={{ base: 'column', md: 'row' }}>
                <Button
                    justifyContent="center"
                    onClick={async () => {
                        onDecide(false);
                    }}
                >
                    {t('support:specifyProduct.continueWithoutSerialNumber.modalCancel')}

                </Button>
                <Button
                    variant="secondary"
                    justifyContent="center"
                    onClick={() => {
                        onDecide(true);
                    }}
                >
                    {t('support:specifyProduct.continueWithoutSerialNumber.modalConfirm')}
                </Button>
            </Stack>
        </Box>
    </ModalDialog>);
}
