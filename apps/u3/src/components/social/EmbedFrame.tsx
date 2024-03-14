/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';
import { Frame } from 'frames.js';
import {
  sendTransaction,
  simulateContract,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { useAccount, useConfig } from 'wagmi';

import { CastId, Message, makeFrameAction } from '@farcaster/hub-web';
import { formatEther, fromHex, parseEther, toHex } from 'viem';
import { toast } from 'react-toastify';
import { Cross2Icon, CaretLeftIcon } from '@radix-ui/react-icons';
import { FarCast } from '../../services/social/types';

import ColorButton from '../common/button/ColorButton';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { FARCASTER_NETWORK } from '@/constants/farcaster';
import useFarcasterCastId from '@/hooks/social/farcaster/useFarcasterCastId';
import ModalContainerFixed from '../common/modal/ModalContainerFixed';
import { cn } from '@/lib/utils';
import {
  postFrameActionApi,
  postFrameActionRedirectApi,
  postFrameActionTxApi,
} from '@/services/social/api/farcaster';

export default function EmbedCastFrame({
  url,
  data,
  cast,
}: {
  url: string;
  data: Frame;
  cast: FarCast;
}) {
  const castId: CastId = useFarcasterCastId({ cast });
  const { encryptedSigner, isConnected, currFid } = useFarcasterCtx();
  const { chain, address } = useAccount();
  const [frameText, setFrameText] = useState('');
  const [frameRedirect, setFrameRedirect] = useState('');
  const [frameData, setFrameData] = useState<Frame>(data);

  const config = useConfig();

  const reportTransaction = useCallback(
    async (txId: string, btnIdx: number, postUrl: string, state?: string) => {
      if (!castId) {
        console.error('no castId');
        toast.error('cast is required');
        return;
      }
      if (!encryptedSigner || !currFid) {
        console.error('no encryptedSigner');
        toast.error('farcaster login is required');
        return;
      }
      const trustedDataResult = await makeFrameAction(
        {
          url: Buffer.from(url),
          buttonIndex: btnIdx,
          castId,
          inputText: Buffer.from(frameText),
          state: Buffer.from(state || ''),
          transactionId: Buffer.from(txId),
          address: address ? fromHex(address, 'bytes') : Buffer.from(''),
        },
        {
          fid: currFid,
          network: FARCASTER_NETWORK,
        },
        encryptedSigner
      );
      if (trustedDataResult.isErr()) {
        throw new Error(trustedDataResult.error.message);
      }

      const trustedDataValue = trustedDataResult.value;
      const untrustedData = {
        fid: currFid,
        url,
        messageHash: toHex(trustedDataValue.hash),
        network: FARCASTER_NETWORK,
        buttonIndex: btnIdx,
        inputText: frameText,
        castId: {
          fid: castId.fid,
          hash: toHex(castId.hash),
        },
        state: state || '',
        transactionId: txId,
      };
      const trustedData = {
        messageBytes: Buffer.from(
          Message.encode(trustedDataValue).finish()
        ).toString('hex'),
      };
      const postData = {
        actionUrl: postUrl,
        untrustedData,
        trustedData,
      };
      const resp = await postFrameActionApi(postData);
      if (resp.data.code !== 0) {
        toast.error(resp.data.msg);
        return;
      }
      const { frame } = resp.data.data;
      setFrameData(frame);
    },
    [frameData, currFid, encryptedSigner, castId, frameText, address]
  );

  const sendEthTransactionAction = async ({
    txData,
    chainId,
  }: {
    txData: any;
    chainId: string;
  }) => {
    console.log('txData', txData, chainId);
    try {
      const parsedChainId = parseInt(chainId, 10);

      // Switch chains if the user is not on the right one
      if (chain?.id !== parsedChainId)
        await switchChain(config, { chainId: parsedChainId });

      const hash = await sendTransaction(config, {
        ...txData,
        // value: txData.value ? BigInt(txData.value) : 0n,
        chainId: parsedChainId,
      });
      // const { request: transferDegenRequest } = await simulateContract(config, {
      //   ...txData,
      //   value: txData.value ? BigInt(txData.value) : 0n,
      //   chainId: parsedChainId,
      // });
      // const hash = await writeContract(config, transferDegenRequest);
      // const degenTxReceipt = await waitForTransactionReceipt(config, {
      //   hash: degenTxHash,
      //   chainId: base.id,
      // });

      const { status } = await waitForTransactionReceipt(config, {
        hash,
        chainId: parsedChainId,
      });
      console.log('tx status', status);
      if (status === 'success') {
        return hash;
      }
      console.error('transaction failed', hash, status);
      //     toast.error(`mint action failed: ${status}`);
    } catch (e: any) {
      console.error(e);
      // toast.error(e.message.split('\n')[0]);
    }
    return undefined;
  };

  const postFrameAction = useCallback(
    async (index: number, action: string, target?: string) => {
      if (action === 'link') {
        // c637bf4bb03cb409f54afa926689312f1960af85
        setFrameRedirect(target || url);
        return;
      }
      if (action === 'mint') {
        // website mint
        setFrameRedirect(url);
        return;
      }
      if (!castId) {
        console.error('no castId');
        toast.error('cast is required');
        return;
      }
      if (!encryptedSigner || !currFid) {
        console.error('no encryptedSigner');
        toast.error('farcaster login is required');
        return;
      }
      const trustedDataResult = await makeFrameAction(
        {
          url: Buffer.from(url),
          buttonIndex: index,
          castId,
          inputText: Buffer.from(frameText),
          state: Buffer.from(frameData.state || ''),
          transactionId: Buffer.from(''),
          address: address ? fromHex(address, 'bytes') : Buffer.from(''),
        },
        {
          fid: currFid,
          network: FARCASTER_NETWORK,
        },
        encryptedSigner
      );
      if (trustedDataResult.isErr()) {
        throw new Error(trustedDataResult.error.message);
      }

      const trustedDataValue = trustedDataResult.value;
      const untrustedData = {
        fid: currFid,
        url,
        messageHash: toHex(trustedDataValue.hash),
        network: FARCASTER_NETWORK,
        buttonIndex: index,
        inputText: frameText,
        castId: {
          fid: castId.fid,
          hash: toHex(castId.hash),
        },
        state: frameData.state || '',
        transactionId: '',
      };
      const trustedData = {
        messageBytes: Buffer.from(
          Message.encode(trustedDataValue).finish()
        ).toString('hex'),
      };
      const postData = {
        actionUrl: target || frameData.postUrl,
        untrustedData,
        trustedData,
        fromAddress: '',
      };

      if (action === 'tx') {
        console.log('tx', target);
        postData.actionUrl = target;
        postData.fromAddress = address;
        const resp = await postFrameActionTxApi(postData);
        if (resp.data.code !== 0) {
          toast.error(resp.data.msg);
          return;
        }
        const chainId = resp.data.data.chainId.split(':')[1];
        console.log('tx resp', resp.data.data.params);
        const txHash = await sendEthTransactionAction({
          txData: resp.data.data.params,
          chainId,
        });
        if (!txHash) {
          toast.error('transaction failed');
          return;
        }
        setFrameText('');
        await reportTransaction(
          txHash,
          index,
          frameData.postUrl,
          frameData.state
        );
        return;
      }

      if (action === 'post_redirect') {
        const resp = await postFrameActionRedirectApi(postData);
        if (resp.data.code !== 0) {
          toast.error(resp.data.msg);
          return;
        }
        setFrameRedirect(resp.data.data?.redirectUrl || '');
      } else {
        const resp = await postFrameActionApi(postData);
        if (resp.data.code !== 0) {
          toast.error(resp.data.msg);
          return;
        }
        const { frame } = resp.data.data;
        console.log('frame', frame);
        setFrameData(frame);
      }
    },
    [frameData, currFid, encryptedSigner, castId, frameText, address]
  );
  return (
    <>
      <div
        className="border rounded-xl overflow-hidden border-[#39424c]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full overflow-hidden flex items-center">
          <img src={frameData.image} alt="" className="w-full " />
        </div>
        {frameData.inputText && (
          <div className="p-3">
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-[#39424c] border-[#39424c] text-[#fff] placeholder-[#718096] focus:outline-none"
              placeholder={frameData.inputText}
              value={frameText}
              onChange={(e) => {
                setFrameText(e.target.value);
              }}
            />
          </div>
        )}
        {isConnected && frameData.buttons.length && (
          <div className="flex items-center justify-around gap-3 mt-1">
            {frameData.buttons.map((item, idx) => {
              if (!item) return null;
              return (
                <ColorButton
                  key={idx}
                  type="button"
                  className="flex-grow p-2 m-2 mt-1 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(
                      'postFrameAction',
                      idx,
                      item.action,
                      item.target
                    );
                    postFrameAction(idx + 1, item.action, item.target);
                  }}
                >
                  {item.label}
                </ColorButton>
              );
            })}
          </div>
        )}
      </div>
      {frameRedirect && (
        <EmbedCastFrameRedirect
          url={frameRedirect}
          resetUrl={() => {
            setFrameRedirect('');
          }}
        />
      )}
    </>
  );
}

function EmbedCastFrameRedirect({
  url,
  resetUrl,
}: {
  url: string;
  resetUrl: () => void;
}) {
  return (
    <ModalContainerFixed
      open={!!url}
      closeModal={() => {
        resetUrl();
      }}
      className="w-full md:w-[420px]"
    >
      <div
        className={cn(
          'flex flex-col gap-5 w-full overflow-hidden rounded-2xl p-5',
          ' text-white bg-inherit  max-h-[600px] overflow-y-auto'
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between text-[#718096] text-base">
          <h3>⚠️ Leaving u3</h3>
          <button type="button" onClick={resetUrl}>
            <Cross2Icon />
          </button>
        </div>
        <p className="">
          You are about to leave u3, please connect your wallet carefully and
          take care of your funds.
        </p>
        <div className="flex items-end justify-between gap-5">
          <button
            type="button"
            className={cn(
              'h-10 w-full bg-white text-black font-bold rounded-xl',
              'flex items-center justify-center'
            )}
            onClick={resetUrl}
          >
            <CaretLeftIcon className="h-7 w-7" /> back to u3
          </button>
          <button
            type="button"
            className="h-10 bg-[#F41F4C] font-bold rounded-xl w-36"
            onClick={() => {
              window.open(url, '_blank');
            }}
          >
            Still leave
          </button>
        </div>
      </div>
    </ModalContainerFixed>
  );
}
