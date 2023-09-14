import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SocialButtonPrimary } from './button/SocialButton';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import { useLensCtx } from '../../contexts/AppLensCtx';
import { useFarcasterCtx } from '../../contexts/FarcasterCtx';

export default function FollowingDefault(
  props: StyledComponentPropsWithRef<'div'>
) {
  const { setOpenLensLoginModal } = useLensCtx();
  const { openFarcasterQR } = useFarcasterCtx();
  return (
    <Wrapper {...props}>
      <NothingImg src="/social/imgs/following-default.png" />
      <Description>There is nothing here.</Description>
      <Description>
        You need at least one handle to view following posts.
      </Description>
      <BtnsWrapper>
        <LensLoginBtn onClick={() => setOpenLensLoginModal(true)}>
          <LensIcon />
          <LensLoginText>Lens handle verify</LensLoginText>
        </LensLoginBtn>
        <FarcasterLoginBtn onClick={() => openFarcasterQR()}>
          <FarcasterIcon />
          <FarcasterLoginText>Farcaster handle verify</FarcasterLoginText>
        </FarcasterLoginBtn>
      </BtnsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;
const NothingImg = styled.img`
  width: 400px;
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
