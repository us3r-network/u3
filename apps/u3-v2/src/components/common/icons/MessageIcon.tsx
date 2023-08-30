export default function MessageIcon({
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
        d="M1 12.5968V2.34148C1 1.6006 1.59695 1 2.33333 1H11.6667C12.4031 1 13 1.6006 13 2.34148V9.04888C13 9.78978 12.4031 10.3904 11.6667 10.3904H4.3075C3.90245 10.3904 3.51937 10.5756 3.26634 10.8938L1.71235 12.8482C1.47614 13.1452 1 12.9772 1 12.5968Z"
        stroke={stroke || 'white'}
      />
    </svg>
  )
}
