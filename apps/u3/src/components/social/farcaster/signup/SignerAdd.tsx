import { useEffect, useState } from 'react';
import { NobleEd25519Signer } from '@farcaster/hub-web';

import { SignedKeyRequestMetadataABI } from 'src/abi/farcaster/SignedKeyRequestMetadataABI';
// import { useFarcaster } from "../providers/FarcasterProvider";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
  useWaitForTransaction,
} from 'wagmi';
import { KeyRegistryABI } from 'src/abi/farcaster/KeyRegistryABI';
import * as ed from '@noble/ed25519';
import { encodeAbiParameters } from 'viem';
import { toast } from 'react-toastify';
import {
  StepsBox,
  StyledData,
  StyledDescription,
  StyledOps,
  StyledTitle,
} from './Steps';
// import * as viem from "viem";

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10, // mainnet
  verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553', // mainnet
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
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
      signature,
      deadline: BigInt(deadline),
    },
  ]);

  return encodedData;
}

export default function SignerAdd({
  fid,
  signer,
  setSigner,
}: {
  fid: number;
  signer: NobleEd25519Signer | null;
  setSigner: (s: NobleEd25519Signer | null) => void;
}) {
  //   const { fid, signer, setSigner } = useFarcaster();
  const { address } = useAccount();

  const [addSignerTxHash, setAddSignerTxHash] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>();
  const [publicKey, setPublicKey] = useState<`0x${string}` | undefined>();
  const [metadata, setMetadata] = useState<`0x${string}` | undefined>();
  const [deadline, setDeadline] = useState<number>(0);

  const {
    data,
    isLoading,
    isSuccess: isSuccessSign,
    signTypedData,
  } = useSignTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: 'SignedKeyRequest',
    message: {
      requestFid: BigInt(fid),
      key: publicKey,
      deadline: BigInt(deadline),
    },
  } as any);

  const {
    config,
    isSuccess: isSuccessPrepare,
    isError: isErrorPrepareContractWrite,
    error: errorPrepareContractWrite,
  } = usePrepareContractWrite({
    address: '0x00000000fC9e66f1c6d86D750B4af47fF0Cc343d', // mainnet
    // address: '0x34A6F04B474eB64d9a82017a01acbe5A58A0F541', // testnet
    abi: KeyRegistryABI,
    functionName: 'add',
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

  const addSigner = () => {
    signTypedData();
  };

  const generateKeyPair = async () => {
    const edPrivateKey = ed.utils.randomPrivateKey();
    const publicKeyBytes = await ed.getPublicKeyAsync(edPrivateKey);
    const edPublicKey = `0x${Buffer.from(publicKeyBytes).toString('hex')}`;
    setPrivateKey(edPrivateKey);
    setPublicKey(edPublicKey as `0x${string}`);
  };

  useEffect(() => {
    if (publicKey === undefined && privateKey === undefined) {
      generateKeyPair();
    }
    if (deadline === 0) {
      const oneHour = 60 * 60;
      const dl = Math.floor(Date.now() / 1000) + oneHour;
      setDeadline(dl);
    }
  }, []);

  useEffect(() => {
    if (isSuccessSign) {
      if (address === undefined) {
        toast.error('Error signing data');
        return;
      }
      if (data === undefined) {
        toast.error('Error signing data');
        return;
      }
      const mdata = encodeMetadata(fid, address, data, deadline);
      setMetadata(mdata);
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

      localStorage.setItem(signerPublicKeyLocalStorageKey, publicKey);
      localStorage.setItem(
        signerPrivateKeyLocalStorageKey,
        ed.etc.bytesToHex(privateKey)
      );

      const ed25519Signer = new NobleEd25519Signer(privateKey);
      setSigner(ed25519Signer);
      toast.success('Signer added');
    }
  }, [isLoadingTx, isSuccessTx]);

  useEffect(() => {
    if (txData) {
      setAddSignerTxHash(txData.hash);
    }
  }, [txData]);

  return (
    <StepsBox>
      <StyledTitle checked={!!fid && !!signer} text={'Step 2'} />
      <StyledDescription>Add a signer</StyledDescription>
      <hr />
      {(fid && signer && (
        <StyledData>
          <p>Signer added</p>
        </StyledData>
      )) || (
        <StyledData>
          <p>
            A signer is a key pair that lets you create new message or “casts”
          </p>
          <StyledOps>
            <span />
            {isLoading ? (
              <button type="button">Registering...</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addSigner();
                }}
              >
                Add
              </button>
            )}
          </StyledOps>
        </StyledData>
      )}
    </StepsBox>
  );
}
