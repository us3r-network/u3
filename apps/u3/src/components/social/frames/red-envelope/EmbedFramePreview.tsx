import { ComponentPropsWithRef, useEffect, useState } from 'react';
import satori from 'satori';
import Loading from '@/components/common/loading/Loading';
import { RedEnvelopeEntity } from '@/services/frames/types/red-envelope';
import { getUserinfoWithFid } from '@/services/social/api/farcaster';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { getBase64FromSvg } from '@/utils/shared/getBase64FromUrl';

type Props = ComponentPropsWithRef<'div'> & {
  frameData: RedEnvelopeEntity;
};
export default function EmbedFramePreview({ frameData, ...props }: Props) {
  const [generating, setGenerating] = useState(false);
  const [frameImg, setFrameImg] = useState('');
  const { currFid } = useFarcasterCtx();

  useEffect(() => {
    (async () => {
      try {
        setGenerating(true);
        let creatorInfo = { fname: '' };
        try {
          const creatorFid = frameData?.creatorFid || '';
          console.log('frameData', frameData);
          console.log('currFid', currFid);

          const { data } = await getUserinfoWithFid(
            creatorFid || String(currFid) || ''
          );
          creatorInfo = data.data;
        } catch (error) {
          console.error(error);
        }

        const host = window.location.origin;

        const fontDataMontserrat700 = await fetch(
          new URL(`fonts/red-envelope/montserrat/Montserrat-Bold.otf`, host)
        ).then((res) => res.arrayBuffer());

        const fontDataMontserrat500 = await fetch(
          new URL(`fonts/red-envelope/montserrat/Montserrat-Medium.otf`, host)
        ).then((res) => res.arrayBuffer());

        const fontDataInter = await fetch(
          new URL(`fonts/red-envelope/inter/Inter-Bold.ttf`, host)
        ).then((res) => res.arrayBuffer());

        const fontDataEricaOne = await fetch(
          new URL(`fonts/red-envelope/erica-one/EricaOne-Regular.ttf`, host)
        ).then((res) => res.arrayBuffer());

        const svg = await satori(
          <FrameImgView data={frameData} creatorInfo={creatorInfo} />,
          {
            width: 800,
            height: 418,
            fonts: [
              {
                name: 'Montserrat',
                // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
                data: fontDataMontserrat700,
                weight: 700,
                style: 'normal',
              },
              {
                name: 'Montserrat',
                // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
                data: fontDataMontserrat500,
                weight: 500,
                style: 'normal',
              },
              {
                name: 'Inter',
                // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
                data: fontDataInter,
                weight: 700,
                style: 'normal',
              },
              {
                name: 'Erica One',
                // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
                data: fontDataEricaOne,
                weight: 400,
                style: 'normal',
              },
            ],
          }
        );
        // svg to base64
        const base64Img = await getBase64FromSvg(svg);
        setFrameImg(base64Img as string);
      } catch (error) {
        console.error(error);
      } finally {
        setGenerating(false);
      }
    })();
  }, [frameData, currFid]);
  return (
    <div
      className="
        box-border flex flex-col items-center self-stretch
        rounded-[10px] border-[1px] border-solid border-[#39424C] bg-[#14171A]
        overflow-hidden
      "
      {...props}
    >
      <div className="w-full h-[418px] overflow-hidden flex justify-center items-center">
        {generating ? (
          <Loading />
        ) : (
          <img src={frameImg} alt="" className="w-full h-full" />
        )}
        {/* <FrameImgView data={frameData} creatorInfo={{ fname: '' }} /> */}
      </div>
      <div className="w-full p-[20px] box-border [border-top:1px_solid_#39424C]">
        <button
          type="button"
          className="flex w-full h-[40px] box-border justify-center items-center rounded-[10px] bg-[#FFF]"
        >
          Claim
        </button>
      </div>
    </div>
  );
}

function FrameImgView({
  data,
  creatorInfo,
}: {
  data: RedEnvelopeEntity;
  creatorInfo: {
    fname: string;
  };
}) {
  const randomFrom = data.randomFrom.toLocaleString();
  const randomTo = data.randomTo.toLocaleString();
  const totalAmountNumber = data.totalAmount;
  const totalAmount =
    totalAmountNumber > 1000
      ? `${(totalAmountNumber / 1000).toFixed(1)}K`
      : totalAmountNumber.toString();
  const RedEnvelopeImg = '/red-envelope/imgs/red-envelope.png';
  const BgPolygon = '/red-envelope/imgs/bg-polygon.png';
  return (
    <div
      style={{
        width: '800px',
        height: '418px',
        backgroundColor: '#D00',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color: '#E7B942',
          fontFamily: 'Montserrat',
          fontWeight: 700,
          fontSize: '20px',
          position: 'absolute',
          top: '29px',
          left: '27px',
          display: 'flex',
        }}
      >
        @{creatorInfo.fname}
      </div>

      <div
        style={{
          color: '#FFF',
          fontSize: '15px',
          fontFamily: 'Montserrat',
          fontWeight: 500,
          position: 'absolute',
          top: '29px',
          right: '29px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {randomFrom} — {randomTo} DEGEN
        <br />
        PER PARTICIPANT
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '10px',
          position: 'absolute',
          bottom: '16px',
          left: '27px',
        }}
      >
        <div
          style={{
            color: '#E7B942',
            fontFamily: 'Montserrat',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          U3.XYZ
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url(${RedEnvelopeImg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '383px',
          height: '346px',
          position: 'absolute',
          bottom: '-89px',
          right: '-86px',
        }}
      />
      <div
        style={{
          backgroundImage: `url(${BgPolygon})`,
          backgroundSize: '323px 323px',
          backgroundRepeat: 'no-repeat',
          width: '323px',
          height: '323px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          marginLeft: '80px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="57"
          height="51"
          viewBox="0 0 57 51"
          fill="none"
        >
          <path
            d="M47.0365 10.4561C43.7458 9.15636 41.5342 8.35476 33.1842 6.11739C26.0204 4.19785 22.4593 3.52184 19.0185 2.94867C17.41 2.68056 15.84 3.53834 15.5325 5.14662L12.5928 20.5545C11.3924 26.8462 14.0129 33.2543 19.2779 36.9021C22.3622 39.039 26.0929 40.0387 29.8325 39.7303C36.2166 39.2039 41.6908 34.9642 43.7973 28.9147L48.9551 14.1022C49.4943 12.556 48.5519 11.0553 47.0351 10.4557L47.0365 10.4561Z"
            fill="#DD0000"
          />
          <path
            d="M46.9348 33.4612C46.2032 33.3569 45.479 33.6213 44.7658 33.8146C43.579 34.1364 41.7211 34.616 40.8952 34.7001C39.6033 34.8324 37.424 34.8206 35.1113 34.7476C28.8537 34.5499 22.7189 32.9068 17.2008 29.9492C15.1613 28.8561 13.2681 27.7764 12.2159 27.0155C11.5416 26.5278 10.1681 25.1794 9.30142 24.3078C8.78405 23.7875 8.29227 23.2011 7.61214 22.9258C6.01902 22.2807 4.12683 23.25 3.62165 25.122C2.63809 28.7659 4.48251 33.2728 7.69108 36.6621C11.3089 40.4839 17.4781 43.3202 22.8319 44.7548C28.1856 46.1893 34.9464 46.8175 39.9905 45.3167C44.4639 43.9858 48.315 41.0036 49.2848 37.3574C49.7825 35.4864 48.6327 33.7035 46.9348 33.4612Z"
            fill="#DD0000"
          />
          <path
            d="M43.2269 30.8019C40.6032 30.8369 36.2869 31.7314 26.9878 29.2396C17.6886 26.7479 14.3979 23.8152 12.1431 22.473C11.7644 22.2476 11.2777 22.4631 11.1858 22.8969L9.90257 29.0088C9.85336 29.2406 9.88139 29.4787 9.97877 29.6936C10.6616 31.1882 14.0494 36.6722 24.2616 39.4085C34.4738 42.1449 40.08 39.1299 41.4648 38.1548C41.6736 38.0075 41.8277 37.7965 41.9087 37.5531L43.844 31.6476C43.9824 31.2278 43.6676 30.796 43.2269 30.8019Z"
            fill="white"
          />
        </svg>
        <div
          style={{
            color: '#D00',
            fontFamily: 'Erica One',
            fontWeight: 400,
            fontSize: '124px',
            lineHeight: '54px',
          }}
        >
          {totalAmount}
        </div>
        <div
          style={{
            color: '#D00',
            fontSize: '24px',
            fontFamily: 'Inter',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          $DEGEN
          <br />
          GIVEAWAY
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '295px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginLeft: '-10px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#000000',
                borderRadius: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFF',
                fontFamily: 'Erica One',
                fontWeight: 400,
                fontSize: '50px',
              }}
            >
              +
            </div>
            <div
              style={{
                color: '#FFF',
                fontSize: '24px',
                fontFamily: 'Inter',
                fontWeight: 700,
              }}
            >
              FOLLOW
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#000000',
                borderRadius: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFF',
                fontSize: '50px',
                fontWeight: 'normal',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M24.9972 7.07713C24.9221 5.21342 24.1668 3.44182 22.8741 2.09719C22.2565 1.44605 21.5148 0.925057 20.6928 0.564889C19.8707 0.20472 18.985 0.0126547 18.0876 0C16.5586 0.00287225 15.0875 0.585393 13.9711 1.6301C13.4172 2.13251 12.9275 2.70142 12.5132 3.32389C12.0982 2.70047 11.6077 2.13076 11.0529 1.62774C9.93609 0.583893 8.46508 0.00223222 6.93639 0C6.03968 0.0114341 5.15431 0.202019 4.33232 0.56055C3.51033 0.919081 2.76831 1.43832 2.14989 2.08775C0.849049 3.43228 0.087583 5.20792 0.0102351 7.07713C-0.110076 9.59423 0.833541 12.4416 2.66888 15.0979C4.79202 18.1646 8.07816 20.9224 12.1593 23.0502L12.4967 23.2271L12.8364 23.0502C16.9199 20.9271 20.2013 18.1717 22.3291 15.0979C24.1645 12.4463 25.1081 9.59895 24.9901 7.07713H24.9972Z"
                  fill="white"
                />
              </svg>
            </div>
            <div
              style={{
                color: '#FFF',
                fontSize: '24px',
                fontFamily: 'Inter',
                fontWeight: 700,
              }}
            >
              LIKE
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '16px',
              marginLeft: '-20px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#000000',
                borderRadius: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFF',
                fontSize: '50px',
                fontWeight: 'normal',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="22"
                viewBox="0 0 25 22"
                fill="none"
              >
                <g clipPath="url(#clip0_4231_13906)">
                  <path
                    d="M10.9566 18.8658H9.6714C7.8442 18.5615 6.18353 17.6154 4.98476 16.1955C3.78599 14.7757 3.12683 12.9742 3.12452 11.1116C3.12791 9.85228 3.43571 8.6127 4.0214 7.49965L4.98077 8.83536C5.13748 9.05392 5.35239 9.2235 5.60075 9.32457C5.84911 9.42564 6.12081 9.45408 6.38454 9.40661C6.64827 9.35915 6.8933 9.23771 7.0914 9.0563C7.28949 8.87488 7.43259 8.64087 7.50421 8.38122L8.26749 5.62101L9.32218 1.81422C9.3812 1.60144 9.39039 1.3778 9.34905 1.16084C9.30771 0.94388 9.21695 0.739506 9.08389 0.563744C8.95083 0.387983 8.77909 0.245615 8.58214 0.147806C8.38519 0.049997 8.16839 -0.000592527 7.94874 5.23629e-06L4.23546 0.00550524L1.4214 0.00943381C1.15969 0.00988792 0.903183 0.0829752 0.68013 0.220646C0.457076 0.358317 0.27613 0.555229 0.15722 0.789696C0.0383096 1.02416 -0.0139505 1.28709 0.0061954 1.54951C0.0263412 1.81193 0.118111 2.06367 0.271398 2.27701L2.03624 4.73472C0.951778 6.26107 0.273932 8.04124 0.0672678 9.90567C-0.139396 11.7701 0.132005 13.6567 0.85562 15.3858C1.57923 17.1148 2.73097 18.6288 4.20111 19.7834C5.67125 20.9381 7.41085 21.6949 9.25421 21.9819C9.39249 22.0016 9.53312 22.0008 9.6714 21.9804V22H10.9566C11.8089 22 12.4995 21.3054 12.4995 20.4482V20.4168C12.4993 20.0054 12.3367 19.6109 12.0473 19.32C11.758 19.0292 11.3656 18.8658 10.9566 18.8658Z"
                    fill="white"
                  />
                  <path
                    d="M22.9633 17.2653C24.0477 15.7389 24.7256 13.9588 24.9323 12.0943C25.1389 10.2299 24.8675 8.34332 24.1439 6.61425C23.4203 4.88519 22.2686 3.37123 20.7984 2.21659C19.3283 1.06196 17.5887 0.305084 15.7453 0.0180714C15.6069 -0.00142524 15.4664 -0.000896066 15.3281 0.0196429V0H14.043C13.1914 0 12.5 0.694571 12.5 1.551V1.58243C12.5 1.99399 12.6626 2.38869 12.9519 2.67971C13.2413 2.97072 13.6337 3.13421 14.043 3.13421H15.3281C19.1016 3.76279 21.8703 7.04157 21.875 10.8884C21.8716 12.1477 21.5638 13.3873 20.9781 14.5004L20.0188 13.1646C19.862 12.9461 19.6471 12.7765 19.3988 12.6754C19.1504 12.5744 18.8787 12.5459 18.615 12.5934C18.3513 12.6409 18.1062 12.7623 17.9081 12.9437C17.71 13.1251 17.5669 13.3591 17.4953 13.6188L16.732 16.379L15.6773 20.1858C15.6183 20.3986 15.6091 20.6222 15.6505 20.8392C15.6918 21.0561 15.7826 21.2605 15.9156 21.4363C16.0487 21.612 16.2204 21.7544 16.4174 21.8522C16.6143 21.95 16.8311 22.0006 17.0508 22L20.7648 21.9945L23.5781 21.9906C23.8399 21.9903 24.0965 21.9173 24.3197 21.7797C24.5428 21.6421 24.7239 21.4452 24.8429 21.2107C24.9619 20.9762 25.0142 20.7132 24.9941 20.4507C24.974 20.1882 24.8822 19.9364 24.7289 19.723L22.9633 17.2653Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4231_13906">
                    <rect width="25" height="22" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              style={{
                color: '#FFF',
                fontSize: '24px',
                fontFamily: 'Inter',
                fontWeight: 700,
              }}
            >
              RECAST
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
