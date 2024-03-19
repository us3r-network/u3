import { ComponentPropsWithRef } from 'react';

export default function NotificationIcon({
  active,
  unread,
  ...props
}: ComponentPropsWithRef<'svg'> & { active?: boolean; unread?: boolean }) {
  const color = active ? '#fff' : '#718096';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_4162_8672)">
        <path
          d="M10.1039 21C10.8091 21.6224 11.7353 22 12.7498 22C13.7642 22 14.6905 21.6224 15.3956 21M18.7498 8C18.7498 6.4087 18.1176 4.88258 16.9924 3.75736C15.8672 2.63214 14.3411 2 12.7498 2C11.1585 2 9.63235 2.63214 8.50713 3.75736C7.38192 4.88258 6.74977 6.4087 6.74977 8C6.74977 11.0902 5.97024 13.206 5.09944 14.6054C4.3649 15.7859 3.99763 16.3761 4.0111 16.5408C4.02601 16.7231 4.06463 16.7926 4.21155 16.9016C4.34423 17 4.94237 17 6.13863 17H19.3609C20.5572 17 21.1553 17 21.288 16.9016C21.4349 16.7926 21.4735 16.7231 21.4884 16.5408C21.5019 16.3761 21.1346 15.7859 20.4001 14.6054C19.5293 13.206 18.7498 11.0902 18.7498 8Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {unread && (
          <rect x="18.75" width="6" height="6" rx="3" fill="#F81775" />
        )}
      </g>
      <defs>
        <clipPath id="clip0_4162_8672">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.75)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
