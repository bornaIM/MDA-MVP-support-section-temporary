import {
    Radio,
    TextBlock,
    GridItem,
} from '@dexcomit/web-ui-lib';

interface RadioItemProps {
    value: string;
    text: string;
    onClick?: () => void;
}

export function RadioItem({ value, text, onClick}: RadioItemProps) {
    return (
        <Radio as={GridItem} value={value}>
            <TextBlock
                onClick={() => {onClick && onClick()}}
                justifyContent="center"
                body={{
                    children: text,
                    style: 'b2',
                    fontWeight: '600',
                    textAlign: 'center',
                }}
            />
        </Radio>
    );
}