import React from "react";

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    inputClassName?: string;
    wrapperClassName?: string;
}

export default function ChatInput({
    value,
    onChange,
    onSubmit,
    inputClassName = "",
    wrapperClassName = "",
    }: ChatInputProps) {
    return (
        <div className={`${wrapperClassName}`}>
        <input
            type="text"
            placeholder="추가로 궁금한 사항이 있으신가요? 여기에 입력해주세요"
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
            }}
            className={`flex-1 px-3 py-2 rounded bg-[#111111] text-white focus:outline-none mr-2 ${inputClassName}`}
        />
        <button
            onClick={onSubmit}
            className="w-12 h-12 bg-[#000000] rounded-full flex items-center justify-center hover:text-[#767676]"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="40"
            height="40"
            >
            <polygon points="12,6 6,18 18,18" />
            </svg>
        </button>
        </div>
    );
}