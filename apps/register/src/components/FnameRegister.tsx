import styled from "styled-components";
import { useFarcaster } from "../providers/FarcasterProvider";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useSignTypedData, useSwitchNetwork } from "wagmi";
import axios from "axios";
import MakeFnamePrimary from "./MakeFnamePrimary";

const MESSAGE_DOMAIN = {
  name: "Farcaster name verification",
  version: "1",
  chainId: 1,
  verifyingContract: "0xe3be01d99baa8db9905b33a3ca391238234b79d1",
} as const;

const MESSAGE_TYPE = {
  UserNameProof: [
    { name: "name", type: "string" },
    { name: "timestamp", type: "uint256" },
    { name: "owner", type: "address" },
  ],
} as const;

export default function FnameRegister() {
  const { fid, fname, setFname } = useFarcaster();
  const [name, setName] = useState("");

  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [timestamp, setTimestamp] = useState<number>(0);
  const {
    isSuccess: isSuccessSwitch,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork();

  const {
    data: signature,
    isError,
    error: errorSign,
    isSuccess: isSuccessSign,
    signTypedData,
  } = useSignTypedData({
    domain: MESSAGE_DOMAIN,
    types: MESSAGE_TYPE,
    primaryType: "UserNameProof",
    message: {
      name: name,
      timestamp: BigInt(timestamp),
      owner: address as `0x${string}`,
    },
  });

  const registerFname = useCallback(async () => {
    if (name.length === 0) {
      toast.error("fname can't be empty");
      return;
    }
    if (isError) {
      toast.error("Error registering fname", {
        description: errorSign?.message,
      });
      return;
    }
    setTimestamp(Math.floor(Date.now() / 1000));

    setIsLoading(true);
    switchNetwork?.(1);
  }, [name]);

  useEffect(() => {
    if (isSuccessSign) {
      axios
        .post("https://fnames.farcaster.xyz/transfers", {
          name: name, // Name to register
          from: 0, // Fid to transfer from (0 for a new registration)
          to: fid, // Fid to transfer to (0 to unregister)
          fid: fid, // Fid making the request (must match from or to)
          owner: address, // Custody address of fid making the request
          timestamp: timestamp, // Current timestamp in seconds
          signature: signature, // EIP-712 signature signed by the custody address of the fid
        })
        .then((response) => {
          toast.success("Fname registered!");
          console.log(response.data);
          // setFnameAsPrimary();
          setFname(name);
        })
        .catch((error) => {
          toast.error("Failed to register fname", {
            description: error.response.data.code,
          });
        })
        .finally(() => {
          setIsLoading(false);
          switchNetwork?.(10); // mainnet
        });
    }
  }, [isSuccessSign, name]);

  useEffect(() => {
    if (isSuccessSwitch && pendingChainId === 1) {
      signTypedData?.();
    }
  }, [isSuccessSwitch]);

  if (!fid) return null;

  if (fname) {
    return (
      <RegisterContainer>
        <p>Your Fname is: {fname}</p>
        <MakeFnamePrimary />
      </RegisterContainer>
    );
  }
  return (
    <RegisterContainer>
      <input
        type="text"
        placeholder="register your fname"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      {isLoading ? (
        <button>Registering...</button>
      ) : (
        <button
          onClick={() => {
            registerFname();
          }}
        >
          Register
        </button>
      )}
    </RegisterContainer>
  );
}

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
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

  input {
    flex-grow: 1;
    background: #1a1e23;
    outline: none;
    border: 1px solid #39424c;
    border-radius: 12px;
    height: 48px;
    padding: 0px 16px;
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
`;
