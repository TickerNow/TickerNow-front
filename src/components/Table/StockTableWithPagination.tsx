import { useState } from "react";
import type { Stock } from "../../types/Stock";

interface Props {
  data: Stock[];
  itemsPerPage?: number;
}

export default function StockTableWithPagination({ data, itemsPerPage = 10 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full mt-4">
        <table className="min-w-full table-auto border border-gray-600 text-sm text-white">
            <thead className="bg-gray-800">
            <tr>
                <th className="p-2 border">종목명</th>
                <th className="p-2 border">날짜</th>
                <th className="p-2 border">시가</th>
                <th className="p-2 border">고가</th>
                <th className="p-2 border">저가</th>
                <th className="p-2 border">종가</th>
                <th className="p-2 border">등락폭</th>
                <th className="p-2 border">등락률</th>
                <th className="p-2 border">거래량</th>
            </tr>
            </thead>
            <tbody>
            {currentData.map((item, index) => (
                <tr key={index} className="text-center even:bg-[#1f1f1f]">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.date}</td>
                <td className="p-2 border">{item.open_price.toLocaleString()}</td>
                <td className="p-2 border">{item.high_price.toLocaleString()}</td>
                <td className="p-2 border">{item.low_price.toLocaleString()}</td>
                <td className="p-2 border">{item.close_price.toLocaleString()}</td>
                <td className="p-2 border">{item.price_change.toLocaleString()}</td>
                <td className="p-2 border">{item.change_rate}</td>
                <td className="p-2 border">{item.trading_volume.toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="flex justify-center mt-4 gap-1 flex-wrap">
            {/* 맨앞 */}
            <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-30"
            >
                ≪
            </button>

            {/* 이전 화살표 */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-30"
            >
                ◀
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                Math.max(0, Math.min(currentPage - 5, totalPages - 10)),
                Math.max(10, Math.min(currentPage + 5, totalPages))
                )
                .map((page) => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 text-center px-0 py-1 rounded ${
                    currentPage === page
                        ? "bg-yellow-400 text-black font-bold"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                >
                    {page}
                </button>
                ))}

            {/* 다음 화살표 */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-30"
            >
                ▶
            </button>

            {/* 맨뒤 */}
            <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-30"
            >
                ≫
            </button>
        </div>
    </div>
  );
}