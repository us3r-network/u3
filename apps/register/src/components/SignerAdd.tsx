import { useEffect, useRef, useState } from "react";
import { NobleEd25519Signer } from "@farcaster/hub-web";

import { SignedKeyRequestMetadataABI } from "../abi/SignedKeyRequestMetadataABI";
import { useFarcaster } from "../providers/FarcasterProvider";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
  useWaitForTransaction,
} from "wagmi";
import { KeyRegistryABI } from "../abi/KeyRegistryABI";
import * as ed from "@noble/ed25519";
import { toast } from "sonner";
import styled from "styled-components";
// import * as viem from "viem";

const { encodeAbiParameters } = require("viem");

const U3_ORIGIN = process.env.REACT_APP_U3_ORIGIN || "https://dev.u3.xyz";

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10, // mainnet
  // chainId: 420, // testnet
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553", // mainnet
  // verifyingContract: "0xd4d096D6Cfbab085e97e0011bEd6001DBb90D050", // testnet
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

function encodeMetadata(
  fid: number,
  address: string,
  signature: string,
  deadline: number
) {
  const encodedData = encodeAbiParameters(SignedKeyRequestMetadataABI.inputs, [
    {
      requestFid: BigInt(fid),
      requestSigner: address,
      signature: signature,
      deadline: BigInt(deadline),
    },
  ]);

  return encodedData;
}

export default function SignerAdd() {
  const { fid, signer, setSigner, hasStorage } = useFarcaster();
  const { address } = useAccount();
  const iRef = useRef<HTMLIFrameElement | null>(null);

  const [addSignerTxHash, setAddSignerTxHash] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>();
  const [publicKey, setPublicKey] = useState<`0x${string}` | undefined>();
  const [metadata, setMetadata] = useState<`0x${string}` | undefined>();
  const [deadline, setDeadline] = useState<number>(0);

  const {
    data,
    isLoading: isLoadingSign,
    isSuccess: isSuccessSign,
    signTypedData,
  } = useSignTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(fid),
      key: publicKey as `0x${string}`,
      deadline: BigInt(deadline),
    },
  });

  const {
    config,
    isSuccess: isSuccessPrepare,
    isError: isErrorPrepareContractWrite,
    error: errorPrepareContractWrite,
  } = usePrepareContractWrite({
    address: "0x00000000fC9e66f1c6d86D750B4af47fF0Cc343d", // mainnet
    // address: '0x34A6F04B474eB64d9a82017a01acbe5A58A0F541', // testnet
    abi: KeyRegistryABI,
    functionName: "add",
    args: [1, publicKey, 1, metadata],
    enabled: Boolean(metadata),
  });

  const {
    data: txData,
    isError: isErrorContractWrite,
    error: errorContractWrite,
    write: writeAddSigner,
  } = useContractWrite(config);

  const { isLoading: isLoadingTx, isSuccess: isSuccessTx } =
    useWaitForTransaction({
      hash: txData?.hash,
    });

  const addSigner = async () => {
    signTypedData();
  };

  const generateKeyPair = async () => {
    const privateKey = ed.utils.randomPrivateKey();
    const publicKeyBytes = await ed.getPublicKeyAsync(privateKey);
    const publicKey = `0x${Buffer.from(publicKeyBytes).toString("hex")}`;
    setPrivateKey(privateKey);
    setPublicKey(publicKey as `0x${string}`);
  };

  useEffect(() => {
    if (publicKey === undefined && privateKey === undefined) {
      generateKeyPair();
    }
    if (deadline === 0) {
      const oneHour = 60 * 60;
      const deadline = Math.floor(Date.now() / 1000) + oneHour;
      setDeadline(deadline);
    }
  }, []);

  useEffect(() => {
    if (isSuccessSign) {
      if (address === undefined) {
        toast.error("Error signing data");
        return;
      }
      if (data === undefined) {
        toast.error("Error signing data");
        return;
      }
      const metadata = encodeMetadata(fid, address, data, deadline);
      setMetadata(metadata);
    }
  }, [data]);

  useEffect(() => {
    // This will trigger the tx signing prompt once the tx is prepared and simulated by wagmi
    if (isSuccessPrepare && !!metadata && !!deadline && !signer) {
      // this may be buggy: isSuccessPrepare can trigger randomly in wrong moments
      // but at least we have a check that it wont once we have a signer
      writeAddSigner?.();
    }
  }, [isSuccessPrepare]);

  useEffect(() => {
    if (!signer) {
      if (isErrorPrepareContractWrite) {
        toast.error(errorPrepareContractWrite?.message);
      }
      if (isErrorContractWrite) {
        toast.error(errorContractWrite?.message);
      }
    }
  }, [isErrorPrepareContractWrite, isErrorContractWrite]);

  useEffect(() => {
    const signerPublicKeyLocalStorageKey = `signerPublicKey-${fid}`;
    const signerPrivateKeyLocalStorageKey = `signerPrivateKey-${fid}`;
    console.log({ isLoadingTx, isSuccessTx });
    if (isLoadingTx) {
      console.log(`https://optimistic.etherscan.io/tx/${txData?.hash}`);
    }

    if (isSuccessTx === true) {
      if (
        localStorage.getItem(signerPublicKeyLocalStorageKey) !== null &&
        localStorage.getItem(signerPrivateKeyLocalStorageKey) !== null
      ) {
        return;
      }

      localStorage.setItem(
        signerPublicKeyLocalStorageKey,
        publicKey as `0x${string}`
      );
      localStorage.setItem(
        signerPrivateKeyLocalStorageKey,
        ed.etc.bytesToHex(privateKey as Uint8Array)
      );

      const ed25519Signer = new NobleEd25519Signer(privateKey as Uint8Array);
      setSigner(ed25519Signer);
      toast.success("Signer added");
    }
  }, [isLoadingTx, isSuccessTx]);

  useEffect(() => {
    const messageHandler = (e: MessageEvent<any>) => {
      if (e.data?.type !== "FARCATER_WALLET_SIGNER_RESULT") return;
      if (e.data?.success)
        toast.success(
          `signer add success to ${U3_ORIGIN}, now you can post cast in ${U3_ORIGIN}`
        );
      else toast.success(`signer add fail to ${U3_ORIGIN}`);
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    if (!!txData) {
      setAddSignerTxHash(txData.hash);
    }
  }, [txData]);

  if (!fid) {
    return null;
  }
  if (signer) {
    return (
      <RegisterSignerContainer>
        <div>
          <p>Signer added (Signer manage coming soon)</p>

          {hasStorage && (
            <>
              <iframe
                id="wallet-iframe"
                title="wallet"
                src={`${U3_ORIGIN}/wallet.html`}
                frameBorder="0"
                width={0}
                height={0}
                ref={iRef}
              ></iframe>

              <button
                onClick={() => {
                  iRef.current?.contentWindow?.postMessage(
                    {
                      fid: fid,
                      privateKey: ed.etc.bytesToHex(privateKey as Uint8Array),
                      publicKey,
                      type: "SET_FARCATER_WALLET_SIGNER",
                    },
                    U3_ORIGIN || "http://localhost"
                  );
                }}
              >
                Make Signer Valid in {U3_ORIGIN}
              </button>

              <button
                onClick={() => {
                  window.open(`${U3_ORIGIN}`, "_blank");
                }}
              >
                Start Exploring from U3
              </button>
            </>
          )}
        </div>
      </RegisterSignerContainer>
    );
  }
  return (
    <RegisterSignerContainer>
      <button
        onClick={() => {
          // registerFid();
          addSigner();
        }}
      >
        Add Signer
      </button>
    </RegisterSignerContainer>
  );
}

const RegisterSignerContainer = styled.div`
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
