export default function ForwardIcon({
  fill,
  stroke,
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={fill || 'none'}
    >
      <path
        d="M13 5.66667H4.6C-0.2 5.66667 -0.2 13 4.6 13M13 5.66667L8.8 1M13 5.66667L8.8 10.3333"
        stroke={stroke || 'white'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ForwardIcon2({
  fill,
  stroke,
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <g clipPath="url(#clip0_343_5790)">
        <path
          d="M9.0568 5.45272C9.16391 5.36088 9.21744 5.31498 9.2371 5.26035C9.2543 5.21239 9.2543 5.15996 9.2371 5.112C9.21744 5.05737 9.16391 5.01147 9.0568 4.91963L5.33984 1.73371C5.15546 1.57566 5.06327 1.49663 4.98521 1.4947C4.91737 1.49302 4.85256 1.52282 4.80969 1.57542C4.76037 1.63594 4.76037 1.75738 4.76037 2.00024V3.88498C3.82368 4.04885 2.96639 4.52348 2.32931 5.23613C1.63475 6.01311 1.25054 7.01857 1.25 8.06071V8.32925C1.71045 7.77457 2.28534 7.32599 2.93531 7.01418C3.50835 6.73927 4.12781 6.57643 4.76037 6.53352V8.37212C4.76037 8.61495 4.76037 8.73641 4.80969 8.79692C4.85256 8.84953 4.91737 8.87933 4.98521 8.87766C5.06327 8.87573 5.15546 8.7967 5.33984 8.63865L9.0568 5.45272Z"
          stroke={stroke || '#718096'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_343_5790">
          <rect width="10" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
