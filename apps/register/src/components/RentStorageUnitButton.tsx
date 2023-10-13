import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
  useWaitForTransaction,
} from "wagmi";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useFarcaster } from "../providers/FarcasterProvider";
import { StorageRegistryABI } from "../abi/StorageRegistryABI";
import styled from "styled-components";

export default function RentStorageUnitButton() {
  const { fid, hasStorage, setHasStorage } = useFarcaster();
  const { isConnected } = useAccount();
  const [price, setPrice] = useState<number>(0);

  const {
    data: unitPrice,
    isError: isErrorPriceRead,
    error: errorPriceRead,
  } = useContractRead({
    address: "0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d", // mainnet

    abi: StorageRegistryABI,
    functionName: "unitPrice",
  });

  const {
    config,
    isError: isErrorWrite,
    error: errorWrite,
  } = usePrepareContractWrite({
    address: "0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d", // mainnet

    abi: StorageRegistryABI,
    functionName: "rent",
    args: [fid, 1],
    value: BigInt(price),
    enabled: Boolean(price),
  });
  const { data: rentTxHash, write } = useContractWrite(config);

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    // chainId: 420, // testnet
    hash: rentTxHash?.hash,
  });

  const rentStorageUnit = async () => {
    if (isErrorPriceRead) {
      toast.error("Cannot rent a storage unit", {
        description: errorPriceRead?.message,
      });
      return;
    }
    if (isErrorWrite) {
      toast.error("Cannot rent a storage unit", {
        description: errorWrite?.message,
      });
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

  // useEffect(() => {
  //   if (!!rentTxHash) {
  //     setRentTxHash(rentTxHash.hash);
  //   }
  // }, [rentTxHash]);

  if (!fid) return null;

  if (hasStorage) {
    return <p>hasStorage</p>;
  }

  return (
    <RegisterContainer>
      <button onClick={() => rentStorageUnit()} type="button">
        Rent
      </button>
    </RegisterContainer>
  );
}

const RegisterContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ffffff;
  button {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;

    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    border: 1px solid #39424c;
    border-radius: 12px;
    padding: 10px;
  }
`;
