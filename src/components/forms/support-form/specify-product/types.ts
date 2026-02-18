export type ProductGenerationType = 'G6' | 'D1' | 'G7' | 'G7 15 Day' | 'D1+' | '';

export type ProductGenerationVariant = 'select' | 'buttons';

export type SelectGenerationProps = {
    onGenerationSelect: (value: ProductGenerationType) => void;
    productGeneration: ProductGenerationType;
};

export type SpecifyProductDetailsSubmitProps = {
    date: string;
    serialNumber?: string;
    lotNumber?: string;
    continueWithoutSerial: boolean;
    productGeneration: ProductGenerationType;
};

export type SpecifyProductDetailsCallback = (
    values: SpecifyProductDetailsSubmitProps
) => void;

export type SpecifyProductDetailsProps = {
    productGeneration: ProductGenerationType;
    continueWithoutSerialChecked: boolean;
    setContinueWithoutSerialChecked: (val: boolean) => void;
    onSpecifyProductDetails: SpecifyProductDetailsCallback;
    issueDate: Date;
    isValid: boolean;
    validateForm: (values?: any) => Promise<unknown>;
    skipInsertionDate: boolean;
};

export type ContinueWithoutSerialModalPromptProps = {
    onDecide: (value: boolean) => void;
};

export type ProductTypeLookupArrayType = {
    [issueCode: string]: {
        [sensorType: string]: {
            productType: string;
        };
    };
};
