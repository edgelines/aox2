import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, IconButton, Grid, Box, Skeleton, Divider } from '@mui/material';
import LeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import RightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextNews from './ScheduleSub/textNews';
import IPO from './ScheduleSub/ipo';
import Weather from './ScheduleSub/weather';
import COEX from './ScheduleSub/coex';
import FlixPatrol from './ScheduleSub/flixPatrol';
import NaverDataLab from './ScheduleSub/naverDataLab';
import FundarmentalPage1 from './Fundarmental/fundarmentalPage1';
import FundarmentalPage2 from './Fundarmental/fundarmentalPage2';
import FundarmentalPage3 from './Fundarmental/fundarmentalPage3';
import Pbr from './Index/PBR';
import { numberWithCommas } from './util/util';
import { API, myJSON } from './util/config';

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
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Export')}>World Export</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('점도표')}>점도표</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('공모주')}>공모주 상장일정</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('IR')}>IR 자료</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('통계지표')}>100대 통계지표</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Bloomberg')}>Bloomberg</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('CNBC')}>CNBC</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Investing')}>Investing</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental1')}>Oil/금속/환율/코인</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental2')}>모기지/금리/<br />비금속/예탁금</Button>,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('Fundarmental3')}>채권/CPI/PPI/재고</Button>,
        <Divider sx={{ borderColor: 'white', mt: 1.5, mb: 1.5 }} />,
        <Button variant={'text'} sx={btnStyle} onClick={() => setSectorPage('PERPBR')}>PER/PBR</Button>,
    ]
    const fetchData = async () => {
        await axios.get(`${API}/FOMC`).then((res) => {
            setFomcDate(res.data[0]['data-endtime']);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        axios.get(`${myJSON}/scheduleWeek${page}`).then(response => {
            const filteredEvents = response.data.map(day => {
                const filteredDayEvents = selectedType
                    ? day.events.filter(event => event.type === selectedType)
                    : day.events;
                return {
                    ...day,
                    events: filteredDayEvents,
                };
            });
            setSchedule(filteredEvents);
        })
    }, [selectedType, page]);
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
            <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={1} >
                    <Box>
                        <ButtonGroup orientation="vertical" color="primary" aria-label="vertical outlined button group">
                            {buttons}
                        </ButtonGroup>
                    </Box>
                    {/* <Box sx={{ width: '100%' }}>
                        <Divider variant="middle" sx={{ borderColor: 'white' }} />
                    </Box> */}
                </Grid>
                <Grid item xs={11}>
                    {sectorPage === '스케쥴' && <Schedule schedule={schedule} date={fomcDate} ipoSubPage={ipoSubPage} swiperRef={swiperRef}
                        handlePageChange={handlePageChange} />}
                    {sectorPage === '날씨' && <Weather />}
                    {sectorPage === 'DataLab' && <NaverDataLab swiperRef={swiperRef} />}
                    {sectorPage === 'COEX' && <COEX swiperRef={swiperRef} />}
                    {sectorPage === 'FlixPatrol' && <FlixPatrol swiperRef={swiperRef} />}
                    {sectorPage === 'Bloomberg' && <Iframe swiperRef={swiperRef} targetUrl={'https://www.bloomberg.com/'} />}
                    {sectorPage === 'CNBC' && <Iframe swiperRef={swiperRef} targetUrl={'https://www.cnbc.com/world/?region=world'} />}
                    {sectorPage === 'Investing' && <Iframe swiperRef={swiperRef} targetUrl={'https://kr.investing.com/'} />}
                    {sectorPage === 'Export' && <Iframe swiperRef={swiperRef} targetUrl={'https://oec.world/en'} />}
                    {sectorPage === '점도표' && <Iframe swiperRef={swiperRef} targetUrl={'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html'} />}
                    {sectorPage === '공모주' && <Iframe swiperRef={swiperRef} targetUrl={'https://www.kokstock.com/stock/ipo_listing.asp'} />}
                    {sectorPage === 'IR' && <Iframe swiperRef={swiperRef} targetUrl={'http://www.38.co.kr/html/ipo/ir_data.php'} />}
                    {sectorPage === '통계지표' && <Iframe swiperRef={swiperRef} targetUrl={'https://ecos.bok.or.kr/#/StatisticsByTheme/KoreanStat100'} />}
                    {sectorPage === 'Fundarmental1' && <FundarmentalPage1 swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental2' && <FundarmentalPage2 swiperRef={swiperRef} />}
                    {sectorPage === 'Fundarmental3' && <FundarmentalPage3 swiperRef={swiperRef} />}
                    {sectorPage === 'PERPBR' && <Pbr swiperRef={swiperRef} />}
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
            <Grid container spacing={2} sx={{ borderBottom: '0.6px solid #ccc', borderTop: '0.6px solid #ccc', marginBottom: '20px', minHeight: '55vh' }} >
                {schedule
                    ? schedule.map((day, dayIndex) => (
                        dayIndex < 5 ? (
                            <Grid item key={dayIndex} sx={{ width: '25vh' }}>
                                <p style={dateStyle}>{new Date(day.date).toLocaleDateString('kr-KR', {
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
                                <p style={dateStyle}>{new Date(day.date).toLocaleDateString('kr-KR', {
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
                    display: 'flex',
                    justifyContent: 'right',
                    alignSelf: 'end',
                    // marginTop: '20px',
                    // marginRight: '20px',
                    position: 'fixed',  // 요소를 고정 위치에 배치합니다
                    right: 0,          // 우측으로부터 0px 위치에 배치합니다
                    // bottom: '75vh',         // 하단으로부터 0px 위치에 배치합니다
                    zIndex: 5,       // 다른 요소 위에 위치시키기 위한 z-index 값을 설정합니다
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
                <Box sx={{ position: 'absolute', transform: 'translate(0vw, 44vh)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingLeft: 2, paddingRight: 2 }}>
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
                    transform: 'translate(71vw, 6vh)'
                }}>
                    {ipoSubPage === '국내외지표이슈' && <ImageUpdater />}
                </Box>
            </Grid>

            {ipoSubPage === '국내외지표이슈' && <TextNews swiperRef={swiperRef} />}
            {ipoSubPage === 'IPO' && <IPO swiperRef={swiperRef} />}
        </>
    )
}

function Iframe({ swiperRef, targetUrl }) {
    return (
        <div style={{ height: "98vh", width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <iframe src={targetUrl} width="100%" height="100%" frameBorder="0" scrolling="no" />

        </div>
    )
}

function ImageUpdater() {
    const [world, setWorld] = useState([
        { name: '다우산업', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/us/daumindex/i/DJI.png" },
        { name: '나스닥', point: '', net: '', div: '', url: "https://t1.daumcdn.net/finance/chart/us/daumindex/i/COMP.png" },
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
                { name: '다우산업', point: 다우산업.현재가, net: 다우산업.등락률, div: 다우산업.전일대비, url: "https://t1.daumcdn.net/finance/chart/us/daumindex/i/DJI.png" + uniq, },
                { name: '나스닥', point: 나스닥.현재가, net: 나스닥.등락률, div: 나스닥.전일대비, url: "https://t1.daumcdn.net/finance/chart/us/daumindex/i/COMP.png" + uniq, },
                { name: '니케이', point: 니케이.현재가, net: 니케이.등락률, div: 니케이.전일대비, url: "https://t1.daumcdn.net/finance/chart/jp/daumindex/i/NI225.png" + uniq, },
                { name: '상해종합', point: 상해종합.현재가, net: 상해종합.등락률, div: 상해종합.전일대비, url: "https://t1.daumcdn.net/finance/chart/sh/daumindex/i/000001.png" + uniq, },
                { name: '영국', point: 영국.현재가, net: 영국.등락률, div: 영국.전일대비, url: "https://t1.daumcdn.net/finance/chart/gb/daumindex/i/FTSE100.png" + uniq, },
                { name: '독일', point: 독일.현재가, net: 독일.등락률, div: 독일.전일대비, url: "https://t1.daumcdn.net/finance/chart/de/daumindex/i/DAX30.png" + uniq, },
            ])
        })
    }


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const world = setInterval(() => {
            fetchData();
        }, 1000 * 60 * 5);

        return () => {
            clearInterval(world);
        };
    }, []);

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

