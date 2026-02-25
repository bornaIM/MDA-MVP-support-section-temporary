import { useProvider } from '@/context/components-context';
import { Box } from '@dexcomit/web-ui-lib';

export const ConfirmNavigateAwayModalSlot = () => {
    const { RenderSlot } = useProvider();
    return (
        <Box sx={{ padding: 0 }}>
            <RenderSlot id="confirm-navigate-away-modal" />
        </Box>
    );
};
