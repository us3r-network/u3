/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-05 10:34:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 18:43:57
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ContentListItem, ContentStatus } from '../services/types/contents';
import { CONTENT_ADMIN_PLUS_SCORE_STEP } from '../utils/content';
import { updateContent } from '../services/api/contents';
import { messages } from '../utils/message';
import useLogin from './useLogin';

// cache content admin handle pending ids
const cacheContentAdminScorePendingIds = new Set();
const cacheContentAdminDeletePendingIds = new Set();

export default (
  contents?: ContentListItem[],
  setContents?: (newContents: ContentListItem[]) => void
) => {
  const { user } = useLogin();
  const updateOne = useCallback(
    (id: string | number, data: Partial<ContentListItem>) => {
      if (setContents) {
        setContents(
          (contents ?? []).map((item) =>
            item.id === id ? { ...item, ...data } : item
          )
        );
      }
    },
    [contents, setContents]
  );

  const deleteOne = useCallback(
    (id: string | number) => {
      if (setContents) {
        setContents((contents ?? []).filter((item) => item.id !== id));
      }
    },
    [contents, setContents]
  );

  // score
  const [adminScorePendingIds, setAdminScorePendingIds] = useState([
    ...cacheContentAdminScorePendingIds,
  ]);
  const onAdminScore = useCallback(
    (data: ContentListItem) => {
      return new Promise<void>((resolve, reject) => {
        (async () => {
          const { id } = data;
          if (adminScorePendingIds.includes(id)) return;
          try {
            cacheContentAdminScorePendingIds.add(id);
            setAdminScorePendingIds([...cacheContentAdminScorePendingIds]);
            const editorScore =
              (data.editorScore || 0) + CONTENT_ADMIN_PLUS_SCORE_STEP;
            const resp = await updateContent({ id, editorScore }, user?.token);
            const { code, msg } = resp.data;
            if (code === 0) {
              updateOne(id, {
                editorScore,
              });
              toast.success(messages.content.admin_add_score);
              resolve();
            } else {
              toast.error(msg || messages.common.error);
              reject(new Error(msg));
            }
          } catch (error) {
            toast.error(error.message || error.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentAdminScorePendingIds.delete(data.id);
            setAdminScorePendingIds([...cacheContentAdminScorePendingIds]);
          }
        })();
      });
    },
    [user, adminScorePendingIds, setAdminScorePendingIds, updateOne]
  );

  // delete
  const [adminDeletePendingIds, setAdminDeletePendingIds] = useState([
    ...cacheContentAdminDeletePendingIds,
  ]);
  const onAdminDelete = useCallback(
    (data: ContentListItem) => {
      return new Promise<void>((resolve, reject) => {
        (async () => {
          const { id } = data;
          if (adminDeletePendingIds.includes(id)) return;
          try {
            cacheContentAdminDeletePendingIds.add(id);
            setAdminScorePendingIds([...cacheContentAdminDeletePendingIds]);
            const status = ContentStatus.HIDDEN;
            const resp = await updateContent({ id, status }, user?.token);
            const { code, msg } = resp.data;
            if (code === 0) {
              deleteOne(id);
              toast.success(messages.content.hide);
              resolve();
            } else {
              toast.error(msg || messages.common.error);
              reject(new Error(msg));
            }
          } catch (error) {
            toast.error(error.message || error.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentAdminDeletePendingIds.delete(id);
            setAdminDeletePendingIds([...cacheContentAdminDeletePendingIds]);
          }
        })();
      });
    },
    [user, adminDeletePendingIds, setAdminDeletePendingIds, deleteOne]
  );

  return {
    adminScorePendingIds,
    adminDeletePendingIds,
    onAdminScore,
    onAdminDelete,
  };
};
