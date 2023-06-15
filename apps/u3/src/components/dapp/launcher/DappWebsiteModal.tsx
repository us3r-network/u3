import styled from 'styled-components';
import useDappWebsite from '../../../hooks/useDappWebsite';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import ImgDefault from '../../common/ImgDefault';
import DappWebsitePreview from './DappWebsitePreview';

import PowerSvg from '../../common/icons/svgs/power.svg';
import useFullScreen from '../../../hooks/useFullScreen';
import ButtonFullScreen from '../../common/button/ButtonFullScreen';

export default function DappWebsiteModal() {
  const { isOpenDappModal, dappModalData, closeDappModal } = useDappWebsite();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  return isOpenDappModal ? (
    <DappWebsiteModalWrapper>
      <Header>
        <HeaderLeft>
          {dappModalData?.image && <DappImg src={dappModalData.image} />}
          {dappModalData?.name && <DappName>{dappModalData.name}</DappName>}
        </HeaderLeft>
        <HeaderRight>
          <ButtonFullScreen isFullscreen={isFullscreen} onClick={onToggle} />
          <RightLine />
          <CloseButton onClick={closeDappModal}>
            <ButtonIcon src={PowerSvg} />
          </CloseButton>
        </HeaderRight>
      </Header>
      <Body ref={ref}>
        {isFullscreen && (
          <ExitFullScreenButton
            isFullscreen={isFullscreen}
            onClick={onToggle}
          />
        )}
        {dappModalData && <DappWebsitePreview data={dappModalData} />}
      </Body>
    </DappWebsiteModalWrapper>
  ) : null;
}

const DappWebsiteModalWrapper = styled.div`
  width: calc(100vw - 60px);
  height: 100vh;
  background: #1b1e23;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  width: 100%;
  height: 60px;
  padding: 14px;
  border-bottom: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;
const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;
const DappImg = styled(ImgDefault)`
  width: 40px;
  height: 40px;
  border: 1px solid #39424c;
  border-radius: 10px;
`;
const DappName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;
const RightLine = styled.div`
  width: 1px;
  height: 10px;
  background: #718096;
`;
const CloseButton = styled(ButtonPrimaryLine)`
  width: 32px;
  height: 32px;
  padding: 6px;
`;
const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const Body = styled.div`
  flex: 1;
  position: relative;
`;
const ExitFullScreenButton = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
