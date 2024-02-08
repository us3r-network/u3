import { useCallback, useEffect, useState } from 'react';
import {
  prepareWriteContract,
  switchNetwork,
  waitForTransaction,
  writeContract,
} from '@wagmi/core';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useNetwork } from 'wagmi';

import ModalContainer from '@/components/common/modal/ModalContainer';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import CreateFrameForm, {
  FrameFormValues,
  defaultFrameFormValues,
} from './CreateFrameForm';
import PostFrameForm from './PostFrameForm';
import useLogin from '@/hooks/shared/useLogin';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { DegenABI, DegenAddress } from '@/services/social/abi/degen/contract';

const U3Address = '0xCFd3527F4334Ebb2E3b53b01f70B7BD5C3170cD5';

enum Steps {
  CREATE_FRAME = 'CREATE_FRAME',
  POST_FRAME = 'POST_FRAME',
}
const unpublishedFrameFormKey = 'red-envelope:unpublished-frame-form';
const unpublishedFrameUrlKey = 'red-envelope:unpublished-frame-url';
const getStoredUnpublishedFrame = () => {
  let form = null;
  let url = '';
  try {
    const formJson = localStorage.getItem(unpublishedFrameFormKey);
    if (formJson) {
      form = JSON.parse(formJson);
    }
  } catch (error) {
    /* empty */
  }
  try {
    url = localStorage.getItem(unpublishedFrameUrlKey) || '';
  } catch (error) {
    /* empty */
  }
  return {
    form: form as FrameFormValues | null,
    url,
  };
};
const storeUnpublishedFrame = (form: any, url: string) => {
  localStorage.setItem(unpublishedFrameFormKey, JSON.stringify(form));
  localStorage.setItem(unpublishedFrameUrlKey, url);
};
const removeStoredUnpublishedFrame = () => {
  localStorage.removeItem(unpublishedFrameFormKey);
  localStorage.removeItem(unpublishedFrameUrlKey);
};

export default function CreateModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { isLogin, login } = useLogin();
  const network = useNetwork();
  const { address: accountAddr } = useAccount();
  const { openFarcasterQR, isConnected: isLoginFarcaster } = useFarcasterCtx();

  const [step, setStep] = useState(Steps.CREATE_FRAME);
  const [frameFormValues, setFrameFormValues] = useState(
    defaultFrameFormValues
  );
  const [frameUrl, setFrameUrl] = useState('');
  useEffect(() => {
    // validate unpublished frame
    const { form, url } = getStoredUnpublishedFrame();
    if (url && form) {
      setFrameFormValues(form);
      setFrameUrl(url);
    }
  }, []);

  const pledgeDegenToU3 = useCallback(
    async (amount: string | number) => {
      try {
        if (network.chain?.id !== base.id) {
          await switchNetwork({ chainId: base.id });
        }
        const { request: transferDegenRequest } = await prepareWriteContract({
          address: DegenAddress,
          abi: DegenABI,
          chainId: base.id,
          functionName: 'transfer',
          args: [U3Address, parseEther(amount.toString())],
        });
        const degenTxHash = await writeContract(transferDegenRequest);
        const degenTxReceipt = await waitForTransaction({
          hash: degenTxHash.hash,
          chainId: base.id,
        });
        console.log('degenTxReceipt', degenTxReceipt);
        if (degenTxReceipt.status === 'success') {
          toast.success('pledge degen success');
          return degenTxHash.hash;
        }
        console.error('transaction failed', degenTxHash.hash, degenTxReceipt);
        toast.error(`pledge action failed: ${degenTxReceipt.status}`);
        return '';
      } catch (e) {
        toast.error(e.message.split('\n')[0]);
        return '';
      }
    },
    [network]
  );

  const submitFrame = useCallback(
    async (values: FrameFormValues) => {
      if (!isLogin || !accountAddr) {
        login();
        return;
      }
      if (!isLoginFarcaster) {
        openFarcasterQR();
        return;
      }

      // pledge degen
      const { totalReward } = values;
      const txHash = await pledgeDegenToU3(totalReward);
      if (!txHash) {
        toast.error('pledge degen failed');
        return;
      }
      console.log(txHash, totalReward);

      // TODO create frame

      // store frame
      storeUnpublishedFrame(values, frameUrl);
      setStep(Steps.POST_FRAME);
    },
    [isLogin, isLoginFarcaster, openFarcasterQR, frameUrl, accountAddr]
  );

  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      zIndex={40}
      contentTop="40%"
    >
      <div className="w-[600px] inline-flex p-[20px] box-border flex-col justify-center items-start gap-[20px]">
        <div className="flex justify-between items-center self-stretch">
          <span className="text-[#718096] text-[14px] font-medium">
            Red Envelope
          </span>
          <ModalCloseBtn onClick={closeModal} />
        </div>
        {step === Steps.POST_FRAME ? (
          <PostFrameForm
            frameUrl={frameUrl}
            frameData={frameFormValues}
            onSuccess={() => {
              removeStoredUnpublishedFrame();
            }}
            onBack={() => {
              setStep(Steps.CREATE_FRAME);
            }}
          />
        ) : (
          <>
            <CreateFrameForm
              disabled={!!frameUrl}
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
    </ModalContainer>
  );
}
