import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import IndexChart from './util/IndexChart';
import { StyledButton } from './util/util';
import MarketCurrentValue from './Index/marketCurrentValue.jsx'
// import { customRsi, williamsR } from 'indicatorts';
import { API, markerConfig } from './util/config';

export default function ModelingPage({ swiperRef, Vix, Exchange, MarketDetail }) {

    // const [kospi200, setKospi200] = useState([]);
    // const [rawKospi200, setRawKospi200] = useState([]);
    // const [adrRaw, setAdrRaw] = useState([]);
    // const [adrLastValue1, setAdrLastValue1] = useState(null);
    // const [adrLastValue2, setAdrLastValue2] = useState(null);
    // const [adrLastValue3, setAdrLastValue3] = useState(null);
    const [lastValue, setLastValue] = useState({ ADR1: '', ADR2: '', ADR3: '', WillR1: '', WillR2: '', WillR3: '', WillR4: '', WillR5: '' })
    const [adrNum1, setAdrNum1] = useState(7);
    const [adrNum2, setAdrNum2] = useState(14);
    const [adrNum3, setAdrNum3] = useState(20);

    const [williamsNum1, setWilliamsNum1] = useState(5);
    const [williamsNum2, setWilliamsNum2] = useState(7);
    const [williamsNum3, setWilliamsNum3] = useState(14);
    const [williamsNum4, setWilliamsNum4] = useState(22);
    const [williamsNum5, setWilliamsNum5] = useState(33);

    const [williamsValue, setWilliamsValue] = useState([]);

    const getWilliamsValue = (item) => { setWilliamsValue(item) };

    const [indexChartConfig, setIndexChartConfig] = useState({})

    const handleValueChange = (type, direction) => {
        if (type === "ADR1") {
            setAdrNum1(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "ADR2") {
            setAdrNum2(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "ADR3") {
            setAdrNum3(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "WillamsR1") {
            setWilliamsNum1(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "WillamsR2") {
            setWilliamsNum2(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "WillamsR3") {
            setWilliamsNum3(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "WillamsR4") {
            setWilliamsNum4(prev => prev + (direction === "UP" ? 1 : -1))
        } else if (type === "WillamsR5") {
            setWilliamsNum5(prev => prev + (direction === "UP" ? 1 : -1))
        }
    };
    const colorMap = {
        ADR1: 'silver',
        ADR2: 'orange',
        ADR3: 'greenyellow',
        WillR1: 'tomato',
        WillR2: 'orange',
        WillR3: 'greenyellow',
        WillR4: 'dodgerblue',
        WillR5: 'silver',
    };
    const getADR = async (num, Name) => {
        const res = await axios.get(`${API}/modeling/adr?num=${num}`);
        const lastValue = res.data[res.data.length - 1][1];
        setLastValue(prevLastValue => ({
            ...prevLastValue,
            [Name]: lastValue.toFixed(1),
        }));
        return {
            name: Name,
            isADR: true,
            id: Name,
            data: res.data,
            type: 'spline',
            color: colorMap[Name],
            yAxis: 2,
            zIndex: 3,
            dashStyle: 'ShortDash',
            lineWidth: 1
        };
    }
    const getWillR = async (num, Name) => {
        const res = await axios.get(`${API}/modeling/willr?num=${num}`);
        const lastValue = res.data[res.data.length - 1][1];
        setLastValue(prevLastValue => ({
            ...prevLastValue,
            [Name]: lastValue.toFixed(1),
        }));
        return {
            name: Name,
            isADR: true,
            id: Name,
            data: res.data,
            type: 'spline',
            color: colorMap[Name],
            yAxis: 1,
            zIndex: 3,
            dashStyle: 'ShortDash',
            lineWidth: 1,
            marker: markerConfig, showInLegend: true,
        };
    }
    // Fetch Data
    const fetchData = async () => {
        const resKospi200 = await axios.get(`${API}/modeling/Kospi200`);
        // setRawKospi200(resKospi200.data);

        // // 변경된 ADR 데이터를 담는 빈 배열 생성
        // const updatedAdrs = [];

        // // 변경된 ADR 번호 확인
        // if (adrNum1 !== 1) {
        //     // ADR 데이터 가져오기
        //     const adr1 = await getADR(adrNum1, 'ADR1');
        //     // 변경된 ADR 데이터 배열에 추가
        //     updatedAdrs.push(adr1);
        // }

        // if (adrNum2 !== 1) {
        //     const adr2 = await getADR(adrNum2, 'ADR2');
        //     updatedAdrs.push(adr2);
        // }

        // if (adrNum3 !== 1) {
        //     const adr3 = await getADR(adrNum3, 'ADR3');
        //     updatedAdrs.push(adr3);
        // }

        // if (williamsNum1 !== 1) {
        //     const WillR1 = await getWillR(williamsNum1, 'WillR1');
        //     updatedAdrs.push(WillR1);
        // }
        // if (williamsNum2 !== 1) {
        //     const WillR2 = await getWillR(williamsNum2, 'WillR2');
        //     updatedAdrs.push(WillR2);
        // }
        // if (williamsNum3 !== 1) {
        //     const WillR3 = await getWillR(williamsNum3, 'WillR3');
        //     updatedAdrs.push(WillR3);
        // }
        // if (williamsNum4 !== 1) {
        //     const WillR4 = await getWillR(williamsNum4, 'WillR4');
        //     updatedAdrs.push(WillR4);
        // }
        // if (williamsNum5 !== 1) {
        //     const WillR5 = await getWillR(williamsNum5, 'WillR5');
        //     updatedAdrs.push(WillR5);
        // }

        // Promise 객체를 사용하여 모든 데이터 수집을 기다림
        const promises = [];
        promises.push(getADR(adrNum1, 'ADR1'));
        promises.push(getADR(adrNum2, 'ADR2'));
        promises.push(getADR(adrNum3, 'ADR3'));
        promises.push(getWillR(williamsNum1, 'WillR1'));
        promises.push(getWillR(williamsNum2, 'WillR2'));
        promises.push(getWillR(williamsNum3, 'WillR3'));
        promises.push(getWillR(williamsNum4, 'WillR4'));
        promises.push(getWillR(williamsNum5, 'WillR5'));

        const updatedData = await Promise.all(promises);
        // Kospi200 데이터와 업데이트된 ADR 데이터를 병합
        const newIndexChartConfig = [
            {
                name: '코스피200', id: 'candlestick',
                type: 'candlestick', yAxis: 0, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false,
                data: resKospi200.data
            },
            ...updatedData,
        ];
        setIndexChartConfig(newIndexChartConfig);
    };

    useEffect(() => { fetchData(); }, [])
    useEffect(() => { fetchData(); }, [adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5])
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
    }, [])


    const indicators = [
        { name: `ADR1`, value: `ADR ( ${adrNum1} )`, color: colorMap.ADR1 },
        { name: `ADR2`, value: `ADR ( ${adrNum2} )`, color: colorMap.ADR2 },
        { name: `ADR3`, value: `ADR ( ${adrNum3} )`, color: colorMap.ADR3 },
        { name: `WillamsR1`, value: `W-R-1 ( ${williamsNum1} )`, color: colorMap.WillR1 },
        { name: `WillamsR2`, value: `W-R-2 ( ${williamsNum2} )`, color: colorMap.WillR2 },
        { name: `WillamsR3`, value: `W-R-3 ( ${williamsNum3} )`, color: colorMap.WillR3 },
        { name: `WillamsR4`, value: `W-R-4 ( ${williamsNum4} )`, color: colorMap.WillR4 },
        { name: `WillamsR5`, value: `W-R-5 ( ${williamsNum5} )`, color: colorMap.WillR5 }
    ]
    const ADR_list = [
        { name: `ADR ( ${adrNum1} )`, value: lastValue.ADR1, color: colorMap.ADR1 },
        { name: `ADR ( ${adrNum2} )`, value: lastValue.ADR2, color: colorMap.ADR2 },
        { name: `ADR ( ${adrNum3} )`, value: lastValue.ADR3, color: colorMap.ADR3 },
    ]
    const WillR_list = [
        { name: `W-R-1 ( ${williamsNum1} )`, value: lastValue.WillR1, color: colorMap.WillR1 },
        { name: `W-R-2 ( ${williamsNum2} )`, value: lastValue.WillR2, color: colorMap.WillR2 },
        { name: `W-R-3 ( ${williamsNum3} )`, value: lastValue.WillR3, color: colorMap.WillR3 },
        { name: `W-R-4 ( ${williamsNum4} )`, value: lastValue.WillR4, color: colorMap.WillR4 },
        { name: `W-R-5 ( ${williamsNum5} )`, value: lastValue.WillR5, color: colorMap.WillR5 },
    ]

    return (
        <Grid container spacing={1}>
            <Grid item xs={10.5}>
                <Box sx={{ position: 'absolute', transform: 'translate(41vw, 85px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1, width: '800px' }}>
                    <Grid container>
                        <Grid item xs={6} sx={{ fontWeight: 600, fontSize: '24px' }}>
                            {Vix.value ?
                                <Grid container>
                                    {Vix.net > 0 ?
                                        <>
                                            <span>Vix : </span>
                                            <span style={{ color: 'tomato' }}> {Vix.value} ( + {Vix.net} )</span>
                                        </>
                                        :
                                        <>
                                            <span>Vix : </span>
                                            <span style={{ color: 'deepskyblue' }}> {Vix.value} ( {Vix.net} )</span>
                                        </>

                                    }
                                </Grid>
                                : <Skeleton variant="rounded" height={20} animation="wave" />}

                            {Exchange.value ?
                                <Grid container>
                                    <span>KRX/USD : </span>
                                    {Exchange.comparison === '상승' ?
                                        <span style={{ color: 'tomato' }}> {Exchange.value} 원 ( + {Exchange.net} )</span> : Exchange.comparison === '하락' ?
                                            <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( - {Exchange.net} )</span> : <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( {Exchange.net} )</span>}
                                </Grid>
                                : <Skeleton variant="rounded" height={20} animation="wave" />}
                        </Grid>
                        <Grid item xs={6}>
                            <MarketCurrentValue MarketDetail={MarketDetail} />
                        </Grid>
                    </Grid>
                </Box>

                <IndexChart data={indexChartConfig} height={940} name={'Modeling'} rangeSelector={4} creditsPositionX={1} 상위컴포넌트로전달={getWilliamsValue} />

            </Grid>
            <Grid item xs={1.5} container sx={{ height: '940px' }}>
                <Grid item xs={12} container direction="column" justifyContent="flex-end" textAlign='start' >
                    {indicators.slice(0, 3).map(indicator => (
                        <Grid container spacing={1} key={indicator.name}>
                            <Grid item xs={5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', height: '100%', color: indicator.color, fontSize: '0.8rem' }}>
                                    {indicator.value}
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <StyledButton onClick={() => handleValueChange(indicator.name, "UP")}>UP</StyledButton>
                            </Grid>
                            <Grid item xs={3}>
                                <StyledButton onClick={() => handleValueChange(indicator.name, "DOWN")}>Down</StyledButton>
                            </Grid>
                        </Grid>
                    ))}
                    {ADR_list.map(item => (
                        <Grid container key={item.name}>
                            {item.value && item.value.length > 0 ?
                                <Typography sx={{ fontSize: '15px', color: item.color, mt: 1 }}>
                                    {item.name} : {item.value} %
                                </Typography>
                                : <Box>Loading</Box>
                            }
                        </Grid>
                    ))}
                    <Grid container sx={{ mb: '140px' }}></Grid>
                    {indicators.slice(3).map(indicator => (
                        <Grid container spacing={1} key={indicator.name}>
                            <Grid item xs={5.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', height: '100%', color: indicator.color, fontSize: '0.8rem' }}>
                                    {indicator.value}
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <StyledButton onClick={() => handleValueChange(indicator.name, "UP")}>UP</StyledButton>
                            </Grid>
                            <Grid item xs={3}>
                                <StyledButton onClick={() => handleValueChange(indicator.name, "DOWN")}>Down</StyledButton>
                            </Grid>
                        </Grid>
                    ))}

                    {WillR_list.map(item => (
                        <Grid container key={item.name}>
                            {item.value && item.value.length > 0 ?
                                <Typography key={item.name} sx={{ fontSize: '15px', color: item.color, mt: 1 }}>
                                    {item.name} : {item.value} %
                                </Typography>
                                : <Box>Loading</Box>
                            }
                        </Grid>
                    ))}

                    <Grid container sx={{ mb: '60px' }}></Grid>
                </Grid>

            </Grid>
        </Grid>
    )
}
