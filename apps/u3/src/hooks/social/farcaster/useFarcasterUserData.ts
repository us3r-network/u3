import { UserDataType } from '@farcaster/hub-web';
import { useMemo } from 'react';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';

export default function useFarcasterUserData({
  farcasterUserData,
  fid,
}: {
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  fid: string;
}) {
  const { currUserInfo } = useFarcasterCtx();
  const userData = useMemo(() => {
    let data = [];
    if (currUserInfo) {
      data = currUserInfo[fid] || [];
    }
    if (farcasterUserData && data.length === 0) {
      data = farcasterUserData[fid] || [];
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
  }, [currUserInfo, farcasterUserData, fid]);

  return userData;
}
