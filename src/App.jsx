import './App.css';
import React, { useState, useEffect, useRef } from "react";
// Components
import SchedulePage from './components/schedulePage.jsx';
import DetailPage from './components/ELW/detailPage.jsx'
import MainPage from './components/mainPage.jsx'
import ModelingPage from './components/modelingPage.jsx';
import WeightAvgPage1 from './components/ELW/weightAvgPage1.jsx';
import WeightAvgPage2 from './components/ELW/weightAvgPage2.jsx';
import CrossPage from './components/crossPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";

function App() {

    const swiperRef = useRef(null);
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
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide> */}

                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
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