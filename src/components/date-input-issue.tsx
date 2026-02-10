import {
    Box,
    Grid,
    GridItem,
    Link,
    Heading,
    HStack,
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { Form, Formik } from 'formik';
import { useFormikContext } from 'formik';
import { useMemo, useState } from 'react';
import QuestionMarkPopover from './common/question-mark-popover';
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';
import { DateInputFormField } from './forms/date-input/date-input-form-field';

const SubmitLink = ({ children }: { children: React.ReactNode }) => {
    const { submitForm } = useFormikContext();
    return (
        <Link variant="greenText" textDecoration="none" onClick={submitForm}>
            {children}
        </Link>
    );
};

export const DateInputIssue = ({
    setDate,
    initialDate,
    preventAutoSubmit = false
}: {
    setDate: (insertionDate: string) => void;
    initialDate?: string | '';
    preventAutoSubmit: boolean;
}) => {
    const { t } = useTranslation();
    const dateHelpers = useDateInputFormFieldHelpers();
    const [manualMode, setManualMode] = useState(false);

    const onSubmit = (values: { date: string }) => {
        if(!!values.date) setDate(values.date);
    };

    const formattedInitialDate = useMemo(() => {
        if (initialDate) {
            const date = new Date(initialDate);
            return dateHelpers.dateToString(date);
        }
        return '';
    }, [initialDate, dateHelpers]);

    return (
        <Box>
            <HStack mb={5}>
                <Heading size="lg">{t('support:issueDate.header')} </Heading>
                <QuestionMarkPopover content={t('support:issueDate.popover')} />
            </HStack>
            <Formik
                initialValues={{ date: formattedInitialDate || '' }}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <Form>
                        <Grid
                            templateColumns={{
                                base: 'repeat(1, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            }}
                            gap={4}
                        >
                            <GridItem colSpan={1} colStart={1}>
                                <DateInputFormField
                                    isDefaultDateToday={false}
                                    onManualModeChange={setManualMode}
                                    preventAutoSubmit={preventAutoSubmit}
                                    name="date"
                                    maxDate={new Date()}
                                    minDate={new Date('2018-01-01')}
                                    mb={3}
                                    onSubmit={onSubmit}
                                    labelFunction={() =>
                                        t(
                                            'support:dates.label'
                                        ).toUpperCase()
                                    }
                                />
                            </GridItem>
                            {manualMode && (
                                <GridItem
                                    colSpan={1}
                                    colStart={1}
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={2}
                                >
                                    <HStack spacing={4}>
                                        <Link
                                            variant="greenText"
                                            textDecoration="none"
                                            onClick={() => {
                                                setDate(
                                                    undefined as unknown as string
                                                );
                                                formik.setFieldValue(
                                                    'date',
                                                    ''
                                                );
                                            }}
                                        >
                                            {t('common:dateInput.cancelDate')}
                                        </Link>
                                        <SubmitLink>
                                            {t('common:dateInput.confirmDate')}
                                        </SubmitLink>
                                    </HStack>
                                </GridItem>
                            )}
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
