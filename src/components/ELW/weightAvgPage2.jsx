import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
import { Grid, Box, Skeleton } from '@mui/material';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTableComponent from './weightAvgTable'
import CoreChart from '../util/CoreChart';
import WeightAvgCheck from './weightAvgCheck';
import { API, TEST, API_WS } from '../util/config';

export default function WeightAvgPage2({ swiperRef }) {
    const [dayGr, setDayGr] = useState({ series: null, categories: null });
    const [ElwRatioData, setElwRatioData] = useState({ series: null, categories: null });
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);
    const [MonthTable, setMonthTable] = useState([]);
    const [CallPutRatio_Maturity, setCallPutRatio_Maturity] = useState([]);
    const [WeightedAvgCheck, setWeightedAvgCheck] = useState([]);
    const [MarketDetail, setMarketDetail] = useState([]);

    // const WeightAvgRef = useRef(null);
    // const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/weightAvgPage2`);

        ws.onopen = () => {
            console.log('weightAvgPage2 WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data)
            setMonth2Data({ series: res.WA3.series, min: res.WA3.min, categories: res.WA3.categories });
            setMonth1Value(res.WA3.CTP);
            setDayGr(res.DayGr);
            setElwRatioData(res.ElwRatioData);
            setMonthTable(res.MonthTable);
            setCallPutRatio_Maturity(res.CallPutRatio_Maturity);
            setWeightedAvgCheck(res.WeightedAvgCheck);
            setMarketDetail(res.MarketDetail);
            // setMessages(prevMessages => [...prevMessages, event.data]);
        };

        ws.onerror = (error) => {
            console.error('weightAvgPage2 WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('weightAvgPage2 WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함

    return (
        <Grid container spacing={1} >
            <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >2</Box>
            <Grid item xs={6}>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <CoreChart data={dayGr.series} height={440} name={'dayGr'} categories={dayGr.categories} creditsPositionY={66} />
                </Grid>
                <Grid item xs={12} >
                    <CoreChart data={ElwRatioData.series} height={440} name={'ElwRatioData'} categories={ElwRatioData.categories} type={'column'} />
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA3</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 3</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 7</span> [거래대금]
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={WeightedAvgCheck} />
                    {/* <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} /> */}
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>
                <MonthChart data={month2Data.series} height={840} categories={month2Data.categories} min={month2Data.min} />

                <Box sx={{ position: 'absolute', transform: 'translate(2.6vw, -240px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MonthTableComponent ELW_monthTable={MonthTable} ELW_CallPutRatio_Maturity={CallPutRatio_Maturity} />
                </Box>

                <Grid container justifyContent="flex-end" alignItems="center">
                    {month1Value && month1Value.length > 0 ?
                        month1Value.map((value, index) => {
                            return <>
                                <Grid item xs={1.04} key={value} sx={{ color: 'pink', fontWeight: 'bold', fontSize: '1rem' }}>
                                    {value}
                                </Grid>
                            </>
                        }) : <Skeleton variant="rectangular" animation="wave" />
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}




{/* <Box sx={{ fontSize: '2rem' }}>
                    - 작업중
                </Box>
                <Box sx={{ fontSize: '1.5rem', textAlign: 'left', mt: '10vh' }}>
                    <ul>1. 데이터는 8월 4일 종가 기준</ul>
                    <ul>2. 2일평균거래대금의 top10 들의 call, put 가중평균</ul>
                    <ul>3. 단순X :  (Call_mean + Put_mean) / 2 </ul>
                    <ul> 가중X : Call과 Put의 가중평균 </ul>
                    <ul>4. 1일 : CTP 전체 데이터 가중평균 </ul>
                    <ul>5. 1.5일 : (1일 + 2일 ) /2 </ul>
                    <ul>6. 2일 : CTP데이터에서 2일평균거래대금으로 Call과 Put 전체데이터 가중평균 </ul>
                    <ul>7. 페이지 하단 08, 09, ... 06까지 마우스올려두면 리얼데이터가 나타남 </ul>
                </Box> */}