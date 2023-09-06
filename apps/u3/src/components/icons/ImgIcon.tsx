export default function ImgIcon({
  fill,
  stroke,
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill={fill || 'none'}
    >
      <path
        d="M21 1.64715V19.7675C21 20.1249 20.7016 20.4146 20.3333 20.4146H1.66667C1.29848 20.4146 1 20.1249 1 19.7675V1.64715C1 1.28974 1.29848 1 1.66667 1H20.3333C20.7016 1 21 1.28974 21 1.64715Z"
        stroke={stroke || 'white'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 15.0217L8.77778 11.7859L21 17.1788"
        stroke={stroke || 'white'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4439 8.5502C14.2166 8.5502 13.2217 7.5844 13.2217 6.39302C13.2217 5.20164 14.2166 4.23584 15.4439 4.23584C16.6712 4.23584 17.6661 5.20164 17.6661 6.39302C17.6661 7.5844 16.6712 8.5502 15.4439 8.5502Z"
        stroke={stroke || 'white'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
