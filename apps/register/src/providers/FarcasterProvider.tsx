import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { IdRegistryABI } from "../abi/IdRegistryABI";
import { useAccount, useContractRead, useNetwork } from "wagmi";

type FcasterContextType = {
  fid: number;
  setFid: React.Dispatch<React.SetStateAction<number>>;
};

const FarcasterContext = createContext<FcasterContextType | null>(null);

export const FarcasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fid, setFid] = useState<number>(0);
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

  useEffect(() => {
    console.log("Your FID is: " + idOf);
    if (idOf) {
      setFid(Number(idOf));
    } else if (chain?.id !== 1) {
      setFid(0);
    }
  }, [chain?.id, idOf]);

  return (
    <FarcasterContext.Provider value={{ fid, setFid }}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFid = () => {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error("useFid must be used within a FidProvider");
  }
  return context;
};
