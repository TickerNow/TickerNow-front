import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import type { Stock } from "../../types/Stock";
import { useRef, useState, useEffect  } from "react";

function convertDateFormat(dateStr: string): string {
    const delimiter = dateStr.includes('.') ? '.' : '-';
    let [yy, mm, dd] = dateStr.split(delimiter);

    // 2자리 연도 처리
    if (yy.length === 2) {
        const num = parseInt(yy, 10);
        const currentYear = new Date().getFullYear() % 100; // 예: 2025 → 25
        const century = num > currentYear ? '19' : '20';
        yy = century + yy;
    }

    return `${yy}-${mm}-${dd}`;
}

function getMonthlyWeekNumber(date: Date): number {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = first.getDay(); // 0(일) ~ 6(토)
    const day = date.getDate();
    return Math.ceil((day + dayOfWeek) / 7);
}

// 봉별 데이터 그룹핑
function getGroupedAverageData(data: Stock[], mode: 'daily' | 'weekly' | 'monthly'): (Stock & { name: string, value: number })[] {
    if (mode === 'daily') {
        return data.map(item => ({
        ...item,
        name: convertDateFormat(item.date),
        value: item.close_price,
        }));
    }

    const grouped: Record<string, Stock[]> = {};

    data.forEach(item => {
        const dateObj = new Date(convertDateFormat(item.date).replace(/\./g, '-'));
        let key = '';

        if (mode === 'weekly') {
        const year = dateObj.getFullYear();
        const week = getMonthlyWeekNumber(dateObj);
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        key = `${year}-${month}-${week}`;
        console.log(key)
        } else if (mode === 'monthly') {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        key = `${year}-${month}`;
        }

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    
    return Object.entries(grouped).map(([key, items]) => {
        const avgClose = items.reduce((sum, item) => sum + item.close_price, 0) / items.length;
        const base = items[items.length - 1]; // 가장 마지막 데이터 사용

        return {
        ...base,
        name: key,
        value: Math.round(avgClose),
        };
    });
}

interface Props {
    data: Stock[];
}

// 커스텀 툴팁 컴포넌트
function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const stock: Stock = payload[0].payload;

        return (
        <div className="bg-[#767676] rounded-sm p-2 text-sm">
            <div>
            <strong>{convertDateFormat(stock.date)}</strong>
            </div>
            <div>시가: {stock.open_price.toLocaleString()}</div>
            <div>고가: {stock.high_price.toLocaleString()}</div>
            <div>저가: {stock.low_price.toLocaleString()}</div>
            <div>종가: {stock.close_price.toLocaleString()}</div>
            <div>거래량: {stock.trading_volume.toLocaleString()}</div>
        </div>
        );
    }

    return null;
}


export default function StockChart({ data }: Props) {
    // 날짜 오름차순 정렬
    const sortedData = [...data].sort(
        (a, b) =>
        new Date(convertDateFormat(a.date)).getTime() -
        new Date(convertDateFormat(b.date)).getTime()
    );

    const [mode, setMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const processed = getGroupedAverageData(sortedData, mode);

    const [visibleStartIndex, setVisibleStartIndex] = useState<number>(0);
    const [visibleRange, setVisibleRange] = useState<number>(processed.length);
    const maxZoomRange = 7;
    const isDragging = useRef<boolean>(false);
    const dragStartX = useRef<number>(0);

    useEffect(() => {
        setVisibleRange(processed.length); // 기본 값으로 초기화
        setVisibleStartIndex(0); // 맨 앞에서 시작
    }, [mode, processed.length]);

    const handleZoomIn = () => {
        const newRange = Math.max(maxZoomRange, Math.floor(visibleRange / 2));
        setVisibleRange(newRange);
        setVisibleStartIndex((prev) =>
            Math.min(prev, processed.length - newRange)
        );
    };

    const handleZoomOut = () => {
        const newRange = Math.min(processed.length, Math.floor(visibleRange * 2));

        // 시작 인덱스 조정 (오른쪽으로 치우치지 않게 중앙 유지)
        const maxStart = processed.length - newRange;
        const centerIndex = visibleStartIndex + Math.floor(visibleRange / 2);
        const newStartIndex = Math.max(0, Math.min(centerIndex - Math.floor(newRange / 2), maxStart));

        setVisibleRange(newRange);
        setVisibleStartIndex(newStartIndex);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const diffX = e.clientX - dragStartX.current;
        const threshold = 3;
        const maxStep = 30;

        if (Math.abs(diffX) > threshold) {
            const direction = diffX > 0 ? -1 : 1;
            const step = Math.min(maxStep, Math.floor(Math.abs(diffX) / threshold));

            setVisibleStartIndex((prev) => {
                const newStart = Math.min(
                    Math.max(0, prev + direction * step),
                    processed.length - visibleRange
                );
                return newStart;
            });
            dragStartX.current = e.clientX;
        }
    };

    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        const direction = e.deltaY > 0 ? 1 : -1;

        const threshold = 3;
        const maxStep = 30;
        const step = Math.min(maxStep, Math.floor(Math.abs(e.deltaY) / threshold));

        setVisibleStartIndex((prev) => {
            const newStart = Math.min(
                Math.max(0, prev + direction * step),
                processed.length - visibleRange
            );
            return newStart;
        });
    };

    const slicedData = processed.slice(
        visibleStartIndex,
        visibleStartIndex + visibleRange
    );


    const values = slicedData.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const range = max - min;

    // range에 따라 padding을 설정
    let padding;
    if (range > 100000) {
        padding = 20000;
    } else if (range > 50000) {
        padding = 10000;
    } else if (range > 20000) {
        padding = 5000;
    } else if (range > 10000) {
        padding = 2000;
    } else if (range > 5000) {
        padding = 1000;
    } else {
        padding = 500;
    }

    const minY = Math.floor((min - padding) / padding) * padding;
    const maxY = Math.ceil((max + padding) / padding) * padding;

    const ticks = [];
    for (let i = minY; i <= maxY; i += padding) {
        ticks.push(i);
    }

    return (
        <div className = "relative" >
            <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-transparent">
                <div className="flex gap-2">
                <button onClick={() => {
                    setMode('daily');
                }} className={`px-3 py-1 rounded ${mode === 'daily' ? 'bg-yellow-400' : 'bg-gray-200'} text-sm text-black`}>
                    일봉
                </button>
                <button onClick={() => {
                    setMode('weekly');
                }} className={`px-3 py-1 rounded ${mode === 'weekly' ? 'bg-yellow-400' : 'bg-gray-200'} text-sm text-black`}>
                    주봉
                </button>
                <button onClick={() => {
                    setMode('monthly');
                }} className={`px-3 py-1 rounded ${mode === 'monthly' ? 'bg-yellow-400' : 'bg-gray-200'} text-sm text-black`}>
                    월봉
                </button>
                </div>
                <div className="flex gap-2">
                <button onClick={handleZoomIn} className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-300 rounded text-black">
                    확대
                </button>
                <button onClick={handleZoomOut} className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-200 rounded text-black">
                    축소
                </button>
                </div>
            </div>

            <div
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
                className="select-none"
                onWheel={onWheel}
            >
                <ResponsiveContainer width="100%" height={600}>
                    <AreaChart
                        data={slicedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                        <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FCD535" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#FCD535" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis
                                width={70}
                                domain={[minY, maxY]}
                                ticks={ticks}
                                tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FCD535"
                        fillOpacity={1}
                        fill="url(#colorLine)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>


        
    );
}