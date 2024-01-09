import { ComponentPropsWithRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ColorButton from '@/components/common/button/ColorButton';
import useMint from '@/hooks/poster/useMint';

type FreeMintButtonProps = ComponentPropsWithRef<'button'> & {
  tokenId: number;
  onSuccess?: (tokenId: number) => void;
};
export default function FreeMintButton({
  tokenId,
  onSuccess,
  ...props
}: FreeMintButtonProps) {
  const { address } = useAccount();
  const { write, isLoading, isSuccess, isError } = useMint({
    tokenId,
    owner: address,
  });

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.(tokenId);
    }
  }, [isSuccess, tokenId, onSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Mint failed');
    }
  }, [isError]);
  return (
    <ColorButton
      onClick={() => {
        write?.();
      }}
      disabled={isLoading}
      {...props}
    >
      {(() => {
        if (isLoading) {
          return 'Free Minting...';
        }
        return 'Free Mint';
      })()}
    </ColorButton>
  );
}
