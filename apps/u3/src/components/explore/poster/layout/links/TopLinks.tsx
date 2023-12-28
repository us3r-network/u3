import LinkCard, { type LinkCardData } from './LinkCard';

export type TopLinksData = Array<LinkCardData>;
export type TopLinksProps = { links: TopLinksData };

export default function TopLinks({ links }: TopLinksProps) {
  return (
    <div className="w-0 flex-1">
      <p className="text-[#000] text-[16px] font-bold leading-normal underline">
        Top Links
      </p>
      <div className="grid grid-cols-1 gap-[10px] divide-y divide-[#808684]">
        {links.map((item) => {
          return <LinkCard key={item.url} data={item} className="pt-[10px]" />;
        })}
      </div>
    </div>
  );
}
