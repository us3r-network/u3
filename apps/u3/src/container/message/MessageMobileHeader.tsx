/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import {
  MobileHeaderBackBtn,
  MobileHeaderWrapper,
} from '@/components/layout/mobile/MobileHeaderCommon';
import { MessageRoute, useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import ProfileInfoHeadless from '@/components/profile/info/ProfileInfoHeadless';
import LoginButtonV2Mobile from '@/components/layout/LoginButtonV2Mobile';
import SearchIconBtn from '@/components/layout/SearchIconBtn';

export default function MessageMobileHeader(
  props: ComponentPropsWithRef<'div'>
) {
  const { messageRouteParams, setMessageRouteParams } = useXmtpClient();
  const { route, peerAddress } = messageRouteParams;
  const isPrivateChat = route === MessageRoute.PRIVATE_CHAT;

  return (
    <MobileHeaderWrapper {...props}>
      {(() => {
        if (isPrivateChat) {
          return (
            <ProfileInfoHeadless identity={peerAddress}>
              {({ displayName }) => {
                return (
                  <MobileHeaderBackBtn
                    title={displayName}
                    onBackClick={() => {
                      setMessageRouteParams({
                        route: MessageRoute.HOME,
                        peerAddress: null,
                      });
                    }}
                  />
                );
              }}
            </ProfileInfoHeadless>
          );
        }
        return (
          <>
            <div className="text-[#FFF] text-[16px] font-medium">Messages</div>
            {/* <MobileHeaderBackBtn title="Messages" /> */}
            <div className="flex items-center gap-[20px]">
              <SearchIconBtn />
              <LoginButtonV2Mobile />
            </div>
          </>
        );
      })()}
    </MobileHeaderWrapper>
  );
}
