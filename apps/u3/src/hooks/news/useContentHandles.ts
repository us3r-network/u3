/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 10:24:07
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import useLogin from '../shared/useLogin';
import { complete, personalComplete } from '../../services/news/api/contents';
import { getContentShareUrl } from '../../utils/shared/share';
import { tweetShare } from '../../utils/shared/twitter';
import { messages } from '../../utils/shared/message';
import { ContentListItem } from '../../services/news/types/contents';

// cache content handle pending ids
const cacheContentHiddenPendingIds = new Set<number | string>();
const cacheContentHiddenTimer = new Map<number | string, NodeJS.Timeout>();

export default (
  contents?: ContentListItem[],
  setContents?: (newContents: ContentListItem[]) => void
) => {
  const { user, handleCallbackVerifyLogin } = useLogin();

  const updateOne = useCallback(
    (id: string | number, data: Partial<ContentListItem>) => {
      if (setContents) {
        setContents(
          (contents ?? []).map((item) =>
            item.id === id || item.uuid === id ? { ...item, ...data } : item
          )
        );
      }
    },
    [contents, setContents]
  );

  const deleteOne = useCallback(
    (id: string | number) => {
      if (setContents) {
        setContents(
          (contents ?? []).filter((item) => item.id !== id && item.uuid !== id)
        );
      }
    },
    [contents, setContents]
  );

  // hidden
  const [hiddenPendingIds, setHiddenPendingIds] = useState([
    ...cacheContentHiddenPendingIds,
  ]);
  const onHidden = useCallback(
    (
      data: ContentListItem,
      callback?: {
        success?: () => void;
        error?: (error: Error) => void;
      }
    ) => {
      return new Promise((resolve, reject) => {
        if (
          data.hidden ||
          cacheContentHiddenPendingIds.has(data?.uuid || data.id)
        )
          return;
        handleCallbackVerifyLogin(async () => {
          try {
            cacheContentHiddenPendingIds.add(data?.uuid || data.id);
            setHiddenPendingIds([...cacheContentHiddenPendingIds]);
            if (data?.uuid) {
              const resp = await personalComplete(data.uuid, user?.token);
              resolve(resp);
            } else {
              const resp = await complete(data.id, user?.token);
              resolve(resp);
            }
            deleteOne(data.uuid || data.id);
            if (callback && callback.success) {
              callback.success();
            }
          } catch (error) {
            if (callback && callback.error) {
              callback.error(error);
            }
            toast.error(error?.message || error?.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentHiddenPendingIds.delete(data?.uuid || data.id);
            setHiddenPendingIds([...cacheContentHiddenPendingIds]);
          }
        });
      });
    },
    [
      user,
      hiddenPendingIds,
      setHiddenPendingIds,
      handleCallbackVerifyLogin,
      deleteOne,
    ]
  );
  // hidden action
  const onHiddenAction = useCallback(
    (data: ContentListItem) => {
      handleCallbackVerifyLogin(() => {
        const key = data?.uuid || data?.id;
        updateOne(key, { hidden: true });
        const timer = setTimeout(() => {
          onHidden(data);
        }, 3000);
        cacheContentHiddenTimer.set(key, timer);
      });
    },
    [handleCallbackVerifyLogin, updateOne, onHidden]
  );
  // hidden undo action
  const onHiddenUndoAction = useCallback(
    (data: ContentListItem) => {
      const key = data?.uuid || data?.id;
      if (cacheContentHiddenTimer.has(key)) {
        clearTimeout(cacheContentHiddenTimer.get(key));
        updateOne(key, { hidden: false });
      }
    },
    [handleCallbackVerifyLogin, updateOne]
  );
  // share
  const onShare = useCallback((data: ContentListItem) => {
    tweetShare(data.title, getContentShareUrl(data.id));
  }, []);

  return {
    hiddenPendingIds,
    onHiddenAction,
    onHiddenUndoAction,
    onHidden,
    onShare,
    updateOne,
    deleteOne,
  };
};
