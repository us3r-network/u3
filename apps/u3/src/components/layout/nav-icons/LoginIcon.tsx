import { ComponentPropsWithRef } from 'react';

export default function LoginIcon({
  active,
  unread,
  ...props
}: ComponentPropsWithRef<'svg'> & { active?: boolean; unread?: boolean }) {
  const color = active ? '#fff' : '#718096';
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.314 16.957C11.0723 16.9257 10.8321 16.884 10.594 16.832C10.531 16.819 10.466 16.808 10.403 16.794C10.1468 16.733 9.89321 16.6613 9.643 16.579C8.916 16.336 8.097 16.519 7.618 17.081C7.558 17.154 7.504 17.231 7.448 17.305C7.378 17.399 7.304 17.489 7.24 17.586C7.183 17.669 7.136 17.759 7.084 17.845C7.026 17.944 6.964 18.041 6.912 18.143C6.865 18.233 6.828 18.329 6.787 18.422C6.74 18.526 6.691 18.629 6.651 18.737C6.616 18.833 6.588 18.933 6.559 19.031C6.525 19.141 6.489 19.249 6.461 19.361C6.437 19.462 6.421 19.566 6.404 19.668C6.383 19.782 6.36 19.895 6.347 20.012C6.336 20.117 6.334 20.225 6.328 20.331C6.322 20.44 6.314 20.548 6.315 20.659C6.428 23.78 18.569 23.78 18.681 20.659C18.682 20.549 18.675 20.439 18.669 20.331C18.664 20.225 18.662 20.117 18.649 20.012C18.636 19.895 18.614 19.782 18.593 19.668C18.576 19.566 18.56 19.462 18.536 19.361C18.509 19.249 18.473 19.141 18.439 19.031C18.409 18.933 18.382 18.833 18.346 18.737C18.307 18.629 18.258 18.527 18.211 18.422C18.169 18.329 18.131 18.234 18.085 18.143C18.033 18.041 17.971 17.943 17.912 17.845C17.861 17.759 17.813 17.669 17.758 17.586C17.692 17.489 17.62 17.399 17.549 17.305C17.492 17.23 17.439 17.154 17.379 17.081C16.9 16.519 16.081 16.336 15.354 16.579C15.1038 16.6613 14.8502 16.733 14.594 16.794C14.53 16.808 14.466 16.819 14.404 16.832C14.1656 16.884 13.925 16.9257 13.683 16.957C13.598 16.968 13.514 16.979 13.429 16.988C13.1201 17.0219 12.8097 17.0399 12.499 17.042C12.184 17.042 11.875 17.019 11.569 16.988C11.483 16.979 11.399 16.968 11.314 16.957ZM19 9.047C19 12.387 16.089 15.096 12.5 15.096C8.91 15.096 6 12.388 6 9.048C6 5.708 8.91 3 12.5 3C16.089 3 19 5.707 19 9.048"
        fill={color}
      />
    </svg>
  );
}
