import request, { RequestPromise } from './request';

export enum AccountType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
  EMAIL = 'EMAIL',
}

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
  ADMIN = 'ADMIN',
  VIP = 'VIP',
}

export enum ResourceType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMMUNITY = 'COMMUNITY',
}

export type ResourcePermission = {
  resourceType: ResourceType;
  resourceIds: number[];
};

export type Account = {
  id: number;
  accountType: AccountType;
  thirdpartyId: string;
  thirdpartyName: string;
  userId: number;
  data: unknown;
};

export type User = {
  id: number;
  name: string;
  avatar: string;
  accounts: Account[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
  token: string;
};

export function u3login(didSessionStr: string): RequestPromise<User> {
  return request({
    url: `/users/u3login`,
    method: 'post',
    headers: {
      token: didSessionStr,
    },
  });
}
