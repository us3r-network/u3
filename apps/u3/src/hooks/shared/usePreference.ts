import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getPreference,
  updatePreference,
} from '../../services/profile/api/profile';
import {
  addLocalPreference,
  getLocalPreference,
} from '../../utils/shared/localPreference';
import useConfigsTopics from './useConfigsTopics';

export default function usePreference(userToken: string) {
  const [loading, setLoading] = useState(false);
  // whatever value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [preference, setPreference] = useState<{ [key: string]: any }>(
    getLocalPreference()
  );
  const { topics } = useConfigsTopics();
  const lists = useMemo(() => {
    const { contentTags, eventTypes, dappTypes } = topics;
    const listData: Array<{
      type: string;
      value: string;
      name: string;
    }> = [];

    return listData
      .concat(
        dappTypes.map((item) => ({
          type: 'dappTypes',
          ...item,
        }))
      )
      .concat(
        contentTags.slice(0, 10).map((item) => ({
          type: 'contentTags',
          ...item,
        }))
      )
      .concat(
        eventTypes.map((item) => ({
          type: 'eventTypes',
          ...item,
        }))
      );
  }, [topics]);

  const fetchPreference = useCallback(
    async (token: string) => {
      if (!token) return;
      if (Object.keys(preference).length > 0) return;
      if (loading) return;
      setLoading(true);
      try {
        const { data } = await getPreference(token);
        addLocalPreference(data.data);
        setPreference(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [preference, loading]
  );

  const postPreference = useCallback(
    async (data: {
      eventRewards: string[];
      eventTypes: string[];
      projectTypes: string[];
      contentTypes: string[];
      langs: string[];
    }) => {
      if (!userToken) return;
      try {
        await updatePreference(data, userToken);
        addLocalPreference(data);
        setPreference(data);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [userToken]
  );

  useEffect(() => {
    if (!userToken) return;
    fetchPreference(userToken);
  }, [userToken]);

  return { preferenceList: lists, preference, postPreference };
}
