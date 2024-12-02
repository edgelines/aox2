import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, Skeleton, ToggleButtonGroup } from '@mui/material';
import IndexChart from './util/IndexChart';
import { StyledButton, StyledToggleButton } from './util/util';
import MarketCurrentValue from './Index/marketCurrentValue.jsx'
import { API, API_WS, markerConfig, useIsMobile } from './util/config';

export default function ModelingPage({ }) {
    const isMobile = useIsMobile();
    const [Vix, setVix] = useState([]);
    const [Exchange, setExchange] = useState([]);
    const [MarketDetail, setMarketDetail] = useState([]);

    const [lastValue, setLastValue] = useState({ ADR1: '', ADR2: '', ADR3: '', WillR1: '', WillR2: '', WillR3: '', WillR4: '', WillR5: '' })
    const [adrNum1, setAdrNum1] = useState(7);
    const [adrNum2, setAdrNum2] = useState(14);
    const [adrNum3, setAdrNum3] = useState(20);

    const [williamsNum1, setWilliamsNum1] = useState(5);
    const [williamsNum2, setWilliamsNum2] = useState(7);
    const [williamsNum3, setWilliamsNum3] = useState(14);
    const [williamsNum4, setWilliamsNum4] = useState(24);
    const [williamsNum5, setWilliamsNum5] = useState(44);

    const [indexChartConfig, setIndexChartConfig] = useState({});
    const [formats, setFormats] = useState(() => ['MA50']);
    const [chartData, setChartData] = useState([]);

    const [indexName, setIndexName] = useState('Kospi200')
    const handlePage = (event, value) => { if (value !== null) { setIndexName(value); } }
    const handleFormat = (event, newFormats) => { if (newFormats !== null) { setFormats(newFormats); } };

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
        WillR5: 'white',
    };
    const getIndexData = async (name) => { return await axios.get(`${API}/modeling/${name}`); }
    const getADR = async (num, Name, indexName) => {
        const res = await axios.get(`${API}/modeling/adr?num=${num}&dbName=Market${indexName}`);
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
    const getWillR = async (num, Name, indexName) => {
        const res = await axios.get(`${API}/modeling/willr?num=${num}&dbName=${indexName}`);
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
            lineWidth: Name === 'WillR5' ? 1.5 : 1,
            marker: markerConfig, showInLegend: true,
        };
    }
    // Fetch Data
    const fetchData = async (adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5, indexName) => {
        const indexData = [];
        indexData.push(getIndexData(indexName))
        const res = await Promise.all(indexData);

        // Promise 객체를 사용하여 모든 데이터 수집을 기다림
        const promises = [];
        promises.push(getADR(adrNum1, 'ADR1', indexName));
        promises.push(getADR(adrNum2, 'ADR2', indexName));
        promises.push(getADR(adrNum3, 'ADR3', indexName));
        promises.push(getWillR(williamsNum1, 'WillR1', indexName));
        promises.push(getWillR(williamsNum2, 'WillR2', indexName));
        promises.push(getWillR(williamsNum3, 'WillR3', indexName));
        promises.push(getWillR(williamsNum4, 'WillR4', indexName));
        promises.push(getWillR(williamsNum5, 'WillR5', indexName));

        const updatedData = await Promise.all(promises);
        // Kospi200 데이터와 업데이트된 ADR 데이터를 병합

        let newIndexChartConfig = [
            {
                name: indexName, id: 'candlestick',
                type: 'candlestick', yAxis: 0, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false,
                data: res[0].data, isCandle: true
            },
            ...updatedData,
        ];

        setIndexChartConfig(newIndexChartConfig);
    };

    useEffect(() => {
        fetchData(adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5, indexName);
    }, [indexName, adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5])

    const createEMAConfig = ({ color, dashStyle = 'solid', name, lineWidth = 1, period, visible = true }) => ({
        type: 'ema',
        animation: false,
        yAxis: 1,
        linkedTo: 'candlestick',
        marker: { enabled: false, states: { hover: { enabled: false } } },
        showInLegend: true,
        visible,
        color,
        dashStyle,
        name,
        lineWidth,
        params: { index: 2, period }, // 시가, 고가, 저가, 종가의 배열 순서를 찾음
    });

    const getData = async (props) => {
        const res = await axios.get(`${API}/indices/${props}`);
        return [
            {
                name: props, id: 'candlestick', isCandle: true,
                data: res.data, type: 'candlestick', yAxis: 1, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
            },
            createEMAConfig({ color: '#efe9e9ed', dashStyle: 'shortdash', name: '3 저지', period: 3 }),
            createEMAConfig({ color: 'coral', dashStyle: 'shortdash', name: '9', period: 9, visible: false }),
            createEMAConfig({ color: 'dodgerblue', name: '18', period: 18 }),
            createEMAConfig({ color: 'skyblue', dashStyle: 'shortdash', name: '27', period: 27, visible: false }),
            createEMAConfig({ color: 'mediumseagreen', dashStyle: 'shortdash', name: '36', period: 36 }),
            createEMAConfig({ color: 'red', dashStyle: 'shortdash', name: '66', period: 66 }),
            createEMAConfig({ color: "orange", name: '112', lineWidth: 2, period: 112 }),
            createEMAConfig({ color: "forestgreen", name: '224', lineWidth: 2, period: 224 }),
            createEMAConfig({ color: "pink", name: '336', lineWidth: 2, period: 336 }),
            createEMAConfig({ color: "magenta", name: '448', lineWidth: 2, period: 448 }),
            createEMAConfig({ color: "skyblue", name: '560', lineWidth: 2, period: 560 }),
        ]

    }

    const getIndexMA = async () => {
        const res = await axios.get(`${API}/indices/IndexMA`);

        const MA50 = [{
            name: '코스피 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kospi_MA50, type: 'spline', color: 'tomato', yAxis: 0, zIndex: 3, lineWidth: 1
        }, {
            name: '코스닥 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kosdaq_MA50, type: 'spline', color: 'dodgerblue', yAxis: 0, zIndex: 3, lineWidth: 1
        }, {
            name: '코스피200 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kospi200_MA50, type: 'spline', color: 'gold', yAxis: 0, zIndex: 3, lineWidth: 1
        }]
        const MA112 = [{
            name: '코스피 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kospi_MA112, type: 'spline', color: 'magenta', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
        }, {
            name: '코스닥 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kosdaq_MA112, type: 'spline', color: 'greenyellow', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
        }, {
            name: '코스피200 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
            data: res.data.Kospi200_MA112, type: 'spline', color: '#efe9e9ed', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
        }]
        return { MA50: MA50, MA112: MA112 }
        // setIndexMA({ MA50: MA50, MA112: MA112 })
    }


    const fetchData_MA50_MA112 = async () => {
        try {
            let data = await getData(indexName);
            let IndexMA = await getIndexMA();
            // formats에 따른 데이터 변형 로직
            if (formats.includes('MA50')) {
                data = [...data, ...IndexMA.MA50]
            }

            if (formats.includes('MA112')) {
                data = [...data, ...IndexMA.MA112]
            }
            setChartData(data);
        } catch (err) {
            console.error('fetchData_2 오류', err)
        }
    }
    useEffect(() => {
        fetchData_MA50_MA112();
    }, [indexName, formats])
    // 60초 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 이전이라면, 9시까지 남은 시간 계산
        let delay;
        if (hour < 9) {
            delay = ((9 - hour - 1) * 60 + (60 - minutes)) * 60 + (60 - seconds);
        } else {
            // 이미 9시 정각 이후라면, 다음 분 시작까지 대기
            delay = 60 - seconds;
        }

        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5, indexName);
                    fetchData_MA50_MA112();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            // fetchData();
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [])

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/modelingPage`);

        ws.onopen = () => {
            console.log('modelingPage WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data)
            setVix(res.Vix);
            setExchange(res.Exchange);
            setMarketDetail(res.MarketDetail);
        };

        ws.onerror = (error) => {
            console.error('modelingPage WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('modelingPage WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함


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
            {/* Chart */}
            <Grid item xs={isMobile ? 12 : 5}>
                <IndexChart data={indexChartConfig} height={940} name={'Modeling'} rangeSelector={1} creditsPositionX={1} />
            </Grid>

            {/* Config, Indicators, Infomation */}
            {
                isMobile ? <></> :
                    <Grid item xs={1.5} container sx={{ height: '940px' }}>
                        <Grid item xs={12} container direction="column" justifyContent="flex-end" textAlign='start' >
                            <Grid container>
                                <MarketCurrentValue MarketDetail={MarketDetail} valueFont={'15px'} valueTitle={'15px'} />
                                <Grid item sx={{ fontWeight: 600, fontSize: '15px' }}>
                                    {Vix.value ?
                                        <Grid container sx={{ mb: 0.4 }}>
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
                            </Grid>

                            <Grid container sx={{ mb: '50px' }}></Grid>
                            <ToggleButtonGroup
                                color='info'
                                exclusive
                                size="small"
                                value={indexName}
                                onChange={handlePage}
                            >
                                <StyledToggleButton fontSize={'12px'} value="Kospi200">Kospi200</StyledToggleButton>
                                <StyledToggleButton fontSize={'12px'} value="Kospi">Kospi</StyledToggleButton>
                                <StyledToggleButton fontSize={'12px'} value="Kosdaq">Kosdaq</StyledToggleButton>
                            </ToggleButtonGroup>

                            <ToggleButtonGroup
                                value={formats}
                                onChange={handleFormat}
                            >
                                <StyledToggleButton fontSize={'12px'} aria-label="MA50" value="MA50">MA50</StyledToggleButton>
                                <StyledToggleButton fontSize={'12px'} aria-label="MA112" value="MA112">MA112</StyledToggleButton>
                            </ToggleButtonGroup>

                            <Grid container sx={{ mb: '50px' }}></Grid>
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

                            <Grid container sx={{ mb: '50px' }}></Grid>

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
            }

            {/* Btn */}
            {/* <Grid item xs={0.5}>
                <Box>
                    <ToggleButtonGroup
                        value={mainData}
                        exclusive
                        onChange={handleMainData}
                        orientation="vertical"
                        aria-label="text alignment"
                    >
                        <StyledToggleButton aria-label="Kospi200" value="Kospi200">코스피200</StyledToggleButton>
                        <StyledToggleButton aria-label="Kospi" value="Kospi">코스피</StyledToggleButton>
                        <StyledToggleButton aria-label="Kosdaq" value="Kosdaq">코스닥</StyledToggleButton>
                        <StyledToggleButton aria-label="Invers" value="Invers">인버스</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>

            </Grid> */}
            {/* Index */}
            <Grid item xs={isMobile ? 12 : 5.5}>
                <IndexChart data={chartData} height={940} name={'IndexMA'} rangeSelector={2} xAxisType={'datetime'} creditsPositionX={1} />
            </Grid>
        </Grid>
    )
}
