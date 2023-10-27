/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-28 16:19:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 22:30:49
 * @Description: file description
 */
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowCircleLeft } from '../../common/assets/svgs/arrow-circle-left.svg';
import { ReactComponent as IconFilterFunnel } from '../../common/assets/svgs/filter-funnel.svg';
import { ReactComponent as IconRefresh } from '../../common/assets/svgs/refresh.svg';
import {
  ButtonPrimary,
  ButtonPrimaryLine,
} from '../../common/button/ButtonBase';

export default function MobileHeaderLayout({
  name,
  displayFilter,
  filterSelectEl,
  onReset,
  onSubmit,
}: {
  name: string;
  displayFilter?: boolean;
  filterSelectEl?: ReactNode;
  onReset?: () => void;
  onSubmit?: () => void;
}) {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <MobileHeaderLayoutWrapper>
      <IconArrowCircleLeft onClick={() => navigate(-1)} />
      <Title>{name}</Title>
      {displayFilter && (
        <>
          <IconFilterFunnel
            onClick={() => {
              setOpenFilter(!openFilter);
            }}
          />
          <FilterSelectModal isOpen={openFilter}>
            <FilterSelectModalInner>
              <FilterSelectWrapper>
                <FilterSelectInner>{filterSelectEl}</FilterSelectInner>
                <FilterSelectButtons>
                  <ButtonPrimaryLine
                    onClick={() => {
                      if (onReset) onReset();
                      setOpenFilter(false);
                    }}
                  >
                    <IconRefresh />
                  </ButtonPrimaryLine>
                  <FilterSubmitBtn
                    onClick={() => {
                      if (onSubmit) onSubmit();
                      setOpenFilter(false);
                    }}
                  >
                    Save
                  </FilterSubmitBtn>
                </FilterSelectButtons>
              </FilterSelectWrapper>
            </FilterSelectModalInner>
          </FilterSelectModal>
        </>
      )}
    </MobileHeaderLayoutWrapper>
  );
}
const MobileHeaderLayoutWrapper = styled.div`
  background: #1b1e23;
  width: 100%;
  height: 56px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 10px;
  border-bottom: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  gap: 20;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const FilterSelectModal = styled.div<{ isOpen: boolean }>`
  width: 100vw;
  height: ${({ isOpen }) => (isOpen ? 'calc(100vh - 56px)' : '0px')};
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 56px;
  left: 0;
  overflow: hidden;
  transition: all 0.3s;
`;
const FilterSelectModalInner = styled.div`
  width: 100%;
`;
const FilterSelectWrapper = styled.div`
  width: 100%;
  max-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background: #1b1e23;
`;
const FilterSelectInner = styled.div`
  height: 0;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  box-sizing: border-box;
`;
const FilterSelectButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: solid 1px #39424c;
  gap: 20px;
`;
const FilterSubmitBtn = styled(ButtonPrimary)`
  width: 0;
  flex: 1;
  max-width: 263px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
