import {
    ProgressBar,
    Box,
    Flex,
    Text,
    Heading,
    useIsMobile
} from "@dexcomit/web-ui-lib"
import useTranslation from "next-translate/useTranslation"

interface SupportFormProgressProps {
    heading?: string
    progress: number
}

export function SupportFormProgress({ heading, progress }: SupportFormProgressProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        <Box>
            {heading && (<Heading
                as='h1'
            >
                {heading}
            </Heading>)}
            <Flex gap={2} position="relative" >
                <Text mt={0.5} textDecoration='underline' {...(isMobile ? {display: 'none'} : {})}>{t('support:progressBarText')}</Text>
                <ProgressBar showValue value={progress} w='100%'></ProgressBar>
            </Flex>
        </Box>
    )
}