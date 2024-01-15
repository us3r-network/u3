import { ComponentPropsWithRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ColorButton from '@/components/common/button/ColorButton';
import useMint from '@/hooks/poster/useMint';

type FreeMintButtonProps = ComponentPropsWithRef<'button'> & {
  tokenId: number;
  isFirstMint: boolean;
  onSuccess?: (tokenId: number) => void;
};
export default function FreeMintButton({
  tokenId,
  isFirstMint,
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
          if (isFirstMint) {
            return 'First Minting...';
          }
          return 'Free Minting...';
        }
        if (isFirstMint) {
          return 'First Mint';
        }
        return 'Free Mint';
      })()}
    </ColorButton>
  );
}
