/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:23:46
 * @Description: file description
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import EllipsisText from '../common/text/EllipsisText';
import ImgDefault from '../common/ImgDefault';

export type ProjectExploreListItemData = ProjectExploreListItemResponse;
export type ProjectExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemData;
  disabledInstall?: boolean;
  loadingInstall?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
  onOpen?: () => void;
  displayButtons?: boolean;
};
export default function ProjectExploreListItem({
  data,
  disabledInstall,
  loadingInstall,
  isInstalled,
  onInstall,
  onOpen,
  displayButtons = true,
  ...props
}: ProjectExploreListItemProps) {
  return (
    <ExploreListItemWrapper {...props}>
      <ListItemInner>
        <ItemImg src={data.image} />
        <InnerCenter>
          <ItemName>{data.name}</ItemName>
          <InnerDesc>{data.description}</InnerDesc>
        </InnerCenter>
        {displayButtons &&
          (isInstalled ? (
            <OpenButton
              onClick={(e) => {
                e.stopPropagation();
                if (onOpen) onOpen();
              }}
            >
              Open
            </OpenButton>
          ) : (
            <InstallButton
              disabled={disabledInstall}
              onClick={(e) => {
                e.stopPropagation();
                if (onInstall) onInstall();
              }}
            >
              {loadingInstall ? 'Installing' : 'Install'}
            </InstallButton>
          ))}
      </ListItemInner>
    </ExploreListItemWrapper>
  );
}
const ExploreListItemWrapper = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
`;

const ItemImg = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  flex-shrink: 0;
`;
const InnerCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;
const ItemName = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const InnerDesc = styled(EllipsisText)`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #718096;
`;
const ButtonCss = css`
  width: 74px;
  height: 32px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  flex-shrink: 0;
`;
const InstallButton = styled(ButtonPrimary)`
  ${ButtonCss}
`;
const OpenButton = styled(ButtonPrimaryLine)`
  ${ButtonCss}
  background: #14171a;
  color: #ffffff;
`;
