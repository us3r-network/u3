import { isMobile } from 'react-device-detect';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Loading from '@/components/common/loading/Loading';
import { MainWrapper } from '@/components/layout/Index';
import PageTitle from '@/components/layout/PageTitle';
import MobilePageHeader from '@/components/layout/mobile/MobilePageHeader';
import Credential, { CredentialMobile } from '@/components/profile/gallery';
import { ProfileDefault, fetchU3Assets } from '@/services/profile/api/profile';
import { ProfileEntity } from '@/services/profile/types/profile';
import { mergeProfilesData } from '@/utils/profile/mergeProfilesData';
import { ProfileOutletContext } from './ProfileLayout';

export default function Gallery() {
  const { address: wallets } = useOutletContext<ProfileOutletContext>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchData = useCallback(async (wallets: string[]) => {
    if (!wallets) return;
    try {
      const { data } = await fetchU3Assets(wallets, ['poap', 'noox', 'galxe']);
      const r = mergeProfilesData(data.data);
      setProfileData(r);
    } catch (error) {
      setProfileData(ProfileDefault);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (wallets) {
      fetchData(wallets);
    }
  }, [fetchData, wallets]);

  return (
    <Wrapper>
      {isMobile ? (
        <MobilePageHeader
          tabs={['Asset', 'Gallery']}
          curTab="Gallery"
          setTab={(tab) => navigate(`/${tab}`)}
        />
      ) : (
        <PageTitle>Gallery</PageTitle>
      )}
      <ContentWrapper id="profile-wrapper">
        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) ||
          (isMobile ? (
            <CredentialMobile
              {...{
                poap: profileData.poap,
                noox: profileData.noox,
                galxe: profileData.galxe,
              }}
            />
          ) : (
            <Credential
              {...{
                poap: profileData.poap,
                noox: profileData.noox,
                galxe: profileData.galxe,
              }}
            />
          ))}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
