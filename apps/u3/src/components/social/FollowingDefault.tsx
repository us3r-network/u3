/* eslint-disable react/destructuring-assignment */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { isMobile } from 'react-device-detect';
import { SocialButtonPrimary } from './button/SocialButton';
import LensIcon from '../common/icons/LensIcon';
import FarcasterIcon from '../common/icons/FarcasterIcon';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';

export default function FollowingDefault(
  props: StyledComponentPropsWithRef<'div'> & {
    lens?: boolean;
    farcaster?: boolean;
  }
) {
  const { setOpenLensLoginModal, isLoginPending } = useLensCtx();
  const { openFarcasterQR } = useFarcasterCtx();
  return (
    <Wrapper {...props}>
      <NothingImg src="/social/imgs/following-default.png" />
      <Description>There is nothing here.</Description>
      <Description>
        You need at least one handle to view following posts.
      </Description>
      <BtnsWrapper>
        {props.lens && (
          <LensLoginBtn
            onClick={() => setOpenLensLoginModal(true)}
            disabled={isLoginPending}
          >
            <LensIcon />
            <LensLoginText>Lens handle verify</LensLoginText>
          </LensLoginBtn>
        )}
        {props.farcaster && (
          <FarcasterLoginBtn onClick={() => openFarcasterQR()}>
            <FarcasterIcon />
            <FarcasterLoginText>Farcaster handle verify</FarcasterLoginText>
          </FarcasterLoginBtn>
        )}
      </BtnsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: ${isMobile ? '0px' : '60px'};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;
const NothingImg = styled.img`
  width: 400px;
  max-width: 100%;
  object-fit: cover;
`;
const Description = styled.span`
  color: #718096;
  text-align: center;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const BtnsWrapper = styled.div`
  display: flex;
  gap: 20px;
  ${isMobile ? 'flex-direction: column;' : ''}
`;
const PlatformLoginButton = styled(SocialButtonPrimary)`
  padding: 10px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
`;
const PlatformLoginText = styled.span`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const LensLoginBtn = styled(PlatformLoginButton)`
  background: #9bea1d;
`;
const LensLoginText = styled(PlatformLoginText)`
  color: #000;
`;
const FarcasterLoginBtn = styled(PlatformLoginButton)`
  background: #7e5abf;
`;
const FarcasterLoginText = styled(PlatformLoginText)`
  color: #fff;
`;
