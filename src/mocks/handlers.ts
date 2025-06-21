import { http, HttpResponse } from "msw";
import type { News } from "../types/News";
import type { Stock } from "../types/Stock";
import type { StockSummary } from "../types/Stock";
import type { RelatedKeyword } from "../types/RelKeyword";
import autoever from './mock_data/hyundai_autoever.json';
import autoeverNews from './mock_data/hyundai_autoever_news.json';
import { mockUsers } from './mock_data/mockUser';
import type { SignUpFormData } from "../types/SignUp";
import type { LoginFormData } from "../types/Login";
import { generateJWT, decodeJWT } from "../utils/simpleJwt";
import type { StockNews } from "../types/StockNews";

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
const stockNewsData: StockNews[] = autoeverNews;

const stockSummary: StockSummary = {
    summary: "2025년 5월 21일 기준, 현대오토에버의 주가는 152,000원이며, 최근 1분기 실적은 매출 8,274억 원, 영업이익 710억 원으로 전년 동기 대비 두 자릿수 성장률을 기록했습니다. 스마트 모빌리티 소프트웨어와 차량용 OS 개발 중심으로 사업 포트폴리오를 확대 중이며, 자율주행 및 커넥티드카 관련 기술 확보를 통해 미래차 전환에 적극 대응하고 있습니다. 특히 현대차그룹의 소프트웨어 중심 차량(SDV) 전략에 있어 핵심 계열사로 자리매김하고 있으며, 글로벌 모빌리티 플랫폼 공급 확대로 수익성이 개선되고 있습니다. 최근 외국인 수급은 중립적이나, 국내 기관의 순매수세가 지속되고 있으며, 애널리스트들은 평균 목표주가를 184,000원으로 제시하고 있어 약 21%의 상승 여력을 전망하고 있습니다. 중장기적으로는 차량 전자화 및 소프트웨어 수요 확대에 따른 성장성이 주목받고 있습니다."
};

const aiResponses = [
    `저는 엔씨소프트의 미래가치를 분석하여 종합적인 전망을 제시해드릴 수 있습니다.

    🔍 **핵심 이슈 분석:**
    - 최근 엔씨소프트는 '블레이드 & 소울 NEO'를 북미 및 유럽 스팀에 출시하고, '리니지M'의 업데이트도 진행하며 글로벌 이용자들에게 게임 서비스를 제공하고 있습니다.
    - 또한, '아이온2'에 대한 기대감이 높아지고 있으며, 이에 따라 투자자들의 관심도 증가하고 있습니다.

    📊 **수치 기반 설명:**
    - 최근 키움증권은 아이온2의 흥행 기대가 반영된 엔씨소프트의 목표주가를 33만원으로 상향 조정하였습니다.
    - 엔씨소프트의 2분기 매출액은 3706억원, 영업이익은 17억원으로 전망되며, 연간 매출액은 1조7086억원, 영업이익은 1285억원으로 예상되고 있습니다.

    🧠 **통찰 제공:**
    - 엔씨소프트는 지속적인 IP의 지역 확장 전략을 추진하고 있으며, 글로벌 시장에서의 경쟁력을 강화하고 있습니다.
    - 향후 아이온2의 성공 여부와 새로운 게임 출시 등이 엔씨소프트의 주가 및 미래 전망에 영향을 줄 것으로 예상됩니다.

    ⚠️ **리스크 판단:**
    - 게임 산업은 예측이 어렵고 경쟁이 치열하기 때문에 새로운 게임의 성공 여부에 따라 주가 등이 크게 변동할 수 있습니다.
    - 또한, 글로벌 시장에서의 확대와 성공을 위해 지속적인 혁신과 경쟁력 강화가 필요합니다.

    🔮 **향후 전망:**
    - 엔씨소프트는 지속적인 IP 확장과 새로운 게임 출시를 통해 성장을 이어갈 것으로 전망됩니다.
    - 아이온2의 흥행이 예상되며, 엔씨소프트의 주가 및 기업가치 상승이 이어질 수 있을 것으로 예상됩니다.

    따라서 종합적으로 보았을 때, 엔씨소프트는 지속적인 성장과 글로벌 시장에서의 경쟁력 강화를 통해 미래가치를 상승시킬 가능성이 있습니다.`,
    `현대중공업(Hyundai Heavy Industries)의 미래가치에 대해 정확히 예측하기 위해서는 해당 기업의 최근 동향, 재무 상태, 산업 트렌드 등을 ganz하여 세밀하게 분석해야 합니다. 이를 토대로 아래의 5가지 항목을 중심으로 답변드리겠습니다.

    1. 🔍 **핵심 이슈 분석**: 현대중공업의 사업 다각화, 수주 상황, 신기술 도입 등의 요인을 분석할 필요가 있습니다.

    2. 📊 **수치 기반 설명**: 최근 재무제표를 통해 매출액, 영업이익, 순이익, 부채와 자본 구조 등의 수치를 정밀하게 분석합니다.

    3. 🧠 **통찰 제공**: 현재의 산업 동향과 미래 전망, 그리고 경쟁사와의 차별점 등을 통해 합리적인 판단을 도와줄 수 있는 통찰을 제공합니다.

    4. ⚠️ **리스크 판단**: 정치적, 경제적 리스크나 산업 내 변화 등으로부터의 위험을 신중하게 고려해야 합니다.

    5. 🔮 **향후 전망**: 현대중공업의 성장 전망, 신규 사업 개발, 글로벌 시장 진출 등을 다각적인 관점에서 조망합니다.

    모든 정보를 기반으로 종합적으로 분석하면 보다 신뢰도 높은 미래 예측이 가능합니다. 현대중공업에 대한 구체적인 정보를 제공해 주시면 미래가치에 대해 더 깊이 있는 분석을 제공해 드릴 수 있습니다.`
    ];

export const handlers = [
    http.get("/stock_news", ()=> {
        return HttpResponse.json(newsData);
    }),

    http.post("/DB_stock_search", ({request})=> {

        return HttpResponse.json({
            stock_data: stockData,
            news_data: stockNewsData,
        });
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

    http.post("/sign_id_check", async ({ request }) => {
        const { id } = (await request.json()) as { id: string };
        const isDuplicate = mockUsers.some((user) => user.id === id);

        if (isDuplicate) {
        return HttpResponse.json(
            { message: "중복된 아이디가 존재 합니다!" },
            { status: 400 }
        );
        }

        return HttpResponse.json(
        { message: "해당 아이디는 사용 가능 합니다!" },
        { status: 200 }
        );
    }),

    // 닉네임 중복 확인 핸들러
    http.post("/sign_nickname_check", async ({ request }) => {
        const { nickname } = await request.json() as { nickname: string };
        const isDuplicate = mockUsers.some((user) => user.nickname === nickname);

        if (isDuplicate) {
        return HttpResponse.json(
            { message: "중복된 닉네임이 존재 합니다!" },
            { status: 400 }
        );
        }

        return HttpResponse.json(
        { message: "해당 닉네임은 사용 가능 합니다!" },
        { status: 200 }
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
    }),

    http.post("/chat", async ({request}) => {
    try {
        const randomIndex = Math.floor(Math.random() * aiResponses.length);
        const reply = aiResponses[randomIndex];

        await new Promise(resolve => setTimeout(resolve, 3000));

        return HttpResponse.json({
            reply: `${reply}`,
        });
    } catch (error) {
        return HttpResponse.json({ error: (error as Error).message }, { status: 500 });
    }
    }),

    http.post("/realtime_search", async ({ request }) => {
        const body = (await request.json()) as { search?: string };
        const search = body.search?.replace(/'/g, "") ?? "";

        // 간단한 mock: 입력값에 '삼'이 들어가면 '삼성전자', '삼성바이오로직스' 반환
        let relatedKeywords : RelatedKeyword[] = [];

        if (search.includes("삼")) {
            relatedKeywords = [
                { name: "삼성전자" },
                { name: "삼성바이오로직스" },
                { name: "삼성SDI" },
                { name: "삼성전기" },
                { name: "삼성화재" },
                { name: "삼성중공업" },
                { name: "삼성물산" },
                { name: "삼성증권" },
                { name: "삼성SDS" },
                { name: "삼성카드" },
                { name: "삼성생명" },
                { name: "삼성에스디에스" }, // 삼성SDS 다른 표기
                { name: "삼성서울병원" },
                { name: "삼성출판사" },
                { name: "삼성전기" },  // 중복 있지만 주요 기업
                { name: "삼성테크윈" },
                { name: "삼성중공업" }, // 중복있음
                { name: "삼성SDI우" },
                { name: "삼성전기우" },
                { name: "삼성바이오에피스" },
            ];
        } else if (search.includes("카")) {
            relatedKeywords = [
                { name: "카카오" },
                { name: "카카오페이" },
            ];
        } else if (search.includes("sk") || search.toLowerCase().includes("sk")) {
            relatedKeywords = [
                { name: "SK하이닉스" },
                { name: "SK이노베이션" },
                { name: "SK텔레콤" },
            ];
        } else if (search.includes("하이")) {
            relatedKeywords = [
                { name: "SK하이닉스" },
                { name: "하이브" },
            ];
        }

        return HttpResponse.json(relatedKeywords);
    }),
];