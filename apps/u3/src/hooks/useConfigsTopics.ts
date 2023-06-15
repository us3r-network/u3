/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 18:47:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 18:52:35
 * @Description: file description
 */
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchConfigsTopics, selectState } from '../features/configs/topics';
import { AsyncRequestStatus } from '../services/types';

export default () => {
  const dispatch = useAppDispatch();
  const { status, topics } = useAppSelector(selectState);
  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchConfigsTopics());
    }
  }, [status]);
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return {
    loading,
    topics,
  };
};
