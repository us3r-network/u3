import { UserDataType } from '@farcaster/hub-web';

export type UserData = {
  fid: string;
  pfp: string;
  bio: string;
  userName: string;
  display: string;
  url: string;
};

export function userDataObjFromArr(
  dataArr: {
    fid: string;
    type: number;
    value: string;
  }[]
) {
  const temp: { [key: string]: UserData } = {};
  dataArr.forEach((item) => {
    let pfp = '';
    let display = '';
    let bio = '';
    let userName = '';
    let url = '';

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

    temp[item.fid] = temp[item.fid] || {
      fid: item.fid,
      pfp,
      display,
      bio,
      userName,
      url,
    };

    if (pfp) temp[item.fid].pfp = pfp;
    if (bio) temp[item.fid].bio = bio;
    if (userName) temp[item.fid].userName = userName;
    if (display) temp[item.fid].display = display;
    if (url) temp[item.fid].url = url;
  });

  return temp;
}
