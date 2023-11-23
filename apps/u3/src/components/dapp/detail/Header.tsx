import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useFavorAction } from '@us3r-network/link';
import { useProfileState } from '@us3r-network/profile';
import { MultiPlatformShareMenuBtn } from 'src/components/shared/share/MultiPlatformShareMenuBtn';
import { getDappShareUrl } from 'src/utils/shared/share';
import { formatFilterShowName } from '../../../utils/shared/filter';
import {
  DappExploreListItemResponse,
  DappStatus,
} from '../../../services/dapp/types/dapp';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import ImgDefault from '../../common/ImgDefault';
import Card from './Card';
import TwitterSvg from '../../common/assets/svgs/twitter.svg';
import DiscordSvg from '../../common/assets/svgs/discord.svg';
import FacebookSvg from '../../common/assets/svgs/facebook.svg';
import TelegramSvg from '../../common/assets/svgs/telegram.svg';
import useConfigsTopics from '../../../hooks/shared/useConfigsTopics';
import { ReactComponent as CheckVerifiedSvg } from '../../common/assets/svgs/check-verified.svg';
import EllipsisTextExpandMore from '../../common/text/EllipsisTextExpandMore';
import { Edit } from '../../common/icons/edit';
import useLogin from '../../../hooks/shared/useLogin';
import Badge from '../Badge';
import { DappMintButton } from '../DappMintButton';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemResponse;
  onOpen?: () => void;
  onEdit?: () => void;
  hiddenEdit?: boolean;
};
export default function Header({
  data,
  onOpen,
  onEdit,
  hiddenEdit,
  ...otherProps
}: Props) {
  const { profile, updateProfile } = useProfileState();
  const { isFavored } = useFavorAction(data.linkStreamId);
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const { topics } = useConfigsTopics();
  const { chains } = topics;
  const showChains = chains.filter((item) =>
    data?.chains?.includes(item.chainEnum)
  );
  const isU3Dapp = data?.url?.startsWith('https://u3.xyz');
  const u3DappRoutePath = data?.url?.replace('https://u3.xyz', '');

  return (
    <HeaderWrapper {...otherProps}>
      <HeaderImg src={data.image} />
      <HeaderCenter>
        <Title>
          {data.name}{' '}
          {data.status === DappStatus.VERIFIED && <CheckVerifiedSvg />}
          {isAdmin && !hiddenEdit && (
            <EditBtn onClick={onEdit}>
              <Edit />
            </EditBtn>
          )}
        </Title>
        <TagsRow>
          {data?.types?.map((item) => (
            <Badge key={item} text={formatFilterShowName(item)} />
          ))}
          {showChains.map((item) => (
            <ChainIcon
              key={item.chainEnum}
              src={item.image}
              alt={item.name}
              title={item.name}
            />
          ))}
        </TagsRow>
        <Description row={2}>{data.description}</Description>
      </HeaderCenter>
      <HeaderRight>
        <RightButtons>
          {data?.id && (
            <DappShareMenuBtn
              shareLink={getDappShareUrl(data.id)}
              shareLinkDefaultText={data.name}
              shareLinkEmbedTitle={data?.name}
              popoverConfig={{ placement: 'top end', offset: 0 }}
            />
          )}
          {data?.mediaLinks?.twitter && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.twitter, '__blank')}
            >
              <LinkIcon src={TwitterSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.discord && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.discord, '__blank')}
            >
              <LinkIcon src={DiscordSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.facebook && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.facebook, '__blank')}
            >
              <LinkIcon src={FacebookSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.telegram && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.telegram, '__blank')}
            >
              <LinkIcon src={TelegramSvg} />
            </LinkButton>
          )}
        </RightButtons>
        {isU3Dapp ? (
          <OpenButton
            onClick={(e) => {
              e.stopPropagation();
              navigate(u3DappRoutePath);
            }}
          >
            Open Dapp
          </OpenButton>
        ) : (
          data?.url &&
          data?.linkStreamId && (
            <RightButtons>
              <DappMintButton dappData={data} />
              <OpenButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpen) onOpen();
                }}
              >
                Open Dapp
              </OpenButton>
            </RightButtons>
          )
        )}
      </HeaderRight>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled(Card)`
  width: 100%;
  min-height: 160px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const HeaderImg = styled(ImgDefault)`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  flex-shrink: 0;
  margin-right: 20px;
`;
const HeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-evenly;
`;
const Title = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TagsRow = styled.div`
  display: flex;
  gap: 10px;
`;
const Description = styled(EllipsisTextExpandMore)`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
  opacity: 0.8;
`;
const HeaderRight = styled.div`
  margin-left: 80px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: end;
`;
const RightButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const LinkButton = styled(ButtonPrimaryLine)`
  width: 40px;
  height: 40px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #14171a;
  border: none;
`;
const LinkIcon = styled.img`
  width: 100%;
  height: 100%;
`;
const OpenButton = styled(ButtonPrimaryLine)`
  height: 40px;
  font-weight: 700;
`;
const ChainIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #14171a;
`;
const EditBtn = styled.div`
  cursor: pointer;
`;

export function HeaderMobile({ data, ...otherProps }: Props) {
  const { topics } = useConfigsTopics();
  const { chains } = topics;
  const showChains = chains.filter((item) =>
    data?.chains?.includes(item.chainEnum)
  );

  return (
    <HeaderWrapperMobile {...otherProps}>
      <HeaderImgMobile src={data.image} />
      <HeaderRightMobile>
        <TitleMobile>
          {data.name}{' '}
          {data.status === DappStatus.VERIFIED && <CheckVerifiedSvg />}
        </TitleMobile>
        <TagsRowMobile>
          {data?.types?.map((item) => (
            <Badge key={item} text={formatFilterShowName(item)} />
          ))}
          {showChains.map((item) => (
            <ChainIcon
              key={item.chainEnum}
              src={item.image}
              alt={item.name}
              title={item.name}
            />
          ))}
        </TagsRowMobile>
      </HeaderRightMobile>
    </HeaderWrapperMobile>
  );
}

const HeaderWrapperMobile = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;
const HeaderImgMobile = styled(ImgDefault)`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  flex-shrink: 0;
`;
const HeaderRightMobile = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-evenly;
`;
const TitleMobile = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TagsRowMobile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const DappShareMenuBtn = styled(MultiPlatformShareMenuBtn)`
  border: none;
  padding: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  &:not(:disabled):hover {
    border: none;
    background-color: #14171a;
  }
  & > svg {
    width: 16px;
    height: 16px;
    cursor: pointer;
    path {
      stroke: #ffffff;
    }
  }
`;
