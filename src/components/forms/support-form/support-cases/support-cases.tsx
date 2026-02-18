import {
    Flex,
    ResponsiveTable,
    Alert,
    Text,
    Box,
    useTheme,
} from '@dexcomit/web-ui-lib';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { SupportCasesTableProps } from './types';
import { getTableRows, getHeaders, getNoDataMessage } from './helpers';
import { TableCellProps } from '@chakra-ui/react';
import Trans from 'next-translate/Trans';
import { OrderHistoryPaginationProps } from '@/components/support-cases-table';

interface SupportCasesTableExtendedProps extends SupportCasesTableProps {
    Pagination: ({ currentPage, totalPages, onClick }: OrderHistoryPaginationProps) => JSX.Element;
    OpenChatbotTrigger: React.ComponentType<any>;
}

const PAGE_SIZE = 5;

export const SupportCasesTable = ({
    casesResponse,
    Pagination,
    OpenChatbotTrigger
}: SupportCasesTableExtendedProps) => {
    const { t } = useTranslation();
    const { space } = useTheme();
    const tableHeaders: Record<string, string> = t(
        'support:supportCasesTable.headers',
        {},
        { returnObjects: true }
    );

    const fetchCasesErrorMessage = t(
        'support:supportCasesTable.fetchCasesErrorMessage'
    );

    const tableTitle = t('support:supportCasesTable.title');

    const [rows, setRows] = useState<TableCellProps[][]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let retValue: TableCellProps[][] = [];
        if (casesResponse?.Patient) {
            retValue = getTableRows(casesResponse, t);
        }

        // if there are no cases render apropiate message
        if (retValue.length === 0) {
            retValue = getNoDataMessage(t, Object.keys(tableHeaders).length);
        }

        setRows(retValue);
    }, [casesResponse]);

    return (
        <>
            {!casesResponse && (
                <Alert
                    status="error"
                    dismissible={false}
                    textBlock={{
                        children: <Text>{fetchCasesErrorMessage}</Text>,
                    }}
                />
            )}
            {casesResponse && (
                <>
                    <ResponsiveTable
                        columns={getHeaders(tableHeaders)}
                        rows={rows.slice(
                            (page - 1) * PAGE_SIZE,
                            page * PAGE_SIZE
                        )}
                        style={{ tableLayout: 'fixed' }}
                    />
                    {/* 
                        sx prop is used here to remove padding which is default 
                        to full-width Flexible Text Banner Amplience component
                    */}
                    <Box textStyle={'b1'} pt={"1rem"}>
                        <Text >{t('support:supportCasesTable.footer.line1')}</Text>
                        <Text mb={9}>{<Trans i18nKey={"support:supportCasesTable.footer.line2"} components={[<OpenChatbotTrigger as="button" type="button" textDecoration="underline" />]}/>}</Text>
                        <Text>{t('support:supportCasesTable.footer.line3')}</Text>
                    </Box>
                    <Flex justifyContent="flex-end">
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(rows.length / PAGE_SIZE)}
                            onClick={setPage}
                        />
                    </Flex>
                </>
            )}
        </>
    );
};