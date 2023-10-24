/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NobleEd25519Signer,
  UserDataType,
  makeUserDataAdd,
} from '@farcaster/hub-web';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from 'src/constants/farcaster';
import styled from 'styled-components';
import { getFarcasterUserInfo } from 'src/api/farcaster';
import { uploadImage } from 'src/services/api/upload';
import { toast } from 'react-toastify';
import { Edit } from 'src/components/icons/edit';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import { StyledOps } from './Steps';

export default function BaseInfo({
  fid,
  signer,
  hasStorage,
  fname,
}: {
  fid: number;
  signer: NobleEd25519Signer;
  hasStorage: boolean;
  fname: string;
}) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [website, setWebsite] = useState('');
  // const { setCurrFid, setSigner } = useFarcasterCtx();
  const navigation = useNavigate();

  const dataAdd = useCallback(
    async (type: UserDataType, value: string) => {
      if (!signer) return;
      // eslint-disable-next-line no-underscore-dangle
      const data = (
        await makeUserDataAdd(
          {
            type,
            value,
          },
          { fid, network: FARCASTER_NETWORK },
          signer
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(data);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
    },
    [fid, signer]
  );

  const updateInfo = useCallback(async () => {
    if (!signer || !hasStorage) return;
    try {
      if (fname) await dataAdd(UserDataType.USERNAME, fname);
      if (displayName) await dataAdd(UserDataType.DISPLAY, displayName);
      if (bio) await dataAdd(UserDataType.BIO, bio);
      if (avatar) await dataAdd(UserDataType.PFP, avatar);
      if (website) await dataAdd(UserDataType.URL, website);

      toast.success('successfully set profile to farcaster');
      navigation('/farcaster');
    } catch (error: unknown) {
      console.error(error);
      toast.error('failed to set profile');
    }
  }, [signer, hasStorage, fname, dataAdd, displayName, bio, avatar, website]);

  useEffect(() => {
    getFarcasterUserInfo([fid])
      .then((res) => {
        if (res.data.code !== 0) throw new Error(res.data.msg);
        res.data.data.forEach((item) => {
          if (item.type === UserDataType.DISPLAY) setDisplayName(item.value);
          if (item.type === UserDataType.BIO) setBio(item.value);
          if (item.type === UserDataType.PFP) setAvatar(item.value);
          if (item.type === UserDataType.URL) setWebsite(item.value);
        });
      })
      .catch(console.error);
  }, [fid]);

  if (!signer || !hasStorage) return null;

  return (
    <Container>
      <div>
        <div>
          <Title>Setup your profile</Title>
          <hr />
        </div>
        <Info>
          <Avatar>
            <div
              className="avatar"
              onClick={() => {
                document.getElementById('avatar')?.click();
              }}
            >
              {avatar && <img src={avatar} alt="" />}
              <div className="overlay">
                <Edit />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              id="avatar"
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                const resp = await uploadImage(e.target.files[0]);
                setAvatar(resp.data.url);
              }}
            />
          </Avatar>
          <div className="item">
            <label htmlFor="display-name">Display name</label>
            <input
              type="text"
              id="display-name"
              placeholder="This is your display name on Farcaster"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
          </div>
          <div className="item">
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              id="bio"
              placeholder="Tell Farcaster a little bit about your self"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </div>
        </Info>
        <StyledOps>
          <span />
          <button
            type="button"
            onClick={() => {
              updateInfo();
            }}
          >
            Save
          </button>
        </StyledOps>
      </div>
    </Container>
  );
}

const Info = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 20px;

  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    /* justify-content: space-between; */
    > label {
      color: var(--neutral-900-text, #fff);
      font-family: Rubik;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 120% */
      margin-bottom: 10px;
    }
  }

  input {
    width: 100%;
    box-sizing: border-box;
    background: #1a1e23;
    outline: none;
    border: 1px solid #39424c;
    border-radius: 12px;
    height: 48px;
    padding: 0px 16px;
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  border: 1px solid gray;
  margin-bottom: 20px;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    border: 1px solid gray;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
    }
  }

  div.overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    text-align: center;
    display: none;

    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
  }

  &:hover {
    div.overlay {
      display: flex;
    }
  }
`;

const Title = styled.h3`
  margin: 0;
  padding: 0;
  color: var(--neutral-900-text, #fff);
  font-family: Rubik;
  font-size: 20px;
  font-style: italic;
  font-weight: 700;
  line-height: 24px; /* 120% */
  width: 100%;
  margin-bottom: 20px;
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
    padding: 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    border-radius: 20px;
    background: #1b1e23;
    box-sizing: border-box;

    > div {
      width: 100%;
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
