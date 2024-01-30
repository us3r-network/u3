export const requestPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
};

export const sendNotification = async (body) => {
  console.log('sendNotification', body);
  if (Notification.permission === 'granted') {
    showNotification(body);
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      showNotification(body);
    }
  }
};

const showNotification = async (body) => {
  const registration = await navigator.serviceWorker.getRegistration();
  const title = 'U3 - Your Web3 Gateway';

  const payload = {
    body,
    icon: `${process.env.PUBLIC_URL}/logo192.png`,
  };

  if ('showNotification' in registration) {
    console.log('showNotification in registration', title, payload);
    registration.showNotification(title, payload);
  } else {
    console.log('showNotification NOT in registration', title, payload);
    // eslint-disable-next-line no-new
    new Notification(title, payload);
  }
};
