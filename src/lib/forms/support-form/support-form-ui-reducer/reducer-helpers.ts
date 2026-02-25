import {
    SUPPORT_FORM_STEPS,
    SUPPORT_FORM_MODE
} from '../support-form-enums';
import { UIState } from '../types';
import { last } from 'lodash';

export function withSaveStep(newState: UIState): UIState {
    const oldStepHistory = (newState.stepHistory || []); 
    return {
        ...newState,
        stepHistory: [
            ...oldStepHistory,
            ...((newState.step !== last(oldStepHistory)) ? [newState.step] : [])
        ]
    }
}

export function withStepProgress(newState: UIState): UIState {
    const STEP_PROGRESS_MAP = {
        [SUPPORT_FORM_STEPS.GUEST_START]: 5,
        [SUPPORT_FORM_STEPS.SELECT_PATIENT]: 5,
        [SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE]: 10,
        [SUPPORT_FORM_STEPS.SELECT_INSERTION_SITE]: 20,
        [SUPPORT_FORM_STEPS.SELECT_ISSUE_DATE]: 40,
        [SUPPORT_FORM_STEPS.SELECT_ISSUE_CATEGORY]: 50,
        [SUPPORT_FORM_STEPS.SELECT_SENTINEL_PRODUCT]: 60,
        [SUPPORT_FORM_STEPS.SPECIFY_PRODUCT]: 60,
        [SUPPORT_FORM_STEPS.TSG_INTERVIEW]: 70,
        [SUPPORT_FORM_STEPS.COLLECT_USER_INFO]: 80,
        [SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION]: 100
    } as {[key in SUPPORT_FORM_STEPS]: number};

    return {
        ...newState,
        progress: STEP_PROGRESS_MAP[newState.step] || newState.progress
    }
}

export function withDisplayProps(uiState: UIState): UIState {
    const display = {
        supportFormBackButton: ![
                SUPPORT_FORM_STEPS.SELECT_PATIENT,
                SUPPORT_FORM_STEPS.GUEST_START,
            ].includes(uiState.step),
        supportFormNavigateAway: ![
                SUPPORT_FORM_STEPS.SELECT_PATIENT,
                SUPPORT_FORM_STEPS.GUEST_START,
                SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE,
                SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION
            ].includes(uiState.step),
        supportFormProgress: uiState.step !== SUPPORT_FORM_STEPS.GUEST_START,
        selectPatient: uiState.step === SUPPORT_FORM_STEPS.SELECT_PATIENT,
        guestStartSupportTicket: uiState.step === SUPPORT_FORM_STEPS.GUEST_START,
        supportModal: uiState.step === SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE,
        insertLocationSelector: uiState.step >= SUPPORT_FORM_STEPS.SELECT_INSERTION_SITE && uiState.step < SUPPORT_FORM_STEPS.TSG_INTERVIEW,
        dateInputIssue: uiState.step >= SUPPORT_FORM_STEPS.SELECT_ISSUE_DATE && uiState.step < SUPPORT_FORM_STEPS.TSG_INTERVIEW,
        issueCategorySelectorWithTimeModal: uiState.step >= SUPPORT_FORM_STEPS.SELECT_ISSUE_CATEGORY && uiState.step < SUPPORT_FORM_STEPS.TSG_INTERVIEW,
        supportSelectMyProduct: [SUPPORT_FORM_STEPS.SELECT_SENTINEL_PRODUCT, SUPPORT_FORM_STEPS.SENTINEL_SHOW_SPECIFY_PRODUCT].includes(uiState.step),
        specifyProduct: [SUPPORT_FORM_STEPS.SPECIFY_PRODUCT, SUPPORT_FORM_STEPS.SENTINEL_SHOW_SPECIFY_PRODUCT].includes(uiState.step),
        tsgInterview: uiState.step === SUPPORT_FORM_STEPS.TSG_INTERVIEW,
        collectAuthUserInfo: [SUPPORT_FORM_STEPS.COLLECT_USER_INFO, SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION].includes(uiState.step) && (uiState.mode === SUPPORT_FORM_MODE.CAREGIVER || uiState.mode === SUPPORT_FORM_MODE.DEPENDENT) && !!uiState.collectedData.selectedPatient,
        collectGuestUserInfo: [SUPPORT_FORM_STEPS.COLLECT_USER_INFO, SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION].includes(uiState.step) && !(uiState.mode === SUPPORT_FORM_MODE.CAREGIVER || uiState.mode === SUPPORT_FORM_MODE.DEPENDENT),
        supportSubmitModal: uiState.step === SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION
    };

    return {
        ...uiState,
        display
    }    
}