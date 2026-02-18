export interface IssueCategoryFaqLink {
    title: string;
    href: string;
    productGeneration?: string
}

export interface IssueCategoryFaqLinks {
    issueCategoryCode: string;
    links: IssueCategoryFaqLink[]
}

export interface IssueCategoriesFaqLinks {
    issueCategories?: IssueCategoryFaqLinks[]
}

export type IssueCategorySelectorWithFaqLinksProps = {
    onIssueSelect: (value: string, flags: IssueFlags) => void;
    currentIssue?: string;
};

export type IssueFlags = {
    issueDuringWarmup: boolean;
    issueLastsOverAnHour: boolean;
    skipInsertionDate: boolean;
};