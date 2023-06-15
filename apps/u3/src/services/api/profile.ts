import {
  KarmaCheckInResponse,
  KarmaListResponse,
  KarmaResponse,
  ProfileResponse,
  ProfilesResponse,
} from '../types/profile';
import request, { RequestPromise } from './request';

export function fetchU3Profile(token: string): RequestPromise<ProfileResponse> {
  return request({
    url: `/users/u3profile?chain=eth`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export const ProfileDefault = {
  erc20Balances: [],
  ethBalance: '0',
  galxe: {
    addressInfo: {
      nfts: {
        totalCount: 0,
        pageInfo: {
          startCursor: '',
          endCursor: '',
          hasNextPage: false,
          hasPreviousPage: false,
        },
        list: [],
      },
    },
  },
  poap: [],
  noox: {
    total: 0,
    result: [],
  },
  nfts: {
    total: 0,
    cursor: '',
    result: [],
  },
};
export function fetchU3Profiles(
  token: string
): RequestPromise<ProfilesResponse> {
  return request({
    url: `/users/u3profiles`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}
export function fetchU3Assets(
  wallet: string[],
  asset?: string[]
): RequestPromise<ProfilesResponse> {
  return request({
    url: `/users/assets`,
    method: 'get',
    params: {
      wallet,
      asset,
    },
  });
}

export function fetchU3ProfileWithWallet(wallet: string) {
  return request({
    url: `/users/u3profile/${wallet}`,
    method: 'get',
  });
}

export function addOrDelWallet(addr: string, add: boolean, token: string) {
  return request({
    url: `/users/wallets`,
    method: 'post',
    data: {
      addRemove: add,
      wallet: addr,
      chain: 'eth',
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchU3Wallets(token: string) {
  return request({
    url: `/users/wallets`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function getPreference(token: string) {
  return request({
    url: `/users/preference`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function updatePreference(
  data: {
    contentTypes: string[];
    eventRewards: string[];
    eventTypes: string[];
    langs: string[];
    projectTypes: string[];
  },
  token: string
) {
  return request({
    url: `/users/preference`,
    method: 'post',
    data,
    headers: {
      token,
      needToken: true,
    },
  });
}

export function getKarma(token: string): RequestPromise<KarmaResponse> {
  return request({
    url: `/users/karma`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function dailyCheckIn(
  token: string
): RequestPromise<KarmaCheckInResponse> {
  return request({
    url: `/users/karma-dailycheckin`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function getKarmaList(
  {
    pageSize,
    pageNumber,
  }: {
    pageSize?: number;
    pageNumber?: number;
  },
  token: string
): RequestPromise<KarmaListResponse> {
  return request({
    url: `/users/karma-list`,
    method: 'get',
    params: {
      pageSize: pageSize ?? 10,
      pageNumber: pageNumber ?? 0,
    },
    headers: {
      token,
      needToken: true,
    },
  });
}
