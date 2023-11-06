import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import IndexChart from './util/IndexChart';
import { StyledButton } from './util/util';
import MarketCurrentValue from './Index/marketCurrentValue.jsx'
// import { customRsi, williamsR } from 'indicatorts';
import { API } from './util/config';

export default function ModelingPage({ swiperRef, Vix, Exchange, MarketDetail }) {

    const [kospi200, setKospi200] = useState([]);
    const [rawKospi200, setRawKospi200] = useState([]);
    const [adrRaw, setAdrRaw] = useState([]);

    const [adrLastValue1, setAdrLastValue1] = useState(null);
    const [adrLastValue2, setAdrLastValue2] = useState(null);
    const [adrLastValue3, setAdrLastValue3] = useState(null);

    const [adrNum1, setAdrNum1] = useState(7);
    const [adrNum2, setAdrNum2] = useState(14);
    const [adrNum3, setAdrNum3] = useState(20);

    const [williamsNum, setWilliamsNum] = useState(5);
    const [williamsNum2, setWilliamsNum2] = useState(7);
    const [williamsNum3, setWilliamsNum3] = useState(14);
    const [williamsValue, setWilliamsValue] = useState([]);
    // const [rsiNum, setRsiNum] = useState(14);
    // const [dmiNum, setDmiNum] = useState(14);

    const getWilliamsValue = (item) => { setWilliamsValue(item) };
    const handleValueChange = (type, direction) => {
        if (type === "ADR1") {
            if (direction === "UP" && adrNum1 < 40) {
                setAdrNum1(prev => prev + 1);
            } else if (direction === "DOWN" && adrNum1 > 1) {
                setAdrNum1(prev => prev - 1);
            }
        } else if (type === "ADR2") {
            if (direction === "UP" && adrNum2 < 40) {
                setAdrNum2(prev => prev + 1);
            } else if (direction === "DOWN" && adrNum2 > 1) {
                setAdrNum2(prev => prev - 1);
            }
        } else if (type === "ADR3") {
            if (direction === "UP" && adrNum3 < 40) {
                setAdrNum3(prev => prev + 1);
            } else if (direction === "DOWN" && adrNum3 > 1) {
                setAdrNum3(prev => prev - 1);
            }
            // } else if (type === "RSI") {
            //     if (direction === "UP" && rsiNum < 40) {
            //         setRsiNum(prev => prev + 1);
            //     } else if (direction === "DOWN" && rsiNum > 1) {
            //         setRsiNum(prev => prev - 1);
            //     }
        } else if (type === "WillamsR") {
            if (direction === "UP" && williamsNum < 80) {
                setWilliamsNum(prev => prev + 1);
            } else if (direction === "DOWN" && williamsNum > 1) {
                setWilliamsNum(prev => prev - 1);
            }
        } else if (type === "WillamsR2") {
            if (direction === "UP" && williamsNum < 80) {
                setWilliamsNum2(prev => prev + 1);
            } else if (direction === "DOWN" && williamsNum > 1) {
                setWilliamsNum2(prev => prev - 1);
            }
        } else if (type === "WillamsR3") {
            if (direction === "UP" && williamsNum < 80) {
                setWilliamsNum3(prev => prev + 1);
            } else if (direction === "DOWN" && williamsNum > 1) {
                setWilliamsNum3(prev => prev - 1);
            }
        }
    };

    const getRollingADR = (data, adrNum, Name) => {
        const adrValues = rolling_adr(data, adrNum);
        const ADR = data.map((data, index) => {
            const timestamp = new Date(data.날짜).getTime();
            return [timestamp, adrValues[index]]
        });

        const colorMap = {
            ADR1: 'silver',
            ADR2: 'orange',
            ADR3: 'greenyellow',
        };

        const lastValueSetters = {
            ADR1: setAdrLastValue1,
            ADR2: setAdrLastValue2,
            ADR3: setAdrLastValue3,
        };

        if (ADR.length > 0) {
            const lastValue = ADR.slice(-1)[0][1].toFixed(2);
            lastValueSetters[Name](lastValue);
        }

        return {
            name: Name,
            isADR: true,
            id: Name,
            data: ADR,
            type: 'spline',
            color: colorMap[Name],
            yAxis: 2,
            zIndex: 3,
            dashStyle: 'ShortDash',
            lineWidth: 1
        };

    }
    // ADR
    const getADR = (df, num) => {
        const advance = df.slice(-num).reduce((acc, curr) => acc + curr['상승'], 0);
        const decline = df.slice(-num).reduce((acc, curr) => acc + curr['total'], 0) - advance;
        return (advance / decline) * 100;
    }
    const rolling_adr = (df, num) => {
        const adr_values = [];
        for (let i = 0; i < df.length; i++) {
            const subset = df.slice(Math.max(0, i - num + 1), i + 1);
            const adr_value = getADR(subset, num);
            adr_values.push(adr_value);
        }
        return adr_values;
    }


    // Fetch Data
    const fetchData = async () => {
        const res = await axios.get(`${API}/ALL/Kospi200`);
        const Kospi200Cendle = res.data.slice(-1500)
        const Kospi200 = [], date = [], highs = [], lows = [], closings = [];
        Kospi200Cendle.forEach((value) => {
            Kospi200.push([new Date(value.날짜).getTime(), value.시가, value.고가, value.저가, value.종가]);
        });
        setRawKospi200(Kospi200);

        const res2r = await axios.get(`${API}/ALL/MarketKospi200`)
        const res2 = res2r.data.slice(-1500);
        setAdrRaw(res2);

        const adr1 = getRollingADR(res2, adrNum1, 'ADR1');
        const adr2 = getRollingADR(res2, adrNum2, 'ADR2');
        const adr3 = getRollingADR(res2, adrNum3, 'ADR3');

        const newKospi200 = [{
            name: '코스피200', id: 'candlestick',
            data: Kospi200, type: 'candlestick', yAxis: 0, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false,
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'tomato',
            dashStyle: 'shortdash',
            name: 'W-R-1', id: 'williamsr',
            lineWidth: 1,
            params: { index: 3, period: williamsNum }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'dodgerblue',
            dashStyle: 'shortdash',
            name: 'W-R-2', id: 'williamsr2',
            lineWidth: 1,
            params: { index: 3, period: williamsNum2 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'gold',
            dashStyle: 'shortdash',
            name: 'W-R-3', id: 'williamsr3',
            lineWidth: 1,
            params: { index: 3, period: williamsNum3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        },
            adr1, adr2, adr3
        ];
        setKospi200(newKospi200);
    }

    useEffect(() => { fetchData(); }, [])
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
    useEffect(() => {
        const adr1Data = getRollingADR(adrRaw, adrNum1, 'ADR1');
        const adr2Data = getRollingADR(adrRaw, adrNum2, 'ADR2');
        const adr3Data = getRollingADR(adrRaw, adrNum3, 'ADR3');

        const newKospi200 = [{
            name: '코스피200', id: 'candlestick', isCandle: true,
            data: rawKospi200, type: 'candlestick', yAxis: 0, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'tomato',
            dashStyle: 'shortdash',
            name: 'Williams-R-1', id: 'williamsr',
            lineWidth: 1,
            params: { index: 3, period: williamsNum }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'dodgerblue',
            dashStyle: 'shortdash',
            name: 'Williams-R-2', id: 'williamsr2',
            lineWidth: 1,
            params: { index: 3, period: williamsNum2 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'williamsr', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
            color: 'gold',
            dashStyle: 'shortdash',
            name: 'Williams-R-3', id: 'williamsr3',
            lineWidth: 1,
            params: { index: 3, period: williamsNum3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, adr1Data, adr2Data, adr3Data
        ];
        setKospi200(newKospi200);
    }, [adrRaw, adrNum1, adrNum2, adrNum3, williamsNum, williamsNum2, williamsNum3])

    const indicators = [
        { name: `ADR1`, value: `ADR ( ${adrNum1} )`, color: "silver" },
        { name: `ADR2`, value: `ADR ( ${adrNum2} )`, color: "orange" },
        { name: `ADR3`, value: `ADR ( ${adrNum3} )`, color: "greenyellow" },
        { name: `WillamsR`, value: `W-R-1 ( ${williamsNum} )`, color: "tomato" },
        { name: `WillamsR2`, value: `W-R-2 ( ${williamsNum2} )`, color: "dodgerblue" },
        { name: `WillamsR3`, value: `W-R-3 ( ${williamsNum3} )`, color: "gold" }
    ]
    const ADR_list = [
        { name: `ADR ( ${adrNum1} )`, value: adrLastValue1, color: "silver" },
        { name: `ADR ( ${adrNum2} )`, value: adrLastValue2, color: "orange" },
        { name: `ADR ( ${adrNum3} )`, value: adrLastValue3, color: "greenyellow" },
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

                <IndexChart data={kospi200} height={940} name={'Modeling'} rangeSelector={4} creditsPositionX={1} 상위컴포넌트로전달={getWilliamsValue} />

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
                    {indicators.slice(3, 6).map(indicator => (
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
                    {williamsValue && williamsValue.length > 0 ?
                        williamsValue.map(item => (
                            <Typography key={item.name} sx={{ fontSize: '15px', color: item.color, mt: 1 }}>
                                {item.name} : {item.value} %
                            </Typography>
                        )) :
                        <Box>Loading</Box>
                    }
                    <Grid container sx={{ mb: '60px' }}></Grid>
                </Grid>

            </Grid>
        </Grid>
    )
}
