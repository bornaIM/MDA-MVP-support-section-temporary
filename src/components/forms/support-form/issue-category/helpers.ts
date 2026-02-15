import type {
    IssueCategoryFaqLink,
    IssueCategoryFaqLinks,
} from './types';

export function findFaqLinksByIssueCategoryCode(
    categories: IssueCategoryFaqLinks[],
    categoryCode: string,
    productGeneration: string
): IssueCategoryFaqLink[] | undefined {
    return (
        categories
            // Find category (there could be multiple instances of the same category so filter is used)
            .filter((category) => category.issueCategoryCode === categoryCode)
            // Get 1D array of all links
            .flatMap((category) => category.links)
            // Filter links by product generation
            .filter((link) => link.productGeneration === productGeneration)
            // Remove duplicates
            .filter(
                (link1, index1, arr) =>
                    !arr.some(
                        (link2, index2) =>
                            index2 < index1 &&
                            link2.href === link1.href &&
                            link2.title === link1.title
                    )
            )
    );
}
