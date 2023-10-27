/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 19:59:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 17:21:20
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import InstallU3ExtensionButton from '../../shared/button/InstallU3ExtensionButton';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';

export type CannotOpenPlatFormLinkProps = StyledComponentPropsWithRef<'div'> & {
  iconUrl: string;
  linkUrl: string;
  title: string;
};
export default function CannotOpenPlatFormLink({
  iconUrl,
  linkUrl,
  title,
  ...props
}: CannotOpenPlatFormLinkProps) {
  return (
    <CannotOpenPlatFormLinkWrapper {...props}>
      {iconUrl && <Icon src={iconUrl} />}
      <Title>{title} </Title>
      <Description>
        Sorry, this website has disabled embedding. Please try our Chrome
        extension for free to see the content displayed here.
      </Description>
      <ButtonBox>
        <ButtonPrimaryLine onClick={() => window.open(linkUrl, '_blank')}>
          Open in new tab
        </ButtonPrimaryLine>
        <InstallU3ExtensionButton />
      </ButtonBox>
    </CannotOpenPlatFormLinkWrapper>
  );
}
const CannotOpenPlatFormLinkWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
const Icon = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 77px;
`;
const Title = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;

  color: #ffffff;
`;

const Description = styled.span`
  max-width: 600px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #748094;
`;
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
