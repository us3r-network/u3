import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SocailPlatform } from '../../../api';
import LensIcon from '../../icons/LensIcon';
import FarcasterIcon from '../../icons/FarcasterIcon';

export type PlatformAccountsData = Array<{
  platform: SocailPlatform;
  avatar: string;
  name: string;
  handle: string;
}>;
interface PlatformAccountsProps extends StyledComponentPropsWithRef<'div'> {
  data: PlatformAccountsData;
}
export default function PlatformAccounts({
  data,
  ...wrapperProps
}: PlatformAccountsProps) {
  return (
    <Wrapper {...wrapperProps}>
      {data.map((item) => (
        <Row key={item.handle}>
          <Line />
          <Avatar src={item.avatar} />
          <Center>
            {!!item.name && <Name>{item.name}</Name>}
            {!!item.handle && <Handle>@{item.handle}</Handle>}
          </Center>

          {(() => {
            switch (item.platform) {
              case SocailPlatform.Lens:
                return <LensIcon width="20px" height="20px" />;
              case SocailPlatform.Farcaster:
                return <FarcasterIcon width="20px" height="20px" />;
              default:
                return null;
            }
          })()}
        </Row>
      ))}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  position: relative;
`;
const Line = styled.div`
  width: 0px;
  height: 20px;
  border-left: 1px dashed #718096;
  position: absolute;
  top: 0px;
  left: 20px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 5px;
  // 超出显示省略号
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Name = styled.div`
  color: #fff;

  /* Text/Body 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
const Handle = styled.div`
  color: #718096;

  /* Text/Body 16pt · 1rem */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;
