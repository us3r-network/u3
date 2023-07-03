import { useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  fetchUserKarmaList,
  fetchUserKarmaListMore,
  selectKarmaState,
} from '../../features/profile/karma';
import ListScrollBox from '../common/box/ListScrollBox';
import Karma from '../common/Karma';
import Loading from '../common/loading/Loading';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useLogin from '../../hooks/useLogin';
import { AsyncRequestStatus } from '../../services/types';

export default function UKarmaList() {
  const { user } = useLogin();
  const { listStatus, loadMoreStatus, hasMore, list, pageNumber, pageSize } =
    useAppSelector(selectKarmaState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pageNumber === 0 && list.length === 0) {
      dispatch(
        fetchUserKarmaList({ token: user?.token, pageNumber, pageSize })
      );
    }
  }, [user?.token]);

  return (
    <ListBox
      onScrollBottom={() => {
        if (hasMore) {
          dispatch(
            fetchUserKarmaListMore({
              token: user?.token,
              pageNumber: pageNumber + 1,
              pageSize,
            })
          );
        }
      }}
    >
      {listStatus === AsyncRequestStatus.PENDING ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        list.map((item) => {
          return (
            <div key={item.id} className="u-karma-item">
              <div>
                <Karma score={`+${item.score}`} />
                <span>{dayjs(item.createdAt).fromNow()}</span>
              </div>
              <div>{item.contentTitle}</div>
            </div>
          );
        })
      )}

      {loadMoreStatus === AsyncRequestStatus.PENDING && (
        <div className="loading-more">
          <Loading />
        </div>
      )}
    </ListBox>
  );
}

export function UKarmaTitle() {
  return <Title>U Karma</Title>;
}

const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  font-style: italic;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #14171a;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListBox = styled(ListScrollBox)`
  height: auto;
  & .loading,
  & .loading-more {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .u-karma-item {
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #14171a;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > div {
      &:first-child {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  &:last-child {
    border-bottom: none;
  }
`;
