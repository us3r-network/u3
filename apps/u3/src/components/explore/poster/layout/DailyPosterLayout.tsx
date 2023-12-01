import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Header from './Header';
import HotPosts, { HotPostsProps } from './posts/HotPosts';
import HighScoreDapps, { HighScoreDappsProps } from './dapps/HighScoreDapps';
import TopLinks, { TopLinksProps } from './links/TopLinks';
import Footer from './Footer';

export type DailyPosterLayoutProps = StyledComponentPropsWithRef<'div'> &
  HotPostsProps &
  HighScoreDappsProps &
  TopLinksProps;

export default function DailyPosterLayout({
  posts,
  farcasterUserData,
  dapps,
  links,
  ...wrapperProps
}: DailyPosterLayoutProps) {
  return (
    <DailyPosterLayoutWrapper {...wrapperProps}>
      <Header />
      <HotPosts posts={posts} farcasterUserData={farcasterUserData} />
      <HighScoreDapps dapps={dapps} />
      <TopLinks links={links} />
      <Footer />
    </DailyPosterLayoutWrapper>
  );
}
export const DailyPosterLayoutWrapper = styled.div`
  width: 1440px;
  display: inline-flex;
  padding: 70px 70px 69.999px 70px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;

  border: 4px solid var(--14171-a, #14171a);
  background: #f6f6f4;
`;
