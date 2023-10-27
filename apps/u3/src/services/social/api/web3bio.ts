import axios, { AxiosPromise } from 'axios';

export enum Web3BioProfilePlatform {
  ens = 'ENS',
  lens = 'lens',
  farcaster = 'farcaster',
  dotbit = 'dotbit',
}
export type Web3BioProfile = {
  address: string | null;
  identity: string;
  platform: string;
  displayName: string | null;
  avatar: string | null;
  email: string | null;
  description: string | null;
  location: string | null;
  header: string | null;
  links: {
    website: {
      link: string;
      handle: string;
    };
  };
};

export const getProfilesWithWeb3Bio = (
  identity: string
): AxiosPromise<Array<Web3BioProfile>> => {
  return axios.request({
    url: `https://api.web3.bio/profile/${identity}`,
    method: 'GET',
  });
};
