import React, { createContext, PropsWithChildren, useContext, useReducer, useState } from 'react'
import { supportFormUiReducer } from './support-form-ui-reducer'
import useMockSupportFormBackend from './use-mock-support-form-backend';
import useSupportFormDispatcher from './use-support-form-dispatcher';
import { SUPPORT_FORM_STEPS } from './support-form-enums';
import { ActionLogItem, ActionLogItemCategory, ISupportFormContext, SupportFormProps, UIAction } from './types';

const SupportFormContext = createContext<ISupportFormContext>({ actionLog: []});
export function SupportFormProvider({ children, mode }: PropsWithChildren & SupportFormProps) {
  const [actionLog, setActionLog] = useState<ActionLogItem[]>([]);
  const logAction = (category: ActionLogItemCategory, payload: UIAction) => setActionLog(currentActionLog => {
    return [...currentActionLog, { category, payload }];
  })

  const [uiState, updateUiState] = useReducer(supportFormUiReducer, {
    mode: mode,
    step: SUPPORT_FORM_STEPS.UNITIALIZED,
    collectedData: {},
    transientFormData: {},
    showNavigateAwayModal: false
  });

  const updateUi = (action: UIAction) => {
    logAction("REDUCER", action);
    updateUiState(action);
  }
  const logDispatcherAction = (payload: UIAction) => logAction("DISPATCHER", payload);
  const backendServices = useMockSupportFormBackend();
  const uiDispatcher = useSupportFormDispatcher({logDispatcherAction, updateUi, backendServices});

  return (
    <SupportFormContext.Provider value={{ 
        uiState, uiDispatcher, actionLog, debugHelpers: {
          updateUiState, setActionLog
        }
      }}>
      {children}
    </SupportFormContext.Provider>
  )
}

export function useSupportForm() {
  return useContext(SupportFormContext)
}