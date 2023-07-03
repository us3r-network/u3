/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 17:47:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 10:45:10
 * @Description: file description
 */
import styled from 'styled-components';

const ScrollBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: overlay;
  box-sizing: border-box;
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 2px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: rgba(0, 0, 0, 0.3);
    box-shadow: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(17, 16, 16, 0.13);
    -webkit-box-shadow: rgba(0, 0, 0, 0.9);
    box-shadow: rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: #1b1e23;
  }
`;
export default ScrollBox;
