import { SFDC_ISSUE_CODES } from '@lib/forms/support-form/support-form-dictionaries';
import { IssueFlags } from "@components/forms/support-form/issue-category/types";

/** Checks if issue category and related flags are valid,
 * this is used for determining if the user is allowed to proceed with the form */
export function isValidIssueCategory(
    issueCategory: string,
    flags: IssueFlags
): boolean {
    return (
        // Issue isn't "Something else"
        issueCategory !== SFDC_ISSUE_CODES.SomethingElse &&
        // Issue isn't signal loss or sensor issue that lasted UNDER an hour
        !((issueCategory === SFDC_ISSUE_CODES.BriefSensorIssue || issueCategory === SFDC_ISSUE_CODES.SignalLoss) && !flags.issueLastsOverAnHour)
    );
}
