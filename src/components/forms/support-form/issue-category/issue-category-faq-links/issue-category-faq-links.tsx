import { useMemo } from 'react';
// import { useSlot } from '@cms';
import { Flex, Link } from '@dexcomit/web-ui-lib';
import type { IssueCategoriesFaqLinks, IssueCategoryFaqLink } from '../types';
import { findFaqLinksByIssueCategoryCode } from '../helpers';
import { PropsOf } from '@chakra-ui/system';

interface IssueCategoryFaqLinksProps extends PropsOf<typeof Flex>{
    /* FAQ links for this issue category will be shown */
    issueCategoryCode: string;
    productGeneration: string;
}

export function IssueCategoryFaqLinks({
    issueCategoryCode,
    productGeneration,
    ...props
}: IssueCategoryFaqLinksProps) {
    // const slot = useSlot({ id: 'issue-categories-faq-links' });
    // const data = slot.data?.body as IssueCategoriesFaqLinks | undefined;

    // const links: IssueCategoryFaqLink[] | undefined = useMemo(() => {
    //     if (!data?.issueCategories || !issueCategoryCode || !productGeneration) return;
    //     return findFaqLinksByIssueCategoryCode(
    //         data.issueCategories,
    //         issueCategoryCode,
    //         productGeneration
    //     );
    // }, [data, issueCategoryCode, productGeneration]);

    const links: Array<{href: string, title: string}> = [];

    if (!links || !links.length) return null;

    return (
        <Flex gap="1rem" flexWrap="wrap" {...props}>
            {links.map((link) => (
                <Link key={link.href} href={link.href} variant="greenText" isExternal>{link.title}</Link>
            ))}
        </Flex>
    );
}
