import {
    SUPPORT_FORM_STEPS,
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
