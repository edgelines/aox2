import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Skeleton } from '@mui/material';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTable from './weightAvgTable'
import CoreChart from '../util/CoreChart';
import WeightAvgCheck from './weightAvgCheck';
import { API } from '../util/config';
import { update_5M } from '../util/util';

export default function WeightAvgPage2({ swiperRef, ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck, MarketDetail }) {
    const [dayGr, setDayGr] = useState({ series: null, categories: null });
    const [ElwRatioData, setElwRatioData] = useState({ series: null, categories: null });
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);

    const fetchData = async () => {
        await axios.get(`${API}/elwData/Month4`).then((res) => {
            var call = [], put = [], kospi200 = [], CallMean = [], PutMean = [], Mean1 = [], Mean2 = [], CTP1 = [], CTP15 = [], CTP2 = [], Min = [], Date = [];
            res.data.slice(-11).forEach((value, index, array) => {
                call.push([value.콜_최소, value.콜_최대])
                put.push([value.풋_최소, value.풋_최대])
                kospi200.push(value.종가)
                CallMean.push(parseFloat(value.콜_가중평균.toFixed(1)))
                PutMean.push(parseFloat(value.풋_가중평균.toFixed(1)))
                Mean1.push(parseFloat(((value.콜_가중평균 + value.풋_가중평균) / 2).toFixed(1)))
                Mean2.push(parseFloat(value.콜풋_가중평균.toFixed(1)))
                CTP1.push(parseFloat(value['1일'].toFixed(1)))
                CTP15.push(parseFloat(value['1_5일'].toFixed(1)))
                CTP2.push(parseFloat(value['2일'].toFixed(1)))
                if (value.콜_최소 > 1) {
                    Min.push(value.콜_최소)
                }
                if (value.풋_최소 > 1) {
                    Min.push(value.풋_최소)
                }
                Date.push(value.최종거래일.substr(2, 2) + '.' + value.최종거래일.substr(5, 2) + '.' + value.최종거래일.substr(8, 2) + '.')
            })
            let Min1 = Math.min(...Min)
            const month = {
                series: [
                    { name: "Call", type: "errorbar", color: "#FCAB2F", lineWidth: 2, data: call },
                    { name: "Put", type: "errorbar", color: "#00F3FF", lineWidth: 2, data: put },
                    { name: "Kospi200", type: "spline", color: "#efe9e9ed", data: kospi200, marker: { radius: 5 }, lineWidth: 1.5, zIndex: 5, },
                    { name: "Call_mean", type: "spline", color: "#FCAB2F", data: CallMean, lineWidth: 1, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "Put_mean", type: "spline", color: "#00F3FF", data: PutMean, lineWidth: 0, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "1/2 (단순)", type: "line", color: "tomato", data: Mean1, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "가중", type: "line", color: "greenyellow", data: Mean2, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "1일", type: "spline", color: "pink", data: CTP1, lineWidth: 1, marker: { symbol: "circle", radius: 3 }, },
                    { name: "1.5일", type: "spline", color: "gold", data: CTP15, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                    { name: "2일", type: "spline", color: "magenta", data: CTP2, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                ],
                min: Min1,
                categories: Date
            }
            setMonth2Data(month);
            setMonth1Value(CTP1);
        })
        await axios.get(`${API}/elwData/DayGr`).then((response) => {
            setDayGr({
                series: [{
                    name: 'Call 잔존 : ' + response.data.call1,
                    data: response.data.data1,
                    color: '#FCAB2F',
                    yAxis: 0
                }, {
                    name: 'Put 잔존 : ' + response.data.put1,
                    data: response.data.data3,
                    color: '#00F3FF',
                    yAxis: 0
                }, {
                    name: 'Call 잔존 : ' + response.data.call2,
                    data: response.data.data2,
                    color: 'tomato',
                }, {
                    name: 'Put 잔존 : ' + response.data.put2,
                    data: response.data.data4,
                    color: 'dodgerblue',
                }], categories: response.data.Day
            })
        })
        await axios.get(`${API}/elwData/ElwRatioData`).then((response) => {
            setElwRatioData({
                series: [
                    {
                        name: '콜',
                        color: '#FCAB2F',
                        pointPlacement: -0.08,
                        pointWidth: 20, //bar 너비 지정.
                        grouping: false,
                        data: response.data.call
                    }, {
                        name: '풋',
                        color: '#00A7B3',
                        pointPlacement: 0.08,
                        pointWidth: 20, //bar 너비 지정.
                        grouping: false,
                        data: response.data.put
                    }],
                categories: response.data.category
            })
        });
    };

    useEffect(() => { fetchData(); }, [])

    // 30초 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 1분 이전이라면, 9시 1분까지 남은 시간 계산
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId); // 컴포넌트가 unmount될 때 타이머 제거
        // const intervalId = setInterval(() => {
        //     const now = new Date();
        //     const hour = now.getHours();
        //     const dayOfWeek = now.getDay();

        //     if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
        //         fetchData();
        //     }

        // }, 1000 * 60 * 5);
        // return () => clearInterval(intervalId);
    }, [])


    return (
        <Grid container spacing={1} >
            <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >2</Box>
            <Grid item xs={6}>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <CoreChart data={dayGr.series} height={440} name={'dayGr'} categories={dayGr.categories} credit={update_5M} creditsPositionY={66} />
                </Grid>
                <Grid item xs={12} >
                    <CoreChart data={ElwRatioData.series} height={440} name={'ElwRatioData'} categories={ElwRatioData.categories} type={'column'} credit={update_5M} />
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
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>
                <MonthChart data={month2Data.series} height={840} categories={month2Data.categories} min={month2Data.min} credit={update_5M} />
                <Box sx={{ position: 'absolute', transform: 'translate(2.6vw, -280px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}><MonthTable ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} /></Box>
                <Grid container justifyContent="flex-end" alignItems="center">
                    {month1Value && month1Value.length > 0 ?
                        month1Value.map((value, index) => {
                            return <>
                                <Grid item xs={1.04} key={index} sx={{ color: 'pink', fontWeight: 'bold', fontSize: '1rem' }}>
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