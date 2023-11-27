import { UserDataType } from '@farcaster/hub-web';

export default function userDataObj(data: { type: number; value: string }[]) {
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
    pfp,
    bio,
    userName,
    display,
    url,
  };
}
