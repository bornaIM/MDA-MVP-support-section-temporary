import {
    Modal,
    Button,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalOverlay,
    AnimationBox,
    useTheme,
    Checkbox,
    Box,
    Heading,
    Text,
    ListItem,
    UnorderedList,
    Link,
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { RefObject, useState } from 'react';
import { SUPPORT_FORM_MODE } from '@lib/forms/support-form/support-form-enums';
import { FocusableElement } from '@chakra-ui/utils';
import { useProvider } from '@/context/components-context';

interface SupportModalProps {
    isOpen: boolean;
    onClose: (decision: boolean) => void;
    mode: SUPPORT_FORM_MODE;
    finalFocusRef: RefObject<FocusableElement>;
}

export function SupportModal({
    isOpen,
    onClose,
    mode,
    finalFocusRef,
}: SupportModalProps) {
    const { useGetLocalizedUrl } = useProvider()
    const { t } = useTranslation();
    const { space } = useTheme();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const listItems = Object.values(
        t('support:supportTermsModal.listItems', {}, { returnObjects: true })
    );
    const suffixKey = 'support:supportTermsModal.terms.contentSuffix';
    const suffixText = t(suffixKey);
    const getLocalizedUrl = useGetLocalizedUrl();

    function handleNext() {
        onClose?.(true);
    }

    return (
        <Modal
            size="md"
            isOpen={isOpen}
            onClose={() => onClose?.(false)}
            finalFocusRef={finalFocusRef}
        >
            <ModalOverlay as={AnimationBox} animationStyle="fadeInOverlay" />
            <ModalContent
                px={0}
                containerProps={{
                    zIndex: '42000',
                }}
                aria-labelledby="support-modal-header"
                aria-describedby="support-modal-description"
            >
                <ModalHeader mb={28} id="support-modal-header">
                    <ModalCloseButton />
                </ModalHeader>
                <Box px={space.xl}>
                    <Heading fontSize={40} mb="10" lineHeight={'44px'}>
                        {t('support:supportTermsModal.header')}
                    </Heading>
                    <Text mb={9} fontSize={18}>
                        {t('support:supportTermsModal.listHeader')}
                    </Text>
                    <UnorderedList styleType="disc" pl={6} mb={10} as="ol">
                        {listItems.map((item, index) => (
                            <ListItem mb={'4!'} fontSize={18} key={index}>
                                <Text>{item as string}</Text>
                            </ListItem>
                        ))}
                    </UnorderedList>
                    <Text mb={9} fontSize={18}>
                        {t('support:supportTermsModal.contact.content')}
                        <Link
                            fontSize={18}
                            target={'_blank'}
                            href={`tel:${t(
                                'support:supportTermsModal.contact.link'
                            )}`}
                        >
                            {t('support:supportTermsModal.contact.link')}
                        </Link>
                    </Text>
                    <Text mb={9} fontSize={18}>
                        {t('support:supportTermsModal.terms.content')}
                        <Link
                            fontSize={18}
                            isExternal
                            href={getLocalizedUrl('legal/privacy-policy')}
                        >
                            {t('support:supportTermsModal.terms.linkLabel')}
                        </Link>
                        {suffixText && suffixText !== suffixKey && (
                            <span>
                                {t(
                                    'support:supportTermsModal.terms.contentSuffix'
                                )}
                            </span>
                        )}
                    </Text>
                </Box>
                <Checkbox
                    mx={space.xl}
                    fontSize={18}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    isChecked={termsAccepted}
                    // Checkbox label is set to turn green on focus/hover
                    // This behavior is only present in local component and negated in checkboxes loaded through slots
                    // Disabling the extra styles to match old behavior for consistency across all checkboxes in the modal
                    sx={{
                        '.chakra-checkbox__label': {
                            fontWeight: '300',
                            fontSize: '18px',
                            lineHeight: '24px',
                            color: 'black!',
                            _hover: { color: 'black!' },
                            _checked: { color: 'black!' },
                            _focus: { color: 'black!' },
                        },
                    }}
                >
                    {t('support:supportTermsModal.checkboxLabel')}
                </Checkbox>
                <Button
                    mx="auto"
                    mt={10}
                    w={200}
                    justifyContent="center"
                    sx={{ borderRadius: '0' }}
                    isDisabled={!termsAccepted}
                    onClick={() => handleNext()}
                >
                    {t('support:supportTermsModal.cta')}
                </Button>
            </ModalContent>
        </Modal>
    );
}
