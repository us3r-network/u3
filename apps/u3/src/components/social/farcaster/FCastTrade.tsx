import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useMemo, useState } from 'react';
// import {
//   useAccount,
//   useClient,
//   useConnect,
//   useDisconnect,
//   useSwitchChain,
// } from 'wagmi';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { cn } from '@/lib/utils';
// import { clientToSigner } from '@/utils/ethers';

export default function FCastTrade() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-full flex justify-end">
      <button
        type="button"
        className="bg-[white] rounded-[999px] px-[12px] py-[8px] items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Trade $Degen
      </button>
      {openModal && <TradeModal open={openModal} setOpen={setOpenModal} />}
    </div>
  );
}

function TradeModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  // const { connectAsync } = useConnect();
  // const { disconnectAsync } = useDisconnect();
  // const { switchChainAsync } = useSwitchChain();
  // const client = useClient();
  // const account = useAccount();

  const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
    integrator: 'DegenCast/US3R.NETWORK',
    fromChain: 8453,
    fromToken: '0x0000000000000000000000000000000000000000',
    toChain: 8453,
    toToken: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    containerStyle: {
      padding: '0',
    },
    theme: {
      palette: {
        primary: {
          main: '#F41F4C',
        },
        background: {
          paper: '#1B1E23', // bg color for cards
          default: '#14171A',
        },
        text: {
          primary: '#fff',
          secondary: '#718096',
        },
      },
    },
  };
  const widgetConfig = DEFAULT_WIDGET_CONFIG;
  // TODO: LiFiWidget is NOT support viem until 3.0, try this after 3.0 is released
  // const widgetConfig = useMemo((): WidgetConfig => {
  //   console.log('client', client);
  //   if (!client || !account) {
  //     return defaultWidgetConfig;
  //   }
  //   const signer = clientToSigner(client, account);
  //   console.log('signer', signer);
  //   return {
  //     ...defaultWidgetConfig,
  //     walletManagement: {
  //       signer,
  //       connect: async () => {
  //         await connectAsync();
  //         return signer;
  //       },
  //       disconnect: async () => {
  //         await disconnectAsync();
  //       },
  //       switchChain: async (chainId: number) => {
  //         await switchChainAsync({ chainId });
  //         if (signer) {
  //           return signer;
  //         }
  //         throw Error('No signer object is found after the chain switch.');
  //       },
  //     },
  //   };
  // }, [client, account, connectAsync, disconnectAsync, switchChainAsync]);

  return (
    <ModalContainer
      open={open}
      closeModal={() => {
        setOpen(false);
      }}
      contentTop="50%"
      className="max-h-full overflow-y-auto"
    >
      <div
        className={cn(
          'flex flex-col',
          'rounded-xl md:rounded-[20px] md:max-w-none',
          'bg-[#14171A]'
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between p-5 mb-[-24px]">
          <div className="text-base">
            <span className="text-[#718096]">Swap</span>
          </div>
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Cross2Icon className="h-5 w-5 text-[#718096]" />
          </div>
        </div>
        <LiFiWidget integrator="DegenCast/US3R.NETWORK" config={widgetConfig} />
      </div>
    </ModalContainer>
  );
}
