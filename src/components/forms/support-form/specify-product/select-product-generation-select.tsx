import useTranslation from 'next-translate/useTranslation';
import { SelectGenerationProps, ProductGenerationType } from './types';
import { SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY } from '@lib/forms/support-form/support-form-dictionaries';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { FormControlSelect } from '@dexcomit/web-ui-lib';

export default function SelectProductGenerationSelect({
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
    const selectlabel = t('support:specifyProduct.productGenerationsSelectLabel');

    const availableProductGenerations =
        SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY[locale?.split('-')[1] || 'Unknown'] || [];

    const optionsArray = useMemo(
        () =>
            Object.entries(translationObject)
                .map(([key, value]) => {
                    return { label: key, value };
                })
                .filter((productGeneration) =>
                    availableProductGenerations.includes(
                        productGeneration.label
                    )
                ),
        [translationObject, availableProductGenerations]
    );

    const handleGenerationChange: React.ChangeEventHandler<
        HTMLSelectElement
    > = (e) => {
        const generation = e.target.value;

        onGenerationSelect(generation as ProductGenerationType);
    };

    return (
        <FormControlSelect
            name="productGenerationSelect"
            label={selectlabel}
            options={optionsArray}
            value={productGeneration}
            onChange={handleGenerationChange}
        />
    );
}
