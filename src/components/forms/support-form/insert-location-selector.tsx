import useTranslation from 'next-translate/useTranslation';
import { Box, Grid, Heading } from '@dexcomit/web-ui-lib';
import { FormControlSelect } from '@dexcomit/web-ui-lib';
import React, { useState } from 'react';

export interface InsertLocationSelectorProps {
    onLocationSelect: (value: string) => void;
    currentInsertionSite?: string | undefined;
}

export function InsertLocationSelector({
    currentInsertionSite,
    onLocationSelect,
}: InsertLocationSelectorProps) {
    const { t } = useTranslation();
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const translationObject = t(
        'support:insertionLocations.options',
        {},
        { returnObjects: true }
    );

    const options = Object.entries(translationObject).map(([key, value]) => {
        return { value: key, label: value };
    });
    const [insertionLocation, setInsertionLocation] = useState<
        string | undefined
    >(currentInsertionSite);

    return (
        <Box>
            <Heading size="lg" mb={5}>
                {t('support:insertionLocations.header')}
            </Heading>
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    lg: 'repeat(4, 1fr)',
                }}
                gap={4}
            >
                <FormControlSelect
                    name="support:insertionLocations.header"
                    options={options}
                    showPlaceholder={true}
                    // @ts-expect-error - The interface FormControlSelectProps is missing the placeholder property
                    placeholder={t('support:insertionLocations.header')}
                    selectorVariant="boldCenterTextNoLabel"
                    value={insertionLocation}
                    isInvalid={isTouched && !insertionLocation}
                    onBlur={() => setIsTouched(true)}
                    errorMessage={t('support:insertionLocations.error')}
                    sx={{
                        select: {
                            fontSize: 18,
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                        },
                    }}
                    onChange={(e) => {
                        setInsertionLocation(e.target.value);
                        onLocationSelect(e.target.value);
                    }}
                />
            </Grid>
        </Box>
    );
}
