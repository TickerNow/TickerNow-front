import React, { useEffect, useState } from "react";

const messages = [
    "지금 이 종목, 오를까? 떨어질까?",
    "오늘의 시장 흐름, 당신은 예측할 수 있나요?",
    "궁금한 주식 정보, 한눈에 정리해드립니다.",
    "당신의 투자 판단, 데이터로 도와드릴게요.",
    "지금 검색하고, 흐름을 확인하세요.",
];

export default function TypingHeadline() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [text, setText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const currentMessage = messages[messageIndex];

        if (charIndex < currentMessage.length) {
            const timeout = setTimeout(() => {
                setText((prev) => prev + currentMessage[charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 100); // 글자 타이핑 속도

            return () => clearTimeout(timeout);
        } else {
            // 다 치고 나서 2초 후 다음 문구
            const wait = setTimeout(() => {
                setText("");
                setCharIndex(0);
                setMessageIndex((prev) => (prev + 1) % messages.length);
            }, 5000);
            return () => clearTimeout(wait);
        }
    }, [charIndex, messageIndex]);

    return (
        <div className="text-white text-xl font-semibold mb-2 mt-[30vh] text-center h-[3.5rem]">
            {text}
            <span className="animate-pulse">|</span>
        </div>
    );
}