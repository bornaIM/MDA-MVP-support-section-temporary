import { useSupportForm } from '@lib/forms/support-form/support-form-provider';
import { IssueCategoryFaqLinks } from '@components/forms/support-form/issue-category/issue-category-faq-links/issue-category-faq-links';

interface SpecifyProductFaqLinksProps {
    productGeneration?: string;
}

export function SpecifyProductFaqLinks({ productGeneration }: SpecifyProductFaqLinksProps) {
    const { uiState } = useSupportForm();

    const issueCategory = uiState?.collectedData.issueCategory;

    if (!productGeneration || !issueCategory) return null;

    return <IssueCategoryFaqLinks issueCategoryCode={issueCategory} productGeneration={productGeneration} my={4} />
}