import { UserDataType } from '@farcaster/hub-web';
import { useMemo } from 'react';

export default function useUserData(
  userData:
    | {
        type: number;
        value: string;
      }[]
    | undefined
) {
  const data = useMemo(() => {
    let pfp = '';
    let display = '';
    let bio = '';
    let userName = '';
    let url = '';

    (userData || []).forEach((item) => {
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
      pfp,
      bio,
      userName,
      display,
      url,
      avatar: pfp,
      name: display,
      handle: userName,
    };
  }, [userData]);

  return data;
}
