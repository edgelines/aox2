import './App.css';
import React, { useState, useEffect, useRef } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getStockSectors, getKospi200BubbleCategoryGruop, getKospi200BubbleCategory } from "./store/stockSectors.js";
import { getABC } from "./store/AxBxC.js";
import { getSearchInfo, getScheduleItemEvent } from "./store/info.js";
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
import Fundarmental from './components/fundarmental';
import HTS from './components/hts';

import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";
import axios from 'axios';
import { API } from './components/util/config'
import useInterval from './components/util/useInterval';

function App() {
    const [SectorsChartData, setSectorsChartData] = useState([]);
    const [ABC1, setABC1] = useState([]);
    const [ABC2, setABC2] = useState([]);

    const dispatch = useDispatch();
    const StockSectors = useSelector((state) => state.StockSectors);
    const Kospi200BubbleCategoryGruop = useSelector((state) => state.Kospi200BubbleCategoryGruop);
    const Kospi200BubbleCategory = useSelector((state) => state.Kospi200BubbleCategory);

    // const StockSearch = useSelector((state) => state.StockSearch);
    // const StockSearchTracking = useSelector((state) => state.StockSearchTracking)
    // const StockSearchTrackingStatistics = useSelector((state) => state.StockSearchTrackingStatistics)
    const SearchInfo = useSelector((state) => state.SearchInfo);
    const ABC = useSelector((state) => state.ABC)

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

    // 60초 주기
    const fetchData = async () => {
        await dispatch(getMarketDetail());
        await dispatch(getStockSectors());
        await dispatch(getKospi200BubbleCategoryGruop());
        await dispatch(getKospi200BubbleCategory());
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
        await postReq();
        // await dispatch(getStockSearch());
        // await dispatch(getStockSearchTrackingStatistics());
    }
    // 하루 주기
    const fetchData1Day = async () => {
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
        fetchData5Min();
        fetchData1Day();
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

    const postReq = async () => {
        const postData = {
            checkboxStatusUp: checkboxStatusUp,
            checkboxStatusTup: checkboxStatusTup,
            checkboxStatusDown: checkboxStatusDown,
            rankRange: rankRange
        }
        const res = await axios.post(`${API}/industryChartData/getThemes`, postData)
        setSectorsChartData(res.data.origin);
        setFilteredChartData(res.data.industryGr);
        setSectorsRanksThemes(res.data.topThemes)
    }

    // sectorsChartPage Render
    useEffect(() => {
        postReq();
    }, [checkboxStatusUp, checkboxStatusDown, checkboxStatusTup, checkboxAll])

    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        if (swiper.activeIndex === 2) {
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
                modules={[Keyboard, Mousewheel, Pagination]}
                keyboard={{ enabled: true, }}
                className="mySwiper"
                onSlideChange={handleSlideChange}
                style={{ height: "100vh" }}
            >
                {/* <SwiperSlide style={swiperSlideStyle} >
                    <HTS swiperRef={swiperRef} />
                </SwiperSlide> */}

                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <Fundarmental swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide>
                    <SectorSearchPage
                        StockSectors={StockSectors} swiperRef={swiperRef} ABC1={ABC1} ABC2={ABC2}
                        SearchInfo={SearchInfo}
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
                    <HTS swiperRef={swiperRef} />
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
                </SwiperSlide>
            </Swiper>
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }

{/* <SwiperSlide style={swiperSlideStyle} >
                    <OldAoxStockPage swiperRef={swiperRef} />
                </SwiperSlide> */}

{/* <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchPage swiperRef={swiperRef} StockSearch={StockSearch} StockSearchTracking={StockSearchTracking} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchMonitoringPage swiperRef={swiperRef} StockSearchTrackingStatistics={StockSearchTrackingStatistics} />
                </SwiperSlide> */}