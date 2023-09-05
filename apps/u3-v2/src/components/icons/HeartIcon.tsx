export default function HeartIcon({
  fill,
  stroke,
}: {
  fill?: string
  stroke?: string
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
        d="M13 4.90815C13 5.93914 12.6437 6.9294 12.0075 7.66194C10.5429 9.34867 9.12244 11.1075 7.60318 12.7331C7.25494 13.1003 6.70252 13.0869 6.36928 12.7031L1.99225 7.66194C0.669248 6.13814 0.669248 3.67815 1.99225 2.15438C3.32826 0.615633 5.50476 0.615633 6.84076 2.15438L6.99988 2.33761L7.15888 2.15449C7.79944 1.41633 8.67184 1 9.58318 1C10.4945 1 11.3669 1.41629 12.0075 2.15438C12.6438 2.88697 13 3.87718 13 4.90815Z"
        fill={fill || 'none'}
        stroke={stroke || 'white'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
