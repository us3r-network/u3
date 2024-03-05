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
import ColorButton from '@/components/common/button/ColorButton';

export default function ExploreMobileHeader(
  props: ComponentPropsWithRef<'div'>
) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePath = pathname === '/';
  const isCommunitiesPath = pathname === '/communities';
  const isPosterGalleryPath = pathname === '/poster-gallery';
  const isCasterDailyPath = pathname === '/caster-daily';
  const isPostsPath = pathname.startsWith('/social');

  return (
    <MobileHeaderWrapper {...props}>
      {(() => {
        if (isHomePath) {
          return (
            <>
              <div
                className="text-[#FFF] text-[16px] font-medium"
                onClick={() => navigate('/')}
              >
                Explore
              </div>
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
                <ColorButton
                  onClick={() => {
                    navigate('/caster-daily');
                  }}
                >
                  Mint
                </ColorButton>
              </div>
            </>
          );
        }
        if (isCommunitiesPath) {
          return (
            <>
              <MobileHeaderBackBtn title="Communities" />
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
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
              <MobileHeaderBackBtn title="Posts" />
              <div className="flex items-center gap-[20px]">
                <SearchIconBtn />
                <AddPostMobileBtn />
              </div>
            </>
          );
        }
        return null;
      })()}
    </MobileHeaderWrapper>
  );
}
