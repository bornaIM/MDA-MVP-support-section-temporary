import { getProductType } from '@components/forms/support-form/specify-product/helpers';
import { SFDC_ISSUE_CODES } from '../support-form-dictionaries';
import {
    SUPPORT_FORM_ACTIONS,
    SUPPORT_FORM_MODE,
    SUPPORT_FORM_SIDE_EFFECTS,
    SUPPORT_FORM_STEPS,
} from '../support-form-enums';
import { UIAction, UIState } from '../types';
import { isValidIssueCategory } from '@lib/forms/support-form/helpers/is-valid-issue-category';
import { Profile } from '@dexcomit/web-vendor-framework/dist/esm/customer/types/customer';

function checkShouldShowSentinelComponent(
    uiState: UIState,
    selectedCategory: string
) {
    const categoryCodesWithNoSentinel = [SFDC_ISSUE_CODES.HelpPairingSensor, SFDC_ISSUE_CODES.DifficultiesDeployingSensor];
    return (
        !categoryCodesWithNoSentinel.includes(selectedCategory) &&
        uiState?.transientFormData?.sentinelProducts?.length
    );
}

const NEXT_STEP_MAP = {} as {[key in SUPPORT_FORM_ACTIONS]: (state:UIState, action: UIAction) => UIState};

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.INITIALIZE] = (state:UIState, action: UIAction) => {
        if (state.mode === SUPPORT_FORM_MODE.GUEST) {
            return {
                ...state,
                step: SUPPORT_FORM_STEPS.GUEST_START,
            };
        }

        const profile = action.value;

        // assertion check, this should never happen
        if (!profile) throw new Error('Missing profile');

        if (profile.dependentsList?.length) {
            return {
                ...state,
                collectedData: {
                  reporter: profile,
                },
                step: SUPPORT_FORM_STEPS.SELECT_PATIENT
            };
        }
        // if not dependents, it's the same as main profile was selected
        return {
            ...state,
            step: SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE,
            collectedData: {
                reporter: profile,
                selectedPatient: action.value
            },
        };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_PATIENT] = (state:UIState, action: UIAction) => {
            const mode = (action.value.accountType === 'dependent') ? SUPPORT_FORM_MODE.DEPENDENT : SUPPORT_FORM_MODE.CAREGIVER;
            return {
                ...state,
                mode,
                step: SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE,
                collectedData: {
                    selectedPatient: action.value
                },
            };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.GUEST_REQUEST_SUPPORT] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        step: SUPPORT_FORM_STEPS.ACKNOWLEDGE_NOT_SAE
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.ACKNOWLEDGE_NOT_SAE] = (state:UIState, action: UIAction) => {
    if (action.value) {
        return {
            ...state,
            step: SUPPORT_FORM_STEPS.SELECT_INSERTION_SITE,
            transientFormData: {
                ...state.transientFormData,
                preventAutoSubmit: true,
            },
        };
    }

    return {
        ...state,
        sideEffect:
            SUPPORT_FORM_SIDE_EFFECTS.REDIRECT_TO_SUPPORT_LANDING_PAGE,
        progress: 20,
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_INSERTION_LOCATION] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        step: SUPPORT_FORM_STEPS.SELECT_ISSUE_DATE,
        collectedData: {
            insertionSite: action.value
        },
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE] = (state:UIState, action: UIAction) => {
    if(!state.collectedData.insertionSite) {
        return {
            ...state,
        }
    }

    if(!action.value) {
        return {
            ...state,
            step: SUPPORT_FORM_STEPS.SELECT_ISSUE_DATE,
            issueDate: ''
        }
    }
    
    return {
        ...state,
        step: SUPPORT_FORM_STEPS.SELECT_ISSUE_CATEGORY,
        sideEffect: SUPPORT_FORM_SIDE_EFFECTS.FETCH_SENTINEL_DATA,
        ts: Date.now(),
        collectedData: {
            issueDate: action.value,
        },
        transientFormData: {
            ...state.transientFormData,
            preventAutoSubmit: false,
        },
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SET_SENTINEL_PRODUCTS] = (state:UIState, action: UIAction) => {
    const userData = {
        patientWeight: action.value?.userData?.weight?.value || '',
        patientWeightUnit: action.value?.userData?.weight?.unit?.toLowerCase() || '',
        connectedDevice: action.value?.userData?.connectedDevice || '',
        gender: action.value?.userData?.gender?.toLowerCase() || '',
    }

    return {
        ...state,
        collectedData: {
            ...state.collectedData,
            selectedPatient: {
                ...(state.collectedData.selectedPatient as Profile),
                ...userData
            },
        },

        transientFormData: {
            ...state.transientFormData,
            sentinelProducts: action.value.mapOfSerials,
        },
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SELECT_ISSUE_CATEGORY] = (state:UIState, action: UIAction) => {
    const shouldSentinelComponentShow = checkShouldShowSentinelComponent(
        state,
        action.value.selectedIssueCategory
    );

    const canProceedToNextStep = isValidIssueCategory(
        action.value.selectedIssueCategory,
        action.value.flags
    );

    let step: number | undefined;

    // If canProceedToNextStep let the user go to the next step, otherwise stay on the current one
    if (canProceedToNextStep) {
        if (shouldSentinelComponentShow) step = SUPPORT_FORM_STEPS.SELECT_SENTINEL_PRODUCT;
        else step = SUPPORT_FORM_STEPS.SPECIFY_PRODUCT;
    }

    return {
        ...state,
        collectedData: {
            issueCategory: action.value.selectedIssueCategory,
        },
        flags: {
            ...action.value.flags,
        },
        ...(step && { step })
    };
}


NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SET_SENTINEL_MANUAL_INPUT] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        step: action.value
            ? SUPPORT_FORM_STEPS.SENTINEL_SHOW_SPECIFY_PRODUCT
            : SUPPORT_FORM_STEPS.SELECT_SENTINEL_PRODUCT
    };
}


NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SPECIFY_PRODUCT] = (state:UIState, action: UIAction) => {
    const useNewSensorFailedCodes =
        (state.collectedData.issueCategory ===
            SFDC_ISSUE_CODES.SensorFailedG6 &&
            action.value.productGeneration.includes('G7')) || // TODO: dictionary/stricter type?
        action.value.productGeneration === 'D1+';

    const formattedProductGeneration = action.value.productGeneration.includes('G7') ? 'G7' : action.value.productGeneration;
    const formattedIssueCode = useNewSensorFailedCodes ? SFDC_ISSUE_CODES.SensorFailedG7 : state.collectedData.issueCategory;
    return {
        ...state,
        step: SUPPORT_FORM_STEPS.TSG_INTERVIEW,
        collectedData: {
            specifiedProductDetails: {
                ...action.value,
                date: state.flags.skipInsertionDate
                    ? state.collectedData.issueDate
                    // TODO: RENAME DATE INTO INSERTION DATEa
                    : action.value.date,
            },
            issueCategory: formattedIssueCode,
            productType: getProductType(
                formattedProductGeneration,
                formattedIssueCode || ''
            ),
        }
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SUBMIT_TSG_INTERVIEW] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        step: SUPPORT_FORM_STEPS.COLLECT_USER_INFO,
        collectedData: {
            tsgInterview: action.value,
        },
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.SUBMIT_USER_INFO] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        collectedData: {
            userInfo: {
                ...action.value,
            },
        },
        sideEffect: SUPPORT_FORM_SIDE_EFFECTS.SUBMIT_TO_SFDC,
        ts: Date.now(),
        progress: 90,
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.CONFIRM_SUBMISSION] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        submissionError: action.value,
        step: SUPPORT_FORM_STEPS.CONFIRM_SUBMISSION,
    };
}

NEXT_STEP_MAP[SUPPORT_FORM_ACTIONS.EXIT_SUBMISSION] = (state:UIState, action: UIAction) => {
    return {
        ...state,
        sideEffect:
            SUPPORT_FORM_SIDE_EFFECTS.REDIRECT_TO_SUPPORT_LANDING_PAGE,
    }
}

export { NEXT_STEP_MAP };
