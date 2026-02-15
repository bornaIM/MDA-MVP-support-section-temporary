import useTranslation from 'next-translate/useTranslation';
import {
    GridItem,
    IconButton,
    IconQuestion,
    Box,
    useTheme,
    Flex,
} from '@dexcomit/web-ui-lib';
import { useCallback } from 'react';
import { SpecifyProductDetailsProps, ProductGenerationType } from './types';
import { FieldFormControl } from '@components/forms/field-form-control';
import { getSerialNumberValidator, isGenerationG6D1 } from './helpers';
// import RenderSlot from '@components/common/render-slot';
import { DateInputFormField } from '@components/forms/date-input/date-input-form-field';
import { add } from 'date-fns';

export default function SpecifyProductDetails({
    productGeneration,
    continueWithoutSerialChecked,
    issueDate,
    skipInsertionDate,
}: SpecifyProductDetailsProps) {
    const { t } = useTranslation();
    const { space } = useTheme();
    const dateInputLabelFunction = (dateFormat: string) =>
        t('support:specifyProduct.dateInputLabel', {
            format: dateFormat.toUpperCase(),
        });
    const generationG6D1 = isGenerationG6D1(productGeneration);

    const colSpan = 1;

    const serialNumberValidator = useCallback(
        (val: any) => {
            if (continueWithoutSerialChecked) return;
            const rawResult = getSerialNumberValidator(
                productGeneration as ProductGenerationType
            )(val);
            if (typeof rawResult == 'string') return t(rawResult);
        },
        [productGeneration, continueWithoutSerialChecked]
    );

    const lotNumberValidator = useCallback(
        (value: any) => {
            if (continueWithoutSerialChecked) return;
            if (!value) return;
            const strVal = (value && String(value)) || '';
            if (![7, 8].includes(strVal.length))
                return t(`support:specifyProduct.enterLotNumber.validation`);
        },
        [continueWithoutSerialChecked]
    );

    const serialNumberInputProps = {
        name: 'serialNumber',
        i18nField: 'support:specifyProduct.enterSerial',
        autoSubmit: false,
        isDisabled: continueWithoutSerialChecked,
        validate: serialNumberValidator,
    };

    const minDate = add(issueDate, { days: -15 });
    const maxDate = issueDate;

    return (
        <>
            {!skipInsertionDate && (
                <GridItem colSpan={colSpan}>
                    <DateInputFormField
                        name="date"
                        minDate={minDate}
                        maxDate={maxDate}
                        labelFunction={dateInputLabelFunction}
                        mb={space.xl}
                        w={{ base: "100%" }}
                    />
                </GridItem>
            )}
            <GridItem
                colSpan={colSpan}
                sx={{
                    svg: {
                        color: 'var(--chakra-colors-black)',
                    }
                }}
            >
                {generationG6D1 ? (
                    <Flex alignItems="center">
                        <Box flex="1" width="100%">
                            <FieldFormControl
                                type="text"
                                maxLength={8}
                                showIcons={false}
                                {...serialNumberInputProps}
                            />
                        </Box>
                        <Box
                            display='flex'
                            w='52px'
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* <RenderSlot id={'g6-serial-number-tooltip'} /> */}
                            <p>placeholder for amplience content`g6-serial-number-tooltip`</p>
                        </Box>
                    </Flex>
                ) : (
                    <Flex alignItems="center">
                        <Box flex="1" width="100%">
                            <FieldFormControl
                                type="number"
                                maxLength={12}
                                showIcons={false}
                                {...serialNumberInputProps}
                            />
                        </Box>
                        <Box
                            display='flex'
                            w='52px'
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* <RenderSlot id={'g7-serial-number-tooltip'} /> */}
                            <p>placeholder for amplience content`g7-serial-number-tooltip`</p>
                        </Box>
                    </Flex>
                )}
            </GridItem>
            {generationG6D1 && (
                <GridItem colSpan={colSpan}>
                    <FieldFormControl
                        type="number"
                        maxLength={8}
                        name="lotNumber"
                        i18nField="support:specifyProduct.enterLotNumber"
                        autoSubmit={false}
                        isDisabled={continueWithoutSerialChecked}
                        showIcons={false}
                        validate={lotNumberValidator}
                        popover={{
                            content: t(
                                'support:specifyProduct.enterLotNumber.popover'
                            ),
                            children: (
                                <IconButton aria-label={t('common:popover.ariaLabel')}>
                                    <IconQuestion color="var(--chakra-colors-black)" />
                                </IconButton>
                            ),
                        }}
                    />
                </GridItem>
            )}
        </>
    );
}
