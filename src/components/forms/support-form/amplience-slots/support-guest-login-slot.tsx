import { useSlot } from '@dexcomit/web-vendor-framework/cms';
import { Box, Button, ContainerGrid, GridItem, Heading, useTheme } from '@dexcomit/web-ui-lib';
import { useProvider } from '@/context/components-context';

export const SupportGuestLoginSlot = () => {
    const { RenderSlot } = useProvider();
    return <RenderSlot id="support-guest-login" />;
};

export const GuestStartSupportTicketSlot = ({
    onClickGuest,
    onClickOverpatch,
    onUsLocale,
}: {
    onClickGuest(): void;
    onClickOverpatch: () => void;
    onUsLocale: boolean;
}) => {
    const { data: guestStartSlotData } = useSlot({
        id: 'guest-start-support-ticket',
    });
    const { space } = useTheme();

    if (guestStartSlotData) {
        return (
            <ContainerGrid isFullWidth={false} pt={space.m}>
                <GridItem colSpan={{ base: 6, md: 12 }}>
                    <Heading size="lg" mt={10} mb={5} as="h3">
                        {guestStartSlotData.body?.heading}
                    </Heading>
                    <Button
                        type="button"
                        margin="0.5rem"
                        onClick={onClickGuest}
                    >
                        {guestStartSlotData.body?.getSupportText}
                    </Button>
                    {onUsLocale && (
                        <Button
                            onClick={() => onClickOverpatch}
                            margin="0.5rem"
                        >
                            {guestStartSlotData.body?.requestOverpatchText}
                        </Button>
                    )}
                </GridItem>
            </ContainerGrid>
        );
    }
    return <></>
};
