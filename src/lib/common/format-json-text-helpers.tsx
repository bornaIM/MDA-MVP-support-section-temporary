import TransText from 'next-translate/TransText';

export function formatJSONTextIntoMultipleLines(title: string) {
    return (
        <TransText
            text={title}
            components={{
                br: <br />,
            }}
        />
    );
};
