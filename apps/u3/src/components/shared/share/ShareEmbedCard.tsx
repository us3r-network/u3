import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SHARE_DOMAIN } from '../../../constants';

interface ShareEmbedCardProps extends StyledComponentPropsWithRef<'div'> {
  domain?: string;
  title: string;
  img?: string;
}
export default function ShareEmbedCard(props: ShareEmbedCardProps) {
  const { img } = props;
  if (img) {
    return <SummaryLargeImgEmbedCard {...props} />;
  }
  return <SummaryEmbedCard {...props} />;
}

function SummaryEmbedCard({
  domain,
  title,
  ...wrapperProps
}: ShareEmbedCardProps) {
  return (
    <Wrapper {...wrapperProps}>
      <Logo />

      <Right>
        <Domain>{domain || SHARE_DOMAIN}</Domain>
        <Title>{title}</Title>
      </Right>
    </Wrapper>
  );
}

function SummaryLargeImgEmbedCard({
  domain,
  title,
  img,
  ...wrapperProps
}: ShareEmbedCardProps) {
  return (
    <LargeImgWrapper {...wrapperProps}>
      <Img src={img} />

      <LargeImgBottom>
        <Domain>{domain || SHARE_DOMAIN}</Domain>
        <Title>{title}</Title>
      </LargeImgBottom>
    </LargeImgWrapper>
  );
}

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path
        d="M3 15.9481C3 10.4539 7.37496 6 12.7717 6H65.93V9.97924H12.7717C9.53367 9.97924 6.90869 12.6516 6.90869 15.9481V63.699C6.90869 66.9955 9.53367 69.6678 12.7717 69.6678H61.2395C64.4776 69.6678 67.1026 66.9955 67.1026 63.699V46.9862H71.0113V63.699C71.0113 69.1931 66.6363 73.647 61.2395 73.647H12.7717C7.37495 73.647 3 69.1931 3 63.699V15.9481Z"
        fill="white"
      />
      <path
        d="M27.6248 18.3356V43.8028C27.6248 49.0772 31.8247 53.3529 37.0056 53.3529C42.1865 53.3529 46.3865 49.0772 46.3865 43.8028V18.3356H55.7674V43.8028C55.7674 54.3516 47.3674 62.9031 37.0056 62.9031C26.6438 62.9031 18.2439 54.3516 18.2439 43.8028V18.3356H27.6248Z"
        fill="white"
      />
      <path
        d="M65.6173 39.6007C66.6804 39.9615 67.9416 40.1419 69.4009 40.1419C71.0686 40.1419 72.5487 39.866 73.8411 39.3142C75.1336 38.7624 76.1447 37.9772 76.8743 36.9585C77.6248 35.9186 78 34.677 78 33.2339C78 31.8544 77.7186 30.7084 77.1557 29.7958C76.6137 28.8833 75.8424 28.1935 74.8418 27.7266C73.862 27.2385 72.7363 26.9414 71.4647 26.8353L71.0894 26.8035L76.4991 21.137C76.6033 21.0309 76.6971 20.9036 76.7805 20.755C76.8639 20.6065 76.9056 20.4367 76.9056 20.2457V18.3356C76.9056 18.1022 76.8326 17.9112 76.6867 17.7626C76.5407 17.6141 76.3531 17.5398 76.1238 17.5398H62.7092C62.4799 17.5398 62.2923 17.6141 62.1463 17.7626C62.0213 17.9112 61.9587 18.1022 61.9587 18.3356V20.4367C61.9587 20.6489 62.0213 20.8293 62.1463 20.9779C62.2923 21.1264 62.4799 21.2007 62.7092 21.2007H71.6523L66.055 26.7716C65.9508 26.8777 65.8466 27.0157 65.7423 27.1855C65.659 27.334 65.6173 27.5144 65.6173 27.7266V29.0637C65.6173 29.2971 65.6902 29.4881 65.8361 29.6367C65.9821 29.764 66.1697 29.8277 66.399 29.8277H69.6198C70.8497 29.8277 71.8086 30.0823 72.4966 30.5917C73.1845 31.0798 73.5285 31.8863 73.5285 33.0111C73.5285 34.1359 73.1532 35.006 72.4028 35.6215C71.6731 36.2157 70.6829 36.5128 69.4322 36.5128C68.8068 36.5128 68.2126 36.4491 67.6498 36.3218C67.0869 36.1732 66.5866 35.9292 66.1488 35.5896C65.7319 35.2501 65.4296 34.7938 65.242 34.2208C65.1378 33.9661 65.0127 33.7963 64.8668 33.7114C64.7209 33.6265 64.5437 33.5841 64.3352 33.5841H61.521C61.3333 33.5841 61.1666 33.6477 61.0206 33.7751C60.8956 33.8812 60.833 34.0298 60.833 34.2208C60.8539 34.8999 61.0415 35.5896 61.3959 36.29C61.7503 36.9691 62.2714 37.6058 62.9593 38.2C63.6681 38.773 64.5541 39.2399 65.6173 39.6007Z"
        fill="white"
      />
    </svg>
  );
}
const Wrapper = styled.div`
  width: 373px;
  height: 120px;
  border-radius: 10px;
  background: #14171a;
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  gap: 15px;
`;
const LargeImgWrapper = styled.div`
  width: 373px;
  border-radius: 10px;
  background: #14171a;
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const LargeImgBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;
const Right = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;
const Domain = styled.div`
  color: #fff;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const Title = styled.div`
  color: #718096;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 150% */

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Img = styled.img`
  width: 100%;
  height: 190px;
  object-fit: cover;
  object-position: top;
`;
