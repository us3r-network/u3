import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useLogin from '../../../hooks/shared/useLogin';
import { formatFilterShowName } from '../../../utils/shared/filter';
import {
  ProjectExploreListItemResponse,
  UniprojectStatus,
} from '../../../services/shared/types/project';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import Tag from '../../common/tag/Tag';
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

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  onFavor?: () => void;
  onUnfavor?: () => void;
  onEdit?: () => void;
};
export default function Header({
  data,
  disabledFavor,
  loadingFavor,
  isFavored,
  onFavor,
  onUnfavor,
  onEdit,
  ...otherProps
}: Props) {
  const { isAdmin } = useLogin();
  const { topics } = useConfigsTopics();
  const { chains } = topics;
  const showChains = chains.filter((item) =>
    data?.chains.includes(item.chainEnum)
  );

  return (
    <HeaderWrapper {...otherProps}>
      <HeaderImg src={data.image} />
      <HeaderCenter>
        <Title>
          {data.name}{' '}
          {data.status === UniprojectStatus.VERIFIED && <CheckVerifiedSvg />}
          {isAdmin && (
            <EditBtn onClick={onEdit}>
              <Edit />
            </EditBtn>
          )}
        </Title>
        <TagsRow>
          {data?.types.map((item) => (
            <Tag>{formatFilterShowName(item)}</Tag>
          ))}
          {showChains.map((item) => (
            <ChainIcon src={item.image} alt={item.name} title={item.name} />
          ))}
        </TagsRow>

        <Description row={2}>{data.description}</Description>
      </HeaderCenter>
      <HeaderRight>
        <RightButtons>
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
  margin-top: auto;
  flex-shrink: 0;
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
const ChainIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #14171a;
`;
const EditBtn = styled.div`
  cursor: pointer;
`;
