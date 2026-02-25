import { IssueCategorySelector } from '@components/forms/support-form/issue-category/issue-category-selector';
import { useRef, useState } from 'react';
import {
    CONNECT_TO_AGENT_ISSUE_CODES,
    SFDC_ISSUE_CODES,
} from '@lib/forms/support-form/support-form-dictionaries';
import IssueCategoryTimeModal from './issue-category-time-modal';
import { Link } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import IssueCategoryWarmupModal from './issue-category-warmup-modal';
import { IssueFlags, IssueCategorySelectorWithFaqLinksProps } from './types';
import { useProvider } from '@/context/components-context';

function checkShouldShowBotButton(issueCode: string): boolean {
    return CONNECT_TO_AGENT_ISSUE_CODES.includes(issueCode);
}
const initialFlags: IssueFlags = {
    issueDuringWarmup: false,
    issueLastsOverAnHour: false,
    skipInsertionDate: false,
};

export function IssueCategorySelectorWithTimeModal({
    onIssueSelect, currentIssue
}: IssueCategorySelectorWithFaqLinksProps) {
    const { OpenChatbotTrigger } = useProvider();
    const { t } = useTranslation();

    const [issue, setIssue] = useState(currentIssue || '');
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [showWarmupModal, setShowWarmupModal] = useState(false);

    const issueCategorySelectorRef = useRef<HTMLDivElement>(null);

    function handleIssueSelect(value: string) {
        switch (value) {
            case SFDC_ISSUE_CODES.SignalLoss:
            case SFDC_ISSUE_CODES.BriefSensorIssue:
                setShowTimeModal(true);
                break;
            case SFDC_ISSUE_CODES.SensorFailedG6:
            case SFDC_ISSUE_CODES.SensorFailedG7:
                setShowWarmupModal(true);
                break;
            case SFDC_ISSUE_CODES.HelpPairingSensor:
            case SFDC_ISSUE_CODES.DifficultiesDeployingSensor:
                onIssueSelect(value, {
                    ...initialFlags,
                    skipInsertionDate: true,
                });
                break;
            default:
                onIssueSelect(value, initialFlags);
        }
        setIssue(value);
    }

    function handleFlags(newFlags: Partial<IssueFlags>){
        setShowTimeModal(false);
        setShowWarmupModal(false);
        onIssueSelect(issue, {...initialFlags, ...newFlags })
    }

    return (
        <>
        <p>u issues categoriju sam</p>
            {showTimeModal && (
                <IssueCategoryTimeModal
                    issue={issue}
                    isOpen={showTimeModal}
                    handleFlags={handleFlags}
                    onClose={() => setShowTimeModal(false)}
                    finalFocusRef={issueCategorySelectorRef}
                />
            )}
            {showWarmupModal && (
                <IssueCategoryWarmupModal
                    isOpen={showWarmupModal}
                    handleFlags={handleFlags}
                    onClose={() => setShowWarmupModal(false)}
                    finalFocusRef={issueCategorySelectorRef}
                />
            )}
            <IssueCategorySelector onIssueSelect={handleIssueSelect} currentIssue={currentIssue} ref={issueCategorySelectorRef} />
            {checkShouldShowBotButton(issue) && (
                <OpenChatbotTrigger>
                    <Link as="button" variant="greenText" alignSelf="start">
                        {t('support:issues.chatbot')}
                    </Link>
                </OpenChatbotTrigger>
            )}
        </>
    );
}
