import styled from 'styled-components';

export default function SocialWhoToFollow() {
  return (
    <Wrapper>
      <Title>Who to follow?</Title>
      <ComingSoon>Coming Soon</ComingSoon>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.h1`
  color: #718096;
  font-family: Rubik;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
`;
const ComingSoon = styled.div`
  width: 350px;
  height: 240px;
  background-image: url('/social/imgs/who-to-follow.png');
  background-size: cover;

  color: #fff;
  font-family: Rubik;
  font-size: 24px;
  font-style: italic;
  font-weight: 700;
  line-height: 240px;
  text-align: center;
`;
