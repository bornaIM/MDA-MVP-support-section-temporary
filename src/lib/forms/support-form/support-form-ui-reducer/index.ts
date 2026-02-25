import { SUPPORT_FORM_ACTIONS, SUPPORT_FORM_MODE, SUPPORT_FORM_SIDE_EFFECTS, SUPPORT_FORM_STEPS, } from '../support-form-enums';
import { UIAction, UIState } from '../types';
import { withSaveStep, withStepProgress, withDisplayProps } from './reducer-helpers';
import { NEXT_STEP_MAP } from './next-step-map';
import { withStickyOldState } from './with-sticky-old-state';

function supportFormUiReducer(state: UIState, action: UIAction): UIState {
    function standardStep(updates: Partial<UIState>): UIState {
        const stateWithUpdates = withStickyOldState(state, updates);
        return withSaveStep(withStepProgress(stateWithUpdates));
    }

    function acknowledgeNotSaeStep(){
        /*
            if we went back to acknowledge SAE screen (using internal back button), accepted again, we 
            want the values on the following page to be pre-filled
            because we don't know how far we went before coming back,
            we're filling the following page step by step
        */     
        let stateAfterSae = standardStep(
            NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.ACKNOWLEDGE_NOT_SAE](state, action)
        );
        
        if (stateAfterSae.step != SUPPORT_FORM_STEPS.SELECT_INSERTION_SITE) return stateAfterSae;
        if (!stateAfterSae.collectedData.insertionSite) return stateAfterSae;
        stateAfterSae = standardStep(
            NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_INSERTION_LOCATION](stateAfterSae, {
                type: SUPPORT_FORM_ACTIONS.SELECT_INSERTION_LOCATION,
                value: stateAfterSae.collectedData.insertionSite
            }
        ));
        if (!stateAfterSae.collectedData.issueDate) return stateAfterSae;
        stateAfterSae = standardStep(
            NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE](stateAfterSae, {
                type: SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE,
                value: stateAfterSae.collectedData.issueDate
            }
        ));

        if (!stateAfterSae.collectedData.issueCategory) return stateAfterSae;
        stateAfterSae = standardStep(
            NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_ISSUE_CATEGORY](stateAfterSae, {
                type: SUPPORT_FORM_ACTIONS.SELECT_ISSUE_CATEGORY,
                value: {
                    selectedIssueCategory: stateAfterSae.collectedData.issueCategory,
                    flags: stateAfterSae.flags
                }
            }
        ));

        return stateAfterSae;
    }

    if ([
        SUPPORT_FORM_ACTIONS.INITIALIZE,
        SUPPORT_FORM_ACTIONS.SELECT_PATIENT,
        SUPPORT_FORM_ACTIONS.GUEST_REQUEST_SUPPORT,

        SUPPORT_FORM_ACTIONS.SELECT_INSERTION_LOCATION,
        SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE,
        SUPPORT_FORM_ACTIONS.SET_SENTINEL_PRODUCTS,
        SUPPORT_FORM_ACTIONS.SET_SENTINEL_MANUAL_INPUT,
        SUPPORT_FORM_ACTIONS.SELECT_ISSUE_CATEGORY,
        SUPPORT_FORM_ACTIONS.SPECIFY_PRODUCT,

        SUPPORT_FORM_ACTIONS.SUBMIT_TSG_INTERVIEW,
        SUPPORT_FORM_ACTIONS.SUBMIT_USER_INFO,
        SUPPORT_FORM_ACTIONS.CONFIRM_SUBMISSION,
        SUPPORT_FORM_ACTIONS.EXIT_SUBMISSION
    ].includes(action.type)) {
        return standardStep(
            NEXT_STEP_MAP[action.type](state, action)
        );
    }

    switch (action.type) {
        case SUPPORT_FORM_ACTIONS.ACKNOWLEDGE_NOT_SAE:
            const newState = acknowledgeNotSaeStep();
            // HACK: due to React.StrictMode, fast-forwarding SAE causes duplicate history, we dedupe here.       
            const newStepHistory:SUPPORT_FORM_STEPS[] = [];
            const reverseOldStepHistory = [...newState.stepHistory].reverse();
            reverseOldStepHistory.forEach(el => {
                if (!newStepHistory.includes(el)) newStepHistory.unshift(el);
            });

            const isGuestMode = newState.mode === SUPPORT_FORM_MODE.GUEST;
            if (isGuestMode && action.value === false) {
                return {
                    ...newState,
                    stepHistory: newStepHistory,
                    sideEffect: SUPPORT_FORM_SIDE_EFFECTS.REDIRECT_TO_SUPPORT_LANDING_PAGE,
                    ts: Date.now()
                };
            }

            return {
                ...newState,
                stepHistory: newStepHistory
            }

        case SUPPORT_FORM_ACTIONS.GO_BACK:
            const IN_BETWEEN_STEPS = [
                SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE,
                SUPPORT_FORM_STEPS.SELECT_INSERTION_SITE,
                SUPPORT_FORM_STEPS.SELECT_ISSUE_DATE,
                SUPPORT_FORM_STEPS.SELECT_YOUR_DEVICE,
                SUPPORT_FORM_STEPS.SELECT_ISSUE_CATEGORY,
            ];

            const stepHistory = state.stepHistory;

            if (!stepHistory?.length) return state;
            let lastIndex = stepHistory.length-1;
            // when clicking back between P2 and P3, we want to go back to acknowledge not SAO
            while ((lastIndex > 0) && (
                IN_BETWEEN_STEPS.includes(stepHistory[lastIndex]))
                || (state.step === stepHistory[lastIndex])
            ) lastIndex--;

            // Before going to guest start show confirmation modal
            if (stepHistory[lastIndex] === SUPPORT_FORM_STEPS.GUEST_START) {
                return {
                    ...state,
                    openNavigateAwayModal: true
                };
            }

                return withStepProgress({
                    ...state,
                    stepHistory: stepHistory.slice(0, lastIndex + 1),
                step: stepHistory[lastIndex],
                sideEffect: SUPPORT_FORM_SIDE_EFFECTS.SCROLL_TO_TOP,
                ts: Date.now()
            }); 

        case SUPPORT_FORM_ACTIONS.DEBUG_OVERRIDE_STATE:
            return action.value;

        // Called when clicking the back button on page 1 of guest flow, we should
        // go back to the guest start step and clear all data
        case SUPPORT_FORM_ACTIONS.RETURN_TO_GUEST_START:
            return withStepProgress({
                ...state,
                collectedData: {},
                transientFormData: {},
                flags: {
                    issueDuringWarmup: false,
                    issueLastsOverAnHour: false,
                    skipInsertionDate: false
                },
                openNavigateAwayModal: false,
                step: SUPPORT_FORM_STEPS.GUEST_START
            });

        case SUPPORT_FORM_ACTIONS.ABANDON_NAVIGATE_AWAY:
            return {
                ...state,
                openNavigateAwayModal: false,
            }

        default:
            throw new Error('Unrecognized reducer action');
            return state;
    }
}

export function supportFormUiReducerWithDisplay(state: UIState, action: UIAction):UIState {
    return withDisplayProps(supportFormUiReducer(state, action));
}
