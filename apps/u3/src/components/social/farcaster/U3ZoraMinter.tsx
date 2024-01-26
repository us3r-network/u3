import {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UrlMetadata } from '@mod-protocol/core';
import { useAccount, useNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  sendTransaction,
  switchNetwork,
  waitForTransaction,
} from '@wagmi/core';
import { toast } from 'react-toastify';

import { getMetadataWithMod } from '@/services/social/api/farcaster';
import { FarCastEmbedMeta } from '@/services/social/types';
import useLogin from '@/hooks/shared/useLogin';

type ModTransactionData = {
  status: string;
  orderIds: string[];
  data: {
    from: string;
    to: string;
    data: string;
    value: string;
  };
  chainId: string;
  explorer: {
    name: string;
    url: string;
  };
};

export default function U3ZoraMinter({
  url,
  embedMetadata,
}: {
  url: string;
  embedMetadata: FarCastEmbedMeta;
}) {
  const [mounted, setMounted] = useState(false);
  const [minting, setMinting] = useState(false); // [loading, setLoading
  const [transactionHash, setTransactionHash] = useState(''); // [data, setData
  const [transactionData, setTransactionData] = useState<ModTransactionData>(); // [data, setData
  const [modMetadataCheckDone, setModMetadataCheckDone] = useState(false);
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [resultUrl, setResultUrl] = useState(url);
  const { walletAddress, isLogin, login } = useLogin();
  const network = useNetwork();
  //   const { currFid } = useFarcasterCtx();

  const [modMetadata, setModMetadata] = useState<{
    [key: string]: UrlMetadata;
  }>({});
  const modData = useMemo(() => {
    return modMetadata[resultUrl];
  }, [modMetadata, resultUrl]);

  const getModMetadata = useCallback(async () => {
    const img = embedMetadata.image;
    const imgTokenId = img.split('/').pop();
    const urlArr = url.split('/');
    const urlTokenId = urlArr.pop();
    if (imgTokenId !== urlTokenId) {
      // console.log('replace tokenId', { imgTokenId }, { urlTokenId });
      urlArr.push(imgTokenId);
    } else {
      urlArr.push(urlTokenId);
    }
    const urlResult = urlArr.join('/');
    const data = await getMetadataWithMod([urlResult]);
    // console.log('data', resultUrl, data);
    setResultUrl(urlResult);
    setModMetadata(data);
    setModMetadataCheckDone(true);
  }, [url, embedMetadata]);

  const sendEthTransactionAction = async ({
    data,
    chainId,
  }: {
    data: any;
    chainId: string;
  }) => {
    try {
      const parsedChainId = parseInt(chainId, 10);

      // Switch chains if the user is not on the right one
      if (network.chain?.id !== parsedChainId)
        await switchNetwork({ chainId: parsedChainId });

      // Send the transaction
      // console.log('data', data, { chainId });
      const { hash } = await sendTransaction({
        ...data,
        value: data.value ? BigInt(data.value) : 0n,
        //   data: (data.data as `0x${string}`) || '0x',
        chainId: parsedChainId,
      });
      // console.log('hash', hash);
      // onSubmitted(hash);

      const { status } = await waitForTransaction({
        hash,
        chainId: parsedChainId,
      });
      if (status === 'success') {
        setTransactionHash(hash);
        toast.success('mint action success');
      } else {
        console.error('transaction failed', hash, status);
        toast.error(`mint action failed: ${status}`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message.split('\n')[0]);
    }
  };

  const transactionAction = useCallback(async () => {
    if (!modData) {
      toast.error('No valid transaction data');
      return;
    }
    if (!isLogin) {
      login();
      return;
    }
    if (!address) {
      console.log('Please connect wallet first');
      openConnectModal();
      return;
    }
    try {
      setMinting(true);
      // console.log('modData', modData);
      const data = await getTransactionDataFromMod(address, modData);
      if (data.message) {
        toast.error(data.message);
        return;
      }
      // console.log('transactionData', data);
      setTransactionData(data);
      await sendEthTransactionAction(data);
    } catch (e) {
      console.error(e);
      toast.error(e.message.split('\n')[0]);
    } finally {
      setMinting(false);
    }
  }, [modData, address, isLogin, login]);

  useEffect(() => {
    if (!mounted) return;
    getModMetadata();
  }, [getModMetadata, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="text-[#fff] w-full rounded-[10px] overflow-hidden bg-[#14171a] [cursor:initial]"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <img
        className="w-full max-h-[500px] object-cover"
        src={embedMetadata.image}
        alt=""
        loading="lazy"
      />
      <div className="flex justify-between items-center p-[20px]">
        <h4 className="m-0 text-[#fff] text-[16px] font-normal leading-[30px]">
          {embedMetadata.collection}
        </h4>
        {(minting && <MintButton>Minting</MintButton>) ||
          (modMetadataCheckDone &&
            ((modData &&
              modData.nft?.tokenId &&
              ((transactionHash && (
                <MintButton
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `${transactionData.explorer.url}/tx/${transactionHash}`,
                      '_blank'
                    );
                  }}
                >
                  View NFT
                </MintButton>
              )) || (
                <MintButton
                  onClick={(e) => {
                    e.stopPropagation();
                    transactionAction();
                  }}
                >
                  Mint
                </MintButton>
              ))) || (
              <MintButton
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank');
                }}
              >
                View
              </MintButton>
            )))}
      </div>
    </div>
  );
}
function MintButton(props: ComponentPropsWithRef<'button'>) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-[10px] bg-[#454c99] px-[20px] py-[10px] border-none outline-[none] text-[#fff] text-[16px] font-bold"
      {...props}
    />
  );
}

async function getTransactionDataFromMod(
  walletAddress: string,
  modMetadata: UrlMetadata
) {
  const resp = await fetch(
    `https://api.modprotocol.org/api/nft-minter?taker=${walletAddress}&itemId=${modMetadata.nft.collection.id}/${modMetadata.nft.tokenId}`
  );
  const data = await resp.json();
  return data;
}
