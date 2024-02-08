import { useEffect, useState } from 'react';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import CreateFrameForm, {
  FrameFormValues,
  defaultFrameFormValues,
} from './CreateFrameForm';
import PostFrameForm from './PostFrameForm';
import useLogin from '@/hooks/shared/useLogin';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

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

  const submitFrame = (values: FrameFormValues) => {
    if (!isLogin) {
      login();
      return;
    }
    if (!isLoginFarcaster) {
      openFarcasterQR();
      return;
    }

    // TODO @ttang pledge degen
    const { totalReward } = values;

    // TODO create frame

    // store frame
    storeUnpublishedFrame(values, frameUrl);
    setStep(Steps.POST_FRAME);
  };

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
