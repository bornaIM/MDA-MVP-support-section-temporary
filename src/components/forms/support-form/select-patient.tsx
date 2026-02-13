import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {
    Box,
    Heading,
} from '@dexcomit/web-ui-lib';
import { useProfile } from '@dexcomit/web-vendor-framework/customer';
import { Profile } from '@dexcomit/web-vendor-framework/dist/esm/customer/types/customer';
import { RadioItemGroup } from '@/components/common/radio-item-group';

interface SelectPatientProps {
    selectedPatient?: Profile
    setSelectedPatient(profile: Profile): void;
}

export function SelectPatient({ selectedPatient, setSelectedPatient }: SelectPatientProps) {
    const { t } = useTranslation();
    const [profileList, setProfileList] = useState<Profile[] | undefined>(undefined);

    const { data: profile } = useProfile();

    const serializeProfiles = (profiles: (Profile | null | undefined)[]) => profiles.filter(Boolean).map(p => p!.id).sort().join(','); // Safe filtering

    useEffect(() => {
        const newProfileList = [profile, ...(profile?.dependentsList || [])].filter(Boolean) as Profile[];

        if (serializeProfiles(newProfileList) !== (profileList ? serializeProfiles(profileList) : ''))
            setProfileList(newProfileList);
    }, [serializeProfiles([profile, ...(profile?.dependentsList || [])])]);

    const selectPatient = (profileId: string): void => {
        const selectedProfile = profileList?.find(profile => profile.id === profileId);
        selectedProfile && setSelectedPatient(selectedProfile);
    }

    const getProfileText = (profile: Profile): string => {
        return profile.accountType === 'caregiver' ? t('support:selectPatient.myself') : profile.firstName;
    }

    return (
        <Box>
            <Heading size='lg' mb='5'>
                {t('support:selectPatient.header')}
            </Heading>
            {profileList && <RadioItemGroup
                selectedValue={selectedPatient?.id || ''}
                list={profileList}
                values={profileList.map(profile => profile.id)}
                texts={profileList.map(profile => getProfileText(profile))}
                onChange={(value) => selectPatient(value)}
            />}
        </Box>
    );
}