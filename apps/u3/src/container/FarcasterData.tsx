import { UserDataType } from '@farcaster/hub-web';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getFarcasterUserInfo } from 'src/api/farcaster';
import Checked from 'src/components/icons/checked';
import { ChevronRightDouble } from 'src/components/icons/chevon-right-double';
import { Edit, Edit3 } from 'src/components/icons/edit';
import Unchecked from 'src/components/icons/unchecked';
import styled from 'styled-components';

export default function FarcasterData() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const { fid, fname, signer, hasStorage } = useOutletContext<any>();

  useEffect(() => {
    getFarcasterUserInfo([fid])
      .then((res) => {
        if (res.data.code !== 0) throw new Error(res.data.msg);
        res.data.data.forEach((item) => {
          if (item.type === UserDataType.DISPLAY) setDisplayName(item.value);
          if (item.type === UserDataType.BIO) setBio(item.value);
          if (item.type === UserDataType.PFP) setAvatar(item.value);
          //   if (item.type === UserDataType.URL) setWebsite(item.value);
        });
      })
      .catch(console.error);
  }, [fid]);

  return (
    <Container>
      <div>
        <Info>
          <span
            onClick={() => {
              navigate('/farcaster/profile');
            }}
          >
            <Edit3 />
          </span>
          <div>
            <img src={avatar} alt="" />
            <div>
              <h2>{displayName}</h2>
              <p>{`@${fname}`}</p>
            </div>
          </div>
          <div>
            <p>{bio}</p>
          </div>
        </Info>
        <FarcasterInfo>
          <div>
            {(fid && <Checked />) || <Unchecked />}
            Your FID is: 189160
          </div>
          <div>
            {(fid && fname && <Checked />) || <Unchecked />}
            Your Fname is: {fname}
          </div>
          <div>
            {(fid && signer && <Checked />) || <Unchecked />}
            Signer added
          </div>
          <div>
            {(fid && hasStorage && <Checked />) || <Unchecked />}
            Renting successful
          </div>
        </FarcasterInfo>
        <StartBtn
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Start Casting in U3
          <ChevronRightDouble />
        </StartBtn>
      </div>
    </Container>
  );
}

const StartBtn = styled.button`
  color: var(--ffffff, #fff);
  text-align: center;
  display: flex;
  width: 525px;
  height: 60px;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;

  /* Text/Medium 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(52deg, #cd62ff 35.31%, #62aaff 89.64%);
`;

const Info = styled.div`
  position: relative;
  > span {
    position: absolute;
    top: 25px;
    right: 25px;
    cursor: pointer;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    > img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    h2 {
      margin: 0;
      padding: 0;
      color: #fff;

      /* Bold Italic-24 */
      font-family: Rubik;
      font-size: 24px;
      font-style: italic;
      font-weight: 700;
      line-height: normal;
    }
  }
  p {
    color: #718096;

    /* Regular-16 */
    font-family: Rubik;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const FarcasterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > div {
    display: flex;
    gap: 20px;
    align-items: center;

    color: var(--neutral-900-text, #fff);
    font-family: Rubik;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 120% */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;

  > div {
    display: flex;
    width: 525px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;

    > div {
      width: 100%;
      padding: 40px;
      border-radius: 20px;
      box-sizing: border-box;
      background: #1b1e23;
    }
  }
  hr {
    width: 100%;
    background-color: inherit;
    border: none;
    border-top: 1px solid rgba(57, 66, 76, 0.5);
    margin-bottom: 20px;
  }
`;
