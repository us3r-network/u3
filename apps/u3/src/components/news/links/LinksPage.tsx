/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-17 17:08:56
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LinkListItem } from 'src/services/news/types/links';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../../common/loading/Loading';
import ListScrollBox from '../../common/box/ListScrollBox';
import SearchInput from '../../common/input/SearchInput';
import { MainWrapper } from '../../layout/Index';
import FeedsMenu from '../web3-today/feeds/FeedsMenu';
import FeedsMenuRight, { Layout } from '../web3-today/feeds/FeedsMenuRight';
import FeedsFilterBox from '../web3-today/feeds/FeedsFilterBox';
import Filter from './Filter';
import GridModal from './grid/GridModal';
import NoResult from '../../layout/NoResult';
import {
  getContentsLayoutFromLocal,
  setContentsLayoutToLocal,
} from '../../../utils/news/localLayout';
import useLogin from '../../../hooks/shared/useLogin';
import LinkOrderBySelect from './LinkOrderBySelect';
import LinkPreview from './LinkPreview';
import LinkGridList from './grid/LinkGridList';
import LinkList from './list/LinkList';

export type LinksPageProps = {
  // Queries
  loading?: boolean;
  hasMore?: boolean;
  links?: Array<LinkListItem>;
  getMore?: () => void;
  currentSearchParams?: {
    keywords?: string;
    channels?: string[];
    includeDomains?: string[];
    excludeDomains?: string[];
    orderBy?: any;
  };
  searchParamsChange?: (values: {
    keywords?: string;
    channels?: string[];
    includeDomains?: string[];
    excludeDomains?: string[];
    orderBy?: any;
  }) => void;
};

export default function LinksPage({
  loading,
  hasMore,
  links,
  currentSearchParams,
  searchParamsChange,
  getMore,
}: LinksPageProps) {
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const { link } = useParams();
  const [searchParams] = useSearchParams();

  const [layout, setLayout] = useState(getContentsLayoutFromLocal());
  const [gridModalShow, setGridModalShow] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(false);

  const selectLink: LinkListItem | null = useMemo(
    () =>
      link
        ? links.find(
            (item) => item?.url === Buffer.from(link, 'base64').toString('utf8')
          )
        : null,
    [links, link]
  );

  useEffect(() => {
    if (link !== ':link' && selectLink && layout === Layout.GRID) {
      setGridModalShow(true);
    } else {
      setGridModalShow(false);
    }
  }, [link, selectLink, layout]);

  const resetRouthPath = useCallback(() => {
    navigate(`/links/:link?${searchParams.toString()}`);
  }, [searchParams]);

  useEffect(() => {
    if (!link) {
      resetRouthPath();
    }
  }, [link, resetRouthPath]);

  return (
    <Box>
      <FeedsMenu
        rightEl={
          <FeedsMenuRight
            // displayFilterButton
            // isActiveFilter={isActiveFilter}
            onChangeActiveFilter={setIsActiveFilter}
            orderByEl={
              <LinkOrderBySelect
                value={currentSearchParams.orderBy}
                onChange={(value) =>
                  searchParamsChange({
                    orderBy: value,
                  })
                }
              />
            }
            // searchEl={
            //   <SearchInput
            //     debounceMs={1000}
            //     onSearch={(value) => {
            //       searchParamsChange({
            //         keywords: value,
            //       });
            //     }}
            //   />
            // }
            multiLayout
            layout={layout}
            setLayout={(l) => {
              setContentsLayoutToLocal(l);
              setLayout(l);
            }}
            displaySubmitButton={isAdmin}
            submitButtonOnClick={() => {
              navigate('/links/create');
            }}
          />
        }
        // bottomEl={
        //   <FeedsFilterBox open={isActiveFilter}>
        //     <Filter
        //       values={currentSearchParams as { channels: string[] }}
        //       filterAction={(data) => {
        //         searchParamsChange(data);
        //       }}
        //     />
        //   </FeedsFilterBox>
        // }
      />
      {(() => {
        if (loading && links.length === 0) {
          return (
            <LinksWrapper loading="true">
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

        switch (layout) {
          case Layout.LIST:
            return (
              <LinksWrapper>
                <ListBox id="links-scroll-wrapper">
                  <InfiniteScroll
                    style={{ overflow: 'hidden' }}
                    dataLength={links?.length || 0}
                    next={() => {
                      if (loading) return;
                      getMore();
                    }}
                    hasMore={hasMore}
                    scrollThreshold="600px"
                    loader={
                      <LoadingMoreWrapper>
                        <Loading />
                      </LoadingMoreWrapper>
                    }
                    scrollableTarget="links-scroll-wrapper"
                  >
                    <LinkList
                      data={links}
                      activeLink={selectLink}
                      onItemClick={(item) => {
                        navigate(
                          `/links/${Buffer.from(item?.url, 'utf8').toString(
                            'base64'
                          )}}`
                        );
                      }}
                    />
                  </InfiniteScroll>
                </ListBox>
                <LinkBoxContainer>
                  {selectLink && <LinkPreview data={selectLink} />}
                </LinkBoxContainer>
              </LinksWrapper>
            );
          case Layout.GRID:
            return (
              <GrideListBox id="links-scroll-wrapper">
                <InfiniteScroll
                  style={{ overflow: 'hidden' }}
                  dataLength={links?.length || 0}
                  next={() => {
                    if (loading) return;
                    getMore();
                  }}
                  hasMore={hasMore}
                  scrollThreshold="600px"
                  loader={
                    <LoadingMoreWrapper>
                      <Loading />
                    </LoadingMoreWrapper>
                  }
                  scrollableTarget="links-scroll-wrapper"
                >
                  <LinkGridList
                    data={links}
                    onItemClick={(item) => {
                      navigate(
                        `/links/${Buffer.from(item?.url, 'utf8').toString(
                          'base64'
                        )}}`
                      );
                    }}
                  />
                </InfiniteScroll>
              </GrideListBox>
            );
          default:
            return null;
        }
      })()}

      <GridModal
        show={gridModalShow}
        closeModal={() => {
          resetRouthPath();
        }}
        data={selectLink}
      />
    </Box>
  );
}

const Box = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0;
`;
// const Box = styled.div`
//   margin: 0 auto;
//   height: calc(100vh - 72px);
//   box-sizing: border-box;
//   padding: 24px 40px 0 40px;
//   overflow: hidden;
// `;
const LinksWrapper = styled.div<{ loading?: string }>`
  /* width: calc(100% - 2px);
  height: calc(100% - 94px); */
  /* box-sizing: border-box; */
  border: ${(props) => (props.loading ? 'none' : '1px solid #39424c')};
  background-color: ${(props) => (props.loading ? '' : '#1b1e23')};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  /* margin-top: 24px; */
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
  min-width: 360px;
  width: 360px;
  height: calc(100%);
  border-right: 1px solid #39424c;

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
const GrideListBox = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const LinkBoxContainer = styled.div`
  height: 100%;
  width: calc(100% - 360px);
`;

const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
