import { ApiResp } from '.';

export type PlatformData = {
  eventNumber: number;
  platform: string;
  platformLogo: string;
  platformUrl: string;
};

export type PlatformDataResponse = ApiResp<Array<PlatformData>>;
