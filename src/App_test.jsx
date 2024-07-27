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
// import LeadThemesTop from './components/leadThemesTop';
import LeadThemesTop2 from './components/leadThemesTop2';
import LeadThemesTop3 from './components/leadThemesTop3';
import StockSearchPage from './components/stockSearchPage';
import MotionPage from './components/motionPage.jsx'
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

                <SwiperSlide style={swiperSlideStyle} >
                    <MotionPage swiperRef={swiperRef} num={'2'} />
                </SwiperSlide>


            </Swiper>
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }