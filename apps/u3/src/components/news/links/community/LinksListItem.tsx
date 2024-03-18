/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 10:08:00
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-15 16:43:21
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { useMemo } from 'react';
import EllipsisText from '../../../common/text/EllipsisText';
import LinkLogo from '../LinkLogo';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: LinkListItem;
};
export default function ListItem({ data, ...otherProps }: Props) {
  const { url, metadata } = data;
  const platformLogo = useMemo(() => metadata?.icon || '', [metadata]);
  return (
    <CardWrapper {...otherProps}>
      <CardBody>
        <Logo logo={platformLogo} link={url} />
        <Right>
          <Title>{metadata?.title}</Title>
          <Url>{url}</Url>
        </Right>
      </CardBody>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  cursor: pointer;
`;
const CardBody = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
const Logo = styled(LinkLogo)`
  width: 48px;
  height: 48px;
  border-radius: 40px;
`;
const Right = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Title = styled(EllipsisText)`
  color: #fff;
  width: 100%;
  /* medium-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: left;
`;
const Url = styled(EllipsisText)`
  color: var(--718096, #718096);
  width: 100%;
  /* Regular-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: left;
`;
