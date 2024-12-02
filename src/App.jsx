import './App.css';
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";
// Components
import SchedulePage from './components/schedulePage.jsx';
import CrossPage from './components/crossPage';
import FormulaPage from './components/formulaPage.jsx';
import DetailPage from './components/ELW/detailPage.jsx'
import MainPage from './components/mainPage.jsx'
import ModelingPage from './components/modelingPage.jsx';
import WeightAvgPage1 from './components/ELW/weightAvgPage1.jsx';
import WeightAvgPage2 from './components/ELW/weightAvgPage2.jsx';
import LeadSectors from './components/leadSectors';
import LeadThemesTop2 from './components/leadThemesTop2';
import MotionPage from './components/motionPage.jsx'
import ReportPage from './components/reportPage';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobilePage from './components/mobilePage.jsx';

function App() {
    const [baseStockName, setBaseStockName] = useState([]);
    const swiperRef = useRef(null);
    const isMobile = useMediaQuery('(max-width:600px)');
    // Swiper Slider Bottom Page Number Style
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        paginationEl.style.color = '#efe9e9ed';
    };
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
                    paddingLeft: '0.2vh', paddingRight: '0.2vh',
                    paddingTop: '0.2vh'
                }}>
                    <MobilePage />
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
                        <SchedulePage swiperRef={swiperRef} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <CrossPage swiperRef={swiperRef} baseStockName={baseStockName} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <ReportPage swiperRef={swiperRef} baseStockName={baseStockName} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <FormulaPage swiperRef={swiperRef} baseStockName={baseStockName} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <MotionPage swiperRef={swiperRef} num={'3'} baseStockName={baseStockName} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <LeadSectors swiperRef={swiperRef} />
                    </SwiperSlide>

                    <SwiperSlide style={swiperSlideStyle} >
                        <LeadThemesTop2 swiperRef={swiperRef} />
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
            )}
        </div >
    );
}

export default App;

const swiperSlideStyle = { backgroundColor: "#404040", color: '#efe9e9ed', paddingLeft: '2vh', paddingRight: '2vh', paddingTop: '0.2vh' }