import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ScoresAvg } from '@us3r-network/link';
import { isMobile } from 'react-device-detect';
import CardBase from '../../common/card/CardBase';
import Badge from '../../dapp/Badge';
import { formatFilterShowName } from '../../../utils/shared/filter';
import { cn } from '@/lib/utils';

export type DappData = {
  logo: string;
  name: string;
  types: string[];
  recReason?: string;
  linkStreamId?: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: DappData;
}
export default function LinkCard({ data, ...wrapperProps }: Props) {
  const {
    logo,
    name,
    types,
    recReason = 'High Score Dapp',
    linkStreamId,
  } = data;
  return (
    <CardWrapper {...wrapperProps}>
      <div
        className={cn(
          'w-full h-full flex [transition:all_0.3s] hover:scale-105',
          'max-sm:[flex-flow:row-reverse] max-sm:p-[10px] max-sm:box-border max-sm:gap-[10px]'
        )}
      >
        <div
          className={cn(
            'w-[0] flex-[1] px-[20px] py-[15px] box-border flex flex-col',
            'max-sm:p-0'
          )}
        >
          <span className="text-[#fff] text-[16px] font-medium line-clamp-1">
            {name}
          </span>
          <span
            className={cn(
              'text-[14px] font-normal bg-[linear-gradient(52deg,_#cd62ff_35.31%,_#62aaff_89.64%)] bg-clip-text mt-auto text-transparent',
              'max-sm:hidden'
            )}
          >
            {recReason}
          </span>
          <div
            className="
              flex
              items-center
              gap-[10px]
              mt-[6px]
            "
          >
            <div
              className="
              w-[0]
              flex-[1]
              flex
              gap-[10px]
              overflow-hidden
            "
            >
              {types.map((item) => (
                <Badge key={item} text={formatFilterShowName(item)} />
              ))}
            </div>
            {linkStreamId && <ScoresAvg linkId={data.linkStreamId} />}
          </div>
        </div>
        <div
          className={cn(
            'w-[110px] h-full',
            'max-sm:w-[48px] max-sm:h-[48px] max-sm:flex-shrink-0'
          )}
        >
          <img
            src={logo}
            alt=""
            className={cn(
              'w-full h-full object-cover',
              'max-sm:rounded-[10px]'
            )}
          />
        </div>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled(CardBase)`
  width: 100%;
  background: #1b1e23;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
`;
