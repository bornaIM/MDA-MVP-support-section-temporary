type QuestionType = | 'Checkboxes'
| 'Picklist'
| 'Text'
| 'Date'
| 'Display'
| 'Time';

export interface SalesforceApiTemplate {
  templateId: string;
  templateHeaderId?: string;
  questionRef: {
    id: string;
    value?: string | null;
    questionText: string;
    questionType: QuestionType;
    customerQuestionText: string;
    helpText?: string; 
  };
  questionId: string; 
  questionConstraint: string | null;
  parentConstraint: string | null;
  questionCode: string; 
  order: number;
  niOptionRequired: boolean; 
  mandatoryForSae?: boolean; 
  compliantConstraint?: string | null;
  validationPattern?: string;
  validationMismatchMessage?: string;
  apiComplaintCodeId?: string;
  
  userEnteredAnswer?: string | string[];
};

export type TsgFormSubmitData = { 
  questionId: string; 
  response: string,
  salesforceApiTemplate: SalesforceApiTemplate
}[];
