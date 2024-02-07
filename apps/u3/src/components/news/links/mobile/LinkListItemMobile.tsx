/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 10:08:00
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-15 16:43:21
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { useMemo } from 'react';
import Badge from '../Badge';
import LinkBox from '../LinkBox';
import EllipsisText from '../../../common/text/EllipsisText';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: LinkListItem;
};
export default function ContentListItemMobile({ data, ...otherProps }: Props) {
  const { tags, url, metadata } = data;
  const platformLogo = useMemo(() => metadata?.icon || '', [metadata]);
  return (
    <Wrapper {...otherProps}>
      <Title row={2}>{metadata.title}</Title>
      <BottomWrapper>
        {tags?.length > 0 && <Badge text={tags[0]} className="tag" />}
        <LinkBox text={url} logo={platformLogo} />
      </BottomWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;

  width: 100%;
  height: 86px;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 10px;
  cursor: pointer;
`;
const Title = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const BottomWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  > .tag {
    flex-shrink: 0;
  }
`;
