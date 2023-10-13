import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { IdRegistryABI } from "../abi/IdRegistryABI";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import axios from "axios";

type FcasterContextType = {
  fid: number;
  setFid: React.Dispatch<React.SetStateAction<number>>;
  fname: string;
  setFname: React.Dispatch<React.SetStateAction<string>>;
};

const FarcasterContext = createContext<FcasterContextType | null>(null);

export const FarcasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fid, setFid] = useState<number>(0);
  const [fname, setFname] = useState<string>("");
  const [hasStorage, setHasStorage] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: idOf } = useContractRead({
    address: "0x00000000FcAf86937e41bA038B4fA40BAA4B780A",
    abi: IdRegistryABI,
    functionName: "idOf",
    args: [address],
    enabled: Boolean(address),
    chainId: 10,
  });

  const signerCheck = useCallback(async () => {
    if (!fid) return;
  }, [fid]);

  const fnameCheck = useCallback(async () => {
    if (!fid) return;
    try {
      const resp = await axios.get(
        `https://fnames.farcaster.xyz/transfers?fid=${fid}`
      );
      if (resp.data.transfers.length > 0) {
        setFname(resp.data.transfers[0].username);
      }
    } catch (error) {
      console.log(error);
    }
  }, [fid]);

  const storageCheck = useCallback(async () => {
    if (!fid) return;
    try {
      // TODO: self hosted hub
      const resp = await axios.get(
        `http://nemes.farcaster.xyz:2281/v1/storageLimitsByFid?fid=${fid}`
      );
      // console.log(resp.data);
      if (resp.data.limit.length > 0) {
        setHasStorage(Boolean(resp.data.limits[0].limit)); // mainnet
      }
    } catch (error) {
      console.log(error);
    }
  }, [fid]);

  useEffect(() => {
    signerCheck();
    fnameCheck();
    storageCheck();
  }, [signerCheck, fnameCheck, storageCheck]);

  useEffect(() => {
    console.log("Your FID is: " + idOf);
    if (idOf) {
      setFid(Number(idOf));
    } else if (chain?.id !== 1) {
      setFid(0);
    }
  }, [chain?.id, idOf]);

  return (
    <FarcasterContext.Provider value={{ fid, setFid, fname, setFname }}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFarcaster = () => {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error("useFid must be used within a FidProvider");
  }
  return context;
};
