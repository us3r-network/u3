export const requestPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
};

export const showNotification = async (title, payload) => {
  console.log('start showNotification......');
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
  console.log('showNotification', title, payload);
  return new window.Notification(title, payload);
};

const registration = await navigator.serviceWorker.getRegistration();

export const sendNotification = async (body) => {
  console.log('sendNotification', body);
  if (Notification.permission === 'granted') {
    showNotification2(body);
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      showNotification2(body);
    }
  }
};

const showNotification2 = (body) => {
  const title = 'U3 - Your WEb3 Gateway';

  const payload = {
    body,
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
