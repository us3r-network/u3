import axios, { AxiosPromise } from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const API_SOCIAL_URL = process.env.REACT_APP_API_SOCIAL_URL;

export enum ApiRespCode {
  SUCCESS = 0,
  ERROR = 1,
}
export type ApiResp<T> = {
  code: ApiRespCode;
  msg: string;
  data: T;
};
export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};
export function getFarcasterUserInfo(
  fids: number[]
): AxiosPromise<ApiResp<FarcasterUserData[]>> {
  return axios({
    url: `${API_SOCIAL_URL}/3r/farcaster/userinfo`,
    method: "get",
    params: {
      fids,
    },
  });
}

export type UploadImageResult = {
  url: string;
};
export function uploadImage(file: File): AxiosPromise<UploadImageResult> {
  const form = new FormData();
  form.append("file", file);
  return axios({
    url: `${API_BASE_URL}/medium/upload`,
    method: "post",
    data: form,
  });
}
