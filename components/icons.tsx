import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M88,134.3,161.7,208,224,145.7,150.3,72,88,134.3a48,48,0,0,1,0,67.9h0a48,48,0,0,1-67.9,0h0a48,48,0,0,1,0-67.9L82.3,72,144,9.7,206.3,72,144,134.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </svg>
  );
}
