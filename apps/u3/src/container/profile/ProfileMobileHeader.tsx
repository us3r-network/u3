/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  MobileHeaderBackBtn,
  MobileHeaderWrapper,
} from '@/components/layout/mobile/MobileHeaderCommon';

export default function ProfileMobileHeader(
  props: ComponentPropsWithRef<'div'>
) {
  const { pathname } = useLocation();
  const { user } = useParams();
  // const isPostsPath = pathname === '/u';
  // const isContactsPath = pathname === '/u/contacts';
  // const isActivityPath = pathname === '/u/activity';
  const isFavPath = pathname === '/u/fav';

  return (
    <MobileHeaderWrapper {...props}>
      {(() => {
        if (isFavPath) {
          return <MobileHeaderBackBtn title="My Favorites" />;
        }
        return <MobileHeaderBackBtn title={user || 'My Profile'} />;
      })()}
    </MobileHeaderWrapper>
  );
}
