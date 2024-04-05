import './App.css';
import React, { useState, useEffect, useRef } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getVix, getExchange } from './store/indexData.js';
// import { getVix, getMarketDetail, getExchange } from './store/indexData.js';
// import { getELW_monthTable, getELW_CallPutRatio_Maturity, getElwWeightedAvgCheck } from './store/ELW.js';


// Components
import SchedulePage from './components/schedulePage.jsx';
// import SectorsChartPage from './components/sectorsChartPage.jsx';
import DetailPage from './components/ELW/detailPage.jsx'
import MainPage from './components/mainPage.jsx'
import ModelingPage from './components/modelingPage.jsx';
import WeightAvgPage1 from './components/ELW/weightAvgPage1.jsx';
import WeightAvgPage2 from './components/ELW/weightAvgPage2.jsx';
// import SearchFinancial from './components/searchFinancial';
import CrossPage from './components/crossPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";
// import axios from 'axios';
// import { API } from './components/util/config'


function App() {
    const dispatch = useDispatch();
    // const ELW_monthTable = useSelector((state) => state.ELW_monthTable);
    // const ELW_CallPutRatio_Maturity = useSelector((state) => state.ELW_CallPutRatio_Maturity);
    // const ElwWeightedAvgCheck = useSelector((state) => state.ElwWeightedAvgCheck);
    // const MarketDetail = useSelector((state) => state.MarketDetail);

    // index Data
    const Vix = useSelector((state) => state.Vix);

    // const MarketKospi200 = useSelector((state) => state.MarketKospi200);
    const Exchange = useSelector((state) => state.Exchange);
    const swiperRef = useRef(null);

    // 5분 주기 ( Index Data )
    const fetchData5Min = async () => {
        // await dispatch(getMarketDetail());
        // await dispatch(getELW_monthTable());
        // await dispatch(getELW_CallPutRatio_Maturity());
        // await dispatch(getElwWeightedAvgCheck());
        await dispatch(getExchange());
    }
    //하루 주기
    const fetchData1Day = async () => {
        await dispatch(getVix());
    }

    // 첫 랜더링
    useEffect(() => {
        fetchData5Min();
        fetchData1Day();
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

    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        paginationEl.style.color = '#efe9e9ed';
    };
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
                    <WeightAvgPage2 swiperRef={swiperRef} />
                </SwiperSlide> */}

                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} Exchange={Exchange} Vix={Vix} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <CrossPage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <MainPage />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <DetailPage />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <ModelingPage />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <WeightAvgPage1 swiperRef={swiperRef} />
                </SwiperSlide>
                <SwiperSlide style={swiperSlideStyle} >
                    <WeightAvgPage2 swiperRef={swiperRef} />
                </SwiperSlide>

            </Swiper>
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }


// import { getScheduleItemEvent } from "./store/info.js";
// import SectorSearchPage from './components/sectorSearchPage.jsx';
// import OldAoxStockPage from './components/OldAoX/stockPage.jsx'
// import CallPutPage from './components/ELW/CallPutPage.jsx';
// import TreasuryStockPage from './components/TreasuryStock.jsx'
// import StockSearchPage from './components/StockSearch';
// import StockSearchMonitoringPage from './components/StockSearchMonitoring';
// import CtpPage from './components/ELW/CtpPage.jsx'
// import WeightAvgPage3 from './components/ELW/weightAvgPage3.jsx';
// import HTS from './components/hts';
// import IpoPulse from './components/ipoPulse';
{/* <SwiperSlide style={swiperSlideStyle} >
                    <OldAoxStockPage swiperRef={swiperRef} />
                </SwiperSlide> */}

{/* <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchPage swiperRef={swiperRef} StockSearch={StockSearch} StockSearchTracking={StockSearchTracking} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchMonitoringPage swiperRef={swiperRef} StockSearchTrackingStatistics={StockSearchTrackingStatistics} />
                </SwiperSlide> */}

{/* <SwiperSlide style={swiperSlideStyle} >
                    <TreasuryStockPage swiperRef={swiperRef} />
                </SwiperSlide> */}

{/* <SwiperSlide style={swiperSlideStyle} >
                    <CtpPage swiperRef={swiperRef} ElwBarData={ElwBarData} ElwWeightedAvg={ElwWeightedAvg} />
                </SwiperSlide> */}

            //     <SwiperSlide style={{ backgroundColor: "#404040", color: '#efe9e9ed' }}>
            //     <SectorsChartPage
            //         filteredChartData={filteredChartData} sectorsRanksThemes={sectorsRanksThemes}
            //         Kospi200BubbleCategoryGruop={Kospi200BubbleCategoryGruop}
            //         checkboxStatusUp={checkboxStatusUp}
            //         checkboxStatusDown={checkboxStatusDown}
            //         checkboxStatusTup={checkboxStatusTup}
            //         checkboxAll={checkboxAll}
            //         onCheckboxStatusUp={handleCheckboxStatusUp}
            //         onCheckboxStatusDown={handleCheckboxStatusDown}
            //         onCheckboxStatusTup={handleCheckboxStatusTup}
            //         onCheckboxAll={handleCheckboxStatusAll}
            //     />
            // </SwiperSlide>