import styled from 'styled-components';
import { useNav } from '../../contexts/NavCtx';
import feedbackIconUrl from '../common/assets/platform/pngs/feedback.png';
import telegramIconUrl from '../common/assets/platform/pngs/telegram.png';
import twitterIconUrl from '../common/assets/platform/pngs/twitter.png';
import discordIconUrl from '../common/assets/platform/pngs/discord.png';
import { CONTACT_US_LINKS } from '../../constants';

const links = [
  {
    link: CONTACT_US_LINKS.feedback,
    iconUrl: feedbackIconUrl,
    name: 'Feedback',
  },
  {
    link: CONTACT_US_LINKS.discord,
    iconUrl: discordIconUrl,
    name: 'Discord',
  },
  {
    link: CONTACT_US_LINKS.twitter,
    iconUrl: twitterIconUrl,
    name: 'Twitter',
  },
  {
    link: CONTACT_US_LINKS.telegram,
    iconUrl: telegramIconUrl,
    name: 'Telegram',
  },
];
export default function ContactUsModal() {
  const { openContactUsModal } = useNav();
  return (
    <Wrapper open={openContactUsModal}>
      <Body>
        {links.map((link) => (
          <Link href={link.link} target="_blank" rel="noreferrer">
            <Icon src={link.iconUrl} />
            <Name>{link.name}</Name>
          </Link>
        ))}
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ open: boolean }>`
  z-index: 3;
  position: absolute;
  bottom: 20px;
  right: 0;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  padding: 20px;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  margin-left: 10px;
`;
const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;
const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
const Name = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
