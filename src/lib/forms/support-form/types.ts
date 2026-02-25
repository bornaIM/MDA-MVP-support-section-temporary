import { SupportAuthInfoProps } from "@components/forms/support-form/collect-auth-user-info";
import { SpecifyProductDetailsSubmitProps } from "@components/forms/support-form/specify-product/types";
import { TsgFormSubmitData } from "@components/forms/support-form/tsg-interview-form/types";
import { Profile } from "@dexcomit/web-vendor-framework/dist/esm/customer/types/customer";
import { SUPPORT_FORM_SIDE_EFFECTS, SUPPORT_FORM_STEPS, SUPPORT_FORM_ACTIONS, SUPPORT_FORM_MODE } from "./support-form-enums";
import { SupportGuestInfoProps } from "@components/forms/support-form/collect-guest-user-info";
import { IssueFlags } from "@components/forms/support-form/issue-category/types";

export type UIStateSelectOption = {
  value: string;
  code: string;
}

export type ProfileWithSentinelData = Profile & {
  patientWeightUnit?: string;
  patientWeight?: string;
  connectedDevice?: string; 
}

export type SupportFormCollectedData = {
  reporter?: Profile;
  selectedPatient?: ProfileWithSentinelData;
  insertionSite?: string;
  issueDate?: string;
  issueCategory?: string;
  specifiedProductDetails?: SpecifyProductDetailsSubmitProps;
  productType?: string
  productReturn?: boolean
  tsgInterview?: TsgFormSubmitData;
  userInfo?: SupportAuthInfoProps | SupportGuestInfoProps;
};

export type UIState = {
  mode: SUPPORT_FORM_MODE;
  step: SUPPORT_FORM_STEPS;
  collectedData: SupportFormCollectedData
  sideEffect?: SUPPORT_FORM_SIDE_EFFECTS;
  ts?: number;
  progress: number;
  transientFormData?: { [key: string]: any} // used for some temporary values, not submitted
  submissionError?: string
  flags: IssueFlags,
  stepHistory: SUPPORT_FORM_STEPS[],
  openNavigateAwayModal: boolean;
  display: DisplayFlags;
};

export interface DisplayFlags {
    supportFormBackButton: boolean;
    supportFormNavigateAway: boolean;
    supportFormProgress: boolean;
    selectPatient: boolean;
    guestStartSupportTicket: boolean;
    supportModal: boolean;
    insertLocationSelector: boolean;
    dateInputIssue: boolean;
    issueCategorySelectorWithTimeModal: boolean;
    supportSelectMyProduct: boolean;
    specifyProduct: boolean;
    tsgInterview: boolean;
    collectAuthUserInfo: boolean;
    collectGuestUserInfo: boolean;
    supportSubmitModal: boolean;
}


export type GenericValue = boolean | number | string | null | GenericObject;
export type GenericObject = { [key: string]: GenericValue};
export type ActionLogItemCategory = "DISPATCHER" | "REDUCER";
export type ActionLogItem = {
  category: ActionLogItemCategory;
  payload: UIAction;
}

export interface UIAction {
  type: SUPPORT_FORM_ACTIONS;
  [key: string]: any;
}

export interface ISupportFormContext {
  uiState?: UIState;
  uiDispatcher?: {[key: string]: (val:any) => void};
  actionLog: ActionLogItem[];
  debugHelpers?: {
    updateUiState: (action: UIAction) => void;
    setActionLog: (actions: ActionLogItem[]) => void;
  }
}


export type SupportFormProps = {
  mode: SUPPORT_FORM_MODE;
};
