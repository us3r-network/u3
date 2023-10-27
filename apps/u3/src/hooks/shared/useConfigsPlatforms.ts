/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 18:47:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 14:52:04
 * @Description: file description
 */
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchConfigsPlatforms,
  selectState,
} from '../../features/shared/platforms';
import { AsyncRequestStatus } from '../../services/shared/types';
import { PlatformType } from '../../services/shared/types/common';

export default () => {
  const dispatch = useAppDispatch();
  const { status, platforms } = useAppSelector(selectState);
  const eventPlatforms = useMemo(
    () => platforms.filter((item) => item.type === PlatformType.EVENT),
    [platforms]
  );
  const contentPlatforms = useMemo(
    () => platforms.filter((item) => item.type === PlatformType.CONTENT),
    [platforms]
  );

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchConfigsPlatforms());
    }
  }, [status]);
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return {
    loading,
    platforms,
    eventPlatforms,
    contentPlatforms,
  };
};
