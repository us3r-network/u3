import { useState } from 'react';
import WebPushService from '@/utils/pwa/WebPushService';
import { showNotification } from '@/utils/pwa/notification';

export function NotificationSettingsGroup() {
  const [push, setPush] = useState(false);

  const handlePushChange = async (e) => {
    const { checked } = e.target;
    setPush(checked);
    try {
      if (!checked) {
        const payload = await WebPushService.unsubscribe();
        if (payload) {
          unsubscribeFromWebPush(payload); // server
        }
        return;
      }
      if (!WebPushService.hasPermission()) {
        await WebPushService.requestPermission();
      }
      let subscription = await WebPushService.getSubscription();
      if (!subscription) {
        subscription = await WebPushService.subscribe();
      }
      subscribeToWebPush(subscription); // server
      console.log('Subscribed to web push');
      // console.log('unreadFarcasterCount', unreadFarcasterCount);
      showNotification(`You have subscrib notifications`);
    } catch (error) {
      setPush(!checked);
      console.error(error);
    }
  };

  return (
    // <div>
    //   <p>Web Push</p>
    <input type="checkbox" checked={push} onChange={handlePushChange} />
    // </div>
  );
}

function unsubscribeFromWebPush(payload) {
  // send payload to server
}
function subscribeToWebPush(payload) {
  // send payload to server
}
