/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 10:08:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 14:37:14
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ContentListItem } from '../../services/types/contents';
import { getContentPlatformLogoWithJsonValue } from '../../utils/content';
import Badge from './Badge';
import LinkBox from './LinkBox';
import UpVote from './ContentActionUpVote';
import ContentActionFavor from './ContentActionFavor';
import EllipsisText from '../common/text/EllipsisText';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ContentListItem;
};
export default function ContentListItemMobile({ data, ...otherProps }: Props) {
  const {
    tags,
    link,
    title,
    upVoteNum,
    editorScore,
    value,
    favored,
    favorNum,
  } = data;
  const platformLogo = getContentPlatformLogoWithJsonValue(value);
  return (
    <Wrapper {...otherProps}>
      <Title row={2}>{title}</Title>
      <BottomWrapper>
        {tags?.length > 0 && <Badge text={tags[0]} className="tag" />}
        <LinkBox text={link} logo={platformLogo} />
        <ActionsWrapper>
          <UpVote number={upVoteNum + (editorScore || 0)} />
          <ContentActionFavor number={favorNum || 0} isFavored={favored} />
        </ActionsWrapper>
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
const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;
