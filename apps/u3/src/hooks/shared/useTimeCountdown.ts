/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-02 14:35:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-02 15:23:32
 * @Description: file description
 */
import React, { useEffect, useRef, useState } from 'react';

const defaultCountdownData = {
  distance: 0,
  day: 0,
  hour: 0,
  minute: 0,
  second: 0,
};
function useTimeCountdown(timestamp: number) {
  const [countdownData, setCountdownData] = useState(defaultCountdownData);
  const countdownDataIntervalRef = useRef<any>(null);
  useEffect(() => {
    if (timestamp > Date.now()) {
      countdownDataIntervalRef.current = setInterval(() => {
        const distance = timestamp - Date.now();
        const distanceDay = Math.floor(distance / (1000 * 60 * 60 * 24));
        const distanceHour = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const distanceMinute = Math.floor((distance / (1000 * 60)) % 60);
        const distanceSecond = Math.floor((distance / 1000) % 60);
        setCountdownData({
          distance,
          day: distanceDay,
          hour: distanceHour,
          minute: distanceMinute,
          second: distanceSecond,
        });
        if (distance === 0) {
          clearInterval(countdownDataIntervalRef.current);
        }
      }, 1000);
    } else {
      clearInterval(countdownDataIntervalRef.current);
      setCountdownData(defaultCountdownData);
    }
    return () => {
      clearInterval(countdownDataIntervalRef.current);
    };
  }, [timestamp]);
  return countdownData;
}

export default useTimeCountdown;
