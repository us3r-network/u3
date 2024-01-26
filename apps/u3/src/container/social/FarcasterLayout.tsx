import { Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { NobleEd25519Signer } from '@farcaster/hub-web';
import { IdRegistryABI } from 'src/services/social/abi/farcaster/IdRegistryABI';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import axios from 'axios';

import styled from 'styled-components';
import { ButtonPrimary } from 'src/components/common/button/ButtonBase';
import WalletSvg from 'src/components/common/assets/svgs/wallet.svg';
import useLogin from 'src/hooks/shared/useLogin';
import { IdRegistryContract, OP_CHAIN_ID } from 'src/constants/farcaster';

export default function FarcasterLayout() {
  const { address, isConnected } = useAccount();
  const { login } = useLogin();

  const [fid, setFid] = useState<number>(0);
  const [fname, setFname] = useState<string>('');
  const [signer, setSigner] = useState<NobleEd25519Signer | null>(null);
  const [hasStorage, setHasStorage] = useState<boolean>(false);

  const { chain } = useNetwork();

  const { data: idOf } = useContractRead({
    address: IdRegistryContract,
    abi: IdRegistryABI,
    functionName: 'idOf',
    args: [address],
    enabled: Boolean(address),
    chainId: OP_CHAIN_ID,
  });

  const signerCheck = useCallback(() => {
    if (!fid) return;
    console.log('checking signer');
    const privateKey = localStorage.getItem(`signerPrivateKey-${fid}`);
    if (privateKey !== null) {
      const ed25519Signer = new NobleEd25519Signer(
        Buffer.from(privateKey, 'hex')
      );
      setSigner(ed25519Signer);
    }
  }, [fid]);

  const fnameCheck = useCallback(async () => {
    if (!fid) return;
    try {
      const resp = await axios.get(
        `https://fnames.farcaster.xyz/transfers?fid=${fid}`
      );
      if (resp.data.transfers.length > 0) {
        setFname(resp.data.transfers[0].username);
      }
    } catch (error) {
      console.log(error);
    }
  }, [fid]);

  const storageCheck = useCallback(async () => {
    if (!fid) return;
    try {
      const resp = await axios.get(
        `https://api.farcaster.u3.xyz/v1/storageLimitsByFid?fid=${fid}`
      );
      // console.log(resp.data);
      if (resp.data.limits?.length > 0) {
        setHasStorage(Boolean(resp.data.limits?.[0].limit)); // mainnet
      }
    } catch (error) {
      console.log(error);
    }
  }, [fid]);

  useEffect(() => {
    signerCheck();
  }, [signerCheck]);

  useEffect(() => {
    fnameCheck();
  }, [fnameCheck]);

  useEffect(() => {
    storageCheck();
  }, [storageCheck]);

  useEffect(() => {
    if (idOf) {
      setFid(Number(idOf));
    } else if (chain?.id !== 1) {
      setFid(0);
    }
  }, [chain?.id, idOf]);

  if (!isConnected) {
    return (
      <NoLoginWrapper>
        <NoLoginContainer>
          <Icon src={WalletSvg} />
          <MainText>No Wallet Connected</MainText>
          <SecondaryText>Get Started by connecting your wallet</SecondaryText>
          <LoginButton onClick={() => login()}>Connect Wallet</LoginButton>
        </NoLoginContainer>
      </NoLoginWrapper>
    );
  }

  return (
    <div>
      <Outlet
        context={{
          fid,
          fname,
          signer,
          hasStorage,
          setHasStorage,
          setSigner,
          setFid,
          setFname,
        }}
      />
    </div>
  );
}

export const NoLoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
`;

const NoLoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #1b1e23;
  border-radius: 20px;
`;

const Icon = styled.img`
  width: 100px;
  height: 100px;
`;
const MainText = styled.span`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
`;
const SecondaryText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #718096;
`;
const LoginButton = styled(ButtonPrimary)`
  width: 228px;
`;
