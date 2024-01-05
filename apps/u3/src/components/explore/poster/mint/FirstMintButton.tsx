import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import useCreate1155Token from '@/hooks/poster/useCreate1155Token';
import { storeNFT } from '@/services/shared/api/nftStorage';
import ColorButton from '@/components/common/button/ColorButton';

const getCasterMetadata = ({ img }: { img: string }) => {
  return {
    name: 'U3 Caster',
    description: 'u3 caster description',
    external_url: 'https://u3.xyz?nft_link=caster',
    properties: {
      imageOriginUrl: img,
      url: 'https://u3.xyz?nft_link=caster',
    },
  };
};

type FirstMintButtonProps = ComponentPropsWithRef<'button'> & {
  img: string;
  onSuccess?: (tokenId: number) => void;
};
export default function FirstMintButton({
  img,
  onSuccess,
  ...props
}: FirstMintButtonProps) {
  const metadata = useMemo(() => getCasterMetadata({ img }), [img]);
  const [metadataUri, setMetadataUri] = useState(null);
  const [metadataUploading, setMetadataUploading] = useState(false);
  const { write, isLoading, isSuccess, isError, nextTokenId } =
    useCreate1155Token({
      tokenURI: metadataUri,
    });

  useEffect(() => {
    if (metadataUri && write) {
      write();
    }
  }, [metadataUri, write]);

  useEffect(() => {
    if (isSuccess && nextTokenId) {
      onSuccess?.(Number(nextTokenId as bigint));
    }
  }, [isSuccess, nextTokenId, onSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Mint failed');
    }
  }, [isError]);
  return (
    <ColorButton
      onClick={async () => {
        setMetadataUploading(true);
        try {
          const url: string = await storeNFT(metadata);
          setMetadataUri(url);
        } catch (error) {
          toast.error('Upload metadata failed');
        } finally {
          setMetadataUploading(false);
        }
      }}
      disabled={isLoading || metadataUploading}
      {...props}
    >
      {(() => {
        if (metadataUploading) {
          return 'Metadata Uploading...';
        }
        if (isLoading) {
          return 'First Minting...';
        }
        return 'First Mint';
      })()}
    </ColorButton>
  );
}
