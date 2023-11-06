import './App.css';
import React, { useState, useEffect, useRef } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getStockSectorsGR } from "./store/stockSectorsGR.js";
import { getStockSectors, getKospi200BubbleCategoryGruop, getKospi200BubbleCategory } from "./store/stockSectors.js";
import { getStockThemes } from "./store/stockThemes.js";
import { getStockPrice, getStockSectorsThemes } from "./store/stockPrice.js";
import { getABC1, getABC2 } from "./store/AxBxC.js";
import { getStockThemeByItem, getStockSectorByItem, getSearchInfo, getScheduleItemEvent } from "./store/info.js";
import { getIndexMA, getVixMA, getVix, getMarketDetail, getKospi200, getKospi, getKosdaq, getInvers, getMarketKospi200, getExchange } from './store/indexData.js';
import { getELW_monthTable, getELW_CallPutRatio_Maturity, getElwWeightedAvg, getElwWeightedAvgCheck } from './store/ELW.js';
// Components
import SchedulePage from './components/schedulePage.jsx';
import SectorsChartPage from './components/sectorsChartPage.jsx';
import SectorSearchPage from './components/sectorSearchPage.jsx';
import OldAoxStockPage from './components/OldAoX/stockPage.jsx'
import CallPutPage from './components/ELW/CallPutPage.jsx'
import DetailPage from './components/ELW/detailPage.jsx'
import MainPage from './components/mainPage.jsx'
import TreasuryStockPage from './components/TreasuryStock.jsx'
import CtpPage from './components/ELW/CtpPage.jsx'
import ModelingPage from './components/modelingPage.jsx';
import WeightAvgPage1 from './components/ELW/weightAvgPage1.jsx';
import WeightAvgPage2 from './components/ELW/weightAvgPage2.jsx';
import WeightAvgPage3 from './components/ELW/weightAvgPage3.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Mousewheel, Pagination } from "swiper/modules";

function App() {
    const [SectorsChartData, setSectorsChartData] = useState([]);

    const dispatch = useDispatch();
    const StockSectorsGR = useSelector((state) => state.StockSectorsGR);
    const StockSectors = useSelector((state) => state.StockSectors);
    const Kospi200BubbleCategoryGruop = useSelector((state) => state.Kospi200BubbleCategoryGruop);
    const Kospi200BubbleCategory = useSelector((state) => state.Kospi200BubbleCategory);
    const StockPrice = useSelector((state) => state.StockPrice);
    const StockSectorsThemes = useSelector((state) => state.StockSectorsThemes);
    const StockThemes = useSelector((state) => state.StockThemes);
    const StockThemeByItem = useSelector((state) => state.StockThemeByItem);
    const StockSectorByItem = useSelector((state) => state.StockSectorByItem);
    const SearchInfo = useSelector((state) => state.SearchInfo);
    const ABC1 = useSelector((state) => state.ABC1);
    const ABC2 = useSelector((state) => state.ABC2);
    const ELW_monthTable = useSelector((state) => state.ELW_monthTable);
    const ELW_CallPutRatio_Maturity = useSelector((state) => state.ELW_CallPutRatio_Maturity);
    const ElwWeightedAvg = useSelector((state) => state.ElwWeightedAvg);
    const ElwWeightedAvgCheck = useSelector((state) => state.ElwWeightedAvgCheck);
    const MarketDetail = useSelector((state) => state.MarketDetail);

    // index Data
    const IndexMA = useSelector((state) => state.IndexMA);
    const VixMA = useSelector((state) => state.VixMA);
    const Vix = useSelector((state) => state.Vix);
    const Kospi200 = useSelector((state) => state.Kospi200);
    const Kospi = useSelector((state) => state.Kospi);
    const Kosdaq = useSelector((state) => state.Kosdaq);
    const Invers = useSelector((state) => state.Invers);
    const MarketKospi200 = useSelector((state) => state.MarketKospi200);
    const ScheduleItemEvent = useSelector((state) => state.ScheduleItemEvent);
    const Exchange = useSelector((state) => state.Exchange);
    const swiperRef = useRef(null);

    // sectorsChartPage State
    const handleCheckboxStatusUp = (data) => { setCheckboxStatusUp(data) }
    const handleCheckboxStatusDown = (data) => { setCheckboxStatusDown(data) }
    const handleCheckboxStatusTup = (data) => { setCheckboxStatusTup(data) }
    const handleCheckboxStatusAll = (data) => { setCheckboxAll(data) }
    const [loading, setLoading] = useState(true);
    const [checkboxStatusUp, setCheckboxStatusUp] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // 전일대비 순위가 상승한 업종
    const [checkboxStatusTup, setCheckboxStatusTup] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // TOM 대비 순위가 상승한 업종
    const [checkboxStatusDown, setCheckboxStatusDown] = useState({ rank1: false, rank2: false, rank3: false, rank4: false }); // 전일대비 순위가 하락한 업종
    const [checkboxAll, setCheckboxAll] = useState({ up: false, down: false, tomUp: false, tomDown: false });
    const rankRange = { rank1: [1, 14], rank2: [15, 25], rank3: [26, 54], rank4: [55, 80] };
    const [filteredChartData, setFilteredChartData] = useState({
        반도체1: [], 반도체2: [], IT1: [], IT2: [], 조선: [], 건설1: [], 건설2: [], 금융: [], B2C: [], BIO1: [], BIO2: [], 식품: [], 아웃도어1: [], 아웃도어2: []
    });
    // 각 구간별 CheckBox BTN을 통해 필터된 업종들
    const [sectorsRanksThemes, setSectorsRanksThemes] = useState([]);
    // 각 구간별 업종에서 테마 추출하기 위한 변수들
    const 종목등락률 = 1;
    const 추출테마수 = 10;
    const 업종데이터전처리 = (data) => {
        const 디스플레이장비및부품 = data.filter(item => item.업종명 === '디스플레이장비및부품')
        const 반도체와반도체장비 = data.filter(item => item.업종명 === '반도체와반도체장비')
        const 자동차 = data.filter(item => item.업종명 === '자동차')
        const 자동차부품 = data.filter(item => item.업종명 === '자동차부품')
        const 화학 = data.filter(item => item.업종명 === '화학')
        const 에너지장비및서비스 = data.filter(item => item.업종명 === '에너지장비및서비스')
        const 전기장비 = data.filter(item => item.업종명 === '전기장비')
        const 전기제품 = data.filter(item => item.업종명 === '전기제품')
        const 전자장비와기기 = data.filter(item => item.업종명 === '전자장비와기기')
        const 전자제품 = data.filter(item => item.업종명 === '전자제품')
        const 생명과학도구및서비스 = data.filter(item => item.업종명 === '생명과학도구및서비스')
        const 생물공학 = data.filter(item => item.업종명 === '생물공학')
        const 제약 = data.filter(item => item.업종명 === '제약')
        const IT서비스 = data.filter(item => item.업종명 === 'IT서비스')
        const 게임엔터테인먼트 = data.filter(item => item.업종명 === '게임엔터테인먼트')
        const 소프트웨어 = data.filter(item => item.업종명 === '소프트웨어')
        const 방송과엔터테인먼트 = data.filter(item => item.업종명 === '방송과엔터테인먼트')
        const 핸드셋 = data.filter(item => item.업종명 === '핸드셋')
        const 건설 = data.filter(item => item.업종명 === '건설')
        const 건축자재 = data.filter(item => item.업종명 === '건축자재')
        const 건축제품 = data.filter(item => item.업종명 === '건축제품')
        const 기계 = data.filter(item => item.업종명 === '기계')
        const 철강 = data.filter(item => item.업종명 === '철강')
        const 운송인프라 = data.filter(item => item.업종명 === '운송인프라')
        const 도로와철도운송 = data.filter(item => item.업종명 === '도로와철도운송')
        const 비철금속 = data.filter(item => item.업종명 === '비철금속')
        const 우주항공과국방 = data.filter(item => item.업종명 === '우주항공과국방')
        const 통신장비 = data.filter(item => item.업종명 === '통신장비')
        const 석유와가스 = data.filter(item => item.업종명 === '석유와가스')
        const 가스유틸리티 = data.filter(item => item.업종명 === '가스유틸리티')
        const 조선 = data.filter(item => item.업종명 === '조선')
        const 항공화물운송과물류 = data.filter(item => item.업종명 === '항공화물운송과물류')
        const 해운사 = data.filter(item => item.업종명 === '해운사')
        const 부동산 = data.filter(item => item.업종명 === '부동산')
        const 상업서비스와공급품 = data.filter(item => item.업종명 === '상업서비스와공급품')
        const 은행 = data.filter(item => item.업종명 === '은행')
        const 증권 = data.filter(item => item.업종명 === '증권')
        const 창업투자 = data.filter(item => item.업종명 === '창업투자')
        const 식품 = data.filter(item => item.업종명 === '식품')
        const 식품과기본식료품소매 = data.filter(item => item.업종명 === '식품과기본식료품소매')
        const 음료 = data.filter(item => item.업종명 === '음료')
        const 종이와목재 = data.filter(item => item.업종명 === '종이와목재')
        const 포장재 = data.filter(item => item.업종명 === '포장재')
        const 가구 = data.filter(item => item.업종명 === '가구')
        const 가정용기기와용품 = data.filter(item => item.업종명 === '가정용기기와용품')
        const 인터넷과카탈로그소매 = data.filter(item => item.업종명 === '인터넷과카탈로그소매')
        const 가정용품 = data.filter(item => item.업종명 === '가정용품')
        const 판매업체 = data.filter(item => item.업종명 === '판매업체')
        const 레저용장비와제품 = data.filter(item => item.업종명 === '레저용장비와제품')
        const 백화점과일반상점 = data.filter(item => item.업종명 === '백화점과일반상점')
        const 섬유 = data.filter(item => item.업종명 === '섬유,의류,신발,호화품')
        const 항공사 = data.filter(item => item.업종명 === '항공사')
        const 호텔 = data.filter(item => item.업종명 === '호텔,레스토랑,레저')
        const 광고 = data.filter(item => item.업종명 === '광고')
        const 교육서비스 = data.filter(item => item.업종명 === '교육서비스')
        const 양방향미디어와서비스 = data.filter(item => item.업종명 === '양방향미디어와서비스')
        const 화장품 = data.filter(item => item.업종명 === '화장품')
        // const 복합기업 = data.filter(item => item.업종명 === '복합기업')
        // const 기타금융 = data.filter(item => item.업종명 === '기타금융')
        // const 손해보험 = data.filter(item => item.업종명 === '손해보험')
        // const 생명보험 = data.filter(item => item.업종명 === '생명보험')
        const 컴퓨터와주변기기 = data.filter(item => item.업종명 === '컴퓨터와주변기기')
        const 무역회사와판매업체 = data.filter(item => item.업종명 === '무역회사와판매업체')
        const 무선통신서비스 = data.filter(item => item.업종명 === '무선통신서비스')
        const 다각화된통신서비스 = data.filter(item => item.업종명 === '다각화된통신서비스')
        const 디스플레이패널 = data.filter(item => item.업종명 === '디스플레이패널')
        const 건강관리기술 = data.filter(item => item.업종명 === '건강관리기술')
        const 건강관리장비와용품 = data.filter(item => item.업종명 === '건강관리장비와용품')
        const 건강관리업체및서비스 = data.filter(item => item.업종명 === '건강관리업체및서비스')

        var 반도체1 = [...디스플레이장비및부품, ...반도체와반도체장비, ...자동차, ...자동차부품, ...화학],
            반도체2 = [...에너지장비및서비스, ...전기장비, ...전기제품, ...전자장비와기기, ...전자제품],
            IT1 = [...IT서비스, ...게임엔터테인먼트, ...소프트웨어, ...방송과엔터테인먼트, ...핸드셋],
            IT2 = [...컴퓨터와주변기기, ...무역회사와판매업체, ...무선통신서비스, ...다각화된통신서비스, ...디스플레이패널],
            // 보험1 = [...복합기업, ...기타금융, ...손해보험, ...생명보험],
            조선1 = [...석유와가스, ...가스유틸리티, ...조선, ...항공화물운송과물류, ...해운사],
            건설1 = [...건설, ...건축자재, ...건축제품, ...기계, ...철강],
            건설2 = [...운송인프라, ...도로와철도운송, ...비철금속, ...우주항공과국방, ...통신장비],
            금융1 = [...부동산, ...상업서비스와공급품, ...은행, ...증권, ...창업투자],
            B2C1 = [...가구, ...가정용기기와용품, ...인터넷과카탈로그소매, ...가정용품, ...판매업체],
            BIO1 = [...생명과학도구및서비스, ...생물공학, ...제약],
            BIO2 = [...건강관리기술, ...건강관리장비와용품, ...건강관리업체및서비스],
            식품1 = [...식품, ...식품과기본식료품소매, ...음료, ...종이와목재, ...포장재],
            아웃도어1 = [...광고, ...교육서비스, ...양방향미디어와서비스, ...화장품],
            아웃도어2 = [...레저용장비와제품, ...백화점과일반상점, ...섬유, ...항공사, ...호텔]

        const result = {
            반도체1: 반도체1, 반도체2: 반도체2, IT1: IT1, IT2: IT2, 조선: 조선1, 건설1: 건설1, 건설2: 건설2,
            금융: 금융1, B2C: B2C1, BIO1: BIO1, BIO2: BIO2, 식품: 식품1, 아웃도어1: 아웃도어1, 아웃도어2: 아웃도어2
        }
        return result;
    }
    // 업종에 속한 테마 가져오기
    function getTop10Themes(rankName, StockSectorsThemes) {
        const sectorsData = StockSectorsThemes.filter((row) =>
            rankName.includes(row['업종명']) && row['등락률'] >= 종목등락률);

        const themeRankInfoByTheme = {};
        StockThemes.forEach((themeInfo) => {
            themeRankInfoByTheme[themeInfo['테마명']] = themeInfo;
        });

        const themeStats = {};

        sectorsData.forEach((row) => {
            row.테마명.forEach((theme) => {
                const themeFluctuation = themeRankInfoByTheme[theme] ? themeRankInfoByTheme[theme]['등락률'] : 0;

                if (!themeStats[theme]) {
                    themeStats[theme] = { count: 1, fluctuation: themeFluctuation, stocks: [{ item: row.종목명, changeRate: row.등락률, volume: row.전일대비거래량, 종목코드: row.종목코드, 업종명: row.업종명 }] };
                } else {
                    themeStats[theme].count++;
                    themeStats[theme].stocks.push({ item: row.종목명, changeRate: row.등락률, volume: row.전일대비거래량, 종목코드: row.종목코드, 업종명: row.업종명 })
                }
            });
        });

        const sortedThemes = Object.entries(themeStats).sort((a, b) => {
            if (b[1].count !== a[1].count) {
                return b[1].count - a[1].count;
            } else {
                return b[1].fluctuation - a[1].fluctuation;
            }
        }).map(([theme, stats]) => [theme, stats.count, stats.fluctuation, stats.stocks]);

        // const top10Themes = sortedThemes.slice(0, 추출테마수).map(([theme, count, fluctuation, stocks]) => ({ theme, count, fluctuation, stocks }));
        const top10Themes = sortedThemes.slice(0, 추출테마수).map(([theme, count, fluctuation, stocks]) => {
            stocks.sort((a, b) => b.changeRate - a.changeRate);  // 내림차순 정렬
            return { theme, count, fluctuation, stocks };
        });
        return top10Themes;
    }

    // 30초 주기
    const fetchData = async () => {
        dispatch(getMarketDetail());
        dispatch(getStockSectorsGR());
        dispatch(getStockSectors());
        dispatch(getKospi200BubbleCategoryGruop());
        dispatch(getKospi200BubbleCategory());
        dispatch(getStockPrice());
        dispatch(getStockSectorsThemes());
        dispatch(getStockThemes());
        dispatch(getABC1());
        dispatch(getABC2());
    }
    // 5분 주기 ( Index Data )
    const fetchData5Min = async () => {
        await dispatch(getELW_monthTable());
        await dispatch(getELW_CallPutRatio_Maturity());
        await dispatch(getElwWeightedAvg());
        await dispatch(getElwWeightedAvgCheck());
        await dispatch(getIndexMA());
        await dispatch(getKospi200());
        await dispatch(getKospi());
        await dispatch(getKosdaq());
        await dispatch(getInvers());
        await dispatch(getMarketKospi200());
        await dispatch(getExchange());
    }
    // 하루 주기
    const fetchData1Day = async () => {
        await dispatch(getStockThemeByItem());
        await dispatch(getStockSectorByItem());
        await dispatch(getSearchInfo());
        await dispatch(getScheduleItemEvent())
        await dispatch(getIndexMA());
        await dispatch(getVixMA());
        await dispatch(getVix());
    }

    // 첫 랜더링
    useEffect(() => {
        fetchData();
        fetchData1Day();
        fetchData5Min();
        setLoading(false);
        const stockSectorsChartData = 업종데이터전처리(StockSectorsGR);
        setSectorsChartData(stockSectorsChartData);
        let allSectorNames = new Set(); // 모든 Rank 구간에서 추출된 업종명을 저장할 Set
        let sectorNames = {}; // 각 구간별로 필터된 업종명을 저장할 객체

        let mergedFilteredData = {}
        for (let rank in rankRange) {
            let filteredDataUp = {};
            let filteredDataDown = {};
            let sectorNamesForRank = new Set(); // 이 Rank 구간에서 필터된 업종명을 저장할 Set. 중복 제거를 위해 Set을 사용합니다.

            // TOM > NOW 체크박스와 다른 체크박스가 모두 체크된 경우에 대한 필터링
            if (checkboxStatusUp[rank] && checkboxStatusTup[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataUp[key] = (filteredDataUp[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] >= item['NOW'] &&
                            item['TOM'] >= item['NOW']
                        )
                    );
                }
            } else if (checkboxStatusUp[rank]) { // 체크박스Up에 대한 필터링
                for (let key in stockSectorsChartData) {
                    filteredDataUp[key] = (filteredDataUp[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] >= item['NOW']
                        )
                    );
                }
            }

            // 체크박스Down에 대한 필터링
            if (checkboxStatusDown[rank] && checkboxStatusTup[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataDown[key] = (filteredDataDown[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] < item['NOW'] &&
                            item['TOM'] >= item['NOW']
                        )
                    );
                }
            } else if (checkboxStatusDown[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataDown[key] = (filteredDataDown[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] < item['NOW']
                        )
                    );
                }
            }

            for (let key in stockSectorsChartData) {
                mergedFilteredData[key] = (mergedFilteredData[key] || []).concat(filteredDataUp[key] || [], filteredDataDown[key] || []);
            }

            for (let key in mergedFilteredData) {
                let data = mergedFilteredData[key];
                for (let item of data) {
                    // '업종명'이 item에 있는지 확인하고 있다면 Set에 추가합니다.
                    if ('업종명' in item) {
                        sectorNamesForRank.add(item['업종명']);
                    }
                }
            }
            // 이전 Rank 구간에서 이미 포함된 업종명을 제외합니다.
            let uniqueSectorNamesForRank = new Set([...sectorNamesForRank].filter(x => !allSectorNames.has(x)));

            // Set을 배열로 변환하여 sectorNames에 저장합니다.
            sectorNames[rank] = [...uniqueSectorNamesForRank];
            // allSectorNames에 현재 Rank 구간에서 추출한 업종명을 추가합니다.
            allSectorNames = new Set([...allSectorNames, ...sectorNamesForRank]);
            const top10Themes = getTop10Themes([...uniqueSectorNamesForRank], StockSectorsThemes);
            setSectorsRanksThemes(prevState => { return { ...prevState, [rank]: top10Themes } });
        }
        setFilteredChartData(mergedFilteredData);

    }, [dispatch])

    // 60초 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const dayOfWeek = now.getDay();
        // 현재 시간이 9시 이전이라면, 9시까지 남은 시간 계산
        let delay;
        if (hour < 9) {
            delay = ((9 - hour - 1) * 60 + (60 - minutes)) * 60 + (60 - seconds);
        } else if (hour === 9 && minutes === 0 && seconds > 0) {
            // 9시 정각에 이미 초가 지나가 있을 경우, 다음 분까지 대기
            delay = 60 - seconds;
        } else {
            // 이미 9시 정각 이후라면, 다음 분 시작까지 대기
            delay = 60 - seconds;
        }

        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            // fetchData();
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId); // 컴포넌트가 unmount될 때 타이머 제거
        // const intervalId = setInterval(() => {
        //     const now = new Date();
        //     const hour = now.getHours();
        //     const dayOfWeek = now.getDay();
        //     if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
        //         fetchData();
        //     }
        // }, 1000 * 60);
        // return () => clearInterval(intervalId);
    }, [dispatch])
    // 5분 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 1분 이전이라면, 9시 1분까지 남은 시간 계산
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData5Min();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId); // 컴포넌트가 unmount될 때 타이머 제거
        // const intervalId = setInterval(() => {
        //     const now = new Date();
        //     const hour = now.getHours();
        //     const dayOfWeek = now.getDay();
        //     if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
        //         fetchData5Min();
        //     }
        // }, 1000 * 60 * 5);
        // return () => clearInterval(intervalId);
    }, [dispatch])

    // 하루 주기 업데이트 
    useEffect(() => {
        function scheduleNextUpdate() {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 42, 0);

            const msUntilTomorrow = tomorrow.getTime() - now.getTime();
            return setTimeout(update, msUntilTomorrow);
        }

        function update() {
            fetchData1Day();
            // Schedule the next update
            scheduleNextUpdate();
        }

        // Schedule the first update
        const timeoutId = scheduleNextUpdate();

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    // sectorsChartPage Render
    useEffect(() => {
        const stockSectorsChartData = 업종데이터전처리(StockSectorsGR);
        setSectorsChartData(stockSectorsChartData);
        let allSectorNames = new Set(); // 모든 Rank 구간에서 추출된 업종명을 저장할 Set
        let sectorNames = {}; // 각 구간별로 필터된 업종명을 저장할 객체

        let mergedFilteredData = {}
        for (let rank in rankRange) {
            let filteredDataUp = {};
            let filteredDataDown = {};
            let sectorNamesForRank = new Set(); // 이 Rank 구간에서 필터된 업종명을 저장할 Set. 중복 제거를 위해 Set을 사용합니다.

            // TOM > NOW 체크박스와 다른 체크박스가 모두 체크된 경우에 대한 필터링
            if (checkboxStatusUp[rank] && checkboxStatusTup[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataUp[key] = (filteredDataUp[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] >= item['NOW'] &&
                            item['TOM'] >= item['NOW']
                        )
                    );
                }
            } else if (checkboxStatusUp[rank]) { // 체크박스Up에 대한 필터링
                for (let key in stockSectorsChartData) {
                    filteredDataUp[key] = (filteredDataUp[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] >= item['NOW']
                        )
                    );
                }
            }

            // 체크박스Down에 대한 필터링
            if (checkboxStatusDown[rank] && checkboxStatusTup[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataDown[key] = (filteredDataDown[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] < item['NOW'] &&
                            item['TOM'] >= item['NOW']
                        )
                    );
                }
            } else if (checkboxStatusDown[rank]) {
                for (let key in stockSectorsChartData) {
                    filteredDataDown[key] = (filteredDataDown[key] || []).concat(
                        stockSectorsChartData[key].filter(item =>
                            item['NOW'] >= rankRange[rank][0] &&
                            item['NOW'] <= rankRange[rank][1] &&
                            item['B1'] < item['NOW']
                        )
                    );
                }
            }

            for (let key in stockSectorsChartData) {
                mergedFilteredData[key] = (mergedFilteredData[key] || []).concat(filteredDataUp[key] || [], filteredDataDown[key] || []);
            }

            for (let key in mergedFilteredData) {
                let data = mergedFilteredData[key];
                for (let item of data) {
                    // '업종명'이 item에 있는지 확인하고 있다면 Set에 추가합니다.
                    if ('업종명' in item) {
                        sectorNamesForRank.add(item['업종명']);
                    }
                }
            }
            // 이전 Rank 구간에서 이미 포함된 업종명을 제외합니다.
            let uniqueSectorNamesForRank = new Set([...sectorNamesForRank].filter(x => !allSectorNames.has(x)));

            // Set을 배열로 변환하여 sectorNames에 저장합니다.
            sectorNames[rank] = [...uniqueSectorNamesForRank];
            // allSectorNames에 현재 Rank 구간에서 추출한 업종명을 추가합니다.
            allSectorNames = new Set([...allSectorNames, ...sectorNamesForRank]);
            const top10Themes = getTop10Themes([...uniqueSectorNamesForRank], StockSectorsThemes);
            setSectorsRanksThemes(prevState => { return { ...prevState, [rank]: top10Themes } });
        }
        setFilteredChartData(mergedFilteredData);
        // setSectorsRanksThemes(sectorsRanksThemes);
    }, [StockSectorsGR, checkboxStatusUp, checkboxStatusDown, checkboxStatusTup, checkboxAll, loading])

    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        if (swiper.activeIndex === 1) {
            paginationEl.style.color = 'black';
        } else {
            paginationEl.style.color = '#efe9e9ed';
        }
    };

    return (
        <div className="App">
            <Swiper
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                pagination={{ type: "fraction", clickable: false, }}
                mousewheel={true}
                allowTouchMove={false}
                modules={[Mousewheel, Pagination]}
                className="mySwiper"
                onSlideChange={handleSlideChange}
                style={{ height: "100vh" }}
            >
                {/* <SwiperSlide style={swiperSlideStyle} >
                    <SectorSearchPage
                        StockSectors={StockSectors} swiperRef={swiperRef} ABC1={ABC1} ABC2={ABC2}
                        StockSectorsThemes={StockSectorsThemes} StockThemeByItem={StockThemeByItem} StockSectorByItem={StockSectorByItem}
                        StockPrice={StockPrice} SearchInfo={SearchInfo}
                        SectorsChartData={SectorsChartData} SectorsRanksThemes={sectorsRanksThemes} ScheduleItemEvent={ScheduleItemEvent}
                    />
                </SwiperSlide> */}

                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide>
                    <SectorSearchPage
                        StockSectors={StockSectors} swiperRef={swiperRef} ABC1={ABC1} ABC2={ABC2}
                        StockSectorsThemes={StockSectorsThemes} StockThemeByItem={StockThemeByItem} StockSectorByItem={StockSectorByItem}
                        StockPrice={StockPrice} SearchInfo={SearchInfo}
                        SectorsChartData={SectorsChartData} SectorsRanksThemes={sectorsRanksThemes} ScheduleItemEvent={ScheduleItemEvent}
                    />
                </SwiperSlide>

                <SwiperSlide style={{ backgroundColor: "#404040", color: '#efe9e9ed' }}>
                    <SectorsChartPage
                        filteredChartData={filteredChartData} sectorsRanksThemes={sectorsRanksThemes}
                        Kospi200BubbleCategoryGruop={Kospi200BubbleCategoryGruop}
                        checkboxStatusUp={checkboxStatusUp}
                        checkboxStatusDown={checkboxStatusDown}
                        checkboxStatusTup={checkboxStatusTup}
                        checkboxAll={checkboxAll}
                        onCheckboxStatusUp={handleCheckboxStatusUp}
                        onCheckboxStatusDown={handleCheckboxStatusDown}
                        onCheckboxStatusTup={handleCheckboxStatusTup}
                        onCheckboxAll={handleCheckboxStatusAll}
                    />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <OldAoxStockPage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <TreasuryStockPage swiperRef={swiperRef} SectorsChartData={SectorsChartData} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <MainPage Vix={Vix} Kospi200BubbleCategoryGruop={Kospi200BubbleCategoryGruop} Kospi200BubbleCategory={Kospi200BubbleCategory} MarketDetail={MarketDetail} ElwWeightedAvgCheck={ElwWeightedAvgCheck} Exchange={Exchange} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <DetailPage Vix={Vix} MarketDetail={MarketDetail} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <CallPutPage swiperRef={swiperRef} Vix={Vix} VixMA={VixMA} IndexMA={IndexMA} Kospi200={Kospi200} Kospi={Kospi} Kosdaq={Kosdaq} Invers={Invers} MarketKospi200={MarketKospi200} MarketDetail={MarketDetail} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <ModelingPage swiperRef={swiperRef} Vix={Vix} Exchange={Exchange} MarketDetail={MarketDetail} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <WeightAvgPage1 swiperRef={swiperRef} ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} ElwWeightedAvgCheck={ElwWeightedAvgCheck} MarketDetail={MarketDetail} />
                </SwiperSlide>
                <SwiperSlide style={swiperSlideStyle} >
                    <WeightAvgPage2 swiperRef={swiperRef} ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} ElwWeightedAvgCheck={ElwWeightedAvgCheck} MarketDetail={MarketDetail} />
                </SwiperSlide>
                <SwiperSlide style={swiperSlideStyle} >
                    <WeightAvgPage3 swiperRef={swiperRef} ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} ElwWeightedAvgCheck={ElwWeightedAvgCheck} Exchange={Exchange} MarketDetail={MarketDetail} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} > <CtpPage swiperRef={swiperRef} /> </SwiperSlide>
            </Swiper>
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }


