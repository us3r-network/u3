import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import isInstalledPwa from '@/utils/shared/isInstalledPwa';

const mobileGuideTimeKey = 'last-mobile-guide-time';
const mobileGuideTimeInterval = 1000 * 60 * 60 * 24 * 3; // 3天显示一次
export function storeMobileGuideSkip() {
  localStorage.setItem(mobileGuideTimeKey, new Date().getTime().toString());
}
export function isShowMobileGuide() {
  if (!isMobile) return false;
  if (isInstalledPwa()) return false;
  const lastTime = Number(localStorage.getItem(mobileGuideTimeKey));
  if (!lastTime) return true;
  return new Date().getTime() - lastTime > mobileGuideTimeInterval;
}

export function MobileGuide() {
  const [show, setShow] = useState(isShowMobileGuide());
  if (!show) return null;
  return (
    <div
      className={cn(
        'z-10 fixed top-[0] left-[0] w-screen h-screen overflow-y-auto bg-[#14171A] p-[20px] pt-[50px] box-border'
      )}
    >
      <div
        className="w-full h-[215px] flex-shrink-0 p-[10px] pt-[0px] bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: `url(guide/imgs/banner.png)`,
        }}
      >
        <div className="flex flex-col gap-[10px] text-[#FFF] text-[32px] font-bold leading-[normal]">
          <span className="flex gap-[10px] items-center">
            <span>Add</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="39"
              viewBox="0 0 40 39"
              fill="none"
            >
              <path
                d="M0 6.29412C0 3.37026 2.33331 1 5.21159 1H33.5626V3.11765H5.21159C3.48462 3.11765 2.08464 4.5398 2.08464 6.29412V31.7059C2.08464 33.4602 3.48462 34.8824 5.21159 34.8824H31.0611C32.788 34.8824 34.188 33.4602 34.188 31.7059V22.8118H36.2727V31.7059C36.2727 34.6297 33.9394 37 31.0611 37H5.21159C2.33331 37 0 34.6297 0 31.7059V6.29412Z"
                fill="white"
              />
              <path
                d="M13.1332 7.56471V21.1176C13.1332 23.9246 15.3732 26.2 18.1363 26.2C20.8995 26.2 23.1395 23.9246 23.1395 21.1176V7.56471H28.1426V21.1176C28.1426 26.7315 23.6626 31.2824 18.1363 31.2824C12.61 31.2824 8.13008 26.7315 8.13008 21.1176V7.56471H13.1332Z"
                fill="white"
              />
              <path
                d="M33.3959 18.8814C33.9629 19.0734 34.6355 19.1694 35.4138 19.1694C36.3032 19.1694 37.0926 19.0226 37.7819 18.7289C38.4713 18.4353 39.0105 18.0174 39.3996 17.4753C39.7999 16.9219 40 16.2612 40 15.4932C40 14.7591 39.8499 14.1492 39.5497 13.6635C39.2607 13.1779 38.8493 12.8108 38.3156 12.5624C37.7931 12.3026 37.1927 12.1445 36.5145 12.088L36.3144 12.0711L39.1995 9.05553C39.2551 8.99906 39.3051 8.93129 39.3496 8.85223C39.3941 8.77318 39.4163 8.68282 39.4163 8.58118V7.56471C39.4163 7.44047 39.3774 7.33882 39.2996 7.25976C39.2217 7.18071 39.1217 7.14118 38.9994 7.14118H31.8449C31.7226 7.14118 31.6225 7.18071 31.5447 7.25976C31.478 7.33882 31.4446 7.44047 31.4446 7.56471V8.68282C31.4446 8.79576 31.478 8.89176 31.5447 8.97082C31.6225 9.04988 31.7226 9.08941 31.8449 9.08941H36.6145L33.6293 12.0541C33.5738 12.1106 33.5182 12.184 33.4626 12.2744C33.4181 12.3534 33.3959 12.4494 33.3959 12.5624V13.2739C33.3959 13.3981 33.4348 13.4998 33.5126 13.5788C33.5904 13.6466 33.6905 13.6805 33.8128 13.6805H35.5305C36.1865 13.6805 36.6979 13.816 37.0648 14.0871C37.4317 14.3468 37.6152 14.776 37.6152 15.3746C37.6152 15.9732 37.4151 16.4362 37.0148 16.7638C36.6257 17.08 36.0976 17.2381 35.4305 17.2381C35.0969 17.2381 34.7801 17.2042 34.4799 17.1365C34.1797 17.0574 33.9129 16.9275 33.6794 16.7468C33.457 16.5661 33.2958 16.3233 33.1957 16.0184C33.1402 15.8828 33.0734 15.7925 32.9956 15.7473C32.9178 15.7021 32.8233 15.6795 32.7121 15.6795H31.2112C31.1111 15.6795 31.0222 15.7134 30.9443 15.7812C30.8776 15.8376 30.8443 15.9167 30.8443 16.0184C30.8554 16.3798 30.9555 16.7468 31.1445 17.1195C31.3335 17.4809 31.6114 17.8198 31.9783 18.136C32.3563 18.4409 32.8288 18.6894 33.3959 18.8814Z"
                fill="white"
              />
            </svg>
            <span>to</span>
          </span>
          <span>Home Screen</span>
        </div>
      </div>
      <div className="inline-flex flex-col items-start gap-[15px] mt-[60px]">
        <div className="flex w-full items-center gap-[10px]">
          <img
            src="guide/imgs/chrome.png"
            alt=""
            className="w-[30px] h-[30px] flex-shrink-0"
          />
          <span className="text-[#FFF] text-[24px] font-bold">Chrome</span>
        </div>
        <GrayText>Tap browser menu, and choose </GrayText>
        <div className="flex w-full items-center gap-[5px]">
          <AddToHomeScreenSvg />
          <WhiteText>“Add to Home Screen”</WhiteText>
          <GrayText>option.</GrayText>
        </div>
      </div>
      <div className="inline-flex flex-col items-start gap-[15px] mt-[60px]">
        <div className="flex w-full items-center gap-[10px]">
          <img
            src="guide/imgs/browser.png"
            alt=""
            className="w-[30px] h-[30px] flex-shrink-0"
          />
          <span className="text-[#FFF] text-[24px] font-bold">
            Other browser
          </span>
        </div>
        <GrayText>Tap browser menu, and choose </GrayText>
        <div className="flex w-full items-center gap-[5px]">
          <ShareSvg />
          <WhiteText>“Share”</WhiteText>
          <GrayText>option.</GrayText>
        </div>
        <div className="flex w-full items-center gap-[5px]">
          <GrayText>Then, choose</GrayText>
          <AddToHomeScreenSvg />
          <span>
            <WhiteText>Add to Home Screen”</WhiteText>
            <GrayText>.</GrayText>
          </span>
        </div>
      </div>
      <div className="w-full flex flex-row items-center  mt-[60px]">
        <Button
          className="
            w-[140px]
            h-[48px]
            px-[24px]
            py-[12px]
            rounded-[12px]
            bg-[#FFF]
            text-[#14171A]
            text-[16px]
            font-medium
            leading-[24px]
            mx-[auto]
          "
          onClick={() => {
            storeMobileGuideSkip();
            setShow(false);
          }}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

function WhiteText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#FFF] text-[16px] font-normal">{children}</span>
  );
}
function GrayText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#718096] text-[16px] font-normal">{children}</span>
  );
}

function AddToHomeScreenSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_2277_19112)">
        <path
          d="M13.6364 0.00909092L4.54545 0C3.54545 0 2.72727 0.818182 2.72727 1.81818V4.54545H4.54545V3.63636H13.6364V16.3636H4.54545V15.4545H2.72727V18.1818C2.72727 19.1818 3.54545 20 4.54545 20H13.6364C14.6364 20 15.4545 19.1818 15.4545 18.1818V1.81818C15.4545 0.818182 14.6364 0.0090909 13.6364 0.00909092ZM6.36364 12.7273H8.18182V6.36364H1.81818V8.18182H5.08182L0 13.2636L1.28182 14.5455L6.36364 9.46364V12.7273Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2277_19112">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ShareSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17.5 5H14.8333C13.4332 5 12.7331 5 12.1984 5.27248C11.728 5.51217 11.3455 5.89462 11.1058 6.36502C10.8333 6.8998 10.8333 7.59987 10.8333 9V10M17.5 5L15 2.5M17.5 5L15 7.5M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V11.6667"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
