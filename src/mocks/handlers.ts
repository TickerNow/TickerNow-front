import { http, HttpResponse } from "msw";
import type { News } from "../types/News";
import type { Stock } from "../types/Stock";
import type { StockSummary } from "../types/Stock";
import autoever from './mock_data/hyundai_autoever.json';
import { mockUsers } from './mock_data/mockUser';
import type { SignUpFormData } from "../types/SignUp";
import type { LoginFormData } from "../types/Login";
import { generateJWT, decodeJWT } from "../utils/simpleJwt";

const JWT_SECRET = "y7P4vZr9kLxT8mNq3sJfUdB2HwEeXoCg";
const JWT_EXPIRES_IN = "1h";

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

const stockData: Stock[]  = autoever;

const stockSummary: StockSummary = {
    summary: "2025년 5월 21일 기준, 현대오토에버의 주가는 152,000원이며, 최근 1분기 실적은 매출 8,274억 원, 영업이익 710억 원으로 전년 동기 대비 두 자릿수 성장률을 기록했습니다. 스마트 모빌리티 소프트웨어와 차량용 OS 개발 중심으로 사업 포트폴리오를 확대 중이며, 자율주행 및 커넥티드카 관련 기술 확보를 통해 미래차 전환에 적극 대응하고 있습니다. 특히 현대차그룹의 소프트웨어 중심 차량(SDV) 전략에 있어 핵심 계열사로 자리매김하고 있으며, 글로벌 모빌리티 플랫폼 공급 확대로 수익성이 개선되고 있습니다. 최근 외국인 수급은 중립적이나, 국내 기관의 순매수세가 지속되고 있으며, 애널리스트들은 평균 목표주가를 184,000원으로 제시하고 있어 약 21%의 상승 여력을 전망하고 있습니다. 중장기적으로는 차량 전자화 및 소프트웨어 수요 확대에 따른 성장성이 주목받고 있습니다."
};


export const handlers = [
    http.get("/stock_news", ()=> {
        return HttpResponse.json(newsData);
    }),

    http.post("/DB_stock_search", ({request})=> {
        return HttpResponse.json(stockData);
    }),

    http.get("/stock-summary-ai", () => {
        return HttpResponse.json(stockSummary);
    }),

    http.get("/check-auth", ({ request }) => {
        const token = request.headers.get("authorization");

        if (!token) {
            return HttpResponse.json({ errorMessage: "Missing session" }, { status: 401 });
        }

        try {
            const payload = decodeJWT(token);
            const user = mockUsers.find(u => u.id === payload.user_id);
            if (!user) {
                return HttpResponse.json({ errorMessage: "Invalid user" }, { status: 401 });
            }

            return HttpResponse.json(
                { user_id: user.id, nickname: user.nickname, is_admin : true },
                { status: 200 }
            );
        } catch (error) {
            return HttpResponse.json({ errorMessage: "Invalid token" }, { status: 401 });
        }
    }),

    http.post("/login", async ({ request }) => {
        const { id, password } = (await request.json()) as LoginFormData;

        const user = mockUsers.find(u => u.id === id);

        if (!user || user.password !== password) {
            return HttpResponse.json({ message: "아이디 또는 비밀번호 오류" }, { status: 401 });
        }

        const expiresInSeconds = 3600;
        const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

        const token = generateJWT({ user_id: user.id, exp });

        return HttpResponse.json(
            { message: "로그인 성공" },
            {
                status: 200,
                headers: {
                "Authorization": `Bearer ${token}`,
                },
            }
        );
    }),

    http.post("/sign_up", async ({ request }) => {
        try {
        const data = (await request.json()) as SignUpFormData;

        const {
            name,
            sex,
            birth_date,
            id,
            nickname,
            password,
            joined_at = new Date().toISOString(),
        } = data;

        // ✅ ID 중복 체크
        const idExists = mockUsers.some(user => user.id === id);
        if (idExists) {
            return HttpResponse.json(
            { error: "중복된 아이디가 존재합니다. 다른 아이디를 사용해주세요." },
            { status: 400 }
            );
        }

        // ✅ 닉네임 중복 체크
        const nicknameExists = mockUsers.some(user => user.nickname === nickname);
        if (nicknameExists) {
            return HttpResponse.json(
            { error: "중복된 닉네임이 존재합니다. 다른 닉네임을 사용해주세요." },
            { status: 400 }
            );
        }

        function getAgeFromBirthDate(birthDate: string): number {
            const today = new Date();
            const birth = new Date(birthDate);

            const yearDiff = today.getFullYear() - birth.getFullYear();
            const isBirthdayPassed =
                today.getMonth() > birth.getMonth() ||
                (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

            return yearDiff - (isBirthdayPassed ? 0 : 1);
        }

        // ✅ 회원 가입 처리 (메모리에 저장)
        mockUsers.push({
            id,
            nickname,
            name,
            sex,
            age : getAgeFromBirthDate(birth_date),
            birth_date,
            password, // 실제 프로젝트면 hash 처리, 여기선 생략
            joined_at,
        });

        return HttpResponse.json({ message: "회원가입이 완료되었습니다." }, { status: 200 });
        } catch (error: any) {
        return HttpResponse.json({ error: error.message }, { status: 500 });
        }
    }),

    // 기업뉴스 크롤링 mock
    http.post("/daum_search", async ({ request }) => {
        // 요청 바디에서 JSON 데이터 파싱
        const body = await request.json() as { search: string; page_count: number };
        const { search, page_count } = body;

        // 10초 대기 (테스트용 지연)
        await new Promise((resolve) => setTimeout(resolve, 10000));

        return HttpResponse.json({
        message: `'${search}' 에 대한 뉴스 ${page_count} 페이지 크롤링 및 저장 완료`,
        });
    }),

    // 주식 데이터 크롤링 mock
    http.post("/stock_load", async ({request}) => {
    try {
        const body = await request.json() as { search?: string };
        const { search } = body;

        if (!search) {
        return HttpResponse.json({ error: "검색어(search)가 필요합니다." }, { status: 400 });
        }

        await new Promise(resolve => setTimeout(resolve, 10000));

        return HttpResponse.json({
            message: `'${search}'에 대한 금융 정보 크롤링 및 저장이 완료되었습니다.`,
        });
    } catch (error) {
        return HttpResponse.json({ error: (error as Error).message }, { status: 500 });
    }
    })
];