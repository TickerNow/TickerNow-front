import type { News } from "../../types/News";

function NewsItem({newsItem} : {newsItem : News}){
    return (
        <li className="flex items-start justify-between border-b border-gray-700 pb-4 mb-4">
            {/* 좌측 텍스트 영역 */}
            <div className="flex-1 text-left">
                <div className="text-xs text-gray-400 font-semibold mb-1">{newsItem.newsAgency}</div>
                <a
                    href={newsItem.newsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white hover:underline"
                >
                    {newsItem.title}
                </a>
                <div className="text-xs text-gray-300 mt-1 line-clamp-2">{newsItem.summary}</div>
                <div className="text-xs text-gray-500 mt-1">{newsItem.date}</div>
            </div>

            {/* 우측 이미지 */}
            {newsItem.imageURL && (
                <img
                    src={newsItem.imageURL}
                    className="w-20 h-20 object-cover rounded-md ml-4 flex-shrink-0"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // 무한루프 방지
                        target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                    }}
                />
            )}
        </li>
    );
}

export default function NewsList({ news }: { news: News[] | undefined }) {
     if (!news || news.length === 0) return null;

    return (
        <div className="mt-2 w-full max-w-4xl bg-black rounded-2xl p-6 shadow text-white transition-all duration-500">
            <div>실시간 주요뉴스 Top{news.length}</div>
            <hr className="mt-1 mb-5"/>
            <ul className="space-y-2">
                {news.map((item, index) => (
                    <NewsItem key={index} newsItem={item} />
                ))}
            </ul>
        </div>
    );
}