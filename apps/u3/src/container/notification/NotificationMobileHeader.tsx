/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import { MobileHeaderWrapper } from '@/components/layout/mobile/MobileHeaderCommon';
import LoginButtonV2Mobile from '@/components/layout/LoginButtonV2Mobile';
import SearchIconBtn from '@/components/layout/SearchIconBtn';

export default function FavMobileHeader(props: ComponentPropsWithRef<'div'>) {
  return (
    <MobileHeaderWrapper {...props}>
      <div className="text-[#FFF] text-[16px] font-medium">Notifications</div>
      <div className="flex items-center gap-[20px]">
        <SearchIconBtn />
        <LoginButtonV2Mobile />
      </div>
    </MobileHeaderWrapper>
  );
}
