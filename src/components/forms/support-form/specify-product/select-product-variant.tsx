import useTranslation from 'next-translate/useTranslation';
import SupportButtonRadioGroup from '../common/support-button-radios';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormControl, HStack, Heading, Box } from '@dexcomit/web-ui-lib';
import { FormErrorMessage } from '@chakra-ui/react';
import { Field, FieldInputProps, FieldMetaProps, FormikBag } from 'formik';
//TODO: handle these slot components
// import { useSlot } from '@cms';
// import { Slot } from '@components/common';

interface SelectProductVariationProps {
    formFieldName: string;
    generationPrefix: string,
    variantMap: Record<string, string[]>;
}

export default function SelectProductVariant({
    formFieldName,
    generationPrefix,
    variantMap,
}: SelectProductVariationProps) {
    const { t } = useTranslation();
    const { locale } = useRouter();

    const sensorTitles = t(`support:specifyProduct.sensorVariant.${generationPrefix}`, null, {
        returnObjects: true,
    }) as Record<string, string>;

    // const { data: tooltipSlot } = useSlot({
    //     id: 'support-select-product-variation-tooltip',
    // });

    const validator = (value: string) => {
        if (!value) {
            return t('support:specifyProduct.sensorVariant.validation');
        }
    };

    const optionsArray = useMemo(() => {
        const selectedLocale = locale?.split('-')[1] || 'Unknown';
        const purchasableVariants: string[] = variantMap[selectedLocale];

        if (!purchasableVariants) {
            return null;
        }

        // "merge" variant and it's localized title
        return purchasableVariants.map((product) => ({
            code: product,
            title: sensorTitles[product] || product,
        }));
    }, [locale, sensorTitles]);

    if (!optionsArray) {
        return null;
    }

    return (
        <Field name={formFieldName} validate={validator}>
            {(formikFieldParams: {
                form: FormikBag<unknown, string>;
                meta: FieldMetaProps<string>;
                field: FieldInputProps<string>;
            }) => {
                const { form, field, meta } = formikFieldParams;

                const selectDevice = (variant: string) => {
                    form.setFieldValue(field.name, variant);
                };

                return (
                    <FormControl isInvalid={!!meta.error} mb={5}>
                        <HStack mb={5} mt={5}>
                            <Heading size="lg">
                                {t('support:specifyProduct.sensorVariant.header')}
                            </Heading>
                            <Box sx={{ svg: { color: 'var(--chakra-colors-black)' } }}>
                                {/* {tooltipSlot && <Slot slot={tooltipSlot} />} */}
                                <p>placeholder for `support-select-product-variation-tooltip`</p>
                            </Box>
                        </HStack>
                        <SupportButtonRadioGroup
                            onSelect={selectDevice}
                            radioOptions={optionsArray}
                            selectedOptionValue={field.value}
                        />
                        <FormErrorMessage marginInlineStart={'1rem'}>
                            {meta.error}
                        </FormErrorMessage>
                    </FormControl>
                );
            }}
        </Field>
    );
}
