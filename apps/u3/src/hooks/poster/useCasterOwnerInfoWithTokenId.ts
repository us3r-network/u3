import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import {
  casterZora1155ToMintAddress,
  casterZoraNetwork,
  ZoraCreator1155ImplAbi,
} from '../../constants/zora';

const publicClient = createPublicClient({
  chain: casterZoraNetwork,
  transport: http(),
});

export default function useCasterOwnerInfoWithTokenId({
  tokenId,
  ownerAddress,
}: {
  tokenId: number;
  ownerAddress: string;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isMintedLoading, setIsMintedLoading] = useState(false);

  useEffect(() => {
    const readIsAdmin = async () => {
      const contractBaseId = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'CONTRACT_BASE_ID',
      });

      const permissionBitAdmin = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'PERMISSION_BIT_ADMIN',
      });

      const res = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'isAdminOrRole',
        args: [ownerAddress, contractBaseId, permissionBitAdmin],
      });
      setIsAdmin(res as boolean);
    };
    if (ownerAddress) {
      readIsAdmin();
    }
  }, [ownerAddress]);

  useEffect(() => {
    const readIsMinted = async () => {
      try {
        setIsMintedLoading(true);
        const res = await publicClient.readContract({
          address: casterZora1155ToMintAddress,
          abi: ZoraCreator1155ImplAbi,
          functionName: 'balanceOf',
          args: [ownerAddress, tokenId],
        });
        const minted = res && Number(res) === 1;
        setIsMinted(minted);
      } catch (error) {
        console.error(error);
      } finally {
        setIsMintedLoading(false);
      }
    };
    if (tokenId && ownerAddress) {
      readIsMinted();
    }
  }, [ownerAddress, tokenId]);

  return {
    isAdmin,
    isMinted,
    isMintedLoading,
  };
}
