/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2022-12-14 18:00:00
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2022-12-12 14:49:05
 * @Description: u3-chrome-extension 会给页面发送消息，如果接收到这个消息，说明extension已经安装
 */
import { useEffect, useState } from 'react';

export default () => {
  const [u3ExtensionInstalled, setU3ExtensionInstalled] = useState(false);
  useEffect(() => {
    function checkMessage(event) {
      if (
        event.source === window &&
        event.data.sender &&
        event.data.sender === 'u3-extension' &&
        event.data.message_name &&
        event.data.message_name === 'version'
      ) {
        console.log('Got the message', event.data);
        setU3ExtensionInstalled(true);
      }
    }
    window.addEventListener('message', checkMessage);
    // return () => window.removeEventListener('message', checkMessage);
  }, []);
  return { u3ExtensionInstalled };
};
