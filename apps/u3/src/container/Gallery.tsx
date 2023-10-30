import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import Credential, { CredentialMobile } from '../components/profile/Credential';
import { fetchU3Assets, ProfileDefault } from '../services/profile/api/profile';
import { ProfileEntity } from '../services/profile/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/profile/mergeProfilesData';
import { MainWrapper } from '../components/layout/Index';
import PageTitle from '../components/layout/PageTitle';
import MobilePageHeader from '../components/layout/mobile/MobilePageHeader';

export default function Gallery() {
  const { profile } = useProfileState()!;
  const { wallet } = useParams();
  const session = useSession();
  const sessId = session?.id;
  const navigate = useNavigate();

  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);

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
    if (wallet) {
      fetchData([wallet]);
      return;
    }
    const profileWallets = profile?.wallets?.map(
      ({ address: walletAddress }) => walletAddress
    );
    const wallets = [...new Set([sessWallet, ...(profileWallets || [])])];
    fetchData(wallets);
  }, [fetchData, sessWallet, wallet, profile]);

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
