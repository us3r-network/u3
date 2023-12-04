/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-01 10:27:40
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-03 13:19:38
 * @FilePath: /u3/apps/u3/src/utils/social/farcaster/getChannel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import FarcasterChannelData from '../../../constants/warpcast.json';

export type FarcasterChannel = {
  name: string;
  parent_url: string;
  image: string;
  channel_id: string;
};

export function getChannelFromName(name: string) {
  const channel = FarcasterChannelData.find((c) => c.name === name);
  if (channel) {
    return channel;
  }
  return null;
}

export function getChannelFromId(id: string) {
  const channel = FarcasterChannelData.find((c) => c.channel_id === id);
  if (channel) {
    return channel;
  }
  return null;
}

export function getChannelFromUrl(url: string) {
  const channel = FarcasterChannelData.find((c) => c.parent_url === url);
  if (channel) {
    return channel;
  }
  return null;
}

export function getChannel() {
  return FarcasterChannelData;
}
