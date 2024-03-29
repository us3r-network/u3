/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react';
import { Frame } from 'frames.js';
import {
  sendTransaction,
  switchChain,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { useAccount, useConfig, useChains } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { CastId, Message, makeFrameAction } from '@farcaster/hub-web';
import { fromHex, toHex } from 'viem';
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
import { shortAddress } from '@/utils/message/xmtp';

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
  const [isLoading, setIsLoading] = useState(false);
  const [txSimulate, setTxSimulate] = useState<any>([]);
  const [txData, setTxData] = useState<any>();
  const [txBtnIdx, setTxBtnIdx] = useState(0);
  const { openConnectModal } = useConnectModal();

  const config = useConfig();

  const generateFrameActionData = useCallback(
    async (btnIdx: number, txId?: string) => {
      if (!castId) {
        console.error('no castId');
        toast.error('cast is required');
        throw new Error('cast is required');
      }
      if (!encryptedSigner || !currFid) {
        console.error('no encryptedSigner');
        toast.error('farcaster login is required');
        throw new Error('farcaster login is required');
      }
      const trustedDataResult = await makeFrameAction(
        {
          url: Buffer.from(url),
          buttonIndex: btnIdx,
          castId,
          inputText: Buffer.from(frameText),
          state: Buffer.from(frameData.state || ''),
          transactionId: Buffer.from(txId || ''),
          address:
            address && txId ? fromHex(address, 'bytes') : Buffer.from(''),
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
        fid: Number(currFid),
        url,
        messageHash: toHex(trustedDataValue.hash),
        network: FARCASTER_NETWORK,
        buttonIndex: trustedDataResult.value.data.frameActionBody.buttonIndex,
        timestamp: trustedDataResult.value.data.timestamp,
        inputText: frameText,
        castId: {
          fid: Number(castId.fid),
          hash: toHex(castId.hash),
        },
        state: frameData.state || '',
        transactionId: txId || '',
        address: address && txId ? address : '',
      };
      const trustedData = {
        messageBytes: Buffer.from(
          Message.encode(trustedDataValue).finish()
        ).toString('hex'),
      };
      return {
        untrustedData,
        trustedData,
      };
    },
    [address, castId.fid, castId.hash, currFid, frameData, url]
  );

  const reportTransaction = useCallback(
    async (txId: string, btnIdx: number, postUrl: string, state?: string) => {
      const { untrustedData, trustedData } = await generateFrameActionData(
        btnIdx,
        txId
      );
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

  const sendEthTransactionAction = useCallback(async () => {
    // console.log('txData', txData);
    if (!txData) {
      return undefined;
    }

    const chainId = txData.chainId.split(':')[1];

    try {
      const parsedChainId = parseInt(chainId, 10);

      // Switch chains if the user is not on the right one
      if (chain?.id !== parsedChainId)
        await switchChain(config, { chainId: parsedChainId });

      const hash = await sendTransaction(config, {
        ...txData.params,
        // value: txData.value ? BigInt(txData.value) : 0n,
        chainId: parsedChainId,
      });

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
      toast.error(e.message.split('\n')[0]);
    }
    return undefined;
  }, [txData]);

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
      const { untrustedData, trustedData } = await generateFrameActionData(
        index
      );
      const postData = {
        actionUrl: target || frameData.postUrl,
        untrustedData,
        trustedData,
        fromAddress: '',
      };

      if (action === 'tx') {
        if (!address) {
          openConnectModal();
          return;
        }
        console.log('tx', target);
        postData.actionUrl = target;
        postData.fromAddress = address;
        const resp = await postFrameActionTxApi(postData);
        if (resp.data.code !== 0) {
          toast.error(resp.data.msg);
          return;
        }
        const { txData: transactionData, simulateResult } = resp.data.data;
        setTxData(transactionData);
        setTxSimulate(simulateResult);
        setTxBtnIdx(index);
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
        <div
          className="w-full overflow-hidden flex items-center"
          style={{
            filter: isLoading ? 'blur(4px)' : undefined,
            aspectRatio:
              (frameData.imageAspectRatio ?? '1.91:1') === '1:1'
                ? '1/1'
                : '1.91/1',
          }}
        >
          <img src={frameData.image} alt="" className="w-full " />
        </div>
        {(frameData.inputText && (
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
        )) ||
          null}
        {(isConnected && frameData.buttons.length && (
          <div className="flex items-center justify-around gap-3 mt-1">
            {frameData.buttons.map((item, idx) => {
              if (!item) return null;
              return (
                <ColorButton
                  key={idx}
                  type="button"
                  className="flex-grow p-2 m-2 mt-1 rounded-xl"
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log(
                      'postFrameAction',
                      idx,
                      item.action,
                      item.target
                    );
                    try {
                      setIsLoading(true);
                      await postFrameAction(idx + 1, item.action, item.target);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {item.action === 'mint' ? `⬗ ` : ''}
                  {item.label}
                  {item.action === 'tx' ? <TxIcon /> : ''}
                  {item.action === 'post_redirect' || item.action === 'link'
                    ? ` ↗`
                    : ''}
                </ColorButton>
              );
            })}
          </div>
        )) ||
          null}
      </div>
      {(frameRedirect && (
        <EmbedCastFrameRedirect
          url={frameRedirect}
          resetUrl={() => {
            setFrameRedirect('');
          }}
        />
      )) ||
        null}
      {(txBtnIdx && (
        <EmbedCastFrameTxSimulate
          walletAddress={address}
          txBtnIdx={txBtnIdx}
          txSimulate={txSimulate}
          txData={txData}
          txAction={async () => {
            try {
              const txId = await sendEthTransactionAction();
              if (txId) {
                await reportTransaction(txId, txBtnIdx, frameData.postUrl);
              }
            } catch (e: any) {
              console.error(e);
            }
          }}
          close={() => {
            setTxBtnIdx(0);
          }}
        />
      )) ||
        null}
    </>
  );
}

function TxIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 16 16"
      className="ml-1 mb-[2px] text-gray-400 inline-block select-none align-text-middle overflow-visible"
      width="12"
      height="12"
      fill="currentColor"
    >
      <path d="M9.504.43a1.516 1.516 0 0 1 2.437 1.713L10.415 5.5h2.123c1.57 0 2.346 1.909 1.22 3.004l-7.34 7.142a1.249 1.249 0 0 1-.871.354h-.302a1.25 1.25 0 0 1-1.157-1.723L5.633 10.5H3.462c-1.57 0-2.346-1.909-1.22-3.004L9.503.429Zm1.047 1.074L3.286 8.571A.25.25 0 0 0 3.462 9H6.75a.75.75 0 0 1 .694 1.034l-1.713 4.188 6.982-6.793A.25.25 0 0 0 12.538 7H9.25a.75.75 0 0 1-.683-1.06l2.008-4.418.003-.006a.036.036 0 0 0-.004-.009l-.006-.006-.008-.001c-.003 0-.006.002-.009.004Z" />
    </svg>
  );
}

function EmbedCastFrameTxSimulate({
  walletAddress,
  txBtnIdx,
  txSimulate,
  txData,
  txAction,
  close,
}: {
  walletAddress: string;
  txBtnIdx: number;
  txSimulate: any[];
  txData: any;
  txAction: () => void;
  close: () => void;
}) {
  const chains = useChains();
  const from = useMemo(() => {
    return txSimulate.find(
      (item) => item.from?.toLowerCase() === walletAddress.toLowerCase()
    );
  }, [txSimulate]);
  const to = useMemo(() => {
    return txSimulate.find(
      (item) => item.to?.toLowerCase() === walletAddress.toLowerCase()
    );
  }, [txSimulate]);
  const chainId = txData.chainId.split(':')[1];
  const chain = chains.find((item) => item.id === parseInt(chainId, 10));
  return (
    <ModalContainerFixed
      open={!!txBtnIdx}
      closeModal={close}
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
          <h3>⚠️ Transaction</h3>
          <button type="button" onClick={close}>
            <Cross2Icon />
          </button>
        </div>
        <div>
          <div className="bg-slate-300 rounded-md p-2">
            {from && (
              <div className="text-[#718096]">
                <p>Send</p>
                <p>
                  {from.amount?.slice(0, 7)}
                  {from.token_info.symbol}
                </p>
              </div>
            )}
            {to && (
              <div className="text-[#718096]">
                <p>Receive</p>
                <p>
                  {to.amount?.slice(0, 7)}
                  {to.token_info.symbol}
                </p>
              </div>
            )}
          </div>

          <div className="p-2">
            <p>
              chain: <span className="text-[#718096]">{chain.name}</span>
            </p>
            <p>
              wallet address:{' '}
              <span className="text-[#718096]">
                {shortAddress(walletAddress)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-5">
          <button
            type="button"
            className={cn(
              'h-10 w-full bg-white text-black font-bold rounded-xl',
              'flex items-center justify-center'
            )}
            onClick={close}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-10 bg-[#F41F4C] font-bold rounded-xl w-full"
            onClick={txAction}
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalContainerFixed>
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
