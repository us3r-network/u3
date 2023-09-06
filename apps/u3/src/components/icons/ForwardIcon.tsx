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
