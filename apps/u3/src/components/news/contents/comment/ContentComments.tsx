import { Comments, CommentsProps } from '@us3r-network/link';
import styled from 'styled-components';
import Loading from '../../../common/loading/Loading';

export default function ContentComments(props: CommentsProps) {
  return (
    <CommentsEl {...props}>
      {({ isLoading }) => {
        if (isLoading) {
          return (
            <FirstLoadingWrapper>
              <Loading />
            </FirstLoadingWrapper>
          );
        }
        return (
          <List>
            {(item) => (
              <Item value={item} key={item.id}>
                <Avatar />
                <ItemRight>
                  <ItemRightHeader>
                    <Name />
                    <CreateAt />
                  </ItemRightHeader>
                  <Text />
                </ItemRight>
              </Item>
            )}
          </List>
        );
      }}
    </CommentsEl>
  );
}
const CommentsEl = styled(Comments)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const FirstLoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const List = styled(CommentsEl.List)`
  & > :not(:first-child) {
    border-top: 1px solid #39424c;
  }
`;

const Item = styled(CommentsEl.Item)`
  display: flex;
  gap: 20px;
  padding: 20px 0px;
`;

const Avatar = styled(CommentsEl.Avatar)`
  display: inline-block;
  width: 48px !important;
  height: 48px !important;
  & > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const ItemRight = styled.div`
  flex: 1;
`;
const ItemRightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled(CommentsEl.Name)`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const CreateAt = styled(CommentsEl.CreateAt)`
  color: var(--718096, #718096);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Text = styled(CommentsEl.Text)`
  color: var(--ffffff, #fff);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: inline-block;
  margin-top: 10px;
`;
