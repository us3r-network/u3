/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-29 16:33:37
 * @Description: file description
 */
import styled from 'styled-components';
import { ReactNode } from 'react';
import { ReactComponent as FilterFunnelSvg } from '../../common/icons/svgs/filter-funnel.svg';
import { ReactComponent as PlusSvg } from '../../common/icons/svgs/plus.svg';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import {
  LayoutGrid,
  LayoutGridActive,
  LayoutList,
  LayoutListActive,
} from '../../icons/layout';
import { Layout } from '../../../utils/localLayout';

export { Layout } from '../../../utils/localLayout';

type FeedsMenuRightProps = {
  orderByEl?: ReactNode;
  searchEl?: ReactNode;
  displayFilterButton?: boolean;
  isActiveFilter?: boolean;
  onChangeActiveFilter?: (active: boolean) => void;
  multiLayout?: boolean;
  layout?: Layout;
  setLayout?: (layout: Layout) => void;
  displaySubmitButton?: boolean;
  submitButtonOnClick?: () => void;
};
export default function FeedsMenuRight({
  orderByEl,
  searchEl,
  displayFilterButton,
  isActiveFilter,
  onChangeActiveFilter,
  multiLayout,
  layout,
  setLayout,
  displaySubmitButton,
  submitButtonOnClick,
}: FeedsMenuRightProps) {
  return (
    <FeedsMenuRightWrapper>
      {orderByEl && <OrderByBox>{orderByEl}</OrderByBox>}
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

      {searchEl && <SearchBox>{searchEl}</SearchBox>}
      {displaySubmitButton && (
        <SubmitButton onClick={submitButtonOnClick}>
          <PlusSvg />
        </SubmitButton>
      )}
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
    </FeedsMenuRightWrapper>
  );
}
const FeedsMenuRightWrapper = styled.div`
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
  width: 200px;
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
