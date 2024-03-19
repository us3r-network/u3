import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../../hooks/shared/useLogin';
import DappWebsiteModal from './DappWebsiteModal';
import { ReactComponent as PlusSquareSvg } from '../../common/assets/svgs/plus-square.svg';
import DappInstallList from './DappInstallList';
import ExploreDappsNavBtn from './ExploreDappsNavBtn';
import { cn } from '@/lib/utils';

export default function DappMenu() {
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const [isOpen, setIsOpen] = useState(false);
  const dappInstallListRef = useRef(null);
  return (
    <div
      className={cn(
        `bg-[#14171A] h-screen px-0 py-[20px] fixed top-[0] right-[0] box-border overflow-x-hidden flex justify-center gap-[20] [transition:all_0.3s_ease-out]`,
        isOpen ? 'w-[60px]' : 'w-[30px]',
        'max-sm:w-0 max-sm:hidden'
      )}
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
          <Title>Your Apps</Title>
          <ExploreDappsNavBtn />
          <DappInstallList ref={dappInstallListRef} />
        </ListInner>
        {isAdmin && (
          <PlusSquareSvg
            className="submit-btn"
            onClick={() => {
              navigate('/apps/create');
            }}
          />
        )}
      </ListWrapper>
      <DappWebsiteModal />
    </div>
  );
}

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
  width: 40px;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #718096;
`;
