import { useState, useEffect, useCallback } from 'react';
import { NobleEd25519Signer } from '@farcaster/hub-web';
import { IdRegistryABI } from 'src/abi/farcaster/IdRegistryABI';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import axios from 'axios';

import styled from 'styled-components';
import { ButtonPrimary } from 'src/components/common/button/ButtonBase';
import WalletSvg from 'src/components/common/icons/svgs/wallet.svg';
import useLogin from 'src/hooks/useLogin';
import { ChevronRightDouble } from 'src/components/icons/chevon-right-double';
import FidRegister from 'src/components/social/farcaster/signup/FidRegister';
import SignerAdd from 'src/components/social/farcaster/signup/SignerAdd';
import RentStorage from 'src/components/social/farcaster/signup/RentStorage';
import FnameRegister from 'src/components/social/farcaster/signup/FnamRegister';
import BaseInfo from 'src/components/social/farcaster/signup/BaseInfo';

export default function FarcasterSignup() {
  const { address, isConnected } = useAccount();
  const { login } = useLogin();

  const [fid, setFid] = useState<number>(0);
  const [fname, setFname] = useState<string>('');
  const [signer, setSigner] = useState<NobleEd25519Signer | null>(null);
  const [hasStorage, setHasStorage] = useState<boolean>(false);

  const [writeProfile, setWriteProfile] = useState<boolean>(false);

  const { chain } = useNetwork();

  const { data: idOf } = useContractRead({
    address: '0x00000000FcAf86937e41bA038B4fA40BAA4B780A',
    abi: IdRegistryABI,
    functionName: 'idOf',
    args: [address],
    enabled: Boolean(address),
    chainId: 10,
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
    console.log(`Your FID is: ${idOf as string}`);
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

  if (writeProfile) {
    return (
      <BaseInfo
        fid={fid}
        signer={signer}
        hasStorage={hasStorage}
        fname={fname}
      />
    );
  }

  return (
    <SignupContainer>
      <h3>Sign up for Farcaster</h3>
      <div className="steps">
        <FidRegister fid={fid} setFid={setFid} />
        <SignerAdd fid={fid} signer={signer} setSigner={setSigner} />
        <RentStorage
          fid={fid}
          hasStorage={hasStorage}
          setHasStorage={setHasStorage}
        />
        <FnameRegister fid={fid} fname={fname} setFname={setFname} />
      </div>
      <div className="set-profile">
        {fid && fname && signer && hasStorage && (
          <button
            type="button"
            onClick={() => {
              setWriteProfile(true);
            }}
          >
            Setup your profile
            <ChevronRightDouble />
          </button>
        )}
      </div>
    </SignupContainer>
  );
}

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  h3 {
    color: #fff;
    font-family: Rubik;
    font-size: 40px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;
    margin: 0;
  }

  div.steps {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 20px;
    width: 100%;
    margin: 50px auto 80px auto;
    flex-wrap: wrap;

    > div {
      width: 320px;
      height: 350px;
      border-radius: 20px;
      border: 1px solid #39424c;
      background: #1b1e23;
      flex-shrink: 0;
      padding: 20px;
      box-sizing: border-box;
    }
  }

  div.set-profile {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    > button {
      border-radius: 10px;
      background: linear-gradient(52deg, #cd62ff 35.31%, #62aaff 89.64%);
      display: flex;
      width: 226px;
      height: 60px;
      padding: 12px 24px;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border: none;
      outline: none;

      color: var(--ffffff, #fff);
      text-align: center;

      /* Text/Medium 16pt · 1rem */
      font-family: Rubik;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
      cursor: pointer;
    }
  }
`;

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
