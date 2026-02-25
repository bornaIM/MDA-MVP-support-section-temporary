
import { Box } from '@dexcomit/web-ui-lib';
import { getMdaUrl } from '@dexcomit/web-vendor-framework/cms/vendor/amplience';
import { useRouter } from 'next/router';
import { SupportGuestLoginSlot, GuestStartSupportTicketSlot } from './amplience-slots';
import { useFramework } from '@dexcomit/web-vendor-framework';
import { useCustomer } from '@dexcomit/web-vendor-framework/customer';

interface GuestStartSupportTicketProps {
    onRequestProductSupport(): void;
}

export function GuestStartSupportTicket({ onRequestProductSupport }: GuestStartSupportTicketProps) {
    const { data: customerSession } = useCustomer();;
    const router = useRouter();
    const {
        localeConfig: { locale },
        features,
    } = useFramework();
    const requestOverpatchUrl = getMdaUrl('Support: Request Overpatch', locale, 'mda', features);
    const onUsLocale = locale === 'en-US' || locale === 'es-US';

    return (
        <Box>
            <SupportGuestLoginSlot />
            {customerSession && customerSession.state !== 'authenticated' && GuestStartSupportTicketSlot && (
                 <GuestStartSupportTicketSlot onClickGuest={onRequestProductSupport} onClickOverpatch={() =>router.replace(requestOverpatchUrl)} onUsLocale={onUsLocale} />
            )}
        </Box>
    )
}
