import {
    RadioGroup,
    Grid,
    useTheme
} from '@dexcomit/web-ui-lib';

import { RadioItem } from './radio-item';

interface RadioItemProps {
    values: string[];
    texts: string[];
    onChange(value: string): void;
    selectedValue: string;
    list: any[];
}

export function RadioItemGroup({ values, texts, onChange, selectedValue, list }: RadioItemProps) {
    const { space } = useTheme();
    function handleClick(value:string){
        if (value === selectedValue) onChange(value);
    }

    return (
        <RadioGroup
            variant="productOptionSelector"
            onChange={(value) => onChange(value)}
            value={selectedValue}
            sx={{
                '.chakra-radio__label': {
                    height: '6.25rem !important',
                    justifyContent: 'center'
                },
            }}
        >
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    lg: 'repeat(4, 1fr)',
                }}
                gap={space.s}
            >
                {list?.map((item, index) => (
                    <RadioItem key={values[index]} value={values[index]} text={texts[index]} onClick={
                        () => handleClick(values[index])
                    }/>
                ))}
            </Grid>
        </RadioGroup>
    )
}