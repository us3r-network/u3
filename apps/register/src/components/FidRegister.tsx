import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import styled from "styled-components";
import { IdRegistryABI } from "../abi/IdRegistryABI";
import { toast } from "sonner";
import { useEffect } from "react";
import { useFid } from "../providers/FarcasterProvider";

export default function FidRegister() {
  const { fid, setFid } = useFid();
  const { address, isConnected } = useAccount();

  const { config, isError, error } = usePrepareContractWrite({
    address: "0x00000000FcAf86937e41bA038B4fA40BAA4B780A",
    abi: IdRegistryABI,
    functionName: "register",
    args: [address],
    enabled: Boolean(address),
  });
  const { data: registerFidTxHash, write } = useContractWrite(config);
  const {
    data: txFid,
    isLoading,
    isSuccess: isSuccessTx,
  } = useWaitForTransaction({
    hash: registerFidTxHash?.hash,
  });

  const registerFid = async () => {
    if (isError) {
      toast.error("Error registering FID", { description: error?.message });
    } else {
      write?.();
    }
  };

  useEffect(() => {
    if (isSuccessTx && fid === 0) {
      const newFid = parseInt(txFid?.logs[0].topics[2] as string, 16);
      setFid(newFid);
      toast.success(`FID ${newFid} registered!`);
    }
  }, [fid, isSuccessTx, setFid, txFid?.logs]);

  if (fid) {
    return <p>Your FID is: {fid}</p>;
  }

  return (
    <RegisterBtnContainer>
      <span>Current wallet is valid to register farcaster</span>
      {isLoading ? (
        <button>Registering...</button>
      ) : (
        <button
          onClick={() => {
            registerFid();
          }}
        >
          Register Now
        </button>
      )}
    </RegisterBtnContainer>
  );
}

const RegisterBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

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
