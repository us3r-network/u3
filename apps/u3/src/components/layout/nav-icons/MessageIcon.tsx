import { ComponentPropsWithRef } from 'react';

export default function MessageIcon({
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
        d="M10.5 15L7.42474 18.1137C6.99579 18.548 6.78131 18.7652 6.59695 18.7805C6.43701 18.7938 6.28042 18.7295 6.17596 18.6076C6.05556 18.4672 6.05556 18.162 6.05556 17.5515V15.9916C6.05556 15.444 5.60707 15.0477 5.0652 14.9683V14.9683C3.75374 14.7762 2.72378 13.7463 2.53168 12.4348C2.5 12.2186 2.5 11.9605 2.5 11.4444V6.8C2.5 5.11984 2.5 4.27976 2.82698 3.63803C3.1146 3.07354 3.57354 2.6146 4.13803 2.32698C4.77976 2 5.61984 2 7.3 2H14.7C16.3802 2 17.2202 2 17.862 2.32698C18.4265 2.6146 18.8854 3.07354 19.173 3.63803C19.5 4.27976 19.5 5.11984 19.5 6.8V11M19.5 22L17.3236 20.4869C17.0177 20.2742 16.8647 20.1678 16.6982 20.0924C16.5504 20.0255 16.3951 19.9768 16.2356 19.9474C16.0558 19.9143 15.8695 19.9143 15.4969 19.9143H13.7C12.5799 19.9143 12.0198 19.9143 11.592 19.6963C11.2157 19.5046 10.9097 19.1986 10.718 18.8223C10.5 18.3944 10.5 17.8344 10.5 16.7143V14.2C10.5 13.0799 10.5 12.5198 10.718 12.092C10.9097 11.7157 11.2157 11.4097 11.592 11.218C12.0198 11 12.5799 11 13.7 11H19.3C20.4201 11 20.9802 11 21.408 11.218C21.7843 11.4097 22.0903 11.7157 22.282 12.092C22.5 12.5198 22.5 13.0799 22.5 14.2V16.9143C22.5 17.8462 22.5 18.3121 22.3478 18.6797C22.1448 19.1697 21.7554 19.5591 21.2654 19.762C20.8978 19.9143 20.4319 19.9143 19.5 19.9143V22Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
