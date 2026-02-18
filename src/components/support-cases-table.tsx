import { useTheme, Box, Heading, LoadingWrapper, ChakraComponent } from "@dexcomit/web-ui-lib";
import { useProfile } from "@dexcomit/web-vendor-framework/customer";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SupportCasesResponse, SupportCasesTable } from "./forms/support-form/support-cases";

export type OrderHistoryPaginationProps = {
    currentPage: number;
    totalPages: number;
    onClick: Dispatch<SetStateAction<number>>;
};

export const RenderSupportCasesTable = ({
    currentLocale,
    SHOW_CASE_TABLE_LOCALES,
    Pagination,
    OpenChatbotTrigger,
    fetchPath
}: {
    currentLocale: string;
    SHOW_CASE_TABLE_LOCALES: string[];
    Pagination: ({ currentPage, totalPages, onClick, }: OrderHistoryPaginationProps) => JSX.Element;
    OpenChatbotTrigger: ChakraComponent<"div", {}>;
    fetchPath: string;
}) => {
    const [supportCases, setSupportCases] =
        useState<SupportCasesResponse | null>();
    const { data: profile } = useProfile();
    const { space, sizes } = useTheme();

    useEffect(() => {
        // fetch user support cases, if locale allows it
        const fetchUserCases = async () => {
            if (profile?.gcaid && profile?.accountType !== 'dependent') {
                try {
                    const response = await fetch(fetchPath);
                    if (response.ok) {
                        const casesResponse: SupportCasesResponse | null =
                            await response.json();
                        setSupportCases(casesResponse);
                        return;
                    }
                } catch (e: any) {
                    console.error('SUPPORT CASES FETCH ERROR', e.message);
                }
                setSupportCases(null);
            }
        };

        fetchUserCases();
    }, [profile]);
    const { t } = useTranslation();
    const tableTitle = t('support:supportCasesTable.title');

    return (
        <>
            {SHOW_CASE_TABLE_LOCALES.includes(currentLocale) && (
                // most components on this page are created with Amplience slots that use grid
                // for rendering, Box in Box with props keep the UI consistent
                <Box mx="auto" maxWidth={sizes.gridContainer.maxWidth}>
                    <Box id="support-cases-table" pt="5" mx={space.grid.mx}>
                        <Heading size="xl" mb="2rem">
                            {tableTitle}
                        </Heading>
                        <LoadingWrapper isLoading={supportCases === undefined}>
                            {supportCases !== undefined && (
                                <SupportCasesTable
                                    casesResponse={supportCases}
                                    Pagination={Pagination}
                                    OpenChatbotTrigger={OpenChatbotTrigger}
                                />
                            )}
                        </LoadingWrapper>
                    </Box>
                </Box>
            )}
        </>
    );
};