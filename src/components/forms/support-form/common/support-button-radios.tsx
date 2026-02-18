import { GridItem, Grid, TextBlock, useTheme } from '@dexcomit/web-ui-lib';
import { formatJSONTextIntoMultipleLines } from '@lib/common/format-json-text-helpers';

export type SupportButtonRadioProps = {
    code: string;
    title: string;
    onClick?: (code: string) => void;
    isChecked?: boolean;
};

export type SupportButtonRadioGroupProps = {
    radioOptions: SupportButtonRadioProps[];
    onSelect: (value: string) => void;
    selectedOptionValue?: string;
    renderItem?: (props: SupportButtonRadioProps, i: number) => JSX.Element;
};

const buttonStyles = {
    alignItems: 'center',
    background: 'white',
    border: '1px solid',
    borderColor: 'neutral.mediumLight',
    borderRadius: 'rounded',
    display: 'inline-flex',
    h: '6.25rem',
    w: '100%',
    marginInlineStart: 0,
    px: '.813rem',
    py: 0,
    justifyContent: 'center',
    _checked: {
        border: '2px solid',
        borderColor: 'brand.secondary',
        color: 'brand.secondary',
        px: '.75rem',
    },

    _hover: {
        border: '2px solid',
        borderColor: 'brand.secondary',
        color: 'brand.secondary',
        cursor: 'pointer',
        px: '.75rem',
    },

    _focus: {
        border: '2px solid',
        borderColor: 'brand.secondary',
        color: 'brand.secondary',
        cursor: 'pointer',
        px: '.75rem',
        outline: 'none',
    },

    _invalid: {
        borderColor: 'neutral.mediumLight',
        color: 'black',
        _checked: {
            border: '2px solid',
            borderColor: 'notification.error',
            color: 'notification.error',
            px: '.75rem',
        },
        _hover: {
            borderColor: 'brand.secondary',
            color: 'brand.secondary',
        },
    },
};

export function SupportButtonRadio({
    code,
    title,
    onClick,
    isChecked,
    ...props
}: SupportButtonRadioProps) {
    return (
        <GridItem w="100%" as="button" role="radio" type='button' >
            <TextBlock
                onClick={() => onClick && onClick(code)}
                body={{
                    children: formatJSONTextIntoMultipleLines(title),
                    style: 'b2',
                    fontWeight: '900',
                    textAlign: 'center',
                }}
                aria-checked={isChecked}
                data-value={code}
                {...buttonStyles}
                {...props}
            />
        </GridItem>
    );
}

export default function SupportButtonRadioGroup({
    radioOptions,
    onSelect,
    selectedOptionValue,
    renderItem,
}: SupportButtonRadioGroupProps) {
    const { space } = useTheme();

    return (
        <Grid
            templateColumns={{
                base: 'repeat(1, 1fr)',
                lg: 'repeat(4, 1fr)',
            }}
            gap={space.s}
            role="radiogroup"
        >
            {radioOptions.map((item, i, arr) =>
                renderItem ? (
                    renderItem(item, i)
                ) : (
                    <SupportButtonRadio
                        code={item.code}
                        title={item.title}
                        key={item.code}
                        isChecked={item.code === selectedOptionValue}
                        onClick={onSelect}
                        // For screen reader reading index of current item (1 of 9, 2 of 9...)
                        aria-setsize={arr.length}
                        aria-posinset={i + 1}
                    />
                )
            )}
        </Grid>
    );
}
