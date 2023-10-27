/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 18:38:59
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import EventForm from '../../components/news/event/EventForm';
import { fetchOneEvent } from '../../services/news/api/event';
import {
  CreateEventData,
  EventExploreListItemResponse,
} from '../../services/news/types/event';
import useAdminEventHandles from '../../hooks/news/useAdminEventHandles';
import { MainWrapper } from '../../components/layout/Index';
import Loading from '../../components/common/loading/Loading';
import { Platform } from '../../services/shared/types/common';

export default function EventEdit() {
  const { id } = useParams();
  const [fetchEventPending, setFetchEventPending] = useState(false);
  const [event, setEvent] = useState<EventExploreListItemResponse | null>(null);

  const initialValues = useMemo<CreateEventData | null>(
    () =>
      event
        ? {
            name: event.name || '',
            description: event.description || '',
            image: event.image || '',
            platform: (event.platform.name || '') as unknown as Platform,
            project: (event.project.id || '') as unknown as number,
            link: event.link || '',
            chain: event.chain,
            reward: event.reward,
            startTime: event.startTime,
            endTime: event.endTime,
            supportIframe: event.supportIframe,
            editorScore: event.editorScore,
            types: event.types,
          }
        : null,
    [event]
  );
  useEffect(() => {
    if (id) {
      setFetchEventPending(true);
      fetchOneEvent(id)
        .then(({ data: { data, code, msg } }) => {
          if (code === 0) {
            setEvent(data);
          } else {
            toast.error(msg);
          }
        })
        .catch((error) => {
          toast.error(error.message || error.msg);
        })
        .finally(() => {
          setFetchEventPending(false);
        });
    }
  }, [id]);
  const { adminEditPending, onAdminEdit } = useAdminEventHandles();
  const formHandleRef = useRef(null);
  useEffect(() => {
    if (initialValues && formHandleRef.current) {
      formHandleRef.current?.resetForm();
    }
  }, [initialValues]);

  return fetchEventPending ? (
    <StatusWrapper>
      <Loading />
    </StatusWrapper>
  ) : initialValues ? (
    <EventForm
      initialValues={initialValues}
      loading={adminEditPending}
      onSubmit={(values) => onAdminEdit(id, values, event?.linkStreamId)}
      ref={formHandleRef}
    />
  ) : (
    <StatusWrapper>The event query with id {id} failed</StatusWrapper>
  );
}

const StatusWrapper = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
