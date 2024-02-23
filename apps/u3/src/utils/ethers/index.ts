import { providers } from 'ethers';
import type { Chain, Client, Transport } from 'viem';

export function clientToSigner(client: Client<Transport, Chain>, account: any) {
  const { chain, transport } = client;
  const network = {
    chainId: (chain as Chain).id,
    name: (chain as Chain).name,
    ensAddress: (chain as Chain).contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account?.address);
  return signer;
}
