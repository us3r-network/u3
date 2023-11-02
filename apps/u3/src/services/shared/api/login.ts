/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-27 17:55:00
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-02 17:07:13
 * @FilePath: /u3/apps/u3/src/services/shared/api/login.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

export function getProfileBiolink(didSessionStr, params) {
  return request({
    url: `/users/profile-links`,
    params,
    method: 'get',
    headers: {
      token: didSessionStr,
    },
  });
}

export function postProfileBiolink(
  data: {
    platform;
    network;
    handle;
    data;
  },
  didSessionStr
) {
  return request({
    url: `/users/profile-links`,
    method: 'post',
    data,
    headers: {
      token: didSessionStr,
    },
  });
}
