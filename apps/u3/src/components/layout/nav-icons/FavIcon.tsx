import { ComponentPropsWithRef } from 'react';

export default function ExploreIcon({
  active,
  ...props
}: ComponentPropsWithRef<'svg'> & { active?: boolean }) {
  const color = active ? '#fff' : '#718096';
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.1321 23.0648V23.0648H18.128C17.8799 23.0648 17.5767 22.9917 17.2829 22.8448L12.2605 20.3327L12.0377 20.2213L11.8145 20.332L6.76097 22.84L6.75457 22.8432L6.74827 22.8466C6.50318 22.9771 6.21792 23.0478 5.92328 23.0478L5.92134 23.0478C5.54419 23.0493 5.17663 22.9292 4.87318 22.7052C4.31388 22.2848 4.03459 21.557 4.1624 20.9176L4.16305 20.9143L5.19662 15.5524L5.249 15.2807L5.04656 15.092L1.09307 11.4073C0.857649 11.1663 0.689029 10.8681 0.603902 10.5421C0.518243 10.214 0.520128 9.86923 0.609338 9.54214L0.61328 9.52858C0.845675 8.84232 1.40617 8.37972 2.0712 8.29064L2.08277 8.28909L2.09426 8.287L7.5983 7.28622L7.84615 7.24115L7.95743 7.01515L10.4266 2.00025C10.4268 1.99983 10.427 1.99942 10.4272 1.999C10.7435 1.36696 11.3818 0.971924 12.0368 0.971924C12.7367 0.971924 13.3804 1.3914 13.6446 1.99246L13.649 2.00237L13.6538 2.01208L16.1163 7.01364L16.2285 7.24156L16.4788 7.28531L21.9837 8.24775L21.9909 8.24901L21.9981 8.25005C22.3304 8.2982 22.6417 8.44134 22.8945 8.66224C23.1474 8.88314 23.331 9.1724 23.4234 9.49522L23.4259 9.50397L23.4287 9.51263C23.5332 9.83344 23.5465 10.177 23.4671 10.5049C23.3876 10.8329 23.2185 11.1322 22.9787 11.3696L22.9766 11.3717L22.9685 11.3798L19.0238 15.0945L18.8251 15.2816L18.875 15.5499L19.8734 20.9213L19.8735 20.9219C19.9984 21.5896 19.7353 22.2697 19.1703 22.6993L19.1701 22.6992L19.1596 22.7076C18.8685 22.9416 18.5055 23.0678 18.1321 23.0648ZM22.2571 11.2169L22.2639 11.2106L22.2703 11.204C22.6606 10.8083 22.7982 10.2353 22.6242 9.70745L22.616 9.68159C22.5431 9.42632 22.3978 9.19754 22.1976 9.02298C21.9963 8.84752 21.7484 8.7345 21.484 8.69766L21.4688 8.69527L15.8465 7.71238L13.3188 2.57831C13.1002 2.08438 12.5634 1.77089 12.0364 1.77089C11.482 1.77089 10.9887 2.11236 10.7455 2.59752L10.7439 2.60071L8.22721 7.71187L2.57955 8.73779C2.01938 8.81383 1.60057 9.19627 1.41799 9.72322L1.41222 9.73989L1.40763 9.75693C1.2695 10.27 1.42818 10.8609 1.79958 11.2405L1.80766 11.2488L1.8161 11.2566L5.86569 15.0302L4.80295 20.5423C4.80281 20.543 4.80267 20.5437 4.80254 20.5444C4.69494 21.0856 4.94653 21.6566 5.37733 21.9801C5.61817 22.1612 5.91621 22.2519 6.21489 22.2519C6.44584 22.2519 6.67562 22.1981 6.88047 22.088L6.8888 22.0835L6.89695 22.0787L6.90004 22.0769L12.0378 19.5283L17.1496 22.0846C17.15 22.0848 17.1503 22.085 17.1507 22.0852C17.3521 22.1865 17.6104 22.2668 17.8356 22.2668C18.1243 22.2668 18.4188 22.1783 18.6512 21.985C18.6516 21.9846 18.652 21.9843 18.6524 21.9839L18.6665 21.9724C19.1045 21.6381 19.3352 21.095 19.2326 20.5457C19.2325 20.5454 19.2325 20.5452 19.2324 20.5449L18.2086 15.0295L22.2571 11.2169Z"
        stroke={color}
      />
    </svg>
  );
}