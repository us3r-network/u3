/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-07 13:15:37
 * @FilePath: /u3/apps/u3/src/utils/social/lens/getLensProfileExternalLink.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LENS_ENV } from '../../../constants/lens';

const HEY_PROD_HOST = 'https://hey.xyz';
const HEY_DEV_HOST = 'https://testnet.hey.xyz';
export const HEY_HOST =
  LENS_ENV === 'production' ? HEY_PROD_HOST : HEY_DEV_HOST;
export const getLensProfileExternalLinkWithHandle = (handle: string) => {
  if (!handle) return '';
  return `${HEY_HOST}/u/${handle}`;
};
export function getOfficialPublicationUrl(id) {
  return `${HEY_HOST}/posts/${id}`;
}
