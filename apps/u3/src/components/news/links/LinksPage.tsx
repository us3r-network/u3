/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-07 15:14:29
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LinkListItem } from 'src/services/news/types/links';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchInput from 'src/components/common/input/SearchInput';
import { decodeLinkURL, encodeLinkURL } from 'src/utils/news/link';
import Loading from '../../common/loading/Loading';
import ListScrollBox from '../../common/box/ListScrollBox';
import NoResult from '../../layout/NoResult';
import {
  Layout,
  getContentsLayoutFromLocal,
  setContentsLayoutToLocal,
} from '../../../utils/news/localLayout';
import LinkOrderBySelect from './LinkOrderBySelect';
import LinkPreview from './LinkPreview';
import LinkGridList from './grid/LinkGridList';
import LinkList from './list/LinkList';
import NewsToolbar from '../header/NewsToolbar';
import LinkModal from './LinkModal';

const ROUTE_PREFIX = '/b/links';

export type LinksPageProps = {
  // Queries
  loading?: boolean;
  hasMore?: boolean;
  links?: Array<LinkListItem>;
  getMore?: () => void;
  currentSearchParams?: {
    keywords?: string;
    orderBy?: any;
  };
  searchParamsChange?: (values: { keywords?: string; orderBy?: any }) => void;
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
  const { group, link } = useParams();
  const [searchParams] = useSearchParams();

  const [layout, setLayout] = useState(getContentsLayoutFromLocal());
  const [gridModalShow, setGridModalShow] = useState(false);

  const selectLink: LinkListItem | null = useMemo(() => {
    return link
      ? link === ':link'
        ? links[0]
        : links.find((item) => item?.url === decodeLinkURL(link)) || links[0]
      : links[0];
  }, [links, link]);

  useEffect(() => {
    if (link !== ':link' && selectLink && layout === Layout.GRID) {
      setGridModalShow(true);
    } else {
      setGridModalShow(false);
    }
  }, [link, selectLink, layout]);

  const resetRouthPath = useCallback(() => {
    navigate(`${ROUTE_PREFIX}/${group}/:link?${searchParams.toString()}`);
  }, [searchParams]);

  useEffect(() => {
    if (!link) {
      resetRouthPath();
    }
  }, [link, resetRouthPath]);
  return (
    <Box>
      <NewsToolbar
        // displayFilterButton
        // isActiveFilter={isActiveFilter}
        // onChangeActiveFilter={setIsActiveFilter}
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
        searchEl={
          <SearchInput
            debounceMs={1000}
            onSearch={(value) => {
              searchParamsChange({
                keywords: value,
              });
            }}
          />
        }
        multiLayout
        layout={layout}
        setLayout={(l) => {
          setContentsLayoutToLocal(l);
          setLayout(l);
        }}
        // displaySubmitButton={isAdmin}
        // submitButtonOnClick={() => {
        //   navigate('/links/create');
        // }}
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
                          `${ROUTE_PREFIX}/${group}/${encodeLinkURL(
                            item?.url
                          )}?${searchParams.toString()}`
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
                        `${ROUTE_PREFIX}/${group}/${encodeLinkURL(
                          item?.url
                        )}?${searchParams.toString()}`
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

      <LinkModal
        show={gridModalShow}
        closeModal={() => {
          resetRouthPath();
        }}
        data={selectLink}
      />
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 0;
`;
const LinksWrapper = styled.div<{ loading?: string }>`
  border: ${(props) => (props.loading ? 'none' : '1px solid #39424c')};
  background-color: ${(props) => (props.loading ? '' : '#1b1e23')};
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
