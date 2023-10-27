/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-09 14:54:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:14:33
 * @Description: 外部链接风险提示
 */
import React from 'react';
import styled from 'styled-components';
import { ButtonPrimary } from '../common/button/ButtonBase';
import LogoImg from './components/common/assets/imgs/logo.svg';
import GlobalStyle from '../../styles/GlobalStyle';

const ExternalLinkRiskWarningUri = `${window.location.origin}/link.html`;
const noWarningDomains = ['wl.xyz', 'twitter.com', 'discord.com', 'discord.gg'];
const isHyperlink = (str: string) => {
  const regexp =
    // eslint-disable-next-line no-useless-escape
    /(http|https):\/\/[\w]+(.[\w]+)([\w\-\.,@?^=%&:/~\+#\u4e00-\u9fa5]*[\w\-\@?^=%&/~\+#])/;
  return regexp.test(str);
};
export const generateExternalLinkRiskWarningUrl = (link: string) => {
  return `${ExternalLinkRiskWarningUri}?target=${link}`;
};
export const getExternalLink = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('target') || '';
};

export const isExternalLinkRiskWarningUrl =
  window.location.href.startsWith(`${ExternalLinkRiskWarningUri}?`) &&
  getExternalLink();

type WindowOpen = typeof window.open;
export const startExternalLinkNavigationListener = () => {
  // 1, a标签的点击事件代理
  document.getElementById('root')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.nodeName === 'A') {
      const { href, hostname } = target as HTMLAnchorElement;
      // 如果href符合超链接，并且链接域名不在白名单中
      if (
        isHyperlink(href) &&
        !noWarningDomains.some((domain) => hostname.endsWith(domain))
      ) {
        e.preventDefault();
        // 克隆一个新元素出来，href设置为风险提示链接再触发一次click (这样不需要去识别原标签上的其它属性，避免意外情况)
        const cloneNode = target.cloneNode() as HTMLAnchorElement;
        const newHref = generateExternalLinkRiskWarningUrl(href);
        cloneNode.href = newHref;
        cloneNode.click();
      }
    }
  });

  // 2, 重写window.open (业务中有通过window.open打开链接的情况)
  window.open = (function (open) {
    return function (url: string, ...args) {
      // 如果链接域名不在白名单中
      const hostname = url.split('/')[2];
      if (
        hostname &&
        !noWarningDomains.some((domain) => hostname.endsWith(domain))
      ) {
        const newUrl = generateExternalLinkRiskWarningUrl(url);
        return open(newUrl, ...args);
      }
      return open(url, ...args);
    } as WindowOpen;
  })(window.open);
  // 3, ....
};

export default function () {
  const externalLink = getExternalLink();
  return (
    <>
      <GlobalStyle />
      <MobileRedirectWrapper>
        <PcImg src={LogoImg} />
        <Title>You are about to leave WL.xyz</Title>
        <RedirectDescBox>
          <span>
            ⚠️ Please make sure your account is safe when accessing external
            websites.{' '}
          </span>
          <span>⚠️ Do not give out your wallet information to others.</span>
          <span>
            ⚠️ When you find that the site is not secure, please
            <RedirectDescBold>
              {' '}
              do not approve the transaction and disconnect the wallet.
            </RedirectDescBold>
          </span>
          <UnderlineText>
            Make sure you read the above information carefully before accessing
            other sites.
          </UnderlineText>
        </RedirectDescBox>
        <ContinueBtn
          onClick={() => {
            window.location.href = externalLink;
          }}
        >
          Got it. Continue →
        </ContinueBtn>
      </MobileRedirectWrapper>
    </>
  );
}
const MobileRedirectWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f7f9f1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;
const PcImg = styled.img`
  width: 160px;
  height: 82px;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: #333333;
  margin-top: 40px;
`;
const RedirectDescBox = styled.div`
  max-width: 660px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;
const RedirectDescBold = styled.span`
  font-weight: bold;
`;
const UnderlineText = styled.span`
  margin-top: 40px;
`;
const ContinueBtn = styled(ButtonPrimary)`
  height: 48px;
  margin-top: 40px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
`;
