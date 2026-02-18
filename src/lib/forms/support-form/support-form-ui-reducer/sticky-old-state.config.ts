
/*  
    Collected Data Paths
    all of the relevant "sticky" property paths
    in an object for easy enumeration and avoding typos
*/
export const CDP = {
    cdSelectedPatient: "collectedData.selectedPatient",
    cdInsertionSite: "collectedData.insertionSite",
    cdIssueDate: "collectedData.issueDate",
    cdIssueCategory: "collectedData.issueCategory",
    cdSpecifiedProductDetails: "collectedData.specifiedProductDetails",
    cdProductType: "collectedData.productType",
    cdProductReturn: "collectedData.productReturn",
    cdTsgInterview: "collectedData.tsgInterview",
    cdUserInfo: "collectedData.userInfo",

    transientFormData: "transientFormData",
    flags: "flags"
}

/*
    configuration of change dependencies
    if we want to say that change to "tsgInterview" depends on changes to "productType" and "country"
    we'd have {...tsgInterview: ['productType', 'country']}
    only list direct dependencies, nested ("recursive") dependencies are resolved automatically
*/
export const COLLECTED_DATA_DEPENDENCIES = {
    [CDP.cdSelectedPatient]: [],
    [CDP.cdInsertionSite]: [CDP.cdSelectedPatient],
    [CDP.cdIssueDate]: [CDP.cdSelectedPatient],
    [CDP.cdIssueCategory]: [CDP.cdSelectedPatient],
    [CDP.cdSpecifiedProductDetails]: [CDP.cdSelectedPatient],
    [CDP.cdProductType]: [CDP.cdSpecifiedProductDetails],
    [CDP.cdProductReturn]: [CDP.cdTsgInterview],
    [CDP.cdTsgInterview]: [CDP.cdProductType, CDP.cdSelectedPatient, CDP.cdIssueCategory, CDP.cdSpecifiedProductDetails],
    [CDP.cdUserInfo]: [CDP.cdSelectedPatient],
    [CDP.transientFormData]: [CDP.cdIssueDate],
    [CDP.flags]: [CDP.cdIssueCategory]
}

export const observedPaths = Object.values(CDP);
