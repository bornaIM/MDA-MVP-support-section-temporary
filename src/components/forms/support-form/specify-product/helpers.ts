import { ProductGenerationType, ProductTypeLookupArrayType } from './types';
import ProductTypeLookupTable from '@components/forms/support-form/specify-product//product-type-lookup-table.json';

export const isGenerationG6D1 = (productGeneration: string) =>
    ['G6', 'D1'].includes(productGeneration);

const ALPHANUM_REGEXP = /^[a-z0-9]+$/i;
const ProductTypeLookupArray: ProductTypeLookupArrayType =
    ProductTypeLookupTable;

/*
    from: https://dexcom-it.atlassian.net/browse/MDAMVP-113
    - for G7/D1+ sensor serial number is 12 digits
    - for G6/D1
        - serial number is 6 or 8 alphanumerical characters
        - G6 products start with 8
        - D1 products start with 5 or C
*/
export const getSerialNumberValidator =
    (productGeneration: ProductGenerationType) => (value: any) => {
        if (!productGeneration) throw new Error('Empty product generation');
        const errorLabel = (val: string) =>
            `support:specifyProduct.enterSerial.validations.${val}`;
        const strVal = (value && String(value)) || '';
        if (!isGenerationG6D1(productGeneration)) {
            return strVal.length == 12 || errorLabel('generationG7D1+');
        }
        if (![6, 8].includes(strVal.length))
            return errorLabel('generationG6D1');
        if (!ALPHANUM_REGEXP.test(strVal)) return errorLabel('generationG6D1');
        const startLetter = strVal.charAt(0);
        if (productGeneration === 'G6') {
            return startLetter == '8' || errorLabel('G6');
        }
        // D1
        return ['5', 'C'].includes(startLetter) || errorLabel('D1');
    };

export function getProductType(
    productGeneration: ProductGenerationType,
    issueCode: string
) {
    if (ProductTypeLookupArray[issueCode]?.[productGeneration]?.productType) {
        return ProductTypeLookupArray[issueCode]?.[productGeneration]
            ?.productType;
    }
    return '';
}
