/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:17:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 15:56:34
 * @Description: file description
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useLogin from '../../hooks/useLogin';
import { CutomNavObject, navs } from '../../route/nav';
import useRoute from '../../route/useRoute';

type Props = {
  onlyIcon?: boolean;
};

export default function Nav({ onlyIcon }: Props) {
  const { isLogin, isAdmin } = useLogin();
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const [openGroupKeys, setOpenGroupKeys] = useState<Array<string>>([]);
  const handleGroupClick = useCallback(
    (key: string) => {
      if (openGroupKeys.includes(key)) {
        setOpenGroupKeys([...openGroupKeys.filter((item) => item !== key)]);
      } else {
        setOpenGroupKeys([...openGroupKeys, key]);
      }
    },
    [openGroupKeys, setOpenGroupKeys]
  );
  const navItemIsActive = useCallback(
    (nav: CutomNavObject) => nav.activeRouteKeys.includes(firstRouteMeta.key),
    [firstRouteMeta]
  );

  const groupChidrenInnerEls = useRef(new WeakMap());
  const navItemTextInnerEls = useRef(new WeakMap());
  const renderNavItemText = useCallback(
    (nav: CutomNavObject) => {
      if (navItemTextInnerEls.current.has(nav)) {
        const innerEl = navItemTextInnerEls.current.get(nav);
        innerEl.parentElement.style.width = onlyIcon
          ? '0px'
          : `${innerEl.scrollWidth}px`;
      }
      return (
        <PcNavItemTextBox>
          <PcNavItemTextInner
            ref={(el) => {
              if (el) {
                navItemTextInnerEls.current.set(nav, el);
              }
            }}
          >
            {nav.name}
          </PcNavItemTextInner>
        </PcNavItemTextBox>
      );
    },
    [onlyIcon]
  );
  const renderNavItem = useCallback(
    (nav: CutomNavObject) => {
      const isActive = navItemIsActive(nav);
      return (
        <PcNavItem
          key={nav.route.path}
          isActive={isActive}
          onClick={() => navigate(nav.route.path)}
        >
          <PcNavItemIconBox isActive={isActive}>{nav.icon}</PcNavItemIconBox>
          {renderNavItemText(nav)}
        </PcNavItem>
      );
    },
    [navItemIsActive, onlyIcon]
  );
  return (
    <NavWrapper>
      {navs.map((item) => {
        // feed submit 特殊处理
        if (item.key === 'feed-submit') {
          // 未登录不显示
          if (!isLogin) return null;
          // 如果不是admin只显示submit content
          if (!isAdmin) {
            return renderNavItem(item);
          }
        }
        if (item.children) {
          const groupIsOpen = openGroupKeys.includes(item.key);
          const childrenHasActive = !!item.children.find((nav) =>
            navItemIsActive(nav)
          );
          const groupIsActive = onlyIcon
            ? childrenHasActive
            : groupIsOpen
            ? false
            : childrenHasActive;

          if (groupChidrenInnerEls.current.has(item)) {
            const innerEl = groupChidrenInnerEls.current.get(item);
            innerEl.parentElement.style.height =
              onlyIcon || !groupIsOpen ? '0px' : `${innerEl.offsetHeight}px`;
          }
          return (
            <PcNavGroupBox key={item.name}>
              <PcNavItem
                isActive={groupIsActive}
                onClick={() => handleGroupClick(item.key)}
              >
                <PcNavItemIconBox isActive={groupIsActive}>
                  {item.icon}
                </PcNavItemIconBox>
                {renderNavItemText(item)}
              </PcNavItem>
              <GroupChildrenBox>
                <GroupChildrenInner
                  ref={(el) => {
                    if (el) {
                      groupChidrenInnerEls.current.set(item, el);
                    }
                  }}
                >
                  {item.children.map((nav) => renderNavItem(nav))}
                </GroupChildrenInner>
              </GroupChildrenBox>
            </PcNavGroupBox>
          );
        }
        return renderNavItem(item);
      })}
    </NavWrapper>
  );
}
const NavWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease-out;
`;
const PcNavItem = styled.div<{ isActive: boolean }>`
  overflow: hidden;
  height: 40px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  padding: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
      background: #14171a;
      opacity: 0.8;
    `};
  }
  transition: all 0.3s ease-out;
`;
const PcNavItemIconBox = styled.div<{ isActive?: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  ${({ isActive }) =>
    isActive &&
    `
    path {
      stroke: #fff;
      transition: all 0.3s ease-out;
    }
  `}
  transition: all 0.3s ease-out;
`;
const PcNavItemTextBox = styled.div`
  overflow: hidden;
  transition: all 0.5s ease-out;
`;
const PcNavItemTextInner = styled.div`
  white-space: nowrap;
`;
const PcNavGroupBox = styled.div`
  max-height: 100vh;
  transition: height 1s;
`;
const GroupChildrenBox = styled.div`
  overflow: hidden;
  transition: all 0.5s ease-out;
`;
const GroupChildrenInner = styled.div``;
