import './App.css';
import React, { useState, useEffect, useRef } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getStockSectorsGR } from "./store/stockSectorsGR.js";
import { getStockSectors, getKospi200BubbleCategoryGruop, getKospi200BubbleCategory } from "./store/stockSectors.js";
import { getStockThemes } from "./store/stockThemes.js";
import { getStockPrice, getStockSectorsThemes } from "./store/stockPrice.js";
import { getABC } from "./store/AxBxC.js";
import { getStockThemeByItem, getStockSectorByItem, getSearchInfo, getScheduleItemEvent } from "./store/info.js";
import { getIndexMA, getVixMA, getVix, getMarketDetail, getKospi200, getKospi, getKosdaq, getInvers, getMarketKospi200, getExchange } from './store/indexData.js';
import { getELW_monthTable, getELW_CallPutRatio_Maturity, getElwWeightedAvg, getElwWeightedAvgCheck, getElwBarData } from './store/ELW.js';
// import { getStockSearch, getStockSearchTracking, getStockSearchTrackingStatistics } from './store/stockSearch';
// Websokect
// import { websocketConnectWA1, websocketConnectWA2, } from './store/actions/websocketActions';

// Components
import SchedulePage from './components/schedulePage.jsx';
import SectorsChartPage from './components/sectorsChartPage.jsx';
import SectorSearchPage from './components/sectorSearchPage.jsx';
import OldAoxStockPage from './components/OldAoX/stockPage.jsx'
import CallPutPage from './components/ELW/CallPutPage.jsx'
import DetailPage from './components/ELW/detailPage.jsx'
import MainPage from './components/mainPage.jsx'
import TreasuryStockPage from './components/TreasuryStock.jsx'
// import StockSearchPage from './components/StockSearch';
// import StockSearchMonitoringPage from './components/StockSearchMonitoring';
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
    const [ABC1, setABC1] = useState([]);
    const [ABC2, setABC2] = useState([]);

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
    // const StockSearch = useSelector((state) => state.StockSearch);
    // const StockSearchTracking = useSelector((state) => state.StockSearchTracking)
    // const StockSearchTrackingStatistics = useSelector((state) => state.StockSearchTrackingStatistics)
    const SearchInfo = useSelector((state) => state.SearchInfo);
    const ABC = useSelector((state) => state.ABC)
    // const ABC1 = useSelector((state) => state.ABC1);
    // const ABC2 = useSelector((state) => state.ABC2);
    const ELW_monthTable = useSelector((state) => state.ELW_monthTable);
    const ELW_CallPutRatio_Maturity = useSelector((state) => state.ELW_CallPutRatio_Maturity);
    const ElwBarData = useSelector((state) => state.ElwBarData)
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
    // const WA1 = useSelector(state => state.websocket.WA_1);
    // const WA2 = useSelector(state => state.websocket.WA_2);
    // sectorsChartPage State
    const handleCheckboxStatusUp = (data) => { setCheckboxStatusUp(data) }
    const handleCheckboxStatusDown = (data) => { setCheckboxStatusDown(data) }
    const handleCheckboxStatusTup = (data) => { setCheckboxStatusTup(data) }
    const handleCheckboxStatusAll = (data) => { setCheckboxAll(data) }

    const [checkboxStatusUp, setCheckboxStatusUp] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // 전일대비 순위가 상승한 업종
    const [checkboxStatusTup, setCheckboxStatusTup] = useState({ rank1: false, rank2: false, rank3: false, rank4: false }); // TOM 대비 순위가 상승한 업종
    const [checkboxStatusDown, setCheckboxStatusDown] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // 전일대비 순위가 하락한 업종

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

    const 업종별데이터그룹화 = (data, 업종그룹) => {
        return 업종그룹.map(업종리스트 => {
            return 업종리스트.flatMap(업종명 => data.filter(item => item.업종명 === 업종명))
        })
    }
    const 업종데이터전처리 = (data) => {
        const 업종그룹 = [
            ['디스플레이장비및부품', '반도체와반도체장비', '자동차', '자동차부품', '화학'],
            ['에너지장비및서비스', '전기장비', '전기제품', '전자장비와기기', '전자제품'],
            ['IT서비스', '게임엔터테인먼트', '소프트웨어', '방송과엔터테인먼트', '핸드셋'],
            ['컴퓨터와주변기기', '무역회사와판매업체', '무선통신서비스', '다각화된통신서비스', '디스플레이패널'],
            ['석유와가스', '가스유틸리티', '조선', '항공화물운송과물류', '해운사'],
            ['건설', '건축자재', '건축제품', '기계', '철강'],
            ['운송인프라', '도로와철도운송', '비철금속', '우주항공과국방', '통신장비'],
            ['부동산', '상업서비스와공급품', '은행', '증권', '창업투자'],
            ['가구', '가정용기기와용품', '인터넷과카탈로그소매', '가정용품', '판매업체'],
            ['생명과학도구및서비스', '생물공학', '제약'],
            ['건강관리기술', '건강관리장비와용품', '건강관리업체및서비스'],
            ['식품', '식품과기본식료품소매', '음료', '종이와목재', '포장재'],
            ['광고', '교육서비스', '양방향미디어와서비스', '화장품'],
            ['레저용장비와제품', '백화점과일반상점', '섬유', '항공사', '호텔']
        ]

        const 그룹화된데이터 = 업종별데이터그룹화(data, 업종그룹);

        const result = {
            반도체1: 그룹화된데이터[0],
            반도체2: 그룹화된데이터[1],
            IT1: 그룹화된데이터[2],
            IT2: 그룹화된데이터[3],
            조선: 그룹화된데이터[4],
            건설1: 그룹화된데이터[5],
            건설2: 그룹화된데이터[6],
            금융: 그룹화된데이터[7],
            B2C: 그룹화된데이터[8],
            BIO1: 그룹화된데이터[9],
            BIO2: 그룹화된데이터[10],
            식품: 그룹화된데이터[11],
            아웃도어1: 그룹화된데이터[12],
            아웃도어2: 그룹화된데이터[13],
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
        await dispatch(getMarketDetail());
        await dispatch(getStockSectorsGR());
        await dispatch(getStockSectors());
        await dispatch(getKospi200BubbleCategoryGruop());
        await dispatch(getKospi200BubbleCategory());
        await dispatch(getStockPrice());
        await dispatch(getStockSectorsThemes());
        await dispatch(getStockThemes());
        await dispatch(getABC());
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
        await dispatch(getElwBarData());
        // await dispatch(getStockSearch());
        // await dispatch(getStockSearchTrackingStatistics());
    }
    // 하루 주기
    const fetchData1Day = async () => {
        await dispatch(getStockThemeByItem());
        await dispatch(getStockSectorByItem());
        await dispatch(getSearchInfo());
        await dispatch(getScheduleItemEvent())
        await dispatch(getVixMA());
        await dispatch(getVix());
        // await dispatch(getStockSearchTracking());
        // dispatch(websocketConnectWA1());
        // dispatch(websocketConnectWA2());
    }

    // 첫 랜더링
    useEffect(() => {
        fetchData();
        fetchData1Day();
        fetchData5Min();
    }, [dispatch])

    // 60초 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const dayOfWeek = now.getDay();
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
                    // fetchData5Min();
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

        return () => clearTimeout(timeoutId);
    }, [dispatch])
    // 5분 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
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

        return () => clearTimeout(timeoutId);
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
    }, [dispatch]);

    // sectorsChartPage Render
    useEffect(() => {
        if (StockSectorsGR.status === 'succeeded') {
            // if (StockSectorsGR.data && StockSectorsGR.data.length > 0) {
            // if (StockSectorsGR.status === 'succeeded') {
            const stockSectorsChartData = 업종데이터전처리(StockSectorsGR.data);
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
        }

    }, [StockSectorsGR, checkboxStatusUp, checkboxStatusDown, checkboxStatusTup, checkboxAll])

    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        if (swiper.activeIndex === 1) {
            paginationEl.style.color = 'black';
        } else {
            paginationEl.style.color = '#efe9e9ed';
        }
    };

    useEffect(() => {
        if (ABC.status === 'succeeded') {
            setABC1(ABC.data1.data)
            setABC2(ABC.data2.data)
        }
    }, [ABC])

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
                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide>

                {/* <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide>
                    <SectorSearchPage
                        StockSectors={StockSectors} swiperRef={swiperRef} ABC1={ABC1} ABC2={ABC2}
                        StockSectorsThemes={StockSectorsThemes} StockThemeByItem={StockThemeByItem} StockSectorByItem={StockSectorByItem}
                        StockPrice={StockPrice} SearchInfo={SearchInfo}
                        SectorsChartData={SectorsChartData} SectorsRanksThemes={sectorsRanksThemes} ScheduleItemEvent={ScheduleItemEvent}
                        StockThemes={StockThemes}
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
                    <MainPage Vix={Vix} Kospi200BubbleCategoryGruop={Kospi200BubbleCategoryGruop} Kospi200BubbleCategory={Kospi200BubbleCategory} MarketDetail={MarketDetail} ElwWeightedAvgCheck={ElwWeightedAvgCheck} Exchange={Exchange} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <DetailPage Vix={Vix} MarketDetail={MarketDetail} ElwBarData={ElwBarData} />
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

                <SwiperSlide style={swiperSlideStyle} >
                    <CtpPage swiperRef={swiperRef} ElwBarData={ElwBarData} ElwWeightedAvg={ElwWeightedAvg} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <TreasuryStockPage swiperRef={swiperRef} />
                </SwiperSlide> */}
            </Swiper>
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }



{/* <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchPage swiperRef={swiperRef} StockSearch={StockSearch} StockSearchTracking={StockSearchTracking} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchMonitoringPage swiperRef={swiperRef} StockSearchTrackingStatistics={StockSearchTrackingStatistics} />
                </SwiperSlide> */}