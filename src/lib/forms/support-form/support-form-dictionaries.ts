import { ReporterType } from '@components/forms/support-form/reporter-information';


// Contains a list of product generations that can be selected in support form.
export const SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY: Record<
    string,
    string[]
> = {
    CA: ['G6', 'G7',],
    US: ['G6', 'G7'],
};

/**
 * Some product generations have more than one sensor variant, and not all variants are available in all
 * countries (ex. G7 in the US), This dictionary is used for filtering product lists fetched from various
 * integrations (ex. products fetched from Sentinel).
 */
export const PURCHASEABLE_PRODUCT_SENSORS_FOR_COUNTRY: Record<
    string,
    string[]
> = {
    CA: [...SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY['CA']],
    US: [...SELECTABLE_PRODUCT_GENERATIONS_FOR_COUNTRY['US'], 'G7_15'],
};

/**
 * Dictionary containing G7 sensor variants, if a country is missing it means only "standard"
 * variant is sold in a country (sensor name is the same as generation name).
 */
export const G7_SENSOR_VARIANT_FOR_COUNTRY: Record<string, string[]> = {
    US: ['G7', 'G7 15 Day'],
};

export const SFDC_REPORTER_TYPES = {
[ReporterType.patient]: "Consumer",
[ReporterType.parent]: "Parent",
[ReporterType.familyMember]: "Family Member",
[ReporterType.spouse]: "Spouse/partner",
[ReporterType.healthcareProfessional]: "Healthcare Professional",
[ReporterType.thirdPartyApp]: "partner",
[ReporterType.other]: "Other",
[ReporterType.default]: ""
}

export const SFDC_ISSUE_CODES = {
    HelpPairingSensor: "113",
    BriefSensorIssue: "042",
    CGMAccuracy: "012",
    SignalLoss: "215",
    Bleeding: "075",
    DifficultiesDeployingSensor: "214",
    SensorFailedG6: "224",
    SensorFailedG7: "125",
    SensorAndOverpatchFellOff: "239",
    SomethingElse: "Other",
}

export const SFDC_INSERTION_LOCATIONS = {
    arm: "Arm",
    abdomen: "Abdomen",
    "upper-buttocks": "Upper Buttocks",
    other: "Other (off-label location)",
    noAnswer: "Unable/Unwilling to Answer"
} as {[key: string]: string};

export const SFDC_TITLE = {
    "mr": "Mr.",
    "ms": "Ms.",
    "mrs": "Mrs.",
    "dr": "Dr.",
    "prof": "Prof.",
    "mx": "Mx."
} as {[key: string]: string}

// Issue code that will automatically open chatbot when selected
export const CHATBOT_TRIGGER_ISSUE_CODE = SFDC_ISSUE_CODES.SomethingElse;
// Issue codes that will trigger "Connect to agent" button
export const CONNECT_TO_AGENT_ISSUE_CODES = [
    SFDC_ISSUE_CODES.HelpPairingSensor,
    SFDC_ISSUE_CODES.SignalLoss,
    SFDC_ISSUE_CODES.BriefSensorIssue,
];

export const SFDC_GENDER = {
    "other": "Prefer not to say",
    "male": "male",
    "female": "female",
}