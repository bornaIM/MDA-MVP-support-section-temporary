import useTranslation from 'next-translate/useTranslation';
import {
    Grid,
    GridItem,
    Heading,
    Button,
    FormControlCheckbox,
    HStack,
    Box
} from '@dexcomit/web-ui-lib';
import { useState } from 'react';
import {
    ProductGenerationType,
    SpecifyProductDetailsSubmitProps,
    SpecifyProductDetailsCallback,
    ProductGenerationVariant,
} from './types';
import SelectProductGeneration from './select-product-generation';
import SelectProductGenerationSelect from './select-product-generation-select';
import ContinueWithoutSerialModalPrompt from './continue-without-serial-modal-prompt';
import SpecifyProductDetails from './specify-product-details';
import SelectProductVariant from './select-product-variant';

import { Form, Formik, FormikValues } from 'formik';
import { SpecifyProductFaqLinks } from '@components/forms/support-form/specify-product/specify-product-faq-links';
// import RenderSlot from '@components/common/render-slot';

import { G7_SENSOR_VARIANT_FOR_COUNTRY } from '@lib/forms/support-form/support-form-dictionaries';
import { isValidIssueCategory } from '@lib/forms/support-form/helpers/is-valid-issue-category';
import { IssueFlags } from '@components/forms/support-form/issue-category/types';

import { useFeatureFlags } from '@dexcomit/web-vendor-framework/feature/vendor/local';
import useDateInputFormFieldHelpers from '@components/forms/date-input/date-input-form-field/use-date-input-form-field-helpers';

export function SpecifyProduct({
    onSpecifyProduct,
    issueDate,
    variant = 'buttons',
    skipInsertionDate,
    selectedIssueCategory,
    issueFlags
}: {
    onSpecifyProduct: SpecifyProductDetailsCallback;
    issueDate: Date;
    variant?: ProductGenerationVariant;
    skipInsertionDate: boolean;
    selectedIssueCategory?: string;
    issueFlags: IssueFlags
}) {
    const { t } = useTranslation();
    const [productGeneration, setProductGeneration] =
        useState<ProductGenerationType>('');
    const [continueWithoutSerialChecked, setContinueWithoutSerialChecked] =
        useState(false);
    const [showContinueWithoutSerialModal, setShowContinueWithoutSerialModal] =
        useState(false);
    const [date, setDate] = useState('');

    const { sensorLifespanPre15DayRolloutDisabled } = useFeatureFlags();
    const { stringToDate } = useDateInputFormFieldHelpers();

    // The use could have went back and chosen an invalid issue category selection and in this case
    // the submit button should be disabled
    const isSubmitDisabled = (!!selectedIssueCategory && !isValidIssueCategory(selectedIssueCategory, issueFlags)) || !productGeneration;

    function onContinueWithoutSerialDecision(
        decision: boolean,
        values: FormikValues
    ) {
        if (decision) {
            onSpecifyProduct({
                date,
                continueWithoutSerial: true,
                productGeneration: values.productVariant || productGeneration,
                lotNumber: values.lotNumber,
            });
            setShowContinueWithoutSerialModal(false);
        } else {
            setContinueWithoutSerialChecked(false);
            setShowContinueWithoutSerialModal(false);
        }
    }

    function onSpecifyDetails(values: SpecifyProductDetailsSubmitProps) {
        if (values.continueWithoutSerial) {
            setDate(values.date);
            setShowContinueWithoutSerialModal(true);
        } else {
            onSpecifyProduct({
                ...values
            });
        }
    }

    function onSubmit(values: FormikValues) {
        // productVariant is internal value and should not be sent as productVariant
        const { productVariant, ...rest } = values;
        const requiredGeneration = values.productVariant || productGeneration;
        onSpecifyDetails({
            ...rest,
            date: values.date && stringToDate(values.date).toISOString(),
            productGeneration: requiredGeneration,
            continueWithoutSerial: continueWithoutSerialChecked,
        } as SpecifyProductDetailsSubmitProps);
    }

    return (
        <Box>
            {variant === 'buttons' && (
                <Box>
                    <HStack mb={5}>
                        <Heading size="lg">
                            {t('support:specifyProduct.header')}
                        </Heading>
                        <Box sx={{ svg: { color: 'var(--chakra-colors-black)' } }}>
                            {/* <RenderSlot id={"select-product-generation"} /> */}
                        </Box>
                    </HStack>
                    <SelectProductGeneration
                        productGeneration={productGeneration}
                        onGenerationSelect={setProductGeneration}
                    />
                </Box>
            )}
            <Formik
                key={productGeneration}
                initialValues={{
                    serialNumber: '',
                    date: '',
                    lotNumber: '',
                    productVariant: '',
                }}
                onSubmit={onSubmit}
            >
                {({ isValid, validateForm, values, setFieldValue }) => (
                    <Form noValidate>
                        <Grid
                            gap={4}
                            templateColumns={{
                                base: 'repeat(1, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            }}
                            mt={5}
                            mb={5}
                        >
                            {variant === 'select' && (
                                <GridItem
                                    colSpan={1}
                                >
                                    <SelectProductGenerationSelect
                                        productGeneration={productGeneration}
                                        onGenerationSelect={
                                            setProductGeneration
                                        }
                                    />
                                </GridItem>
                            )}
                            {!!productGeneration && (
                                <SpecifyProductDetails
                                    productGeneration={productGeneration}
                                    continueWithoutSerialChecked={
                                        continueWithoutSerialChecked
                                    }
                                    setContinueWithoutSerialChecked={
                                        setContinueWithoutSerialChecked
                                    }
                                    onSpecifyProductDetails={onSpecifyDetails}
                                    issueDate={issueDate}
                                    isValid={isValid}
                                    validateForm={validateForm}
                                    skipInsertionDate={skipInsertionDate}
                                />
                            )}
                            <GridItem colSpan={{ base: 1, lg: 4 }}>
                                <FormControlCheckbox
                                    checkboxLabel={t(
                                        'support:specifyProduct.continueWithoutSerialNumber.linkText'
                                    )}
                                    isChecked={continueWithoutSerialChecked}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setContinueWithoutSerialChecked(checked);

                                        if (checked) setFieldValue('lotNumber', '');

                                        setTimeout(validateForm, 500);
                                    }}
                                    isDisabled={!!values.serialNumber}
                                />
                            </GridItem>
                        </Grid>

                        {!sensorLifespanPre15DayRolloutDisabled && productGeneration.startsWith('G7') && (
                            <SelectProductVariant
                                formFieldName="productVariant"
                                generationPrefix="G7"
                                variantMap={G7_SENSOR_VARIANT_FOR_COUNTRY}
                            />
                        )}

                        <SpecifyProductFaqLinks
                            productGeneration={productGeneration}
                        />

                        <Button
                            width={{ base: "100%", md: "10rem" }}
                            justifyContent="center"
                            alignItems="center"
                            mt={5}
                            isDisabled={!isValid || isSubmitDisabled}
                            type="submit"
                            alignSelf="start"
                        >
                            {t('support:specifyProduct.submit')}
                        </Button>
                        {showContinueWithoutSerialModal && (
                            <ContinueWithoutSerialModalPrompt
                                onDecide={(decision: boolean) =>
                                    onContinueWithoutSerialDecision(
                                        decision,
                                        values
                                    )
                                }
                            />
                        )}
                    </Form>
                )}
            </Formik>
        </Box>
    );
}
