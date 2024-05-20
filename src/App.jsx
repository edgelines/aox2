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
import LeadSectors from './components/leadSectors';
import LeadThemes from './components/leadThemes';
import LeadThemesTop from './components/leadThemesTop';
import StockSearchPage from './components/stockSearchPage';
import TestPage from './components/testPage';
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

                {/* <TestPage swiperRef={swiperRef} /> */}
                {/* <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchPage swiperRef={swiperRef} />
                </SwiperSlide> */}

                <SwiperSlide style={swiperSlideStyle} >
                    <SchedulePage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <StockSearchPage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <CrossPage swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <LeadSectors swiperRef={swiperRef} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <LeadThemes swiperRef={swiperRef} 중복수={2} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <LeadThemes swiperRef={swiperRef} 중복수={3} />
                </SwiperSlide>

                <SwiperSlide style={swiperSlideStyle} >
                    <LeadThemesTop swiperRef={swiperRef} />
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