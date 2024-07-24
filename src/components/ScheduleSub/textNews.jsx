import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableContainer, TableBody, TableHead, Modal, Backdrop, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { API } from '../util/config';
import useInterval from '../util/useInterval';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TextNews({ swiperRef, handleImgClick }) {
    const 하단최대높이 = '37vh'
    const [news, setNews] = useState([]);
    const [finvizImg, setFinvizImg] = useState();
    const [worldIndex, setWorldIndex] = useState();
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = (event) => { setOpenModal(true); setUrl(event.target.src); }
    const handleClose = () => setOpenModal(false);
    const [worldIndexPage, setWorldIndexPage] = useState('A');
    const [chartPreset, setChartPreset] = useState('d')
    const worldIndeces = [
        { name: 'S&P500', code: 'us', url: 'SP500' },
        { name: '나스닥 100', code: 'us', url: 'NDX' },
        { name: '나스닥 종합', code: 'us', url: 'COMP' },
        { name: '다우 산업', code: 'us', url: 'DJI' },
        { name: '다우 운송', code: 'us', url: 'DJT' },
        { name: '필라델피아 반도체', code: 'us', url: 'SOX' },
        { name: '브라질', code: 'br', url: 'BRI@BVSP' },
        { name: '아르헨티나', code: 'ar', url: 'ARI@MERV' },
        { name: '중국 CSI 300', code: 'cn', url: '000300' },
        { name: '상해 종합', code: 'cn', url: '000001' },
        { name: '상해A', code: 'cn', url: '000002' },
        { name: '상해B ', code: 'cn', url: '000003' },

        { name: '일본 TOPIX', code: 'jp', url: 'T0000' },
        { name: '일본 니케이', code: 'jp', url: 'NI225' },
        { name: '홍콩 H지수', code: 'hk', url: 'HSCE' },
        { name: '홍콩 항셍', code: 'hk', url: 'HSI' },
        { name: '홍콩 차이나대기업', code: 'hk', url: 'HSCC' },
        { name: '말레이시아', code: 'my', url: 'MYI@KLSE' },
        { name: '싱가포르', code: 'sg', url: 'SGI@STI' },
        { name: '인도', code: 'in', url: 'INI@BSE30' },
        { name: '대만', code: 'tw', url: 'TAIEX' },
        { name: '인도네시아', code: 'id', url: 'IDI@JKSE' },
        { name: '영국', code: 'gb', url: 'FTSE100' },
        { name: '독일', code: 'de', url: 'DAX30' },
        { name: '프랑스', code: 'fr', url: 'CAC40' },
        { name: '이탈리아', code: 'it', url: 'ITI@FTSEMIB' },

    ]
    const [url, setUrl] = useState(null);
    const fetchData = async () => {
        await axios.get(`${API}/schedule/TextNews`).then(response => { setNews(response.data); })
        const uniq = "?" + new Date().getTime();
        const url = `/img/finviz.jpg${uniq}`
        // const url = `${API_FILE}/image/finviz${uniq}`
        setFinvizImg(url);
        await axios.get(`${API}/indices/WorldIndex`).then(res => {
            setWorldIndex(res.data);
        })

    }

    const handlePreset = (event, value) => {
        if (value !== null) { setWorldIndexPage(value); }
    }
    const handleChartPreset = (event, value) => {
        if (value !== null) { setChartPreset(value); }
    }
    useEffect(() => {
        fetchData();
    }, []);

    useInterval(fetchData, 1000 * 60 * 20, {
        startHour: 7,
        endHour: 8,
        daysOff: [0, 6], // 일요일(0)과 토요일(6)은 제외
    });

    const uniq = "?t=" + new Date().getTime();
    const key = ['시한폭탄', '급락', '위험']
    const key2 = ['투자', '진출', '급등', '러브콜', '재개발']

    return (
        <Grid container spacing={1} sx={{ maxHeight: 하단최대높이 }}>
            <Modal open={openModal} onClose={handleClose} closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}  >
                    <img src={url} onClick={handleClose} style={{ width: '100%' }} />
                </Box>
            </Modal>
            <Grid item xs={3.5}>
                <div style={{ height: 하단최대높이, marginLeft: '1vw' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <TableContainer sx={{ height: 하단최대높이, overflowY: 'scroll', borderBottom: '1px solid #ccc ' }}>
                        <Table>
                            <TableBody>
                                {news ?
                                    news.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={{
                                                    textAlign: 'left', lineHeight: 2,
                                                    color:
                                                        key.some(keyword => item.title.includes(keyword)) ? '#FCAB2F'
                                                            : key2.some(keyword => item.title.includes(keyword)) ? '#62FFF6'
                                                                : null
                                                }}>{item.title}</td>

                                            </tr>
                                        )
                                    }) : <tr><td>Loading...</td></tr>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div style={{ height: 하단최대높이, marginLeft: '1vw' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <TableContainer sx={{ height: 하단최대높이, overflowY: 'scroll', borderBottom: '1px solid #ccc ' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left' }}>
                            <ToggleButtonGroup
                                // orientation="vertical"
                                color='info'
                                exclusive
                                size="small"
                                value={worldIndexPage}
                                onChange={handlePreset}
                            >
                                <StyledToggleButton value="A">Table</StyledToggleButton>
                                <StyledToggleButton value="B">Chart</StyledToggleButton>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup
                                // orientation="vertical"
                                color='info'
                                exclusive
                                size="small"
                                value={chartPreset}
                                onChange={handleChartPreset}
                            >
                                <StyledToggleButton value="d">1일</StyledToggleButton>
                                <StyledToggleButton value="m">1개월</StyledToggleButton>
                                <StyledToggleButton value="m3">3개월</StyledToggleButton>
                                <StyledToggleButton value="y">1년</StyledToggleButton>
                                <StyledToggleButton value="y3">3년</StyledToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {
                            worldIndexPage === 'A' ?
                                <Table>
                                    <TableHead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc', lineHeight: '2.2vh' }}>
                                            <td>국가명</td>
                                            <td>지수명</td>
                                            <td>등락률</td>
                                        </tr>
                                    </TableHead>
                                    <TableBody>
                                        {worldIndex ?
                                            worldIndex.map((item, index) => {
                                                return (
                                                    <tr key={index} style={{ textAlign: 'left' }}>
                                                        <td>{item.국가명}</td>
                                                        <td>{item.지수명}</td>
                                                        {
                                                            item.전일대비 === '+' ?
                                                                <Grid item sx={{ color: 'tomato' }} xs={4}> +{item.등락률}%</Grid>
                                                                : <Grid item sx={{ color: 'deepskyblue' }} xs={4}>{item.등락률}%</Grid>
                                                        }
                                                    </tr>
                                                )
                                            }) : <tr><td>Loading...</td></tr>
                                        }
                                    </TableBody>
                                </Table>
                                : <>
                                    <Grid container spacing={1} rowSpacing={3}>
                                        {worldIndeces.map((item, i) => (
                                            <Grid item xs={4} key={i}>
                                                <Box sx={worldIndexChartFont}>{item.name}</Box>
                                                <img src={`https://t1.daumcdn.net/media/finance/chart/${item.code}/daumstock-mini/${chartPreset}/${item.url}.png${uniq}`} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                        }

                    </TableContainer>
                </div>
            </Grid>
            <Grid item xs={4.5}>
                <img src={`${finvizImg}`} style={{ width: '100%', objectFit: 'contain' }} onClick={handleOpen} />
            </Grid>
        </Grid>
    )
}

const worldIndexChartFont = { color: '#efef9e9ed' }

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    fontSize: '8px',
    color: '#efe9e9ed', // 비활성화 상태에서의 글자색
    '&.Mui-selected': { // 활성화 상태에서의 스타일
        backgroundColor: '#efe9e9ed', // 활성화 상태에서의 배경색
        color: '#404040', // 활성화 상태에서의 글자색
        '&:hover': { // 마우스 오버 상태에서의 스타일
            backgroundColor: '#d8d8d8', // 마우스 오버 상태에서의 배경색
        },
    },
    '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
        backgroundColor: '#505050', // 비활성화 상태에서의 마우스 오버 배경색
    },
}));