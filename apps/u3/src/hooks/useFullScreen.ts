/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 14:12:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 15:19:50
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
import screenfull from 'screenfull';

export default () => {
  // 是否已全屏
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const screenfullChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };
    if (screenfull.isEnabled) {
      screenfull.on('change', screenfullChange);
    }
    return () => screenfull.off('change', screenfullChange);
  }, []);
  const [el, setEl] = useState<Element | null>(null);
  // 指定元素引用
  const ref = useCallback((e: Element) => {
    setEl(e);
  }, []);
  // 全屏
  const onRequest = useCallback(() => {
    screenfull.request(el);
  }, [el]);
  // 取消全屏
  const onExit = useCallback(() => {
    screenfull.exit();
  }, []);
  // 切换全屏
  const onToggle = useCallback(() => {
    screenfull.toggle(el);
  }, [el]);
  return { ref, isFullscreen, onRequest, onExit, onToggle };
};
