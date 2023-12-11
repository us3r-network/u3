import { UserDataType } from '@farcaster/hub-web';
import { useMemo } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { UserData } from 'src/utils/social/farcaster/user-data';

export default function useFarcasterUserData({
  farcasterUserData,
  farcasterUserDataObj,
  fid,
}: {
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  fid: string;
}) {
  const { currFid, currUserInfo } = useFarcasterCtx();
  const userData = useMemo(() => {
    let data = [];
    if (farcasterUserData && data.length === 0) {
      data = farcasterUserData[fid] || [];
    }
    if (currFid && currUserInfo && farcasterUserDataObj) {
      farcasterUserDataObj[currFid] = userDataArrToObj(
        currUserInfo[currFid],
        `${currFid}`
      );
    }
    if (farcasterUserDataObj) {
      const obj = farcasterUserDataObj[fid];
      if (obj) {
        return obj;
      }
    }

    return userDataArrToObj(data, fid);
  }, [farcasterUserData, fid, farcasterUserDataObj, currFid, currUserInfo]);

  return userData;
}

function userDataArrToObj(data: any[], fid: string) {
  let pfp = '';
  let display = '';
  let bio = '';
  let userName = '';
  let url = '';

  data.forEach((item) => {
    switch (item.type) {
      case UserDataType.PFP:
        pfp = item.value;
        break;
      case UserDataType.DISPLAY:
        display = item.value;
        break;
      case UserDataType.BIO:
        bio = item.value;
        break;
      case UserDataType.USERNAME:
        userName = item.value;
        break;
      case UserDataType.URL:
        url = item.value;
        break;
      default:
        break;
    }
  });

  return {
    fid,
    pfp,
    bio,
    userName,
    display,
    url,
  };
}
