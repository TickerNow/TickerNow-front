import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import type { Stock } from "../../types/Stock";

function convertDateFormat(dateStr: string): string {
    const [yy, mm, dd] = dateStr.split(".");
    return `20${yy}-${mm}-${dd}`;
}

interface Props {
    data: Stock[];
}

// 커스텀 툴팁 컴포넌트
function CustomTooltip({ active, payload, label }: any) {
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

    // 툴팁에 표시할 값 계산한 value 필드 추가 (예: 시가+고가-종가-저가)/2
    const processed = sortedData.map((item) => ({
        ...item,
        name: convertDateFormat(item.date),
        value: item.close_price,
    }));

    const values = processed.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = 5000;

    const minY = Math.floor((min - padding) / 5000) * 5000;
    const maxY = Math.ceil((max + padding) / 5000) * 5000;

    const ticks = [];
    for (let i = minY; i <= maxY; i += 5000) {
        ticks.push(i);
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
        <AreaChart
            data={processed}
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
    );
}