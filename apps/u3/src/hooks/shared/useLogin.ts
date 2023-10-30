/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 14:13:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-23 14:21:10
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import {
  useAuthentication,
  useSession,
} from '@us3r-network/auth-with-rainbowkit';
import { useU3Login } from '../../contexts/U3LoginContext';
import { RoleType } from '../../services/shared/api/login';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import { getAddressWithDidPkh } from '../../utils/shared/did';

export default () => {
  const session = useSession();
  const { user, u3IsLogin, u3logout } = useU3Login();
  const { disconnectXmtp } = useXmtpClient();

  const { signIn, signOut } = useAuthentication();
  const login = useCallback(async () => {
    await signIn();
  }, [signIn]);

  const logout = useCallback(() => {
    signOut();
    u3logout();
    disconnectXmtp();
  }, [signOut, u3logout, disconnectXmtp]);

  const isLogin = useMemo(() => !!session && u3IsLogin, [session, u3IsLogin]);

  const walletAddress = useMemo(
    () => (isLogin && session?.id ? getAddressWithDidPkh(session.id) : null),
    [session, isLogin]
  );

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
    walletAddress,
    isLogin,
    isAdmin,
    login,
    logout,
    handleCallbackVerifyLogin,
  };
};
