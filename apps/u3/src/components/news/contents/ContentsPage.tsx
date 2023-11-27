/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-27 14:39:41
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../../common/loading/Loading';
import ListScrollBox from '../../common/box/ListScrollBox';
import { ContentBoxContainer } from './ContentShowerBox';
import { MainWrapper } from '../../layout/Index';
import NewsMenu from '../header/NewsMenu';
import GridModal from './GridModal';
import Filter from './Filter';
import SearchInput from '../../common/input/SearchInput';
import NoResult from '../../layout/NoResult';
import ContentOrderBySelect from './ContentOrderBySelect';
import {
  Layout,
  getContentsLayoutFromLocal,
  setContentsLayoutToLocal,
} from '../../../utils/news/localLayout';
import ContentList from './ContentList';
import ContentGridList from './ContentGridList';
import ContentPreview from './ContentPreview';
import type { ContentsPageProps } from '../../../container/news/Contents';
import useLogin from '../../../hooks/shared/useLogin';
import NewsToolbar from '../header/NewsToolbar';
import FilterBox from '../header/FilterBox';

export default function ContentsPage({
  // Queries
  loading,
  loadingMore,
  hasMore,
  contents,
  currentSearchParams,
  searchParamsChange,
  getMore,
  // Mutations
  onHiddenAction,
  onHiddenUndoAction,
  onAdminScore,
  onAdminDelete,
  // Others
  onShare,
}: ContentsPageProps) {
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [layout, setLayout] = useState(getContentsLayoutFromLocal());
  const [gridModalShow, setGridModalShow] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(false);

  const activeId = useMemo(() => {
    return id === ':id' ? contents[0]?.uuid || contents[0]?.id : id;
  }, [id, contents]);

  const selectContent = useMemo(
    () =>
      contents.find(
        (item) => String(item?.uuid || item?.id) === String(activeId)
      ),
    [contents, activeId]
  );

  const renderMoreLoading = useMemo(
    () =>
      loadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : !hasMore ? (
        <MoreLoading>No other contents</MoreLoading>
      ) : null,
    [loadingMore, hasMore]
  );

  useEffect(() => {
    if (id !== ':id' && selectContent && layout === Layout.GRID) {
      setGridModalShow(true);
    } else {
      setGridModalShow(false);
    }
  }, [id, selectContent, layout]);

  const resetRouthPath = useCallback(() => {
    navigate(`/contents/:id?${searchParams.toString()}`);
  }, [searchParams]);

  useEffect(() => {
    if (!id) {
      resetRouthPath();
    }
  }, [id, resetRouthPath]);

  return (
    <Box>
      <NewsMenu />
      <NewsToolbar
        // displayFilterButton
        // isActiveFilter={isActiveFilter}
        // onChangeActiveFilter={setIsActiveFilter}
        orderByEl={
          <>
            <ContentOrderBySelect
              value={currentSearchParams.orderBy}
              onChange={(value) =>
                searchParamsChange({
                  orderBy: value,
                })
              }
            />
            {/* <NewestButton
                  isActive={currentSearchParams.orderBy === 'NEWEST'}
                  onClick={() => {
                    searchParamsChange({
                      orderBy: 'NEWEST',
                    });
                  }}
                >
                  Mempool
                  {hasNewest && <HasNewestTag />}
                </NewestButton> */}
          </>
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
        // filterEl={
        //   <FilterBox open={isActiveFilter}>
        //     <Filter
        //       values={currentSearchParams}
        //       filterAction={(data) => {
        //         searchParamsChange(data);
        //       }}
        //     />
        //   </FilterBox>
        // }
        multiLayout
        layout={layout}
        setLayout={(l) => {
          setContentsLayoutToLocal(l);
          setLayout(l);
        }}
        displaySubmitButton={isAdmin}
        submitButtonOnClick={() => {
          navigate('/contents/create');
        }}
      />
      {(() => {
        if (loading) {
          return (
            <ContentsWrapper loading="true">
              <div className="loading">
                <Loading />
              </div>
            </ContentsWrapper>
          );
        }
        if (contents.length === 0) {
          return (
            <ContentsWrapper>
              <NoResult />
            </ContentsWrapper>
          );
        }
        if (layout === Layout.LIST) {
          return (
            <ContentsWrapper>
              <ListBox onScrollBottom={getMore}>
                <ContentList
                  data={contents}
                  activeId={activeId}
                  onHiddenUndo={onHiddenUndoAction}
                  onItemClick={(item) => {
                    navigate(
                      `/contents/${
                        item?.id || item?.uuid || ''
                      }?${searchParams.toString()}`
                    );
                  }}
                />
                {renderMoreLoading}
              </ListBox>
              <ContentBoxContainer>
                {selectContent && (
                  <ContentPreview
                    data={selectContent}
                    showAdminOps={!selectContent.isForU && isAdmin}
                    onAdminScore={() => {
                      onAdminScore(selectContent);
                    }}
                    onAdminDelete={() => {
                      onAdminDelete(selectContent);
                    }}
                    onShare={() => {
                      onShare(selectContent);
                    }}
                    onHidden={() => {
                      onHiddenAction(selectContent);
                    }}
                  />
                )}
              </ContentBoxContainer>
            </ContentsWrapper>
          );
        }
        if (layout === Layout.GRID) {
          return (
            <GrideListBox onScrollBottom={getMore}>
              <ContentGridList
                data={contents}
                activeId={activeId}
                onHiddenUndo={onHiddenUndoAction}
                onItemClick={(item) => {
                  navigate(
                    `/contents/${
                      item?.id || item?.uuid || ''
                    }?${searchParams.toString()}`
                  );
                }}
              />
              {renderMoreLoading}
            </GrideListBox>
          );
        }

        return null;
      })()}

      <GridModal
        show={gridModalShow}
        closeModal={() => {
          resetRouthPath();
        }}
        selectContent={selectContent}
        onAdminScore={() => {
          onAdminScore(selectContent);
        }}
        onAdminDelete={() => {
          onAdminDelete(selectContent).then(() => {
            resetRouthPath();
          });
        }}
        shareAction={() => {
          if (!selectContent) return;
          onShare(selectContent);
        }}
        hiddenAction={() => {
          if (!selectContent) return;
          onHiddenAction(selectContent);
          resetRouthPath();
        }}
      />
    </Box>
  );
}

const Box = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 0;
`;
// const Box = styled.div`
//   margin: 0 auto;
//   height: calc(100vh - 72px);
//   box-sizing: border-box;
//   padding: 24px 40px 0 40px;
//   overflow: hidden;
// `;
const ContentsWrapper = styled.div<{ loading?: string }>`
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
  overflow: scroll;
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

const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
