import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../../hooks/shared/useLogin';
import DappWebsiteModal from './DappWebsiteModal';
import { ReactComponent as PlusSquareSvg } from '../../common/assets/svgs/plus-square.svg';
import DappInstallList from './DappInstallList';
import ExploreDappsNavBtn from './ExploreDappsNavBtn';

export default function DappMenu() {
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const [isOpen, setIsOpen] = useState(false);
  const dappInstallListRef = useRef(null);
  return (
    <Wrapper
      isOpen={isOpen}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        if (dappInstallListRef.current) {
          dappInstallListRef.current.setHandlesItemId(null);
        }
      }}
    >
      {!isOpen && <OpenIcon>{'<'}</OpenIcon>}
      <ListWrapper isOpen={isOpen}>
        <ListInner
          onScroll={() => {
            if (dappInstallListRef.current) {
              dappInstallListRef.current.updatePopperStyle();
            }
          }}
        >
          <Title>Your Dapps</Title>
          <ExploreDappsNavBtn />
          <DappInstallList ref={dappInstallListRef} />
        </ListInner>
        {isAdmin && (
          <PlusSquareSvg
            className="submit-btn"
            onClick={() => {
              navigate('/dapp-store/create');
            }}
          />
        )}
      </ListWrapper>
      <DappWebsiteModal />
    </Wrapper>
  );
}
const Wrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '60px' : '30px')};
  height: 100vh;
  padding: 20px 0px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  border-left: 1px solid #39424c;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  gap: 20;
  transition: all 0.3s ease-out;
`;

const OpenIcon = styled.div`
  width: 30px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #718096;
`;
const ListWrapper = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '60px' : '0px')};
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease-out;
  .submit-btn {
    width: 40px;
    height: 40px;
    cursor: pointer;
    &:hover {
      path {
        stroke: #fff;
        transition: all 0.3s ease-out;
      }
    }
  }
`;
const ListInner = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  overflow-y: auto;
`;
const Title = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #718096;
`;
