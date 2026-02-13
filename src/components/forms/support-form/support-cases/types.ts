export interface SupportCase {
    transmitterSN: string | null;
    systemGeneration: string | null;
    submitedDate: string;
    subject: string | null;
    status: string;
    productType: string;
    orders: any[];
    codeLabel: string;
    codeDetermination: number;
    caseNumber: string;
    caseId: string;
}

export interface Patient {
    gcaid: string;
    cases: SupportCase[];
    accountName: string;
    accountId: string;
    locale: string
}

export interface SupportCasesResponse {
    Id: string;
    Patient?: Patient;
    Dependents?: Patient[];
}

export interface SupportCasesTableProps {
    casesResponse: SupportCasesResponse | null | undefined;
}

// helper interface for mapping support cases to UI row components
export interface ExtendedSupportCase extends SupportCase {
    accountName: string;
    isDependant?: boolean;
}