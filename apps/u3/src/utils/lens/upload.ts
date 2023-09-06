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

    // eslint-disable-next-line no-unsafe-optional-chaining
    const { id }: { id: string } = upload?.data;

    return `ar://${id}`;
  } catch (e: any) {
    console.error(e);

    throw new Error(e);
  }
};
