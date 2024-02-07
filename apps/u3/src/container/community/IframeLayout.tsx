import { useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import Loading from '@/components/common/loading/Loading';
import { CommunityEntity } from '@/services/community/types/community';

export default function IframeLayout() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { pathname } = useLocation();
  const { configType, configId } = useParams();
  const { channelId, communityInfo } = useOutletContext<any>();
  const { name, nfts, tokens, points, apps } = communityInfo as CommunityEntity;
  let href = '';
  let title = '';
  console.log('configType', configType);
  console.log('configId', configId);

  if (configType === 'app') {
    const dapp = apps?.find((app) => app.name === configId);
    href = dapp?.website;
    title = dapp?.name;
  }
  if (configType === 'nft') {
    const nft = nfts?.find((n) => n.contract === configId);
    href = nft?.url;
    title = configId;
  }
  if (configType === 'token') {
    const token = tokens?.find((t) => t.contract === configId);
    href = token?.url;
    title = configId;
  }
  if (pathname.includes(`community/${channelId}/point`)) {
    const point = points?.[0];
    href = point?.url;
    title = `${name} Points`;
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
