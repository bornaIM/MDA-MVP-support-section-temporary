import { SUPPORT_FORM_ACTIONS } from "./support-form-enums";
import { GenericValue, UIAction } from "./types";
import { SentinelProduct } from "@lib/api/sentinel";
import {
  ProductGenerationType,
  SpecifyProductDetailsSubmitProps,
} from '@components/forms/support-form/specify-product/types';
import { isValid } from "date-fns";
import useDateInputFormFieldHelpers from "@components/forms/date-input/date-input-form-field/use-date-input-form-field-helpers";


type BackendFunction = (...args: GenericValue[]) => Promise<GenericValue> | null | string;
interface IBackendServices {
  [key: string]: BackendFunction;
}
interface SupportFormDispatcherProps {
  logDispatcherAction: (payload: UIAction) => void;
  updateUi: (action: UIAction) => void;
  backendServices: IBackendServices
}

function useSupportFormDispatcher({logDispatcherAction, updateUi, backendServices}: SupportFormDispatcherProps ){
  const { convertString, dateSimpleFormat, dateStandardFormat } = useDateInputFormFieldHelpers();

  /* all data is available, just trigger reducer logic */
  const reducerAction = (type: SUPPORT_FORM_ACTIONS) => {
    return (value: Omit<UIAction, "type">) => {
      logDispatcherAction({ type, value });
      updateUi({ type, value });
    }
  }
  const uiDispatcher = {
    initialize: reducerAction(SUPPORT_FORM_ACTIONS.INITIALIZE),
    selectPatient: reducerAction(SUPPORT_FORM_ACTIONS.SELECT_PATIENT),
    acknowledgeNotSae: reducerAction(SUPPORT_FORM_ACTIONS.ACKNOWLEDGE_NOT_SAE),
    selectInsertionSite: reducerAction(SUPPORT_FORM_ACTIONS.SELECT_INSERTION_LOCATION),
    setInsertionDate: (date: string) => {
      logDispatcherAction({
        type: SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE,
        value: isValid(date) ? date : undefined
      });

      // Convert from locale specific format to standard format
      const dateFormatted = convertString(date, dateSimpleFormat, dateStandardFormat);

      updateUi({
        type: SUPPORT_FORM_ACTIONS.SELECT_ISSUE_DATE,
        value: dateFormatted
      });
    },
    setSentinelProducts: reducerAction(SUPPORT_FORM_ACTIONS.SET_SENTINEL_PRODUCTS),
    selectIssueCategory: reducerAction(SUPPORT_FORM_ACTIONS.SELECT_ISSUE_CATEGORY),
    specifySentinelProduct: (sentinelProduct: SentinelProduct) => {
        const productDetails: SpecifyProductDetailsSubmitProps = {
            date: new Date(sentinelProduct.audit_time_stamp)
                .toISOString()
                .substring(0, 10),
            serialNumber: sentinelProduct.serial_number,
            continueWithoutSerial: false,
            productGeneration:
                sentinelProduct.product_type as ProductGenerationType,
        };
      logDispatcherAction({type: SUPPORT_FORM_ACTIONS.SPECIFY_PRODUCT, value: productDetails});
      updateUi({type: SUPPORT_FORM_ACTIONS.SPECIFY_PRODUCT, value: productDetails});
    },
    specifyProduct: reducerAction(SUPPORT_FORM_ACTIONS.SPECIFY_PRODUCT),
    setProductType: reducerAction(SUPPORT_FORM_ACTIONS.SET_PRODUCT_TYPE),
    submitTsgInterview: reducerAction(SUPPORT_FORM_ACTIONS.SUBMIT_TSG_INTERVIEW),
    submitUserInfo: reducerAction(SUPPORT_FORM_ACTIONS.SUBMIT_USER_INFO),
    confirmSubmission: reducerAction(SUPPORT_FORM_ACTIONS.CONFIRM_SUBMISSION),
    exitSubmission: reducerAction(SUPPORT_FORM_ACTIONS.EXIT_SUBMISSION),
    setSentinelManualInput: reducerAction(SUPPORT_FORM_ACTIONS.SET_SENTINEL_MANUAL_INPUT),
    guestRequestSupport: reducerAction(SUPPORT_FORM_ACTIONS.GUEST_REQUEST_SUPPORT),
    goBack: reducerAction(SUPPORT_FORM_ACTIONS.GO_BACK),
    returnToGuestStart: reducerAction(SUPPORT_FORM_ACTIONS.RETURN_TO_GUEST_START),
    abandonNavigateAway: reducerAction(SUPPORT_FORM_ACTIONS.ABANDON_NAVIGATE_AWAY)
  };

  return uiDispatcher;
}

export default useSupportFormDispatcher;
