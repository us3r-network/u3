import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WebPushService from '@/utils/pwa/WebPushService';
import { sendNotification } from '@/utils/pwa/notification';
import {
  NotificationSetting,
  NotificationSettingType,
} from '@/services/notification/types/notification-settings';
import useLogin from '@/hooks/shared/useLogin';
import {
  addNotificationSetting,
  fethNotificationSettings,
  updateNotificationSetting,
} from '@/services/notification/api/notification-settings';
import { ApiRespCode } from '@/services/shared/types';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import Switch from '../common/switch/Switch';

export function NotificationSettingsGroup() {
  const { currFid } = useFarcasterCtx();
  const { isLogin } = useLogin();
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loadingTypes, setLoadingTypes] = useState<NotificationSettingType[]>(
    []
  );
  const [settingsLoading, setSettingsLoading] = useState(true);
  useEffect(() => {
    if (isLogin) {
      setSettingsLoading(true);
      fethNotificationSettings()
        .then((res) => {
          setSettings(res?.data?.data || []);
        })
        .catch((err) => {
          console.log(err);
          setSettings([]);
        })
        .finally(() => {
          setSettingsLoading(false);
        });
    } else {
      setSettings([]);
    }
  }, []);

  const upsertSetting = async (setting: Partial<NotificationSetting>) => {
    if (!isLogin) return;
    const index = settings.findIndex((s) => s.type === setting.type);

    try {
      setLoadingTypes((prev) => {
        if (prev.includes(setting.type)) return prev;
        return [...prev, setting.type];
      });
      if (index >= 0 && settings[index]?.id) {
        // update
        const res = await updateNotificationSetting(settings[index].id, {
          ...settings[index],
          ...setting,
        });
        if (res.data.code === ApiRespCode.SUCCESS) {
          setSettings((prev) => {
            return [
              ...prev.slice(0, index),
              {
                ...prev[index],
                ...setting,
              },
              ...prev.slice(index + 1),
            ] as NotificationSetting[];
          });
        }
      } else {
        // add
        const res = await addNotificationSetting({
          type: setting.type,
          ...setting,
        });
        if (res.data.code === ApiRespCode.SUCCESS) {
          setSettings((prev) => {
            return [...prev, res.data.data] as NotificationSetting[];
          });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    } finally {
      setLoadingTypes((prev) => {
        if (prev.includes(setting.type)) {
          return prev.filter((t) => t !== setting.type);
        }
        return prev;
      });
    }
  };

  const webpushSubscribed = settings.some(
    (setting) =>
      setting.type === NotificationSettingType.WEB_PUSH &&
      setting?.enable === true &&
      !!setting?.subscription
  );

  console.log('settings', settings);

  const webpushLoading = loadingTypes.includes(
    NotificationSettingType.WEB_PUSH
  );
  const webpushDisabled = settingsLoading || webpushLoading;

  const handlePushChange = async (checked: boolean) => {
    try {
      if (!checked) {
        toast.info('checked: false');
        const payload = await WebPushService.unsubscribe();
        toast.info(`payload: ${JSON.stringify(payload)}`);
        if (payload) {
          // unsubscribeFromWebPush(payload); // server
          await upsertSetting({
            type: NotificationSettingType.WEB_PUSH,
            fid: currFid ? String(currFid) : undefined,
            enable: checked,
            subscription: JSON.stringify(payload),
          });
        }
      } else {
        toast.info('checked: true');
        if (!WebPushService.hasPermission()) {
          await WebPushService.requestPermission();
        }
        let subscription = await WebPushService.getSubscription();
        if (!subscription) {
          subscription = await WebPushService.subscribe();
        }
        toast.info(`subscription: ${JSON.stringify(subscription)}`);

        // subscribeToWebPush(subscription); // server
        await upsertSetting({
          type: NotificationSettingType.WEB_PUSH,
          fid: currFid ? String(currFid) : undefined,
          enable: checked,
          subscription: JSON.stringify(subscription),
        });
        sendNotification(`You have subscribe notifications`);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    // <div>
    //   <p>Web Push</p>
    <>
      <Switch
        onColor="#5057AA"
        disabled={webpushDisabled}
        checked={webpushSubscribed}
        onChange={handlePushChange}
      />
      webpushLoading: {String(webpushLoading)}
      <br />
      webpushDisabled: {String(webpushDisabled)}
      <br />
      webpushSubscribed: {String(webpushSubscribed)}
      <br />
      navigator.serviceWorker: {String(Boolean(navigator.serviceWorker))}
    </>
    // </div>
  );
}
