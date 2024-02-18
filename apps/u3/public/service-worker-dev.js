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

// 监听通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    // 获取所有clients
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clients) => {
        if (!clients || clients.length === 0) {
          // 当不存在client时，打开该网站
          if (self.clients.openWindow) self.clients.openWindow('/notification');
          return;
        }
        // 切换到该站点的tab
        if (clients[0].focus) clients[0].focus();
        clients.forEach((client) => {
          // 使用postMessage进行通信
          client.postMessage(event.action);
        });
      })
  );
});