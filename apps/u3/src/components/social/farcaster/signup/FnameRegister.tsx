import { toast } from 'react-toastify';
import { useCallback, useEffect, useState } from 'react';

import { useAccount, useSignTypedData, useSwitchNetwork } from 'wagmi';
import axios from 'axios';
import { NameVerifyContract, OP_CHAIN_ID } from 'src/constants/farcaster';

import {
  StepsBox,
  StyledData,
  StyledDescription,
  StyledOps,
  StyledSpan,
  StyledTitle,
} from './Steps';

const MESSAGE_DOMAIN = {
  name: 'Farcaster name verification',
  version: '1',
  chainId: 1,
  verifyingContract: NameVerifyContract,
} as const;

const MESSAGE_TYPE = {
  UserNameProof: [
    { name: 'name', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'owner', type: 'address' },
  ],
} as const;

export default function FnameRegister({
  fid,
  fname,
  setFname,
  makePrimaryName,
}: {
  fid: number;
  fname: string;
  setFname: (n: string) => void;
  makePrimaryName: (n: string) => Promise<void>;
}) {
  //   const { fid, fname, setFname } = useFarcaster();
  const [name, setName] = useState('');

  const { address } = useAccount();
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
    primaryType: 'UserNameProof',
    message: {
      name,
      timestamp: BigInt(timestamp),
      owner: address,
    },
  } as any);

  const registerFname = useCallback(() => {
    if (name.length === 0) {
      toast.error("fname can't be empty");
      return;
    }
    if (isError) {
      toast.error(`Error registering fname:${errorSign?.message}`);
      return;
    }
    setTimestamp(Math.floor(Date.now() / 1000));

    setIsLoading(true);
    switchNetwork?.(1);
  }, [name]);

  useEffect(() => {
    if (isSuccessSign) {
      axios
        .post('https://fnames.farcaster.xyz/transfers', {
          name, // Name to register
          from: 0, // Fid to transfer from (0 for a new registration)
          to: fid, // Fid to transfer to (0 to unregister)
          fid, // Fid making the request (must match from or to)
          owner: address, // Custody address of fid making the request
          timestamp, // Current timestamp in seconds
          signature, // EIP-712 signature signed by the custody address of the fid
        })
        .then((response) => {
          toast.success('Fname registered!');
          console.log(response.data);
          makePrimaryName(name);
          setFname(name);
        })
        .catch((error) => {
          toast.error(`Failed to register fname: ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
          switchNetwork?.(OP_CHAIN_ID); // mainnet
        });
    }
  }, [isSuccessSign, name]);

  useEffect(() => {
    if (isSuccessSwitch && pendingChainId === 1) {
      signTypedData?.();
    }
  }, [isSuccessSwitch]);

  return (
    <StepsBox>
      <StyledTitle checked={!!fid && !!fname} text={'Step 4'} />
      <StyledDescription>Register an fname</StyledDescription>
      <hr />

      {(fid && fname && (
        <StyledData>
          <div>
            <p>Your Fname is:</p>
            <StyledSpan>{fname}</StyledSpan>
          </div>
        </StyledData>
      )) || (
        <StyledData>
          <p>Acquire a free offchain ENS username issued by Farcster.</p>
          <StyledOps className="register">
            <input
              type="text"
              placeholder="fname"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {isLoading ? (
              <button type="button">Registering...</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  registerFname();
                }}
              >
                Register
              </button>
            )}
          </StyledOps>
        </StyledData>
      )}
    </StepsBox>
  );
}
