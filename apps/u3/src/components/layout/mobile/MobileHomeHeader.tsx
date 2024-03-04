/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 15:54:26
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import { MobileHeaderWrapper } from './MobileHeaderCommon';
import SearchIconBtn from '../SearchIconBtn';

export default function MobileHomeHeader() {
  const navigate = useNavigate();
  return (
    <MobileHeaderWrapper>
      <div
        className="text-[#FFF] text-[16px] font-medium"
        onClick={() => navigate('/')}
      >
        Explore
      </div>
      <div className="flex items-center gap-[20px]">
        <SearchIconBtn />
      </div>
    </MobileHeaderWrapper>
  );
}
