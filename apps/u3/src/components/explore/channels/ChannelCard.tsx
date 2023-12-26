import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type ChannelData = {
  logo: string;
  name: string;
  followerCount: number;
  postCount: number;
};
interface Props extends ComponentPropsWithRef<'div'> {
  data: ChannelData;
}
export default function ChannelCard({ data, className, ...divProps }: Props) {
  const { logo, name, followerCount, postCount } = data;
  return (
    <div
      className={cn(
        'w-full box-border bg-[#1B1E23] rounded-[20px] border-[1px] border-solid border-[#39424C] overflow-hidden cursor-pointer ',
        className
      )}
      {...divProps}
    >
      <div
        className={cn(
          'w-full h-full flex [transition:all_0.3s] hover:scale-105',
          'max-sm:p-[10px] max-sm:box-border max-sm:gap-[10px]'
        )}
      >
        <div
          className={cn(
            'w-[80px] h-full',
            'max-sm:w-[48px] max-sm:h-[48px] max-sm:flex-shrink-0'
          )}
        >
          <img
            src={logo}
            alt=""
            className={cn(
              'w-full h-full object-cover',
              'max-sm:rounded-[10px]'
            )}
          />
        </div>
        <div
          className={cn(
            'w-[0] flex-[1] px-[20px] box-border flex flex-col justify-center gap-[14px]',
            'max-sm:p-0 max-sm:gap-[4px]'
          )}
        >
          <span className="text-white text-[16px] font-medium line-clamp-1">
            {name}
          </span>
          <div
            className={cn(
              'flex items-center gap-[10px] justify-between text-[#718096] text-[16px] leading-[15px]',
              'max-sm:justify-start max-sm:gap-[40px] max-sm:text-[12px]'
            )}
          >
            {followerCount > 0 && (
              <div
                className="
              flex
              items-center
              gap-[5px]
            "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M9.81223 9.4787C10.931 8.83943 11.73 7.61416 11.73 6.22907C11.73 4.15145 10.0786 2.5 8.00097 2.5C5.92334 2.5 4.27189 4.15145 4.27189 6.22907C4.27189 7.61416 5.01771 8.83943 6.1897 9.4787C4.69807 10.0647 3.57935 11.3965 3.20644 12.9947C3.15317 13.261 3.31299 13.5807 3.63262 13.634H3.73917C4.00553 13.634 4.21862 13.4741 4.27189 13.2078C4.6448 11.4498 6.1897 10.1712 8.00097 10.1712C9.81223 10.1712 11.3571 11.4498 11.73 13.2078C11.7833 13.4741 12.0497 13.6872 12.3693 13.634C12.6357 13.5807 12.8488 13.3143 12.7955 12.9947C12.4226 11.3965 11.3039 10.0647 9.81223 9.4787ZM5.33734 6.22907C5.33734 4.73744 6.50934 3.56545 8.00097 3.56545C9.4926 3.56545 10.6646 4.73744 10.6646 6.22907C10.6646 7.7207 9.4926 8.8927 8.00097 8.8927C6.50934 8.8927 5.33734 7.7207 5.33734 6.22907ZM15.9918 9.79833C15.7788 8.73288 15.0862 7.88052 14.0208 7.40107C14.6068 6.86834 14.9264 6.12253 14.9264 5.27017C14.9264 3.72527 13.7544 2.5 12.2628 2.5C11.9431 2.5 11.73 2.71309 11.73 3.03272C11.73 3.35236 11.9431 3.56545 12.2628 3.56545C13.1684 3.56545 13.8609 4.31126 13.8609 5.27017C13.8609 6.12253 13.3815 6.7618 12.6357 6.92162C12.3693 6.97489 12.1562 7.29452 12.2628 7.56089C12.2628 7.82725 12.4226 8.04034 12.6889 8.04034C13.8609 8.25343 14.66 8.94597 14.8731 9.95815C14.9264 10.2245 15.1395 10.3843 15.4058 10.3843H15.5124C15.832 10.3843 16.0451 10.118 15.9918 9.79833ZM3.6859 7.61416C3.79244 7.29452 3.57935 7.02816 3.31299 6.92162C2.62045 6.7618 2.14099 6.12253 2.14099 5.27017C2.19427 4.31126 2.83354 3.56545 3.73917 3.56545C4.0588 3.56545 4.27189 3.35236 4.27189 3.03272C4.27189 2.71309 4.00553 2.5 3.73917 2.5C2.24754 2.5 1.12882 3.67199 1.12882 5.27017C1.12882 6.12253 1.44845 6.86834 1.98118 7.40107C0.969 7.88052 0.223185 8.73288 0.0100952 9.79833C-0.0431773 10.0647 0.11664 10.3843 0.436275 10.4376H0.54282C0.809183 10.4376 1.02227 10.2778 1.07554 10.0114C1.28863 8.99924 2.08772 8.3067 3.25972 8.09361C3.52608 8.09361 3.6859 7.88052 3.6859 7.61416Z"
                    fill="#718096"
                  />
                </svg>
                {followerCount}
              </div>
            )}

            <div>{postCount} new posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
