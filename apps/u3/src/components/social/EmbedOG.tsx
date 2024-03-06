import { OGData } from '@/services/social/types';

export default function EmbedOG({ data, url }: { data: OGData; url: string }) {
  const img = data.ogImage?.[0]?.url;

  return (
    <div
      className="border rounded-xl overflow-hidden border-[#39424c]"
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, '_blank');
      }}
    >
      {img && (
        <div className="img">
          <img
            className="img w-full object-cover max-h-[300px]"
            src={img}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-col gap-[10px] p-[16px] font-[Rubik]">
        <h4 className="text-[#fff] text-[14px] not-italic font-bold leading-[20px]">
          {data.ogTitle}
        </h4>
        {data.ogDescription && (
          <p
            className={
              'text-[#fff] text-[12px] not-italic font-normal leading-[20px]'
            }
          >
            {data.ogDescription}
          </p>
        )}
        <div className="flex justify-between items-center gap-[12px]">
          <a
            className="inline-block flex-1 line-clamp-1 text-[#718096] text-[12px] not-italic font-normal leading-[20px]"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(url).host}
          </a>
        </div>
      </div>
    </div>
  );
}
