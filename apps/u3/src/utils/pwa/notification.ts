export const requestPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
};

export const showNotification = async (title) => {
  if (!('Notification' in window)) {
    throw new Error('Notification not supported');
  }
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
  return new window.Notification(title);
  console.log('showNotification', title);
};
