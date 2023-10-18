import FarcasterChannelData from '../../constants/warpcast.json';

export function getChannelFromName(name: string) {
  const channel = FarcasterChannelData.find(
    (c) => c.name === name || c.channel_description === name
  );
  if (channel) {
    return channel;
  }
  return null;
}

export function getChannel() {
  return FarcasterChannelData;
}