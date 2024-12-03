import './App.css';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { API, useIsMobile } from './components/util/config';
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
import { Grid } from '@mui/material';

import LeadSectors from './components/leadSectors';
import LeadThemesTop2 from './components/leadThemesTop2';
import MotionPage from './components/motionPage.jsx';
import FormulaPage from './components/formulaPage.jsx';
import ReportPage from './components/reportPage';
import TestPage from './components/testPage';

import useMediaQuery from '@mui/material/useMediaQuery';

function App() {

    const swiperRef = useRef(null);
    const isMobile = useIsMobile();
    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        paginationEl.style.color = '#efe9e9ed';
    };
    const [baseStockName, setBaseStockName] = useState([]);
    const fetchData = async () => {
        const res = await axios.get(`${API}/industry/stockName`);
        setBaseStockName(res.data);
    }

    useEffect(() => { fetchData(); }, [])
    return (
        <div className="App">
            {isMobile ? (
                // Mobile
                <Grid sx={{
                    backgroundColor: "#404040",
                    color: '#efe9e9ed',
                    padding: '0.2rem',
                    width: '100%',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    '& .MuiGrid-root': {  // 모든 하위 Grid에 적용
                        margin: 0,
                        width: '100%',
                        padding: '0 !important',
                    },
                    '& .MuiTableCell-root': {  // 모든 테이블 셀에 적용
                        padding: '2px',
                        whiteSpace: 'nowrap',
                    },
                    '& .MuiTable-root': {  // 모든 테이블에 적용
                        width: '100%',
                        tableLayout: 'fixed',
                    }

                }}>
                    <MainPage />
                    <DetailPage />
                    <ModelingPage />
                    <WeightAvgPage1 swiperRef={swiperRef} />
                    <WeightAvgPage2 swiperRef={swiperRef} />
                </Grid>
            ) : (
                // Desktop

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
                        {/* <SchedulePage swiperRef={swiperRef} /> */}
                        {/* <CrossPage swiperRef={swiperRef} baseStockName={baseStockName} /> */}
                        {/* <ReportPage swiperRef={swiperRef} baseStockName={baseStockName} /> */}
                        {/* <FormulaPage swiperRef={swiperRef} baseStockName={baseStockName} /> */}
                        {/* <MotionPage swiperRef={swiperRef} num={'3'} baseStockName={baseStockName} /> */}
                        {/* <LeadSectors swiperRef={swiperRef} baseStockName={baseStockName} /> */}
                        {/* <LeadThemesTop2 swiperRef={swiperRef} /> */}
                        {/* <MainPage /> */}
                        <DetailPage />
                        {/* <ModelingPage /> */}
                        {/* <WeightAvgPage1 swiperRef={swiperRef} /> */}
                        {/* <WeightAvgPage2 swiperRef={swiperRef} /> */}
                    </SwiperSlide>
                </Swiper>
            )}
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }


