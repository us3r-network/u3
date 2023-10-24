import styled from 'styled-components';
import { ChevronRightDouble } from 'src/components/icons/chevon-right-double';
import FidRegister from 'src/components/social/farcaster/signup/FidRegister';
import SignerAdd from 'src/components/social/farcaster/signup/SignerAdd';
import RentStorage from 'src/components/social/farcaster/signup/RentStorage';
import FnameRegister from 'src/components/social/farcaster/signup/FnameRegister';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from 'src/constants/farcaster';
import { useCallback } from 'react';
import { UserDataType, makeUserDataAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';

export default function FarcasterSignup() {
  const {
    fid,
    fname,
    signer,
    hasStorage,
    setHasStorage,
    setSigner,
    setFid,
    setFname,
  } = useOutletContext<any>();
  const navigate = useNavigate();

  const makePrimaryName = useCallback(
    async (name: string) => {
      if (!name || !signer || !fid || !hasStorage) return;
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeUserDataAdd(
            {
              type: UserDataType.USERNAME,
              value: name,
            },
            { fid, network: FARCASTER_NETWORK },
            signer
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('successfully primary name to farcaster');
      } catch (error: unknown) {
        console.error(error);
        toast.error('failed to primary name');
      }
    },
    [fid, signer, hasStorage]
  );

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
        <FnameRegister
          fid={fid}
          fname={fname}
          hasStorage={hasStorage}
          signer={signer}
          setFname={setFname}
          makePrimaryName={makePrimaryName}
        />
      </div>
      <div className="set-profile">
        {fid && fname && signer && hasStorage && (
          <button
            type="button"
            onClick={() => {
              navigate('/farcaster/profile');
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
