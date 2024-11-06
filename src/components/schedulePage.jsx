import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, IconButton, Grid, Box, Skeleton, Divider } from '@mui/material';
import LeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import RightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextNews from './ScheduleSub/textNews';
import Weather from './ScheduleSub/weather';
import COEX from './ScheduleSub/coex';
import FlixPatrol from './ScheduleSub/flixPatrol';
import NaverDataLab from './ScheduleSub/naverDataLab';
import FundarmentalPage1 from './Fundarmental/fundarmentalPage1';
import FundarmentalPage2 from './Fundarmental/fundarmentalPage2';
import FundarmentalPage3 from './Fundarmental/fundarmentalPage3';
import Fundarmental from './fundarmental';
import HTS from './hts';
import IpoPulse from './ipoPulse';
import WeightAvgPage3 from './temp/weightAvgPage3.jsx';
import { numberWithCommas } from './util/util';
import { API } from './util/config';
import useInterval from './util/useInterval';

export default function SchedulePage({ swiperRef }) {

    const [schedule, setSchedule] = useState();
    const [page, setPage] = useState(1);
    const [fomcDate, setFomcDate] = useState(null);
    const [selectedType, setSelectedType] = useState('국내외지표이슈');
    const [sectorPage, setSectorPage] = useState('스케쥴'); // 메뉴버튼 눌렀을 경우 페이지 전환이 필요한 경우
    const [ipoSubPage, setIpoSubPage] = useState('국내외지표이슈');
    // Menu BTN
    const buttons = [
        <Button variant={'text'} sx={btnStyle} onClick={() => handleTypeChange('국내외지표이슈')}>국내외 지표 / 이슈</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => handleTypeChange('국내외실적')}>국내외 종목 (실적 등)</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => handleTypeChange('신규상장')}>신규 / 공모 / 보호</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => handleTypeChange('변경상장')}>BW/CB/주식전환/<br />유증/무증/변경/재상장</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => handleTypeChange('기타')}>기타(영화,음악,스포츠)</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('DataLab')}>Naver DataLab</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('FlixPatrol')}>Flix Patrol</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('COEX')}>COEX</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('날씨')}>Weather</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => window.open('https://oec.world/en', '_blank')}>World Export</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => window.open('https://www.kokstock.com/stock/ipo_listing.asp', '_blank')}>공모주 상장일정</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => window.open('http://www.38.co.kr/html/ipo/ir_data.php', '_blank')}>IR 자료</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental')}>CPI/PPI</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental1')}>Oil/금속/환율/코인</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental2')}>모기지/금리/<br />비금속/예탁금</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental3')}>채권/CPI/PPI/재고</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('HTS')}>추정매매동향</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('IpoPulse')}>신규상장</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('WeightAvgPage3')}>환율/PBR/VIX</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => window.open('https://www.windy.com/', '_blank')}>Windy</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => window.open('https://zoom.earth/', '_blank')}>zoom.earth</Button>,
    ]
    const fetchData = async () => {
        const res = await axios.get(`${API}/fundamental/FOMC_clock`);
        setFomcDate(res.data[0]['data-endtime']);
    }

    const getScheduleEventWeeks = async () => {
        const today = new Date();
        const pageOffset = (page - 1) * 7;
        today.setDate(today.getDate() + pageOffset)

        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = `${year}-${month}-${day}`;
        const weeks = await axios.get(`${API}/schedule/weeks?date=${dateString}`)

        const filteredEvents = weeks.data.map(day => {
            const filteredDayEvents = selectedType
                ? day.events.filter(event => event.type === selectedType)
                : day.events;
            return {
                ...day,
                events: filteredDayEvents,
            };
        });
        setSchedule(filteredEvents);

    }

    useEffect(() => { fetchData(); }, [])
    useEffect(() => { getScheduleEventWeeks(); }, [selectedType, page]);
    // 버튼이 클릭될 때 호출할 핸들러 함수
    const handleTypeChange = (type) => {
        setSelectedType(type);
        setSectorPage('스케쥴');
        if (type === '신규상장') { setIpoSubPage('IPO') } else if (type === '국내외지표이슈') { setIpoSubPage('국내외지표이슈') } else { setIpoSubPage('') }
    };
    const handlePageChange = (delta) => {
        const newValue = page + delta;
        if (newValue < 1) {
            setPage(1);
        } else if (newValue > 4) {
            setPage(4);
        } else {
            setPage(newValue);
        }
    };

    return (
        <>
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={1} >
                    <Box>
                        <ButtonGroup orientation="vertical" color="primary" aria-label="vertical outlined button group">
                            {buttons}
                        </ButtonGroup>
                    </Box>

                </Grid>
                <Grid item xs={11}>
                    {sectorPage === '스케쥴' && <Schedule schedule={schedule} date={fomcDate} ipoSubPage={ipoSubPage} swiperRef={swiperRef}
                        handlePageChange={handlePageChange} />}
                    {sectorPage === '날씨' && <Weather />}
                    {sectorPage === 'DataLab' && <NaverDataLab swiperRef={swiperRef} />}
                    {sectorPage === 'COEX' && <COEX swiperRef={swiperRef} />}
                    {sectorPage === 'FlixPatrol' && <FlixPatrol swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental' && <Fundarmental swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental1' && <FundarmentalPage1 swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental2' && <FundarmentalPage2 swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental3' && <FundarmentalPage3 swiperRef={swiperRef} />}
                    {sectorPage === 'IpoPulse' && <IpoPulse swiperRef={swiperRef} />}
                    {sectorPage === 'HTS' && <HTS swiperRef={swiperRef} />}
                    {sectorPage === 'WeightAvgPage3' && <WeightAvgPage3 swiperRef={swiperRef} />}
                </Grid>
            </Grid>
        </>
    )
}

function Schedule({ schedule, date, handlePageChange, ipoSubPage, swiperRef }) {
    const repeatedKeyword = ['美)', '휴장', '보호예수', '美', '유상증자'];
    const key = ['CB전환', '무상증자', 'NDR', 'Roadshow', 'IR']
    const key2 = ['신규상장', 'BW행사', '설명회']
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(date));
        }, 1000);

        return () => clearInterval(timer);
    }, [date]);

    function calculateTimeLeft(date) {
        const now = new Date();
        const targetDate = new Date(date);
        const difference = targetDate - now;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }
    return (
        <>
            <Grid container spacing={2} sx={{ borderBottom: '0.6px solid #ccc', borderTop: '0.6px solid #ccc', marginBottom: '20px', minHeight: '550px' }} >
                {schedule
                    ? schedule.map((day, dayIndex) => (
                        dayIndex < 5 ? (
                            <Grid item key={dayIndex} sx={{ width: '25vh' }}>
                                <p style={dateStyle}>{new Date(day.날짜).toLocaleDateString('kr-KR', {
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'short'
                                })}</p>
                                {day.events.map((event, eventIndex) => (
                                    <p style={{
                                        color:
                                            repeatedKeyword.some(keyword => event.event.includes(keyword)) ? 'greenyellow'
                                                : key.some(keyword => event.event.includes(keyword)) ? '#FCAB2F'
                                                    : key2.some(keyword => event.event.includes(keyword)) ? '#62FFF6'
                                                        : null, ...dateEventStyle
                                    }} key={eventIndex}>{event.event}</p>
                                ))}
                            </Grid>
                        ) : (
                            <Grid item key={dayIndex} sx={{ width: '15vh' }}>
                                <p style={dateStyle}>{new Date(day.날짜).toLocaleDateString('kr-KR', {
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'short'
                                })}</p>
                                {day.events.map((event, eventIndex) => (
                                    <p style={{
                                        color:
                                            repeatedKeyword.some(keyword => event.event.includes(keyword)) ? 'greenyellow'
                                                : key.some(keyword => event.event.includes(keyword)) ? '#FCAB2F'
                                                    : key2.some(keyword => event.event.includes(keyword)) ? '#62FFF6'
                                                        : null, ...dateEventStyle
                                    }} key={eventIndex}>{event.event}</p>
                                ))}
                            </Grid>
                        )

                    ))
                    : ( // Loading
                        <>
                            <Skeleton variant="rounded" animation="wave" />
                        </>
                    )
                }

                {/* 스케쥴 좌/우 이동버튼  */}
                <Box sx={{
                    position: 'absolute', transform: 'translate(1230px, 500px)', zIndex: 5,
                    // display: 'flex',
                    // justifyContent: 'right',
                    // alignSelf: 'end',
                    // // marginTop: '20px',
                    // // marginRight: '20px',
                    // position: 'fixed',  // 요소를 고정 위치에 배치합니다
                    // right: 0,          // 우측으로부터 0px 위치에 배치합니다
                    // // bottom: '75vh',         // 하단으로부터 0px 위치에 배치합니다
                    // zIndex: 5,       // 다른 요소 위에 위치시키기 위한 z-index 값을 설정합니다
                }}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item xs={6}>
                            <IconButton aria-label="delete" size="large" onClick={() => handlePageChange(-1)}>
                                <LeftIcon fontSize="large" sx={{ color: '#efe9e9ed' }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton aria-label="delete" size="large" onClick={() => handlePageChange(1)}>
                                <RightIcon fontSize="large" sx={{ color: '#efe9e9ed' }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>

                {/* FOMC BOX */}
                <Box sx={{ position: 'absolute', transform: 'translate(1360px, 460px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingLeft: 2, paddingRight: 2 }}>
                    <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'left' }}>
                        The next FOMC meeting is in:
                    </Box>
                    <Box sx={{ fontSize: '1.8rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                {timeLeft.days}
                                <Divider sx={{ borderColor: 'white' }} />
                                <Box sx={{ fontSize: '1rem' }}>
                                    Days
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                {timeLeft.hours}
                                <Divider sx={{ borderColor: 'white' }} />
                                <Box sx={{ fontSize: '1rem' }}>
                                    Hrs
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                {timeLeft.minutes}
                                <Divider sx={{ borderColor: 'white' }} />
                                <Box sx={{ fontSize: '1rem' }}>
                                    Min
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                {timeLeft.seconds}
                                <Divider sx={{ borderColor: 'white' }} />
                                <Box sx={{ fontSize: '1rem' }}>
                                    Sec
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* 우측 해외 차트 6개 */}
                <Box sx={{
                    position: 'fixed',
                    width: '20vw',
                    transform: 'translate(1360px, 80px)'
                }}>
                    {ipoSubPage === '국내외지표이슈' && <ImageUpdater />}
                </Box>
            </Grid>
            <TextNews swiperRef={swiperRef} />
            {/* {ipoSubPage === '국내외지표이슈' && } */}
            {/* {ipoSubPage === 'IPO' && <IPO swiperRef={swiperRef} />} */}
        </>
    )
}


function ImageUpdater() {
    const [world, setWorld] = useState([
        { name: '다우산업', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/us/daumindex/i/DJI.png" },
        { name: '나스닥', point: '', net: '', div: '', url: "https://t1.daumcdn.net/media/finance/chart/us/daumstock-mini/d/COMP.png" },
        { name: '니케이', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/jp/daumindex/i/NI225.png" },
        { name: '상해종합', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/sh/daumindex/i/000001.png" },
        { name: '영국', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/gb/daumindex/i/FTSE100.png" },
        { name: '독일', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/de/daumindex/i/DAX30.png" },
    ])

    const fetchData = async () => {
        const uniq = "?" + new Date().getTime();
        await axios.get(`${API}/indices/WorldIndex`).then(res => {
            var 다우산업 = res.data.find(item => item.지수명 === '다우 산업');
            var 나스닥 = res.data.find(item => item.지수명 === '나스닥 종합');
            var 니케이 = res.data.find(item => item.지수명 === '니케이 225');
            var 상해종합 = res.data.find(item => item.지수명 === '상해 종합');
            var 영국 = res.data.find(item => item.지수명 === 'FTSE 100');
            var 독일 = res.data.find(item => item.지수명 === 'DAX');
            setWorld([
                { name: '다우산업', point: 다우산업.현재가, net: 다우산업.등락률, div: 다우산업.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/DJI@DJI.png" + uniq, },
                { name: '나스닥', point: 나스닥.현재가, net: 나스닥.등락률, div: 나스닥.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/NAS@IXIC.png" + uniq, },
                { name: '니케이', point: 니케이.현재가, net: 니케이.등락률, div: 니케이.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/NII@NI225.png" + uniq, },
                { name: '상해종합', point: 상해종합.현재가, net: 상해종합.등락률, div: 상해종합.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/SHS@000001.png" + uniq, },
                { name: '영국', point: 영국.현재가, net: 영국.등락률, div: 영국.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/LNS@FTSE100.png" + uniq, },
                { name: '독일', point: 독일.현재가, net: 독일.등락률, div: 독일.전일대비, url: "https://ssl.pstatic.net/imgfinance/chart/world/continent/XTR@DAX30.png" + uniq, },
            ])
        })
    }


    useEffect(() => {
        fetchData();
    }, []);

    // 5분 주기 업데이트
    useInterval(fetchData, 1000 * 60 * 5, {
        startHour: 9,
        endHour: 16,
        daysOff: [0, 6], // 일요일(0)과 토요일(6)은 제외
    });

    // ccs
    const fontSytle = { fontWeight: 'bold' }

    return (
        <Grid container spacing={3}>
            {world ?
                world.map((item, index) => {
                    return (
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item sx={fontSytle} xs={4}>{item.name}</Grid>
                                <Grid item sx={{
                                    color: item.div === '+' ? 'tomato' : 'deepskyblue',
                                    ...fontSytle
                                }} xs={4}>{numberWithCommas(item.point)}</Grid>
                                {
                                    item.div === '+' ?
                                        <Grid item sx={{ color: 'tomato', ...fontSytle }} xs={4}> +{item.net}%</Grid>
                                        : <Grid item sx={{ color: 'deepskyblue', ...fontSytle }} xs={4}>{item.net}%</Grid>
                                }
                            </Grid>
                            <img src={`${item.url}`} />
                        </Grid>
                    )
                })
                : <Skeleton variant="rounded" animation="wave" />

            }
        </Grid>
    )
}

// css
const dateStyle = { fontSize: '13px', fontWeight: 'bold' }
const dateEventStyle = { fontSize: '12px', textAlign: 'left', lineHeight: 1 }
const btnStyle = { color: '#efe9e9ed', fontSize: '12px', textAlign: 'left' }

