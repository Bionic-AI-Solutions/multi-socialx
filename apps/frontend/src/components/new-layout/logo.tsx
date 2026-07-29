'use client';

// Text wordmark rather than a drawn mark — the previous icon was the Postiz
// logo. Dimensions and className are unchanged so surrounding layout is
// unaffected.
export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      className="mt-[8px] min-w-[60px] min-h-[60px]"
    >
      <rect width="60" height="60" rx="14" fill="#612BD3" />
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="inherit"
        fontSize="34"
        fontWeight="700"
      >
        B
      </text>
    </svg>
  );
};
