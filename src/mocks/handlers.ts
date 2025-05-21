import { http, HttpResponse } from "msw";
import type { News } from "../types/News";
import type { Stock } from "../types/Stock";
import type { StockSummary } from "../types/Stock";

const newsData: News[] = [
    {
        "title":"[증시전망대] 美·中 관세 리스크 털어낸 코스피, 이제는 AI 주목",
        "summary":"미중 무역갈등 완화 기대에 국내 증시가 반등세를 이어가고 있다. 외국인과 기관의 동반 순매수세, 오는 19일 개막하는 '컴퓨텍스 2025'의 인공지능(AI) 모멘텀 기대가 시장을  ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/dt\/20250518152041410etrc.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518152040883",
        "newsAgency":"디지털타임스",
        "date":"05.18"
    },
    {
        "title":"잇따르는 ‘兆 단위’ 유상증자…“목적·모회사 참여가 주가 판가름”",
        "summary":"[이데일리 박순엽 기자] 올해 들어 상장사들의 대규모 유상증자가 잇따르고 있다. 삼성SDI와 한화에어로스페이스, 포스코퓨처엠이 1조원이 넘는 유상증자를 각각 발표하면서 전체 유상증 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/Edaily\/20250518151418061ojnp.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518151415701",
        "newsAgency":"이데일리",
        "date":"05.18"
    },
    {
        "title":"불닭으로 황제주 갔는데 더 오른다고?…목표가 170만원 제시한 리포트",
        "summary":"머니투데이 증권부가 선정한 5월 둘째주(12일~16일) 베스트리포트는 총 3건입니다. 김민정 DS투자증권 연구원이 덴티움을 분석한 '1Q25 Re: 관망', 정호윤 한국투자증권 연 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/moneytoday\/20250518150955986isyf.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518150954605",
        "newsAgency":"머니투데이",
        "date":"05.18"
    },
    {
        "title":"3% 이자` 홍보하더니…완판에 슬그머니 내린 미래에셋",
        "summary":"미래에셋증권이 개인투자용 국채 계좌의 예탁금 이용요율(이자)을 기존 연 3%에서 연 2.5%로 0.5%포인트 내린다. 독점 판매를 개시한 지 약 1년이 흘러 상품이 시장에 안착하자 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/dt\/20250518145118065ckfg.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518145116211",
        "newsAgency":"디지털타임스",
        "date":"05.18"
    },
    {
        "title":"SK텔레콤, 해킹 악재 딛고 반등 조짐…증권가 '저점 매수' 신호 주목",
        "summary":"사진=연합뉴스 [파이낸셜뉴스] 지난달 해킹 사고 이후 내리막을 걷던 SK텔레콤을 '저점 매수'할 때라는 증권가 분석이 나왔다. SK텔레콤은 지난 1·4분기 전년 동기 대비 13%대 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/fnnewsi\/20250518143925988oscw.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518143925945",
        "newsAgency":"파이낸셜뉴스",
        "date":"05.18"
    },
    {
        "title":"일 년 새 반토막 난 화학주... 증권가 “최악은 지났다“",
        "summary":"LG화학 여수 NCC 공장 전경. 사진=뉴스1 [파이낸셜뉴스] 화학주 하락세가 멈출 줄을 모르고 있다. 글로벌 수요부진, 고유가, 대규모 증설까지 '3중고'에 시달리면서 주가는 일 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/fnnewsi\/20250518143521729eoun.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518143521851",
        "newsAgency":"파이낸셜뉴스",
        "date":"05.18"
    },
    {
        "title":"[가상자산 나침반] 이더리움 48% 급등했지만…파월의 금리 발언은 ‘경고등’",
        "summary":"이더리움이 최근 48% 급등하며 가상자산 시장에서 주도적 흐름을 보이고 있다. 기술 업그레이드와 기관 매수세가 상승을 이끌었지만, 미국의 고금리 장기화 우려와 제한적인 매크로 반응 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/dt\/20250518143321514ubmb.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518143320803",
        "newsAgency":"디지털타임스",
        "date":"05.18"
    },
    {
        "title":"혼돈의 시장, 모두를 위한 '분산의 미학'…김태현 부서장의 해법",
        "summary":"김태현 한국투자신탁운용 글로벌대체투자2부 부서장.\/사진=한국투자신탁운용 제공   [파이낸셜뉴스] “하나에 몰아넣는 투자는 이제 의미가 없 습니다. 다양한 자산과 전략을 나누고 시장 ...",
        "imageURL":"https:\/\/t1.daumcdn.net\/news\/202505\/18\/fnnewsi\/20250518143059218agvv.jpg",
        "newsURL":"https:\/\/v.daum.net\/v\/20250518143058744",
        "newsAgency":"파이낸셜뉴스",
        "date":"05.18"
    }
];

const stockData: Stock[]  = [
    {
        "name": "SK하이닉스",
        "open_price": 182000,
        "high_price": 182900,
        "low_price": 179100,
        "close_price": 180800,
        "price_change": -1200,
        "change_rate": "-0.66%",
        "trading_volume": 1851551,
        "date": "25.04.29"
    },
    {
        "name": "SK하이닉스",
        "open_price": 183500,
        "high_price": 183900,
        "low_price": 179700,
        "close_price": 182000,
        "price_change": -2400,
        "change_rate": "-1.30%",
        "trading_volume": 2454440,
        "date": "25.04.28"
    },
    {
        "name": "SK하이닉스",
        "open_price": 182500,
        "high_price": 184900,
        "low_price": 182100,
        "close_price": 184400,
        "price_change": 6100,
        "change_rate": "+3.42%",
        "trading_volume": 3413222,
        "date": "25.04.25"
    },
    {
        "name": "SK하이닉스",
        "open_price": 182800,
        "high_price": 183400,
        "low_price": 177600,
        "close_price": 178300,
        "price_change": -2700,
        "change_rate": "-1.49%",
        "trading_volume": 3149026,
        "date": "25.04.24"
    },
    {
        "name": "SK하이닉스",
        "open_price": 179100,
        "high_price": 181600,
        "low_price": 178100,
        "close_price": 181000,
        "price_change": 7200,
        "change_rate": "+4.14%",
        "trading_volume": 3745347,
        "date": "25.04.23"
    },
    {
        "name": "SK하이닉스",
        "open_price": 175000,
        "high_price": 175500,
        "low_price": 173300,
        "close_price": 173800,
        "price_change": -2800,
        "change_rate": "-1.59%",
        "trading_volume": 2002542,
        "date": "25.04.22"
    },
    {
        "name": "SK하이닉스",
        "open_price": 174800,
        "high_price": 180000,
        "low_price": 174500,
        "close_price": 176600,
        "price_change": 1600,
        "change_rate": "+0.91%",
        "trading_volume": 1819055,
        "date": "25.04.21"
    },
    {
        "name": "SK하이닉스",
        "open_price": 174000,
        "high_price": 175500,
        "low_price": 172800,
        "close_price": 175000,
        "price_change": 0,
        "change_rate": "0.00%",
        "trading_volume": 1304677,
        "date": "25.04.18"
    },
    {
        "name": "SK하이닉스",
        "open_price": 172100,
        "high_price": 175400,
        "low_price": 171800,
        "close_price": 175000,
        "price_change": 1000,
        "change_rate": "+0.57%",
        "trading_volume": 2986932,
        "date": "25.04.17"
    },
    {
        "name": "SK하이닉스",
        "open_price": 176500,
        "high_price": 177500,
        "low_price": 173500,
        "close_price": 174000,
        "price_change": -6600,
        "change_rate": "-3.65%",
        "trading_volume": 2930407,
        "date": "25.04.16"
    },
    {
        "name": "SK하이닉스",
        "open_price": 180200,
        "high_price": 182400,
        "low_price": 179700,
        "close_price": 180600,
        "price_change": 400,
        "change_rate": "+0.22%",
        "trading_volume": 1887663,
        "date": "25.04.15"
    },
    {
        "name": "SK하이닉스",
        "open_price": 182900,
        "high_price": 184400,
        "low_price": 178000,
        "close_price": 180200,
        "price_change": -600,
        "change_rate": "-0.33%",
        "trading_volume": 3445599,
        "date": "25.04.14"
    },
    {
        "name": "SK하이닉스",
        "open_price": 177800,
        "high_price": 181800,
        "low_price": 176100,
        "close_price": 180800,
        "price_change": -2400,
        "change_rate": "-1.31%",
        "trading_volume": 3206784,
        "date": "25.04.11"
    },
    {
        "name": "SK하이닉스",
        "open_price": 189700,
        "high_price": 189900,
        "low_price": 180000,
        "close_price": 183200,
        "price_change": 18200,
        "change_rate": "+11.03%",
        "trading_volume": 7832318,
        "date": "25.04.10"
    },
    {
        "name": "SK하이닉스",
        "open_price": 170000,
        "high_price": 170000,
        "low_price": 162700,
        "close_price": 165000,
        "price_change": -4500,
        "change_rate": "-2.65%",
        "trading_volume": 5908245,
        "date": "25.04.09"
    },
    {
        "name": "SK하이닉스",
        "open_price": 172000,
        "high_price": 173100,
        "low_price": 168200,
        "close_price": 169500,
        "price_change": 4700,
        "change_rate": "+2.85%",
        "trading_volume": 4947180,
        "date": "25.04.08"
    },
    {
        "name": "SK하이닉스",
        "open_price": 168000,
        "high_price": 172800,
        "low_price": 164800,
        "close_price": 164800,
        "price_change": -17400,
        "change_rate": "-9.55%",
        "trading_volume": 7842468,
        "date": "25.04.07"
    },
    {
        "name": "SK하이닉스",
        "open_price": 187900,
        "high_price": 189600,
        "low_price": 178400,
        "close_price": 182200,
        "price_change": -12400,
        "change_rate": "-6.37%",
        "trading_volume": 9169244,
        "date": "25.04.04"
    },
    {
        "name": "SK하이닉스",
        "open_price": 189600,
        "high_price": 194600,
        "low_price": 188200,
        "close_price": 194600,
        "price_change": -3300,
        "change_rate": "-1.67%",
        "trading_volume": 4156940,
        "date": "25.04.03"
    },
    {
        "name": "SK하이닉스",
        "open_price": 198800,
        "high_price": 201500,
        "low_price": 197300,
        "close_price": 197900,
        "price_change": 900,
        "change_rate": "+0.46%",
        "trading_volume": 2723930,
        "date": "25.04.02"
    }
]

const stockSummary : StockSummary = {
    "summary": "2025년 5월 21일 기준, SK하이닉스의 주가는 202,000원이며, 1분기 실적은 매출 17.6조 원, 영업이익 7.44조 원으로 전년 대비 큰 폭의 성장을 보였습니다. HBM(고대역폭 메모리) 시장에서 70%의 점유율로 글로벌 1위를 차지하고 있으며, AI 서버 및 DRAM 수요 증가가 실적을 견인하고 있습니다. 다만 최근 외국인 투자자의 순매도와 공매도 증가, 미국의 반도체 수출 규제 우려 등으로 인해 주가에 조정이 나타나고 있습니다. 애널리스트들은 평균 목표주가를 274,701원으로 제시하며, 약 36%의 상승 여력을 전망합니다. 중장기적으로는 AI 메모리 수요 확대에 따라 성장 가능성이 크다는 평가를 받고 있습니다."
}


export const handlers = [
    http.get("/api/news", ()=> {
        return HttpResponse.json(newsData);
    }),

    http.get("/api/stock", ()=> {
        return HttpResponse.json(stockData);
    }),

    http.get("/api/stock-summary-ai", () => {
        return HttpResponse.json(stockSummary);
    }),

    http.get("/api/check-auth", () => {
        return HttpResponse.json(
            {
            errorMessage: 'Missing session',
            },
            { status: 401 },
        )
    }),

    http.post("/api/login", () => {
        return HttpResponse.json(
            {
            errorMessage: 'Missing session',
            },
            { status: 401 },
        )
    })
];