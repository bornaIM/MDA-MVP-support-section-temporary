import useTranslation from 'next-translate/useTranslation';
import { SupportButtonRadioProps } from '../common';
import SupportButtonRadioGroup from '../common/support-button-radios';
import { SelectGenerationProps } from './types';
import { useRouter } from 'next/router';
import { SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY } from '@lib/forms/support-form/support-form-dictionaries';
import { useMemo } from 'react';

export default function SelectProductGeneration({
    onGenerationSelect,
    productGeneration,
}: SelectGenerationProps) {
    const { t } = useTranslation();
    const { locale } = useRouter();

    // check the other component where this is being used if making changes
    const translationObject = t(
        'support:specifyProduct.productGenerations',
        {},
        { returnObjects: true }
    );
    const availableProductGenerations =
        SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY[locale?.split('-')[1] || 'Unknown'] || [];

    const optionsArray = useMemo(
        () =>
            Object.entries(translationObject)
                .map(([key, value]) => {
                    return { code: key, title: value };
                })
                .filter((productGeneration) =>
                    availableProductGenerations.includes(productGeneration.code)
                ) as SupportButtonRadioProps[]
    , [translationObject, availableProductGenerations]);

    return (
        <SupportButtonRadioGroup
            onSelect={onGenerationSelect as (val: string) => void}
            selectedOptionValue={productGeneration}
            radioOptions={optionsArray}
        />
    );
}
