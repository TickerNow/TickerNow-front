import { useEffect, useState } from "react";

interface TypingTextProps {
    text: string;
    speed?: number;       // 타이핑 속도 (ms)
}

export default function TypingText({ text, speed = 20 }: TypingTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
        const timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            setIndex((prev) => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
        }
        // 다 찍으면 그냥 멈춤
    }, [index, text, speed]);

    return (
        <p>
        {displayedText}
        <span className="animate-pulse">|</span>
        </p>
    );
}