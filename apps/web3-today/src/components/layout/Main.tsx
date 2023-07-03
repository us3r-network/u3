/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 18:35:10
 * @Description:
 */
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import { CutomRouteObject, RoutePermission, routes } from '../../route/routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useU3Extension from '../../hooks/useU3Extension';
import {
  selectWebsite,
  setU3ExtensionInstalled,
} from '../../features/website/websiteSlice';
import EventCompleteGuideModal from '../event/EventCompleteGuideModal';
import useLogin from '../../hooks/useLogin';
import NoLogin from './NoLogin';
// import usePreference from '../../hooks/usePreference';
// import OnboardModal from '../onboard/OnboardModal';

// import {
//   fetchUserKarma,
//   selectKarmaState,
//   checkIn,
// } from '../../features/profile/karma';
// import { Atom02 } from '../icons/atom';
// import { store } from '../../store/store';

function Main() {
  const dispatch = useAppDispatch();
  // const session = useSession();
  // const { profile, updateProfile, profileLoading } = useProfileState();
  const { isLogin, user, isAdmin } = useLogin();
  const { openEventCompleteGuideModal, eventCompleteGuideEndCallback } =
    useAppSelector(selectWebsite);
  const { u3ExtensionInstalled } = useU3Extension();
  useEffect(() => {
    dispatch(setU3ExtensionInstalled(u3ExtensionInstalled));
  }, [u3ExtensionInstalled]);

  // const { preferenceList } = usePreference(user?.token);

  // useEffect(() => {
  //   if (!user?.token) return;
  //   dispatch(fetchUserKarma({ token: user?.token }));
  // }, [user?.token]);

  const renderElement = useCallback(
    ({ element, permissions }: CutomRouteObject) => {
      if (permissions) {
        // 需要以登录为前提的权限
        if (isLogin) {
          // 验证admin权限
          if (permissions.includes(RoutePermission.admin)) {
            if (isAdmin) {
              return element;
            }
            return <NoPermission>Need Admin Permission</NoPermission>;
          }
          return element;
        }
        // 没有登录但需要登录权限
        if (permissions.includes(RoutePermission.login)) {
          return <NoLogin />;
        }
      }
      return element;
    },
    [isLogin, isAdmin]
  );
  const routesMap = routes.map((item) => ({
    ...item,
    element: renderElement(item),
  }));
  const renderRoutes = useRoutes(routesMap);
  // const { checked } = useAppSelector(selectKarmaState);

  return (
    <MainWrapper id="main-wrapper">
      {renderRoutes}
      <EventCompleteGuideModal
        isOpen={openEventCompleteGuideModal}
        onGuideEnd={eventCompleteGuideEndCallback}
      />
      {/* {!isMobile && (
        <OnboardModal
          show={
            !!session?.id &&
            !profileLoading &&
            !!profile &&
            (!profile?.tags || profile.tags.length === 0)
          }
          lists={preferenceList}
          finishAction={async (data) => {
            await updateProfile({
              tags: data.tags,
            });
          }}
        />
      )} */}

      {/* {!isMobile && !checked && (
        <KarmaGMBox>
          <KarmaGM
            onClick={() => {
              if (!user?.token) return;
              store.dispatch(checkIn({ token: user?.token }));
            }}
          >
            <Atom02 />
            GM
          </KarmaGM>
        </KarmaGMBox>
      )} */}
    </MainWrapper>
  );
}
export default Main;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const NoPermission = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #ffffff;
`;

const KarmaGMBox = styled.div`
  position: absolute;
  right: 130px;
`;

const KarmaGM = styled.div`
  position: fixed;
  transition: all 0.3s ease-out;
  bottom: 24px;
  color: #fff;
  padding: 4px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 106px;
  height: 48px;
  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  border-radius: 10px;

  font-size: 24px;
  line-height: 28px;

  cursor: pointer;
`;
