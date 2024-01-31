/* eslint-disable */

// listen for push event
self.addEventListener('push', (event) => {
  let { title, body, icon } = event.data.json();
  if (!title || title === 'undefined') title = 'U3 - Your Web3 Gateway';
  if (!body) return;
  self.registration.showNotification(title, {
    body,
    icon: icon || `logo192.png`,
  });
});
