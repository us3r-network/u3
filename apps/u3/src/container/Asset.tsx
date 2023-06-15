import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import OnChainInterest, {
  OnChainInterestMobile,
} from '../components/profile/OnChainInterest';
import { fetchU3Assets, ProfileDefault } from '../services/api/profile';
import { ProfileEntity } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/mergeProfilesData';
import { MainWrapper } from '../components/layout/Index';
import PageTitle from '../components/common/PageTitle';
import MobilePageHeader from '../components/common/mobile/MobilePageHeader';

export default function Asset() {
  const { profile } = useProfileState()!;
  const { wallet } = useParams();
  const session = useSession();
  const sessId = session?.id || '';
  const navigate = useNavigate();

  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchData = useCallback(async (wallets: string[]) => {
    if (!wallets) return;
    try {
      const { data } = await fetchU3Assets(wallets, [
        'nfts',
        'erc20Balances',
        'ethBalance',
      ]);
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
    const wallets = [...new Set([sessWallet, ...profileWallets])];
    fetchData(wallets);
  }, [fetchData, sessWallet, wallet, profile]);

  return (
    <Wrapper>
      {isMobile ? (
        <MobilePageHeader
          tabs={['Asset', 'Gallery']}
          curTab="Asset"
          setTab={(tab) => navigate(`/${tab}`)}
        />
      ) : (
        <PageTitle>Asset</PageTitle>
      )}
      <ContentWrapper>
        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) ||
          (isMobile ? (
            <OnChainInterestMobile
              data={profileData.nfts}
              wallet={profileData.erc20Balances}
              ethBalance={profileData.ethBalance}
            />
          ) : (
            <OnChainInterest
              data={profileData.nfts}
              wallet={profileData.erc20Balances}
              ethBalance={profileData.ethBalance}
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
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;
