import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';
import { shortPubKey } from '@/utils/shared/shortPubKey';
import { casterZoraNetworkExplorer } from '@/constants/zora';

interface Props extends ComponentPropsWithRef<'div'> {
  data: {
    network: string;
    standard: string;
    contract: string;
    firstMinter?: {
      avatar?: string;
      displayName?: string;
    };
    mintersCount?: number;
  };
}

export default function MintInfo({ data, className, ...props }: Props) {
  const { network, standard, contract, firstMinter, mintersCount } = data;
  return (
    <div className={cn('flex flex-col gap-[20px]', className)} {...props}>
      <AttrRow>
        <AttrName>Network</AttrName>
        <AttrValue>{network}</AttrValue>
      </AttrRow>
      <AttrRow>
        <AttrName>Standard</AttrName>
        <AttrValue>{standard}</AttrValue>
      </AttrRow>

      <AttrRow>
        <AttrName>Contract</AttrName>
        <AttrValue>
          <a
            href={`${casterZoraNetworkExplorer}/address/${contract}`}
            target="_blank"
            rel="noreferrer"
          >
            {shortPubKey(contract)}
          </a>
        </AttrValue>
      </AttrRow>

      {!!firstMinter && !!firstMinter?.displayName && (
        <AttrRow>
          <AttrName>First Minter</AttrName>
          <AttrValue>{firstMinter.displayName}</AttrValue>
        </AttrRow>
      )}

      {!!mintersCount && (
        <AttrRow>
          <AttrName>Minters</AttrName>
          <AttrValue>{mintersCount}</AttrValue>
        </AttrRow>
      )}
    </div>
  );
}
function AttrRow({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'w-full flex flex-row justify-between items-center',
        className
      )}
      {...props}
    />
  );
}
function AttrName({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      className={cn(
        'text-[#718096] text-[16px] font-normal leading-[normal]',
        className
      )}
      {...props}
    />
  );
}
function AttrValue({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      className={cn(
        'text-[#FFF] text-[16px] font-normal leading-[normal]',
        className
      )}
      {...props}
    />
  );
}
