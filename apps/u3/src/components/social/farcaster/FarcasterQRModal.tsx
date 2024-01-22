import QRCode from 'react-qr-code';

import { ModalCloseBtn, ModalTitle } from '../../common/modal/ModalWidgets';
import ModalContainerFixed from '@/components/common/modal/ModalContainerFixed';
import { cn } from '@/lib/utils';

type Token = {
  token: string;
  deepLink: string;
};

export default function FarcasterQRModal({
  open,
  token,
  closeModal,
  afterCloseAction,
  showQR,
  warpcastErr,
  deepLinkUrl,
}: {
  warpcastErr: string;
  token: Token;
  open: boolean;
  showQR: boolean;
  deepLinkUrl: string;
  closeModal: () => void;
  afterCloseAction: () => void;
}) {
  return (
    <ModalContainerFixed
      open={open}
      closeModal={closeModal}
      afterCloseAction={afterCloseAction}
      id="farcaster-qr-modal"
      className={cn(
        'top-[100px] md:w-[480px] w-full mb-2 box-border overflow-hidden'
      )}
    >
      <div className="flex flex-col w-full p-6 md:w-[480px] gap-7">
        <div className="flex justify-between items-center">
          <div className="font-bold text-white">Login with mobile</div>
          <ModalCloseBtn onClick={closeModal} />
        </div>
        {(warpcastErr && (
          <div className="text-white font-normal text-base">
            {warpcastErr}
            <p>please try again in a few minutes</p>
          </div>
        )) || (
          <div className="flex md:flex-row flex-col w-full gap-7">
            <div>
              <div className="text-[#718096] text-base">
                Scan the QR code with the camera app on your device with
                Warpcast installed.
              </div>
              <a
                href="https://warpcast.com/~/download"
                target="blank"
                className={cn(
                  'text-base text-transparent',
                  'bg-gradient-to-r from-[#cd62ff] to-[#62aaff]',
                  'bg-clip-text'
                )}
              >
                Download Warpcast
              </a>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              {(showQR && <QRCode value={token.deepLink} />) || (
                <div className="text-[#718096] text-base">
                  Loading QR code...
                </div>
              )}
              {showQR && deepLinkUrl && (
                <div>
                  <span className="pt-4 text-gray-500">
                    On mobile?{' '}
                    <a
                      rel="noreferrer"
                      className="underline"
                      href={deepLinkUrl}
                      target={'_blank'}
                    >
                      Open in Warpcast
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ModalContainerFixed>
  );
}
