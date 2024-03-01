import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import LinkBox from '../../news/contents/LinkBox';
import type { SaveExploreListItemData } from './SaveExploreList';

export type SaveExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: SaveExploreListItemData;
};

export default function SaveExploreListItem({
  data,
  ...props
}: SaveExploreListItemProps) {
  return (
    <div className="flex flex-col gap-4 pt-4 pb-4" {...props}>
      <IconLink text={data.url} logo={data?.logo} className="iconLink" />
      <p className="flex-[1] font-medium text-[16px] leading-[20px] text-white line-clamp-4 max-sm:line-clamp-1">
        {data.title || data.url}
      </p>
      {!!data?.createAt && (
        <p className="text-white">{defaultFormatFromNow(data.createAt)}</p>
      )}
    </div>
  );
}

const IconLink = styled(LinkBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  gap: 6px;
  background: #14171a;
  border-radius: 100px;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718096;
  }
`;

export const SaveExploreListItemMobile = styled(SaveExploreListItem)`
  padding: 10px;
  height: auto;
`;
