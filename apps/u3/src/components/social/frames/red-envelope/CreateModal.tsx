import { useCallback, useEffect, useState } from 'react';
import {
  simulateContract,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useConfig } from 'wagmi';

import ModalContainer from '@/components/common/modal/ModalContainer';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import CreateFrameForm, { defaultFrameFormValues } from './CreateFrameForm';
import PostFrameForm from './PostFrameForm';
import useLogin from '@/hooks/shared/useLogin';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { DegenABI, DegenAddress } from '@/services/social/abi/degen/contract';
import {
  CreateRedEnvelopeParams,
  createRedEnvelope,
} from '@/services/frames/api/red-envelope';
import { API_BASE_URL, RED_ENVELOPE_PLEDGE_ADDRESS } from '@/constants';
import { RedEnvelopeEntity } from '@/services/frames/types/red-envelope';
import ModalBase, { ModalBaseBody } from '@/components/common/modal/ModalBase';

const RED_ENVELOPE_FRAME_HOST = API_BASE_URL;

enum Steps {
  CREATE_FRAME = 'CREATE_FRAME',
  POST_FRAME = 'POST_FRAME',
}
const unpublishedRedEnvelopeFrameDataKey =
  'red-envelope:unpublished-frame-data';
const getStoredUnpublishedData = () => {
  let data = null;
  try {
    const dataJson = localStorage.getItem(unpublishedRedEnvelopeFrameDataKey);
    if (dataJson) {
      data = JSON.parse(dataJson);
    }
  } catch (error) {
    /* empty */
  }
  return {
    data: data as RedEnvelopeEntity,
  };
};
const storeUnpublishedFrameData = (data: RedEnvelopeEntity) => {
  localStorage.setItem(
    unpublishedRedEnvelopeFrameDataKey,
    JSON.stringify(data)
  );
};
const removeStoredUnpublishedFrameData = () => {
  localStorage.removeItem(unpublishedRedEnvelopeFrameDataKey);
};
const getFrameUrl = (data: RedEnvelopeEntity) => {
  return `${RED_ENVELOPE_FRAME_HOST}/red-envelope/frame/${data.id}`;
};

export default function CreateModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { isLogin, login } = useLogin();
  const { address: accountAddr, chain } = useAccount();
  const config = useConfig();
  const { openFarcasterQR, isConnected: isLoginFarcaster } = useFarcasterCtx();

  const [step, setStep] = useState(Steps.CREATE_FRAME);
  const [submitting, setSubmitting] = useState(false);
  const [frameFormValues, setFrameFormValues] = useState(
    defaultFrameFormValues
  );
  const [createdFrameData, setCreatedFrameData] =
    useState<RedEnvelopeEntity | null>(null);
  const [frameUrl, setFrameUrl] = useState('');
  useEffect(() => {
    // validate unpublished frame
    const { data } = getStoredUnpublishedData();
    if (data) {
      setFrameFormValues(data);
      setCreatedFrameData(data);
      const url = getFrameUrl(data);
      setFrameUrl(url);
    }
  }, []);

  const pledgeDegenToU3 = useCallback(
    async (amount: string | number) => {
      try {
        if (!RED_ENVELOPE_PLEDGE_ADDRESS) {
          throw new Error('RED_ENVELOPE_PLEDGE_ADDRESS is not defined');
        }
        if (chain?.id !== base.id) {
          await switchChain(config, { chainId: base.id });
        }
        const { request: transferDegenRequest } = await simulateContract(
          config,
          {
            address: DegenAddress,
            abi: DegenABI,
            chainId: base.id,
            functionName: 'transfer',
            args: [RED_ENVELOPE_PLEDGE_ADDRESS, parseEther(amount.toString())],
          }
        );
        const degenTxHash = await writeContract(config, transferDegenRequest);
        const degenTxReceipt = await waitForTransactionReceipt(config, {
          hash: degenTxHash,
          chainId: base.id,
        });
        console.log('degenTxReceipt', degenTxReceipt);
        if (degenTxReceipt.status === 'success') {
          toast.success('pledge degen success');
          return degenTxHash;
        }
        console.error('transaction failed', degenTxHash, degenTxReceipt);
        toast.error(`pledge action failed: ${degenTxReceipt.status}`);
        return '';
      } catch (e) {
        toast.error(e.message.split('\n')[0]);
        return '';
      }
    },
    [chain]
  );
  const submitFrame = useCallback(
    async (values: CreateRedEnvelopeParams) => {
      if (!isLogin || !accountAddr) {
        login();
        return;
      }
      if (!isLoginFarcaster) {
        openFarcasterQR();
        return;
      }

      try {
        setSubmitting(true);
        // pledge degen
        const { totalAmount } = values;
        const txHash = await pledgeDegenToU3(totalAmount);
        if (!txHash) {
          toast.error('pledge degen failed');
          return;
        }
        console.log(txHash, totalAmount);
        const res = await createRedEnvelope({ ...values, txHash });
        const data = res?.data?.data;
        if (data.id) {
          const url = getFrameUrl(data);
          setFrameUrl(url);
          setCreatedFrameData(data);
          storeUnpublishedFrameData(data);
          setStep(Steps.POST_FRAME);
          toast.success('Red envelope created');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSubmitting(false);
      }
    },
    [isLogin, isLoginFarcaster, openFarcasterQR, accountAddr]
  );

  const [openNotice, setOpenNotice] = useState(false);
  return (
    <ModalBase
      isOpen={open}
      onRequestClose={closeModal}
      style={{
        overlay: {
          zIndex: 40,
        },
      }}
    >
      <div className="bg-[#1b1e23] rounded-[20px] mx-[0] my-[60px]">
        <div className="w-[800px] inline-flex p-[20px] box-border flex-col justify-center items-start gap-[20px]">
          <div className="flex justify-between items-center self-stretch">
            <span className="text-[#718096] text-[14px] font-medium">
              Red Envelope
            </span>
            <ModalCloseBtn onClick={closeModal} />
          </div>
          {step === Steps.POST_FRAME ? (
            <PostFrameForm
              frameUrl={frameUrl}
              frameData={createdFrameData}
              onSuccess={() => {
                setStep(Steps.CREATE_FRAME);
                removeStoredUnpublishedFrameData();
                setFrameFormValues(defaultFrameFormValues);
                setCreatedFrameData(null);
                setFrameUrl('');
                setOpenNotice(true);
              }}
              onBack={() => {
                setStep(Steps.CREATE_FRAME);
              }}
            />
          ) : (
            <>
              <CreateFrameForm
                submitting={submitting}
                disabled={submitting || !!frameUrl}
                values={frameFormValues}
                onValuesChange={(values) => {
                  setFrameFormValues(values);
                }}
                onSubmit={(values) => {
                  submitFrame(values);
                }}
              />
              {!!frameUrl && !!frameFormValues && (
                <button
                  type="button"
                  className="
                  w-full flex px-[12px] py-[6px] h-[40px] justify-center items-center rounded-[10px] bg-[#FFF]
                text-[#000] text-center text-[12px] font-normal leading-[20px]
                "
                  onClick={() => {
                    setStep(Steps.POST_FRAME);
                  }}
                >
                  The red envelope is ready, go publish it.
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <PostNotice
        open={openNotice}
        closeModal={() => {
          setOpenNotice(false);
        }}
      />
    </ModalBase>
  );
}

function PostNotice({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <ModalBase
      isOpen={open}
      onRequestClose={closeModal}
      style={{
        overlay: {
          zIndex: 40,
        },
      }}
    >
      <div className="bg-[#1b1e23] rounded-[20px] mx-[0] my-[60px]">
        <div className="w-[320px] inline-flex p-[20px] box-border flex-col justify-center items-start gap-[20px]">
          <div className="flex justify-between items-center self-stretch">
            <span className="text-[#718096] text-[14px] font-medium">
              Red Envelope
            </span>
            <ModalCloseBtn onClick={closeModal} />
          </div>
          <div className="flex flex-col gap-[20px]">
            <span className="text-[#FFF] text-[16px] font-medium leading-[150%]">
              Red envelope sent successfully! It will be posted to Warpcast in a
              few minutes, please check back later.
            </span>
            <button
              type="button"
              className="
                flex-1 flex px-[12px] py-[6px] h-[40px] justify-center items-center rounded-[10px] bg-[#F41F4C]
              text-[#FFF] text-center text-[12px] font-normal leading-[20px]
              "
              onClick={() => {
                closeModal();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
