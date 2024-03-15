/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddPostMobileBtn from '@/components/social/AddPostMobileBtn';
import {
  MobileHeaderBackBtn,
  MobileHeaderWrapper,
} from '@/components/layout/mobile/MobileHeaderCommon';
import SearchIconBtn from '@/components/layout/SearchIconBtn';
import LoginButtonV2Mobile from '@/components/layout/LoginButtonV2Mobile';

export default function ExploreMobileHeader(
  props: ComponentPropsWithRef<'div'>
) {
  const { pathname } = useLocation();
  const isHomePath = pathname === '/';
  const isCommunitiesPath = pathname.startsWith('/communities');
  const isPosterGalleryPath = pathname === '/poster-gallery';
  const isCasterDailyPath = pathname === '/caster-daily';
  const isPostsPath = pathname.startsWith('/social');
  const isPostDetailPath = pathname.startsWith('/social/post-detail');

  return (
    <MobileHeaderWrapper {...props}>
      {(() => {
        if (isHomePath) {
          return (
            <>
              <div className="text-[#FFF] text-[16px] font-medium">Explore</div>
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
                <LoginButtonV2Mobile />
              </div>
            </>
          );
        }
        if (isCommunitiesPath) {
          return (
            <>
              <div className="text-[#FFF] text-[16px] font-medium">
                Communities
              </div>
              {/* <MobileHeaderBackBtn title="Communities" backToPath="/" /> */}
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
                <LoginButtonV2Mobile />
              </div>
            </>
          );
        }
        if (isPosterGalleryPath) {
          return <MobileHeaderBackBtn title="Poster Gallery" />;
        }
        if (isCasterDailyPath) {
          return <MobileHeaderBackBtn title="Caster Daily" />;
        }
        if (isPostsPath) {
          return (
            <>
              <MobileHeaderBackBtn
                title="Posts"
                backToPath={isPostDetailPath ? undefined : '/'}
              />
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
                <LoginButtonV2Mobile />
              </div>
              <AddPostMobileBtn />
            </>
          );
        }
        return null;
      })()}
    </MobileHeaderWrapper>
  );
}
