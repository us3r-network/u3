import { FarcasterNetwork } from "@farcaster/core";
import { getHubRpcClient } from "@farcaster/hub-web";

export const FARCASTER_HUB_URL = "https://farcaster.u3.xyz";
export const FARCASTER_NETWORK = FarcasterNetwork.MAINNET;
export const FARCASTER_WEB_CLIENT = getHubRpcClient(FARCASTER_HUB_URL, {});
