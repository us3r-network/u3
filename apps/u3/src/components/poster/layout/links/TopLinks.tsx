import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import LinkCard, { type LinkCardData } from './LinkCard';
import { encodeLinkURL } from '@/utils/news/link';

export type TopLinksData = Array<LinkCardData>;
export type TopLinksProps = { links: TopLinksData };

const ROUTE_PREFIX = '/b/links';
export default function TopLinks({ links }: TopLinksProps) {
  const navigate = useNavigate();
  return (
    <div className="w-0 flex-1">
      <p className="text-[#000] text-[16px] font-bold leading-normal underline">
        Top Links
      </p>
      <div className="grid grid-cols-1 gap-[10px] divide-y divide-[#808684]">
        {links.map((item) => {
          return (
            <LinkCard
              key={item.url}
              data={item}
              className="pt-[10px] cursor-pointer"
              onClick={() =>
                isMobile
                  ? window.open(item?.url, '_blank')
                  : navigate(`${ROUTE_PREFIX}/all/${encodeLinkURL(item?.url)}`)
              }
              title={`${ROUTE_PREFIX}/all/${encodeLinkURL(item?.url)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
