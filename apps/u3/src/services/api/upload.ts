import request, { RequestPromise } from './request';

export type UploadImageResult = {
  url: string;
};
export function uploadImage(
  file: File,
  token: string
): RequestPromise<UploadImageResult> {
  const form = new FormData();
  form.append('file', file);
  return request({
    url: '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      needToken: true,
      token,
    },
  });
}
