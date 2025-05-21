import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
};

export default function Button({ children, className = "", disabled, ...props }: ButtonProps) {
    return (
        <button
        disabled={disabled}
        className={`
            px-6 py-3 rounded-sm shadow-lg transition-colors border
            ${disabled 
            ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400"
            : "bg-[#FCD535] text-[#111111] hover:bg-[#2c2f36] hover:text-white active:bg-[#121417] cursor-pointer border-[#FCD535]"
            }
            ${className}
        `}
        {...props}
        >
        {children}
        </button>
    );
}