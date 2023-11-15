import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useUserData from 'src/hooks/social/farcaster/useUserData';
import SettingIcon from 'src/components/common/icons/setting';

import { SocialPlatform } from '../../../services/social/types';
import LensIcon from '../../common/icons/LensIcon';
import FarcasterIcon from '../../common/icons/FarcasterIcon';
import { SocialButtonPrimary } from '../../social/button/SocialButton';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';

export type PlatformAccountsData = Array<{
  platform: SocialPlatform;
  avatar: string;
  name: string;
  handle: string;
  id: string | number;
  bio: string;
  address?: string;
}>;
interface PlatformAccountsProps extends StyledComponentPropsWithRef<'div'> {
  data: PlatformAccountsData;
  isLoginUser?: boolean;
  isSelf: boolean;
}
export default function PlatformAccounts({
  isSelf,
  data,
  isLoginUser,
  ...wrapperProps
}: PlatformAccountsProps) {
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const {
    isConnected: isLoginFarcaster,
    openFarcasterQR,
    currFid,
    currUserInfo,
    setSignerSelectModalOpen,
  } = useFarcasterCtx();
  const findLensAccount = data?.find(
    (item) => item.platform === SocialPlatform.Lens
  );
  const findFarcasterAccount = data?.find(
    (item) => item.platform === SocialPlatform.Farcaster
  );

  const userInfo = useUserData(currUserInfo?.[currFid]);

  return (
    <Wrapper {...wrapperProps}>
      {isLoginUser && !findLensAccount && (
        <Row>
          <Line />
          <LensIcon width="40px" height="40px" />
          <Center>
            <LoginButton onClick={() => setOpenLensLoginModal(true)}>
              {isLoginLens ? 'bind' : 'login'}
            </LoginButton>
          </Center>
        </Row>
      )}
      {isLoginUser && !findFarcasterAccount && (
        <Row>
          <Line />
          <FarcasterIcon width="40px" height="40px" />
          <Center>
            <LoginButton onClick={() => openFarcasterQR()}>
              {isLoginFarcaster ? 'bind' : 'login'}
            </LoginButton>
          </Center>
        </Row>
      )}

      {data.map((item) => {
        if (isSelf && item.platform === SocialPlatform.Farcaster) {
          return null;
        }
        return (
          <Row key={item.handle}>
            <Line />
            <Avatar src={item.avatar} />
            <Center>
              {!!item.name && <Name>{item.name}</Name>}
              {!!item.handle && <Handle>@{item.handle}</Handle>}
            </Center>

            {(() => {
              switch (item.platform) {
                case SocialPlatform.Lens:
                  return <LensIcon width="20px" height="20px" />;
                case SocialPlatform.Farcaster:
                  return <FarcasterIcon width="20px" height="20px" />;
                default:
                  return null;
              }
            })()}
          </Row>
        );
      })}
      {isSelf && currFid && currUserInfo && (
        <Row>
          <Line />
          <div className="avatar">
            <Avatar src={userInfo.avatar} />
            <FarcasterIcon width="20px" height="20px" className="platform" />
          </div>
          <Center>
            {!!userInfo.name && <Name>{userInfo.name}</Name>}
            {!!userInfo.handle && <Handle>@{userInfo.handle}</Handle>}
          </Center>
          <button
            className="setting"
            type="button"
            onClick={() => {
              setSignerSelectModalOpen(true);
            }}
          >
            <SettingIcon />
          </button>
        </Row>
      )}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  position: relative;

  .avatar {
    position: relative;
    > .platform {
      position: absolute;
      bottom: 2px;
      left: 0px;
    }
  }

  button.setting {
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }
`;
const Line = styled.div`
  width: 0px;
  height: 20px;
  border-left: 1px dashed #718096;
  position: absolute;
  top: 0px;
  left: 20px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 5px;
  // 超出显示省略号
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Name = styled.div`
  color: #fff;

  /* Text/Body 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
const Handle = styled.div`
  color: #718096;

  /* Text/Body 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

const LoginButton = styled(SocialButtonPrimary)`
  width: 60px;
  height: 24px;
  font-size: 12px;
  font-weight: 400;
`;
