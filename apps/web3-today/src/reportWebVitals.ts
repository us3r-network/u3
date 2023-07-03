/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 10:00:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 16:50:12
 * @Description: file description
 */
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch(() => {});
  }
};

export default reportWebVitals;
