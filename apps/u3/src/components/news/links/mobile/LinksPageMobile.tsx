/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 17:45:09
 * @Description: 首页任务看板
 */
import { useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../common/loading/Loading';
import ListScrollBox from '../../../common/box/ListScrollBox';
import { MainWrapper } from '../../../layout/Index';
import NoResult from '../../../layout/NoResult';
import LinkListMobile from './LinkListMobile';
import { LinksPageProps } from '../LinksPage';

export default function LinksPageMobile({
  loading,
  hasMore,
  links,
  // currentSearchParams,
  // searchParamsChange,
  getMore,
}: LinksPageProps) {
  const navigate = useNavigate();

  const renderMoreLoading = useMemo(
    () =>
      loading && links.length > 0 ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : !hasMore ? (
        <MoreLoading>No other contents</MoreLoading>
      ) : null,
    [loading, hasMore]
  );

  return (
    <Box>
      {(() => {
        if (loading) {
          return (
            <LinksWrapper>
              <div className="loading">
                <Loading />
              </div>
            </LinksWrapper>
          );
        }
        if (links.length === 0) {
          return (
            <LinksWrapper>
              <NoResult />
            </LinksWrapper>
          );
        }

        return (
          <ListBox onScrollBottom={getMore}>
            <LinkListMobile
              data={links}
              onItemClick={(item) => {
                navigate(`/links/${item?.url}`);
              }}
            />
            {renderMoreLoading}
          </ListBox>
        );
      })()}
    </Box>
  );
}

const Box = styled(MainWrapper)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const LinksWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-grow: 1;

  & .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;
const ListBox = styled(ListScrollBox)`
  width: 100%;
  height: calc(100%);
  overflow: scroll;

  & .load-more {
    margin: 20px;
    text-align: center;
    color: #718096;
    > button {
      cursor: pointer;
      background-color: inherit;
      color: #fff;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 10px 20px;
      outline: none;
    }
  }
`;

const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
