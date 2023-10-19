import { useCallback, useEffect, useState } from "react";
import { useFarcaster } from "../providers/FarcasterProvider";
import { UserDataType, makeUserDataAdd } from "@farcaster/hub-web";
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from "./client";
import { toast } from "sonner";
import styled from "styled-components";
import { getFarcasterUserInfo, uploadImage } from "../api";

export default function BaseInfo() {
  const { fid, signer, hasStorage, fname } = useFarcaster();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [website, setWebsite] = useState("");

  const dataAdd = useCallback(
    async (type: UserDataType, value: string) => {
      if (!signer) return;
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
      if (avatar) await dataAdd(UserDataType.PFP, avatar);

      toast.success("successfully set baseInfo to farcaster");
    } catch (error: unknown) {
      toast.error("failed to set baseInfo");
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
      <h3>BaseInfo</h3>
      <div>
        <div
          className="avatar"
          onClick={() => {
            document.getElementById("avatar")?.click();
          }}
        >
          <div className="overlay">avatar</div>
          {avatar && <img src={avatar} alt="" />}
        </div>
        <input
          type="file"
          accept="image/*"
          id="avatar"
          style={{ display: "none" }}
          onChange={async (e) => {
            if (!e.target.files?.[0]) return;
            const resp = await uploadImage(e.target.files[0]);
            setAvatar(resp.data.url);
          }}
        />
      </div>
      <div className="item">
        <label htmlFor="display-name">display name</label>
        <input
          type="text"
          id="display-name"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
        />
      </div>
      <div className="item">
        <label htmlFor="bio">bio</label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
          }}
        />
      </div>
      <div className="item">
        <label htmlFor="website">website</label>
        <input
          type="text"
          id="website"
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          updateInfo();
        }}
      >
        Update Info
      </button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: space-between; */
  gap: 20px;
  button {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;

    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    border: 1px solid #39424c;
    border-radius: 12px;
    padding: 10px;
  }

  input {
    flex-grow: 1;
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

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > label {
      width: 110px;
    }
  }

  .avatar {
    width: 150px;
    height: 150px;
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

      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;
