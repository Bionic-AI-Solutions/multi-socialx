import React from 'react';

// Text wordmark rather than drawn glyphs — the previous paths spelled "Postiz".
// Width/height are unchanged so surrounding layout is unaffected, and the text
// keeps `currentColor` so it still follows the theme as the paths did.
export const LogoTextComponent = () => {
  return (
    <svg
      width="101"
      height="33"
      viewBox="0 0 101 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="26" height="26" x="0" y="3" rx="6" fill="#612BD3" />
      <text
        x="13"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="inherit"
        fontSize="16"
        fontWeight="700"
      >
        B
      </text>
      <text
        x="33"
        y="17"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="20"
        fontWeight="600"
      >
        Bionic
      </text>
    </svg>
  );
};
