/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 14:26:41
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ChainType,
  Platform,
  Reward,
} from '../../services/shared/types/common';
import EventForm from '../../components/news/event/EventForm';
import useLinkSubmit from '../../hooks/shared/useLinkSubmit';
import { CreateEventData } from '../../services/news/types/event';
import { createEvent } from '../../services/news/api/event';
import { messages } from '../../utils/shared/message';
import useConfigsPlatforms from '../../hooks/shared/useConfigsPlatforms';

function EventCreate() {
  const { eventPlatforms } = useConfigsPlatforms();
  const { createEventLink } = useLinkSubmit();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValues = {
    name: '',
    description: '',
    image: '',
    platform: '' as unknown as Platform,
    project: '' as unknown as number,
    link: searchParams.get('url') || '',
    chain: ChainType.EVM,
    reward: Reward.BADGE,
    startTime: Date.now(),
    endTime: Date.now() + 48 * 60 * 60 * 1000,
    supportIframe: true,
    editorScore: 0,
    types: [],
  };
  const formHandleRef = useRef(null);
  const [pending, setPending] = useState(false);
  const handleReset = () => formHandleRef.current?.resetForm();
  const handleSubmit = useCallback(
    async (form: CreateEventData) => {
      if (pending) return;
      try {
        setPending(true);
        const resp = await createEvent(form);
        const { code, msg } = resp.data;
        if (code === 0) {
          const respData = resp.data.data;
          toast.success(messages.event.admin_submit);
          handleReset();
          let platform = {};
          if (respData?.platform) {
            platform = respData?.platform;
          } else {
            const findPlatform = eventPlatforms.find(
              (item) => item.platform === form.platform
            );
            platform = findPlatform
              ? {
                  name: findPlatform.platform,
                  logo: findPlatform.platformLogo,
                }
              : {};
          }
          const linkData = {
            name: form.name,
            description: form.description,
            image: form.image,
            chain: form.chain,
            reward: form.reward,
            startTime: form.startTime,
            endTime: form.endTime,
            supportIframe: form.supportIframe,
            types: form.types,

            platform,
          };
          createEventLink(form.link, linkData);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setPending(false);
      }
    },
    [pending, eventPlatforms, createEventLink]
  );

  return (
    <EventForm
      initialValues={initialValues}
      loading={pending}
      onSubmit={handleSubmit}
      ref={formHandleRef}
    />
  );
}
export default EventCreate;
