import { ComponentPropsWithRef } from 'react';

export default function ExploreIcon({
  active,
  ...props
}: ComponentPropsWithRef<'svg'> & { active?: boolean }) {
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
      <path
        d="M12.25 22C17.7728 22 22.25 17.5228 22.25 12C22.25 6.47715 17.7728 2 12.25 2C6.72715 2 2.25 6.47715 2.25 12C2.25 17.5228 6.72715 22 12.25 22Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9721 8.26596C15.4607 8.10312 15.7049 8.02169 15.8674 8.07962C16.0087 8.13003 16.12 8.24127 16.1704 8.38263C16.2283 8.54507 16.1469 8.78935 15.984 9.27789L14.4965 13.7405C14.4501 13.8797 14.4269 13.9492 14.3874 14.007C14.3524 14.0582 14.3082 14.1024 14.257 14.1374C14.1992 14.1769 14.1297 14.2001 13.9905 14.2465L9.52789 15.734C9.03935 15.8969 8.79507 15.9783 8.63263 15.9204C8.49127 15.87 8.38003 15.7587 8.32962 15.6174C8.27169 15.4549 8.35312 15.2107 8.51596 14.7221L10.0035 10.2595C10.0499 10.1203 10.0731 10.0508 10.1126 9.99299C10.1476 9.94182 10.1918 9.8976 10.243 9.8626C10.3008 9.82308 10.3703 9.79989 10.5095 9.75351L14.9721 8.26596Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
