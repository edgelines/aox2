import React, { useEffect, useState, useMemo } from 'react';
import { Grid, Box, Typography, Skeleton, ToggleButtonGroup } from '@mui/material';
import IndexChart from './util/IndexChart';
import { StyledButton, StyledToggleButton } from './util/util';
import MarketCurrentValue from './Index/marketCurrentValue.jsx'
import IndicesChart from './Modeling/IndicesChart';
import { API_WS, useIsMobile } from './util/config';

export default function ModelingPage({ }) {
    const isMobile = useIsMobile();
    const [Vix, setVix] = useState([]);
    const [Exchange, setExchange] = useState([]);
    const [MarketDetail, setMarketDetail] = useState([]);

    // Charts State
    const [gisu, setGisu] = useState([]);
    const [indexChartConfig, setIndexChartConfig] = useState({});

    // Indicator Params State
    const [lastValue, setLastValue] = useState({ ADR1: '', ADR2: '', ADR3: '', WillR1: '', WillR2: '', WillR3: '', WillR4: '', WillR5: '' })
    const [adrNum1, setAdrNum1] = useState(7);
    const [adrNum2, setAdrNum2] = useState(14);
    const [adrNum3, setAdrNum3] = useState(20);

    const [williamsNum1, setWilliamsNum1] = useState(5);
    const [williamsNum2, setWilliamsNum2] = useState(7);
    const [williamsNum3, setWilliamsNum3] = useState(14);
    const [williamsNum4, setWilliamsNum4] = useState(24);
    const [williamsNum5, setWilliamsNum5] = useState(44);

    const [formats, setFormats] = useState(() => ['MA50']);
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


    useEffect(() => {
        const indicatorParams = {
            ADR1_num: adrNum1,
            ADR2_num: adrNum2,
            ADR3_num: adrNum3,
            WillR1_num: williamsNum1,
            WillR2_num: williamsNum2,
            WillR3_num: williamsNum3,
            WillR4_num: williamsNum4,
            WillR5_num: williamsNum5,
        }
        const ws = new WebSocket(`${API_WS}/modelingPage/${indexName}/${formats}`);

        ws.onopen = () => {
            ws.send(JSON.stringify({
                indicatorParams: indicatorParams
            }));
            console.log('modelingPage WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data)
            setVix(res.Vix);
            setExchange(res.Exchange);
            setMarketDetail(res.MarketDetail);
            setGisu(res.Gisu);
            setIndexChartConfig(res.ADR_WillR);
            // setLastValue(res.LastValue);
            // lastValue 업데이트 전에 데이터 검증
            if (res.LastValue && typeof res.LastValue === 'object') {
                setLastValue(prevState => ({
                    ...prevState,
                    ...res.LastValue
                }));
            }
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
    }, [indexName, formats, adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5]); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함


    const indicators = useMemo(() => [
        { name: `ADR1`, value: `ADR ( ${adrNum1} )`, color: colorMap.ADR1 },
        { name: `ADR2`, value: `ADR ( ${adrNum2} )`, color: colorMap.ADR2 },
        { name: `ADR3`, value: `ADR ( ${adrNum3} )`, color: colorMap.ADR3 },
        { name: `WillamsR1`, value: `W-R-1 ( ${williamsNum1} )`, color: colorMap.WillR1 },
        { name: `WillamsR2`, value: `W-R-2 ( ${williamsNum2} )`, color: colorMap.WillR2 },
        { name: `WillamsR3`, value: `W-R-3 ( ${williamsNum3} )`, color: colorMap.WillR3 },
        { name: `WillamsR4`, value: `W-R-4 ( ${williamsNum4} )`, color: colorMap.WillR4 },
        { name: `WillamsR5`, value: `W-R-5 ( ${williamsNum5} )`, color: colorMap.WillR5 }
    ], [adrNum1, adrNum2, adrNum3, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5])
    const ADR_list = useMemo(() => [
        { name: `ADR ( ${adrNum1} )`, value: lastValue.ADR1, color: colorMap.ADR1 },
        { name: `ADR ( ${adrNum2} )`, value: lastValue.ADR2, color: colorMap.ADR2 },
        { name: `ADR ( ${adrNum3} )`, value: lastValue.ADR3, color: colorMap.ADR3 },
    ], [lastValue, adrNum1, adrNum2, adrNum3])
    const WillR_list = useMemo(() => [
        { name: `W-R-1 ( ${williamsNum1} )`, value: lastValue.WillR1, color: colorMap.WillR1 },
        { name: `W-R-2 ( ${williamsNum2} )`, value: lastValue.WillR2, color: colorMap.WillR2 },
        { name: `W-R-3 ( ${williamsNum3} )`, value: lastValue.WillR3, color: colorMap.WillR3 },
        { name: `W-R-4 ( ${williamsNum4} )`, value: lastValue.WillR4, color: colorMap.WillR4 },
        { name: `W-R-5 ( ${williamsNum5} )`, value: lastValue.WillR5, color: colorMap.WillR5 },
    ], [lastValue, williamsNum1, williamsNum2, williamsNum3, williamsNum4, williamsNum5])

    return (
        <Grid container spacing={1}>
            {/* Chart */}
            <Grid item xs={isMobile ? 12 : 5}>
                <IndexChart data={indexChartConfig} height={isMobile ? 500 : 940} name={'Modeling'} rangeSelector={1} creditsPositionX={1} />
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

                            {ADR_list.map((item, index) => (
                                <Grid container key={index}>
                                    {item.value !== undefined && (
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: item.color,
                                                mt: 1,
                                                width: '100%'  // 너비 100%로 설정
                                            }}
                                        >
                                            {`${item.name} : ${item.value} %`}
                                        </Typography>
                                    )}
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

                            {WillR_list.map((item, index) => (
                                <Grid container key={index}>
                                    {item.value !== undefined && (
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: item.color,
                                                mt: 1,
                                                width: '100%'  // 너비 100%로 설정
                                            }}
                                        >
                                            {`${item.name} : ${item.value} %`}
                                        </Typography>
                                    )}
                                </Grid>
                            ))}

                            <Grid container sx={{ mb: '60px' }}></Grid>
                        </Grid>

                    </Grid>
            }


            {/* Index */}
            <Grid item xs={isMobile ? 12 : 5.5}>
                <IndicesChart data={gisu} height={isMobile ? 500 : 940} rangeSelector={2} />
            </Grid>
        </Grid>
    )
}
