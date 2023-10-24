import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
  useWaitForTransaction,
} from 'wagmi';

import { useEffect, useState } from 'react';

// import { useFarcaster } from 'src/providers/FarcasterProvider';
import { StorageRegistryABI } from 'src/abi/farcaster/StorageRegistryABI';
import { toast } from 'react-toastify';
import {
  StepsBox,
  StyledData,
  StyledDescription,
  StyledOps,
  StyledTitle,
} from './Steps';

export default function RentStorage({
  fid,
  hasStorage,
  setHasStorage,
}: {
  fid: number;
  hasStorage: boolean;
  setHasStorage: (h: boolean) => void;
}) {
  const { isConnected } = useAccount();
  const [price, setPrice] = useState<number>(0);

  const {
    data: unitPrice,
    isError: isErrorPriceRead,
    error: errorPriceRead,
  } = useContractRead({
    address: '0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d', // mainnet

    abi: StorageRegistryABI,
    functionName: 'unitPrice',
  });

  const {
    config,
    isError: isErrorWrite,
    error: errorWrite,
  } = usePrepareContractWrite({
    address: '0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d', // mainnet

    abi: StorageRegistryABI,
    functionName: 'rent',
    args: [fid, 1],
    value: BigInt(price),
    enabled: Boolean(price),
  });
  const { data: rentTxHash, write } = useContractWrite(config);

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    // chainId: 420, // testnet
    hash: rentTxHash?.hash,
  });

  const rentStorageUnit = () => {
    if (isErrorPriceRead) {
      toast.error(`Cannot rent a storage unit:${errorPriceRead?.message}`);
      return;
    }
    if (isErrorWrite) {
      toast.error(`Cannot rent a storage unit:${errorWrite?.message}`);
      return;
    }

    write?.();
  };

  useEffect(() => {
    if (unitPrice) {
      setPrice(Math.floor(Number(unitPrice) * 1.1));
    }
  }, [unitPrice]);

  useEffect(() => {
    if (isSuccess && !hasStorage) {
      toast.success(`Storage unit rented!`);
      setHasStorage(true);
    }
  }, [isSuccess]);

  return (
    <StepsBox>
      <StyledTitle checked={!!fid && hasStorage} text={'Step 3'} />
      <StyledDescription>Rent storage</StyledDescription>
      <hr />
      {(fid && hasStorage && (
        <StyledData>
          <p>Renting successful</p>
        </StyledData>
      )) || (
        <StyledData>
          <p>Renting to store casts</p>
          <StyledOps>
            <span />
            {isLoading ? (
              <button type="button">Registering...</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  rentStorageUnit();
                }}
              >
                Rent
              </button>
            )}
          </StyledOps>
        </StyledData>
      )}
    </StepsBox>
  );
}
