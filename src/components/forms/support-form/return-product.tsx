import {
    Box,
    Radio,
    RadioGroup,
    Text,
    Stack
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';

interface ReturnProductProps {
    setIsProductReturn: (value: boolean) => void;
    productReturn: boolean
}

export function ReturnProduct({
    setIsProductReturn,
    productReturn
}: ReturnProductProps) {
    const { t } = useTranslation();

    const handleRadioChange = (value: string): void => {
        setIsProductReturn(value === 'true');
    }

    return (
        <Box>
            <Text as="p" my="2rem">
                <Text as="strong" display="inline">
                    {t('support:returnProduct.labelStrong')}
                </Text>
                    <span> - </span>
                    {t('support:returnProduct.labelNormal')}
            </Text>
            <RadioGroup
                onChange={handleRadioChange}
                value={productReturn.toString()}
            >
                <Stack
                    direction={'column'}
                    spacing={2}
                >
                    <Radio
                        value={'true'}
                    >
                        {t('support:returnProduct.radio.yes')}
                    </Radio>
                    <Radio
                        value={'false'}
                    >
                        {t('support:returnProduct.radio.no')}
                    </Radio>
                </Stack>
            </RadioGroup>
        </Box>
    )
}