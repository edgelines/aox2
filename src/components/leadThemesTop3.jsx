import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, TableContainer, Table, TableHead, TableBody, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { customTheme, stockTableColumns, DataTableStyleDefault, volumePowerColumns } from './LeadSectors/tableColumns';

import TestChart from './Test/TestChart';
import { API, API_WS, STOCK } from './util/config';
import { SectorsName15 } from './util/util';
import StockChart_MA from './util/stockChart_MA';
import SectorChart from './SectorsPage/sectorChart';
import { StockInfoSimple } from './SearchFinancial/info';
import { StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';


export default function LeadThemesTopPage({ swiperRef }) {
    const [today, setToday] = useState(null);
    const [time, setTime] = useState(null);
    const [savetime, setSavetime] = useState(null);
    const [chartData, setChartData] = useState({ data: [] });
    const [tableData, setTableData] = useState([]);

    const [SectorsName, setSectorsName] = useState(null);
    const [stock, setStock] = useState({});
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [themesCounterIndustry, setThemesCounterIndustry] = useState([]);
    const [industryInfo, setIndustryInfo] = useState([]);
    const [themesTableData, setThemesTableData] = useState([]);
    const [themesToStockData, setThemesToStockData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });


    const setDate = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
        var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        var amPM = 'AM'
        if (hour >= 12) { amPM = 'PM' }
        var date = year + '-' + month + '-' + day;
        var time = `${hour}:${min}:${sec} ${amPM}`;
        setToday(date);
        setTime(time);
    }

    // hanlder
    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }
    const getInfo = async (item) => {
        // var res = await axios.get(`${API}/industry/LeadSectorsTable/${item.업종명}`);
        // setStockTableData(res.data);

        // 업종 차트
        const name = SectorsName15(item.업종명)
        setSectorsName(item.업종명);

        const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        if (!excludedNames.includes(name)) {
            var res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
            setSectorsChartDataSelected(res.data);
        }

        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            setStock({
                종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
                시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                // PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                // N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                // 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                // 최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 
                분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                // 주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                // 테마명: res.data.테마명
            })

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}`);
            // console.log(res.data);
            setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, treasuryPrice: res.data.treasuryPrice, willR: res.data.willR, net: res.data.net, MA: res.data.MA })
            //     console.log(res.data); ${item.종목코드}
        } else {
            setStock({});
            setStockChart({ price: [], volume: [] });
        }

    }

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/LeadThemesTop3`);
        ws.onopen = () => {
            console.log('Lead ThemesTop3 WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setChartData(res.chart);
            setSavetime(res.savetime);
            setTableData(res.table);
        };

        ws.onerror = (error) => {
            console.error('Lead ThemesTop3 WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('Lead ThemesTop3 WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함
    // 시계 1초마다
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setDate();
    //     }, 1000);
    //     return () => clearInterval(timer);
    // }, [])


    return (
        <Grid container >
            {/* Title */}
            <Box sx={{ position: 'absolute', transform: 'translate(0px, 40px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <Grid container>
                    {savetime}
                </Grid>
            </Box>
            <Box sx={{ position: 'absolute', transform: 'translate(600px, 5px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>

                <Typography sx={{ fontSize: '12px' }}>x축 : 체결강도</Typography>
                <Typography sx={{ fontSize: '12px' }}>y축 : 전일대비거래량</Typography>
                <Typography sx={{ fontSize: '12px' }}>원의크기 : 외국인+기관순매수 합산</Typography>
                <Typography sx={{ fontSize: '12px' }}>원의색상 : 외국인+기관순매수 합산이 0보다 클경우 빨간색</Typography>
                <Typography sx={{ fontSize: '12px' }}>외국인,기관 순매수 단위 : 백만원</Typography>
                <Typography sx={{ fontSize: '12px', color: 'mediumorchid' }} >3% 미만</Typography>
                <Typography sx={{ fontSize: '12px', color: 'dodgerblue' }} >3%~6%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'skyblue' }} >6%~9%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'Lawngreen' }} >9%~12%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'gold' }} >12%~15%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'orange' }} >15%~18%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'tomato' }} >18%~24%</Typography>

            </Box>



            {/* Main Chart1 */}
            <Grid item xs={7}>
                <Grid item container>
                    <Typography>체결강도 - 전일대비거래량 Chart Page</Typography>
                </Grid>
                <TestChart data={chartData.series} height={500} getInfo={getInfo} />

                <Grid item container
                    sx={{ height: '420px', mt: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={volumePowerColumns}
                            hideFooter rowHeight={20}
                            onCellClick={(params, event) => { getInfo(params.row); }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                            }}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>

            {/* 가운데 간지 */}
            <Grid item xs={0.5}></Grid>

            {/* Stock Info */}
            <Grid item xs={3.5} sx={{ pl: 1 }}>

                <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} height={190} />

                <Grid item container >
                    <StockChart_MA height={460} boxTransform={`translate(10px, 53px)`}
                        stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} stockName={stock.종목명 ? stock.종목명 : ''} price={stock.현재가} net={stockChart.net}
                        willR={stockChart.willR} treasuryPrice={stockChart.treasuryPrice} treasury={stockChart.treasury} MA={stockChart.MA} />
                </Grid>

                <Grid item container sx={{ mt: 1 }}>
                    {stock.종목명 ?
                        <>
                            {/* <Grid item xs={8}> */}
                            <StockInfoSimple data={stock} handleFavorite={handleFavorite} />
                            {
                                Array.isArray(stock.연간실적) ?
                                    <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                                    : <></>
                            }
                        </>

                        : <></>
                    }
                </Grid>

            </Grid>

        </Grid >
    )
}
