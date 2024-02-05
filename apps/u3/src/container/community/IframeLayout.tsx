import { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Loading from '@/components/common/loading/Loading';

export default function IframeLayout() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { configType, configId } = useParams();
  const { communityInfo } = useOutletContext<any>();
  let href = '';
  let title = '';
  if (configType === 'app') {
    href = communityInfo?.dapps?.find((dapp: any) => dapp.id === configId)?.url;
    title = communityInfo?.dapps?.find(
      (dapp: any) => dapp.id === configId
    )?.name;
  }
  const config = communityInfo[configType];
  if (config && config.contract === configId) {
    href = config.url;
    title = configId;
  }
  return (
    <div className="w-full h-full flex">
      {!iframeLoaded && (
        <div className="w-full h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
      <iframe
        src={href}
        title={title}
        style={{
          display: iframeLoaded ? 'block' : 'none',
        }}
        onLoad={(e) => {
          setIframeLoaded(true);
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full bg-[#fff]"
      />
    </div>
  );
}
