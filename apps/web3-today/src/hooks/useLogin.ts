/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 14:13:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 18:38:14
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import {
  useAuthentication,
  useSession,
} from '@us3r-network/auth-with-rainbowkit';
import { useU3Login } from '../contexts/U3LoginContext';
import { RoleType } from '../services/api/login';

export default () => {
  const session = useSession();
  const { user, u3IsLogin, u3logout } = useU3Login();

  const { signIn, signOut } = useAuthentication();
  const login = useCallback(() => {
    signIn();
  }, [signIn]);

  const logout = useCallback(() => {
    signOut();
    u3logout();
  }, [signOut, u3logout]);

  const isLogin = useMemo(() => !!session && u3IsLogin, [session, u3IsLogin]);

  const handleCallbackVerifyLogin = useCallback(
    (callback?: () => void) => {
      if (!isLogin) {
        login();
      } else if (callback) {
        callback();
      }
    },
    [isLogin, login]
  );

  const isAdmin = useMemo(() => user?.roles?.includes(RoleType.ADMIN), [user]);

  return {
    user,
    isLogin,
    isAdmin,
    login,
    logout,
    handleCallbackVerifyLogin,
  };
};
