import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import CardBase from '../../common/card/CardBase';
import Tag from '../../common/tag/Tag';

export type ContentLinkCardData = {
  title: string;
  type: string;
  link: string;
  author: string;
  createdAt: number;
  upVoteNum: number;
};

export type ContentLinkCardProps = StyledComponentPropsWithRef<'div'> & {
  data: ContentLinkCardData;
  displayVote?: boolean;
  disabledVote?: boolean;
  loadingVote?: boolean;
  isVoted?: boolean;
  onVote?: () => void;
};
export default function ContentLinkCard({
  data,
  displayVote = true,
  disabledVote,
  loadingVote,
  isVoted,
  onVote,
  ...props
}: ContentLinkCardProps) {
  return (
    <ContentLinkCardWrapper
      onClick={() => window.open(data.link, '__blank')}
      {...props}
    >
      <ListItemInner>
        <LayoutCenter>
          <LayoutCenterRow>
            <ContentName>{data.title}</ContentName>
          </LayoutCenterRow>
          <LayoutCenterRow>
            <ContentType>{data.type}</ContentType>
            <LayoutText>{data.author}</LayoutText>
            <LayoutText>|</LayoutText>
            <LayoutText>{defaultFormatFromNow(data.createdAt)}</LayoutText>
          </LayoutCenterRow>
        </LayoutCenter>
        {displayVote && (
          <ContentHandleButton
            onClick={(e) => {
              e.stopPropagation();
              if (onVote) onVote();
            }}
            disabled={disabledVote}
          >
            👏
            <ContentHandleButtonText>
              &nbsp;{data.upVoteNum}
            </ContentHandleButtonText>
          </ContentHandleButton>
        )}
      </ListItemInner>
    </ContentLinkCardWrapper>
  );
}
const ContentLinkCardWrapper = styled(CardBase)`
  background: #14171a;
  width: 100%;
  cursor: pointer;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
`;
const LayoutCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const LayoutCenterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ContentName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const ContentType = styled(Tag)``;

const LayoutText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #718096;
`;
const ContentHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const ContentHandleButtonText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  white-space: nowrap;
`;
