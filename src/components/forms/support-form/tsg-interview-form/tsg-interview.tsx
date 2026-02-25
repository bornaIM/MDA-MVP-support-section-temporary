import { useEffect, useState } from 'react';
import { SalesforceApiTemplate, TsgFormSubmitData } from './types';
import { TsgInterviewForm } from './tsg-interview-form';
import { ProductGenerationType } from '../specify-product/types';
import { useRouter } from 'next/router';
import { IssueFlags } from '../issue-category/types';
import { Alert, LoadingWrapper } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { useProvider } from '@/context/components-context';

type TSGQuestionParams = {
    productGeneration: ProductGenerationType;
    locale:string,
    code: string;
};

type GetTsgQuestionParamsProps = {
    productGeneration: ProductGenerationType;
};

type TsgInterviewProps = GetTsgQuestionParamsProps & {
    onSubmit: (data: TsgFormSubmitData) => void;
    code: string;
    flags: IssueFlags;
};

type GetTsgQuestionsApiResponseProps = {
    error?: boolean;
    records: SalesforceApiTemplate[];
    complaintIdRef: {
        code: string;
    };
};

const getQuestions = async (
    params: TSGQuestionParams
): Promise<GetTsgQuestionsApiResponseProps> => {
    const init: RequestInit = {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'GET',
    };
    const queryParams = new URLSearchParams(params);

    const path = `/api/sfdc/get-tsg-questions?${queryParams.toString()}`;
    const response = await fetch(path, init);
    if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
    }
    throw new Error(response.statusText);
};


function TSGInterviewQuestionsOptionsFilter(
    questionRecords: GetTsgQuestionsApiResponseProps,
): SalesforceApiTemplate[] {
    return questionRecords.records.map((apiTemplate: SalesforceApiTemplate) => {
        return {
            ...apiTemplate,
            apiComplaintCodeId: questionRecords.complaintIdRef.code,
            questionRef: {
                ...apiTemplate.questionRef,
                value: apiTemplate.questionRef.value || '',
            },
        };
    });
}

export function TsgInterview({
    onSubmit,
    productGeneration,
    code,
    flags,
}: TsgInterviewProps) {
    const [questionData, setQuestionData] = useState<
        SalesforceApiTemplate[] | undefined | null
    >();

    const { defaultLanguage } = useProvider();

    const { t } = useTranslation();

    const { locale = defaultLanguage } = useRouter();
    useEffect(() => {
        getQuestions({
            productGeneration,
            locale,
            code,
        }).then((questionRecords: GetTsgQuestionsApiResponseProps) => {
            if (!questionRecords.error && questionRecords.records) {
                setQuestionData(
                    TSGInterviewQuestionsOptionsFilter(
                        questionRecords,
                    )
                );
            } else {
                setQuestionData(null);
            }
        });
    }, []);

    return (
        <LoadingWrapper isLoading={questionData === undefined}>
            <p>BORNA proba</p>
            {questionData && (
                <TsgInterviewForm
                    templates={questionData}
                    onSubmit={onSubmit}
                    flags={flags}
                    code={code}
                />
            )}

            {questionData === null && (
                <Alert
                    textBlock={{
                        body: {
                            children:
                                t('support:tsgInterview.loadingErrorMessage'),
                            style: 'b2',
                        },
                    }}
                    dismissible={false}
                    borderRadius="rounded"
                    status="error"
                />
            )}
        </LoadingWrapper>
    );
}
