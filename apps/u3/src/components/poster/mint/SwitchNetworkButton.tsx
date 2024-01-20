import { ComponentPropsWithRef } from 'react';
import { useSwitchNetwork, useWalletClient } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { casterZoraChainId, casterZoraNetwork } from '@/constants/zora';
import ColorButton from '@/components/common/button/ColorButton';

interface Props extends ComponentPropsWithRef<'button'> {}

export default function SwitchNetworkButton(props: Props) {
  const { switchNetwork } = useSwitchNetwork();
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClient();
  const { openConnectModal } = useConnectModal();
  const switchChain = () => {
    if (!isLoadingWalletClient && !walletClient) openConnectModal?.();
    walletClient?.addChain({ chain: casterZoraNetwork });
    switchNetwork?.(casterZoraChainId);
  };

  return (
    <ColorButton onClick={() => switchChain()} {...props}>
      Switch to {casterZoraNetwork.name}
    </ColorButton>
  );
}
