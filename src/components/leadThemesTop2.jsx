import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, TableContainer, Table, TableHead, TableBody, Typography } from '@mui/material';
import FilterStockChart from './LeadSectors/chart';
import { API, API_WS, STOCK, TEST } from './util/config';



export default function LeadThemesTopPage({ swiperRef }) {
    const [today, setToday] = useState(null);
    const [time, setTime] = useState(null);
    const [savetime, setSavetime] = useState(null);


    const [chartData1, setChartData1] = useState({ data: [], yAxis: { categories: null } });
    const [chartData2, setChartData2] = useState({ data: [], yAxis: { categories: null } });
    const [chartTable1, setChartTable1] = useState([]);
    const [chartTable2, setChartTable2] = useState([]);

    const [checkStats, setCheckStats] = useState({ b1_kospi200: [] });

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

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/LeadThemesTop2`);
        ws.onopen = () => {
            console.log('Lead Sectors WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setChartData1(res.chart1);
            setChartData2(res.chart2);
            // setIndustryTableData(res.industry);
            setCheckStats(res.check);
            setSavetime(res.savetime);
            setChartTable1(res.table1)
            setChartTable2(res.table2)
            // setThemesTableData(res.themes);
            // setIndustryInfo(res.industryInfo);
        };

        ws.onerror = (error) => {
            console.error('Lead Sectors WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('Lead Sectors WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함
    // 시계 1초마다
    useEffect(() => {
        const timer = setInterval(() => {
            setDate();
        }, 1000);
        return () => clearInterval(timer);
    }, [])


    return (
        <Grid container >
            {/* Title */}
            <Box sx={{ position: 'absolute', transform: 'translate(0px, 5px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <Grid container>
                    {savetime}
                </Grid>
            </Box>
            {/* Clock Box */}
            <Box sx={{ position: 'absolute', transform: 'translate(800px, 280px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <Grid container >{today}</Grid>
                <Grid container >{time}</Grid>
                <Grid container sx={{ mb: 2 }}></Grid>
                <Typography sx={{ fontSize: '12px', color: 'mediumorchid' }} >50% 미만</Typography>
                <Typography sx={{ fontSize: '12px', color: 'dodgerblue' }} >50%~75%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'skyblue' }} >75%~100%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'Lawngreen' }} >100%~200%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'gold' }} >200%~300%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'orange' }} >300%~400%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'tomato' }} >400% 이상</Typography>
                <Grid container sx={{ mb: 2 }}></Grid>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량</Typography>
                <Typography sx={{ fontSize: '12px', color: 'dodgerblue' }} >X : 어제기준</Typography>
                <Typography sx={{ fontSize: '12px', color: 'tomato' }} >X : 오늘기준</Typography>
            </Box>

            <Box sx={{ position: 'absolute', transform: 'translate(7px, 865px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                {Array.isArray(checkStats.b1_kospi200) && checkStats.b1_kospi200.length > 0 ?
                    <>
                        <Typography sx={{ fontSize: '13px' }} > 코스피200 : {checkStats.now_kospi200.length} / {checkStats.b1_kospi200.length} ({parseInt(checkStats.now_kospi200.length / checkStats.b1_kospi200.length * 100)}%)</Typography>
                        <Typography sx={{ fontSize: '13px' }} > 코스피 : {checkStats.now_kospi.length} / {checkStats.b1_kospi.length} ({parseInt(checkStats.now_kospi.length / checkStats.b1_kospi.length * 100)}%)</Typography>
                        <Typography sx={{ fontSize: '13px' }} > 코스닥 : {checkStats.now_kosdaq.length} / {checkStats.b1_kosdaq.length} ({parseInt(checkStats.now_kosdaq.length / checkStats.b1_kosdaq.length * 100)}%)</Typography>
                    </>
                    : <></>}
            </Box>

            {/* filtered table */}
            <Box sx={{ position: 'absolute', transform: 'translate(640px, 540px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <TableContainer >
                    <Table size='small'>
                        <TableHead>
                            <tr style={{ fontSize: '11px' }}>
                                <td style={{ textAlign: 'center' }} >중복</td>
                                <td style={{ textAlign: 'center' }} >종목명</td>
                                <td style={{ textAlign: 'center' }} >순위</td>
                                <td style={{ textAlign: 'center' }} >%</td>
                                <td style={{ textAlign: 'center' }} >V%</td>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {
                                Array.isArray(chartTable1) && chartTable1.length > 0 ?
                                    chartTable1.map(item => (
                                        <tr style={{ fontSize: '11px' }}>
                                            <td style={{ width: '30px', textAlign: 'center' }}>{item.중복}</td>
                                            <td style={{ width: '80px', textAlign: 'right' }}>{item.종목명.substr(0, 6)}</td>
                                            <td style={{ width: '45px', textAlign: 'center' }}>{item.순위}</td>
                                            <td style={{ width: '50px', textAlign: 'right' }}>{item.등락률} %</td>
                                            <td style={{ width: '50px', textAlign: 'right' }}>{item.전일대비거래량} %</td>
                                        </tr>
                                    ))
                                    : ''

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ position: 'absolute', transform: 'translate(1600px, 540px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <TableContainer >
                    <Table size='small'>
                        <TableHead>
                            <tr style={{ fontSize: '11px' }}>
                                <td style={{ textAlign: 'center' }} >중복</td>
                                <td style={{ textAlign: 'center' }} >종목명</td>
                                <td style={{ textAlign: 'center' }} >순위</td>
                                <td style={{ textAlign: 'center' }} >%</td>
                                <td style={{ textAlign: 'center' }} >V%</td>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {
                                Array.isArray(chartTable2) && chartTable2.length > 0 ?
                                    chartTable2.map(item => (
                                        <tr style={{ fontSize: '11px' }}>
                                            <td style={{ width: '30px', textAlign: 'center' }}>{item.중복}</td>
                                            <td style={{ width: '80px', textAlign: 'right' }}>{item.종목명.substr(0, 6)}</td>
                                            <td style={{ width: '45px', textAlign: 'center' }}>{item.순위}</td>
                                            <td style={{ width: '50px', textAlign: 'right' }}>{item.등락률} %</td>
                                            <td style={{ width: '50px', textAlign: 'right' }}>{item.전일대비거래량} %</td>
                                        </tr>
                                    ))
                                    : ''

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>


            {/* Main Chart1 */}
            <Grid item xs={5.9}>
                <FilterStockChart data={chartData1.series} height={930} yAxis={chartData1.yAxis} isThemes={true} />
            </Grid>

            {/* 가운데 간지Table */}
            <Grid item xs={0.2} sx={{ pl: 1 }}>
            </Grid>

            {/* Main Chart2 */}
            <Grid item xs={5.9} >
                <FilterStockChart data={chartData2.series} height={930} yAxis={chartData2.yAxis} isThemes={true} />
            </Grid>


        </Grid >
    )
}
