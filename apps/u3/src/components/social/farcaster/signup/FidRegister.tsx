import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { IdRegistryABI } from 'src/abi/farcaster/IdRegistryABI';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { shortAddress } from 'src/utils/xmtp';
import {
  StepsBox,
  StyledData,
  StyledDescription,
  StyledOps,
  StyledSpan,
  StyledTitle,
} from './Steps';

export default function FidRegister({
  fid,
  setFid,
}: {
  fid: number;
  setFid: (fid: number) => void;
}) {
  const { address } = useAccount();

  const { config, isError, error } = usePrepareContractWrite({
    address: '0x00000000FcAf86937e41bA038B4fA40BAA4B780A',
    abi: IdRegistryABI,
    functionName: 'register',
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

  const registerFid = () => {
    if (isError) {
      toast.error(`Error registering FID: ${error?.message}`);
    } else {
      write?.();
    }
  };

  useEffect(() => {
    if (isSuccessTx && fid === 0) {
      const newFid = parseInt((txFid?.logs[0] as any).topics[2] as string, 16);
      setFid(newFid);
      toast.success(`FID ${newFid} registered!`);
    }
  }, [fid, isSuccessTx, setFid, txFid?.logs]);

  return (
    <StepsBox>
      <StyledTitle checked={!!fid} text={'Step 1'} />
      <StyledDescription>Register a new Farcaster ID</StyledDescription>
      <hr />
      {(fid && (
        <StyledData>
          <div>
            <p>Your FID is:</p>
            <StyledSpan>{fid}</StyledSpan>
          </div>
        </StyledData>
      )) || (
        <StyledData>
          <p>
            Register a new Farcaster ID with{' '}
            <StyledSpan>{shortAddress(address)}</StyledSpan>
          </p>
          <StyledOps>
            <span />
            {isLoading ? (
              <button type="button">Registering...</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  registerFid();
                }}
              >
                Register Now
              </button>
            )}
          </StyledOps>
        </StyledData>
      )}
    </StepsBox>
  );
}
