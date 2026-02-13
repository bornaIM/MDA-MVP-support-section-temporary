import {
    HStack,
    IconArrow,
    IconButton,
    Text,
    useTheme,
} from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import React, { Dispatch, SetStateAction } from 'react';

type OrderHistoryPaginationProps = {
    currentPage: number;
    totalPages: number;
    onClick: Dispatch<SetStateAction<number>>;
    Link: any;
};

export const Pagination = ({
    currentPage,
    totalPages,
    onClick,
    Link
}: OrderHistoryPaginationProps) => {
    const { t } = useTranslation();
    const { direction = 'ltr' } = useTheme();
    const isRtl = direction === 'rtl';

    const previousPage = currentPage - 1;
    const isPreviousPage = currentPage > 1;
    const showStartEllipsisLink = previousPage > 2;
    const nextPage = currentPage + 1;
    const isNextPage = currentPage < totalPages;
    const showEndEllipsisLink = currentPage < totalPages - 2;

    const paginationItemStyle = {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '2.25rem',
        textStyle: 'n2',
        width: '2.25rem',
    };

    const updatePageNumber = (page: number) => {
        if (page > 0 && page <= totalPages) onClick(page);
    };

    // only show pagination for more than a single page
    if (totalPages < 2) return <></>;

    return (
        <HStack ms={{ base: '-.625rem', md: '-1rem' }} spacing=".5rem">
            {isPreviousPage ? (
                <IconButton
                    aria-label={t('common:pagination.previous')}
                    icon={<IconArrow variant={isRtl ? 'right' : 'left'} />}
                    title={t('common:pagination.previous')}
                    onClick={() => updatePageNumber(previousPage)}
                />
            ) : (
                <IconButton
                    aria-label={t('common:pagination.on-first')}
                    isDisabled
                    icon={<IconArrow variant={isRtl ? 'right' : 'left'} />}
                />
            )}
            {showStartEllipsisLink && (
                <>
                    <Link
                        {...paginationItemStyle}
                        title={t('common:pagination.go-first')}
                        onClick={() => updatePageNumber(1)}
                    >
                        1
                    </Link>
                    <Text {...paginationItemStyle} as="span">
                        ...
                    </Text>
                </>
            )}
            {isPreviousPage && (
                <Link
                    {...paginationItemStyle}
                    title={t('common:pagination.previous')}
                    onClick={() => updatePageNumber(previousPage)}
                    textAlign="center"
                >
                    {previousPage.toFixed()}
                </Link>
            )}
            <Text {...paginationItemStyle} as="span" color="brand.secondary">
                {currentPage}
            </Text>
            {isNextPage && (
                <Link
                    {...paginationItemStyle}
                    onClick={() => updatePageNumber(nextPage)}
                    title={t('common:pagination.next')}
                    textAlign="center"
                >
                    {nextPage.toFixed()}
                </Link>
            )}
            {showEndEllipsisLink && (
                <>
                    <Text {...paginationItemStyle} as="span">
                        ...
                    </Text>
                    <Link
                        {...paginationItemStyle}
                        onClick={() => updatePageNumber(totalPages)}
                        title={t('common:pagination.go-last')}
                        textAlign="center"
                    >
                        {totalPages.toFixed()}
                    </Link>
                </>
            )}
            {isNextPage ? (
                <IconButton
                    aria-label={t('common:pagination.next')}
                    onClick={() => updatePageNumber(nextPage)}
                    icon={<IconArrow variant={isRtl ? 'left' : 'right'} />}
                    title={t('common:pagination.next')}
                />
            ) : (
                <IconButton
                    aria-label={t('common:pagination.on-last')}
                    isDisabled
                    icon={<IconArrow variant={isRtl ? 'left' : 'right'} />}
                />
            )}
        </HStack>
    );
};
