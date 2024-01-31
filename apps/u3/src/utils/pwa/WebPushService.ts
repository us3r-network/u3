class WebPushService {
  static hasPermission() {
    return Notification.permission === 'granted';
  }

  static async requestPermission() {
    return Notification.requestPermission();
  }

  static async getSubscription() {
    return navigator.serviceWorker.ready.then(async (registration) => {
      return registration.pushManager.getSubscription();
    });
  }

  static async subscribe() {
    const applicationServerKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
    if (!applicationServerKey) {
      throw new Error('VAPID public key not found');
    }
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      throw new Error('Service Worker not ready');
    }
    if (!('pushManager' in registration)) {
      throw new Error("PushManager isn't available");
    }
    if (!('subscribe' in registration.pushManager)) {
      throw new Error('subscribe method not available');
    }
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    return subscription;
  }

  static async unsubscribe() {
    const subscription = await this.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
    return subscription;
  }
}

export default WebPushService;
