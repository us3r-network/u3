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
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
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
