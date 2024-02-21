import { ComponentPropsWithRef } from 'react';
import { useSwitchChain, useWalletClient } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { casterZoraChainId, casterZoraNetwork } from '@/constants/zora';
import ColorButton from '@/components/common/button/ColorButton';

interface Props extends ComponentPropsWithRef<'button'> {}

export default function SwitchNetworkButton(props: Props) {
  const { switchChain } = useSwitchChain();
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClient();
  const { openConnectModal } = useConnectModal();
  const switchToChain = () => {
    if (!isLoadingWalletClient && !walletClient) openConnectModal?.();
    walletClient?.addChain({ chain: casterZoraNetwork });
    switchChain?.({ chainId: casterZoraChainId });
  };

  return (
    <ColorButton onClick={() => switchToChain()} {...props}>
      Switch to {casterZoraNetwork.name}
    </ColorButton>
  );
}
