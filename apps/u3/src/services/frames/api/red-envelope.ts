import request, { RequestPromise } from '../../shared/api/request';
import { ApiResp } from '@/services/shared/types';
import { RedEnvelopeEntity } from '../types/red-envelope';

export type CreateRedEnvelopeParams = {
  description?: string;
  randomFrom: number;
  randomTo: number;
  totalAmount: number;
  txHash: string;
};
export function createRedEnvelope(
  params: CreateRedEnvelopeParams
): RequestPromise<ApiResp<RedEnvelopeEntity>> {
  return request({
    url: `/onboarding/red-envelopes`,
    method: 'post',
    headers: {
      needToken: true,
    },
    data: params,
  });
}

export type RedEnvelopeListResponse = Array<RedEnvelopeEntity>;
export function fetchRedEnvelopeList(
  id: string | number
): RequestPromise<ApiResp<RedEnvelopeListResponse>> {
  return request({
    url: `/community/${id}/members/top`,
    method: 'get',
  });
}
