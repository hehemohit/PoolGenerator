
import React from 'react';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Background Shape */}
        <rect x="5" y="5" width="90" height="90" fill="#a3e635" stroke="black" strokeWidth="6" />

        {/* Abstract 'P' / Bracket Shape */}
        <path
            d="M30 25 H70 V45 H50 V75 H30 V25 Z"
            fill="#d8b4fe"
            stroke="black"
            strokeWidth="6"
        />

        {/* Accent Dot */}
        <circle cx="65" cy="65" r="10" fill="#ff69b4" stroke="black" strokeWidth="6" />

        {/* Hard Shadow Detail */}
        <path d="M75 25 L75 35" stroke="black" strokeWidth="6" />
        <path d="M30 75 L30 85" stroke="black" strokeWidth="6" />
    </svg>
);
