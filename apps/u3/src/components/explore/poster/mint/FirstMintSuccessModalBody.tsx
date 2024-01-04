import { toast } from 'react-toastify';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import TokenShare from './TokenShare';
import {
  casterZora1155ToMintAddress,
  casterZoraChainId,
} from '@/constants/zora';
import { getZoraMintLink } from '@/utils/shared/zora';
import CopyIcon from '@/components/common/icons/CopyIcon';

type Props = {
  img: string;
  tokenId: number;
  referrerAddress: string;
  closeModal: () => void;
};

export default function FirstMintSuccessModalBody({
  img,
  tokenId,
  referrerAddress,
  closeModal,
}: Props) {
  const mintLink = getZoraMintLink({
    chainId: casterZoraChainId,
    mintAddress: casterZora1155ToMintAddress,
    tokenId,
    referrerAddress,
  });
  return (
    <div className="w-[310px] flex flex-col gap-[20px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[#FFF] text-[24px] font-bold leading-none">
          Minted - U3 Caster
        </h1>
        <ModalCloseBtn onClick={closeModal} />
      </div>
      <img src={img} alt="" className="w-full object-cover" />
      <TokenShare mintLink={mintLink} />
      <div className="flex gap-[10px] items-center py-[15px] px-[20px] rounded-[10px] border-[1px] border-solid border-[#39424C] bg-[#14171A]">
        <span className="flex-1 text-[16px] text-[#718096] line-clamp-1">
          {mintLink}
        </span>
        <div
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(mintLink);
            toast.success('Copied to clipboard');
          }}
        >
          <CopyIcon />
        </div>
      </div>
    </div>
  );
}
