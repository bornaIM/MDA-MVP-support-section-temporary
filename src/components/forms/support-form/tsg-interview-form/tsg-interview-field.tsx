import { memo, useMemo, useRef, useLayoutEffect } from 'react';
import {
    FormControlCheckboxGroup,
    FormControlInput,
    FormControlSelect,
    FormControlSwitch,
    HStack,
    VStack,
    Text,
    Box
} from '@dexcomit/web-ui-lib';
import type { SalesforceApiTemplate } from './types';
import useTranslation from 'next-translate/useTranslation';
import { getTsgQuestionOptions, OPTED_OUT_ANSWER_VALUE } from './helpers';
import { useElementSize } from '@components/common/hooks/use-element-size';
import { IssueFlags } from '../issue-category/types';
import { DateInputFormField } from '@components/forms/date-input/date-input-form-field';
import styles from '@components/forms/date-input/date-input.module.css';

interface TsgInterviewFieldProps {
    template: SalesforceApiTemplate;
    value: string | string[];
    touched: boolean;
    error?: string | null;
    onBlur: React.FocusEventHandler<any>;
    onChange: React.ChangeEventHandler<any>;
    onCheckedChange: (value: (string | number)[]) => void;
    onOptOutChange: (isOptedOut: boolean) => void;
    isDisabled: boolean;
    flags?: IssueFlags,
    issueDate: Date;
}

/**
 * Renders a single template question. Can render different types of questions, like Text, Date, Picklist, Checkboxes etc.
 */
export const TsgInterviewField = memo(function TsgInterviewField({
    template,
    value,
    error,
    touched,
    onBlur,
    onChange,
    onOptOutChange,
    onCheckedChange,
    isDisabled,
    flags,
    issueDate
}: TsgInterviewFieldProps) {
    const { t } = useTranslation();

    const isOptedOut = useMemo( () => value === OPTED_OUT_ANSWER_VALUE, [value])

    const questionType = template.questionRef.questionType;
    const questionId = template.questionRef.id;
    const label = template.questionRef.customerQuestionText;
    const shouldShowOptOutOption = template.niOptionRequired;
    const parsedOptions = getTsgQuestionOptions(template, flags, t);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLElement | null>(null);
    const minDobDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 120)
    );

    // Capture the label element for resize via useElementSize
    useLayoutEffect(() => {
        if (containerRef.current) {
            const label = containerRef.current.querySelector<HTMLElement>('.chakra-form__label');
            if (label) {
                labelRef.current = label;
            }
        }
    }, []);

    const { height: labelHeight } = useElementSize(labelRef);
    
    const commonProps = {
        name: questionId,
        onBlur: onBlur,
        label: label,
        isInvalid: !!(touched && error),
        errorMessage: error,
        isDisabled: isOptedOut,
        sx: {
            '> .chakra-form__label': {
                whiteSpace: 'normal',
            },
        },
    };

    const picklistProps = {
        sx: {
            '> .chakra-form__label': {
                whiteSpace: 'normal',
                // transition: 'none', // Can be toggled if needed for performance improvement
            },
            '.form-control': {
                height: 'auto',
                paddingTop: value === '' 
                    ? `${(labelHeight + 5) / 16}rem`
                    : `${(labelHeight + 15) / 16}rem`,
                paddingBottom: '10px',
                whiteSpace: 'normal',
            },
        },
    }

    const renderedValue = useMemo<string | string[]>(
        () => (value === OPTED_OUT_ANSWER_VALUE ? '' : value),
        [value]
    );

    return (
        <VStack alignItems="stretch" ref={containerRef}>
            {/* Opt out switch */}
            {shouldShowOptOutOption && (
                <HStack>
                    <FormControlSwitch
                        isChecked={isOptedOut}
                        onChange={(e) => onOptOutChange(e.target.checked)}
                    />
                    <Text>{t('support:tsgInterview.no-information')}</Text>
                </HStack>
            )}

            {questionType === 'Date' && (
                isOptedOut ? (
                    // Dummy component to maintain layout when opted out
                    <Box position="relative">
                        <FormControlInput
                            {...commonProps}
                            value={renderedValue as string}
                            onChange={onChange}
                            isDisabled
                            type="text"
                            isInvalid={false}
                            isReadOnly
                            className={styles.dateInput}
                        />
                    <Box
                        className={styles.calendarToggle}
                        w="1.2rem"
                        h="1.2rem"
                        position="absolute"
                        top="1.2rem"
                        right={{ base: '1.2rem' }}
                    ></Box>
                </Box>
                ) : (
                    <DateInputFormField 
                        {...commonProps}
                        value={renderedValue as string}
                        onChange={onChange}
                        maxDate={issueDate}
                        minDate={minDobDate}
                    />
                )
            )}


            {/* Different input types */}
            {questionType === 'Time' && (
                <FormControlInput
                    {...commonProps}
                    value={renderedValue}
                    onChange={onChange}
                    type="time"
                />
            )}

            {questionType === 'Picklist' && (
                <FormControlSelect
                    {...commonProps}
                    {...picklistProps}
                    value={renderedValue}
                    onChange={onChange}
                    options={parsedOptions}
                />
            )}

            {questionType === 'Checkboxes' && (
                <FormControlCheckboxGroup
                    {...commonProps}
                    value={Array.isArray(renderedValue) ? renderedValue : []}
                    onChange={(value) => onCheckedChange(value)}
                    options={parsedOptions}
                />
            )}

            {/* Render basic text input by default */}
            {questionType !== 'Date' &&
                questionType !== 'Picklist' &&
                questionType !== 'Checkboxes' &&
                questionType !== 'Display' &&
                questionType !== 'Time' && (
                    <FormControlInput
                        {...commonProps}
                        value={renderedValue}
                        onChange={onChange}
                    />
                )}
        </VStack>
    );
});
