import useTranslation from 'next-translate/useTranslation';
import { Grid, GridItem, Text, Heading } from '@dexcomit/web-ui-lib';
import SupportButtonRadioGroup, {
    SupportButtonRadio,
} from '../common/support-button-radios';
import { useState, forwardRef } from 'react';
import { CHATBOT_TRIGGER_ISSUE_CODE } from '@lib/forms/support-form/support-form-dictionaries';
import { useProvider } from '@/context/components-context';

export interface IssueCategoryOptionsProps {
    onIssueSelect: (value: string) => void;
    currentIssue?: string;
}

export const IssueCategorySelector = forwardRef<
    HTMLDivElement,
    IssueCategoryOptionsProps
>(function IssueCategorySelector({ onIssueSelect, currentIssue }, ref) {
    const { OpenChatbotTrigger } = useProvider();
    const [issue, setIssue] = useState(currentIssue || '');
    const { t } = useTranslation();

    const translationObject: { code: string; label: string }[] = t(
        'support:issues.options',
        {},
        { returnObjects: true }
    );

    const optionsArray = translationObject.map(({ code, label }) => {
        return { code: code, title: label };
    });

    function handleSelect(val: string) {
        setIssue(val);
        onIssueSelect(val);
    }

    return (
        <Grid ref={ref}>
            <GridItem colSpan={{ base: 6, md: 12 }}>
                <Heading size="lg" mb={5}>
                    {t('support:issues.header')}
                </Heading>
                <Text fontSize={18} mb={5}>
                    {t('support:issues.subheader')}
                </Text>
                <SupportButtonRadioGroup
                    onSelect={handleSelect}
                    selectedOptionValue={issue}
                    radioOptions={optionsArray}
                    renderItem={({ code, title }, i) =>
                        code !== CHATBOT_TRIGGER_ISSUE_CODE ? (
                            <SupportButtonRadio
                                code={code}
                                title={title}
                                key={code}
                                onClick={handleSelect}
                                isChecked={code === issue}
                                // For screen reader reading index of current item (1 of 9, 2 of 9...)
                                aria-setsize={optionsArray.length}
                                aria-posinset={i + 1}
                            />
                        ) : (
                            <OpenChatbotTrigger key={code} role="none">
                                <SupportButtonRadio
                                    code={code}
                                    title={title}
                                    onClick={handleSelect}
                                    isChecked={code === issue}
                                    // For screen reader reading index of current item (1 of 9, 2 of 9...)
                                    aria-setsize={optionsArray.length}
                                    aria-posinset={i + 1}
                                />
                            </OpenChatbotTrigger>
                        )
                    }
                />
            </GridItem>
        </Grid>
    );
});
