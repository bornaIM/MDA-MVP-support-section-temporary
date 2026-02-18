import React from 'react';
import {
    SupportCase,
    ExtendedSupportCase,
    SupportCasesResponse,
} from './types';
import { Text, Badge, Link } from '@dexcomit/web-ui-lib';
import { getDisplayDate } from '@dexcomit/web-util-lib';

import { TableCellProps } from '@chakra-ui/react';
import { Translate } from 'next-translate';
import { format } from 'date-fns';


export const getHeaders = (headers: Record<string, string>) => {
    return [
        {
            children: <Text>{headers.device}</Text>,
            width: { base: 'auto', md: '5%' },
        },
        {
            children: <Text>{headers.dateSubmitted}</Text>,
            width: { base: 'auto', md: '15%' },
        },
        {
            children: <Text>{headers.patientName}</Text>,
            width: { base: 'auto', md: '15%' },
        },
        {
            children: <Text>{headers.details}</Text>,
            width: { base: 'auto', md: '40%' },
        },
        {
            children: <Text>{headers.status}</Text>,
            width: { base: 'auto', md: '15%' },
        },
        {
            children: <Text>{headers.action}</Text>,
            width: { base: 'auto', md: '10%' },
        },
    ];
};

const getTimezonedDate = (date: string, dateFormat: string) => {
    const localizedDate = new Date(date)
    return format(localizedDate, dateFormat)
}

export const mapCaseToRow = (
    item: ExtendedSupportCase,
    translations: Translate
): TableCellProps[] => {
    const hasOrders = item.orders && item.orders?.length;
    return [
        {
            children: (
                <Text textStyle="b2">
                    {item.systemGeneration?.replace('Dexcom ', '') || ''}
                </Text>
            ),
        },
        {
            children: (
                <Text>
                    {getTimezonedDate(
                        item.submitedDate,
                        translations('common:dates.simpleFormat')
                    )}
                </Text>
            ),
        },
        {
            children: (
                <>
                    <Text as="span" textStyle="b2" mr="1">
                        {item.accountName}
                    </Text>
                    {item.isDependant && (
                        <Badge>
                            {translations(
                                'support:supportCasesTable.dependantBadge'
                            )}
                        </Badge>
                    )}
                </>
            ),
        },
        {
            children: (
                <>
                    <Text textStyle="b2">{item.codeLabel}</Text>
                    <Text textStyle="b2">
                        {`${translations(
                            'support:supportCasesTable.ticketLabel'
                        )}${item.caseNumber}`}
                    </Text>
                    <Text textStyle="b2">
                        {`${translations(
                            'support:supportCasesTable.serialLabel'
                        )}${item.transmitterSN}`}
                    </Text>
                </>
            ),
        },
        {
            children: <Text textStyle="b2">{item.status}</Text>,
        },
        {
            children: hasOrders ? (
                <Link
                    variant="greenText"
                    textStyle="b2"
                    href={`/order-history/order?id=${item.orders[0].orderNumber}`}
                >
                    {translations('support:supportCasesTable.case-action')}
                </Link>
            ) : null,
        },
    ];
};

const getLocalizedItemStatus = (item: SupportCase, translations: Translate) => {
    const formattedStatus = item.status.toLowerCase()
    if (formattedStatus.includes("no replacement")) {
        return translations(
            'support:supportCasesTable.statuses.noReplacement'
        );
    }

    if (formattedStatus.includes("replacement approved")) {
        return translations(
            'support:supportCasesTable.statuses.replacementApproved'
        );
    }

    if (formattedStatus.includes("in progress")) {
        return translations(
            'support:supportCasesTable.statuses.inProgress'
        );
    }

    return item.status;
}

export const getTableRows = (
    casesResponse: SupportCasesResponse,
    translations: Translate,
): TableCellProps[][] => {
    const casesArray: ExtendedSupportCase[] = [];

    // 1.) add all Patient cases to unified array
    if (casesResponse.Patient) {
        casesResponse.Patient.cases.forEach((caregiverCase) => {
            casesArray.push({
                ...caregiverCase,
                accountName: casesResponse.Patient?.accountName ?? '',
            });
        });
    }

    // 2.) add cases of all dependents to unified array
    if (casesResponse.Dependents) {
        casesResponse.Dependents.forEach((dependant) => {
            dependant.cases.forEach((dependentCase) => {
                casesArray.push({
                    ...dependentCase,
                    accountName: dependant.accountName,
                    isDependant: true,
                });
            });
        });
    }

    // 3.) sort unified array by date, newest at the top
    casesArray.sort(
        (item1: SupportCase, item2: SupportCase) =>
            new Date(item2.submitedDate).getTime() -
            new Date(item1.submitedDate).getTime()
    );

    casesArray.forEach((item) => {
        item.status = getLocalizedItemStatus(item, translations);
    });

    // 4.) map unified array form array of case objects to array of UI components
    const retValue: TableCellProps[][] = casesArray.map((item) =>
        mapCaseToRow(item, translations)
    );
    return retValue;
};

export const getNoDataMessage = (
    translations: Translate,
    headerNum: number
): TableCellProps[][] => {
    return [
        [
            {
                colSpan: headerNum,
                children: (
                    <Text textStyle="b2">
                        {`${translations(
                            'support:supportCasesTable.noDataMessage'
                        )}`}
                    </Text>
                ),
            },
        ],
    ];
};
