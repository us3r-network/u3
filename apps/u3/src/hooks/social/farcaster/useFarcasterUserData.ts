import { UserDataType } from '@farcaster/hub-web';
import { useMemo } from 'react';
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
  const userData = useMemo(() => {
    let data = [];
    if (farcasterUserData && data.length === 0) {
      data = farcasterUserData[fid] || [];
    }
    if (farcasterUserDataObj) {
      const obj = farcasterUserDataObj[fid];
      if (obj) {
        return obj;
      }
    }

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
  }, [farcasterUserData, fid, farcasterUserDataObj]);

  return userData;
}
