/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 18:20:09
 * @Description: file description
 */
import styled from 'styled-components';
import { ReactNode } from 'react';
import { ReactComponent as FilterFunnelSvg } from '../../common/assets/svgs/filter-funnel.svg';
import { ReactComponent as PlusSvg } from '../../common/assets/svgs/plus.svg';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import {
  LayoutGrid,
  LayoutGridActive,
  LayoutList,
  LayoutListActive,
} from '../../common/icons/layout';
import { Layout } from '../../../utils/news/localLayout';

type NewsToolbarProps = {
  orderByEl?: ReactNode;
  searchEl?: ReactNode;
  filterEl?: ReactNode;
  displayFilterButton?: boolean;
  isActiveFilter?: boolean;
  onChangeActiveFilter?: (active: boolean) => void;
  multiLayout?: boolean;
  layout?: Layout;
  setLayout?: (layout: Layout) => void;
  displaySubmitButton?: boolean;
  submitButtonOnClick?: () => void;
};
export default function NewsToolbar({
  orderByEl,
  searchEl,
  filterEl,
  displayFilterButton,
  isActiveFilter,
  onChangeActiveFilter,
  multiLayout,
  layout,
  setLayout,
  displaySubmitButton,
  submitButtonOnClick,
}: NewsToolbarProps) {
  return (
    <>
      <NewsToolbarWrapper>
        {displaySubmitButton && (
          <SubmitButton onClick={submitButtonOnClick}>
            <PlusSvg />
          </SubmitButton>
        )}
        {searchEl && <SearchBox>{searchEl}</SearchBox>}
        {displayFilterButton && (
          <FilterButton
            isActive={isActiveFilter}
            onClick={() =>
              onChangeActiveFilter && onChangeActiveFilter(!isActiveFilter)
            }
          >
            <FilterFunnelSvg />
          </FilterButton>
        )}
        {orderByEl && <OrderByBox>{orderByEl}</OrderByBox>}
        <MultiLayoutBox>
          {multiLayout && (
            <div className="layout">
              <span
                className={(layout === Layout.LIST && 'active') || ''}
                onClick={() => {
                  if (setLayout) setLayout(Layout.LIST);
                }}
              >
                {(layout === Layout.LIST && <LayoutListActive />) || (
                  <LayoutList />
                )}
              </span>
              <span
                className={(layout === Layout.GRID && 'active') || ''}
                onClick={() => {
                  setLayout(Layout.GRID);
                }}
              >
                {(layout === Layout.GRID && <LayoutGridActive />) || (
                  <LayoutGrid />
                )}
              </span>
            </div>
          )}
        </MultiLayoutBox>
      </NewsToolbarWrapper>
      {displayFilterButton && filterEl}
    </>
  );
}
const NewsToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 20px;
`;
const OrderByBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 180px;
`;
const FilterButton = styled(ButtonPrimaryLine)<{ isActive?: boolean }>`
  width: 52px;
  height: 40px;
  border-radius: 100px;
  padding: 0;
  ${({ isActive }) =>
    isActive &&
    `
    background: #718096;
    transition: all 0.3s ease-out;
    path {
      stroke: #14171A;
      transition: all 0.3s ease-out;
    }
  `}
  &:not(:disabled):hover {
    ${({ isActive }) =>
      isActive &&
      `
        background: #718096;
      `}
  }
`;
const SearchBox = styled.div`
  width: 620px;
`;
const MultiLayoutBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;

  & .layout {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #14171a;
    border: 1px solid #39424c;
    border-radius: 100px;
    width: 124px;
    height: 40px;
    padding: 0px 2px;
    > span {
      cursor: pointer;
      width: 60px;
      height: 36px;

      box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
        0px 0px 4px rgba(20, 23, 26, 0.04);
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        background: #718096;
      }
    }
  }
`;

const SubmitButton = styled(ButtonPrimaryLine)`
  width: 52px;
  height: 40px;
  border-radius: 100px;
  padding: 0;
  svg {
    path {
      stroke: #718096;
    }
  }
`;
