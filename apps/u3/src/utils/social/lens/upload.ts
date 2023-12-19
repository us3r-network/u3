/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { METADATA_WORKER_URL } from './constants';

export const lensUploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios(METADATA_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    const resData = upload?.data?.data;
    const { id }: { id: string } = resData || {};

    return `https://arweave.net/${id}`;
  } catch (e: any) {
    console.error(e);

    throw new Error(e);
  }
};
