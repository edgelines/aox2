import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, ToggleButtonGroup } from '@mui/material';
import IndexChart from '../util/IndexChart.jsx';
import CoreChart from '../util/CoreChart.jsx';
import { StyledToggleButton } from '../util/util.jsx'
import MarketCurrentValue from '../Index/marketCurrentValue.jsx'
import { API, myJSON, API_FILE } from '../util/config.jsx';
export default function ELW_PutCallPage({ swiperRef, Vix, VixMA, Kospi200, Kospi, Kosdaq, Invers, IndexMA, MarketDetail }) {
    const [ElwPutCallRatioData, setElwPutCallRatioData] = useState(null);
    const [dayGr, setDayGr] = useState({ series: null, categories: null });
    const [ElwRatioData, setElwRatioData] = useState({ series: null, categories: null });
    const [mainData, setMainData] = useState('Kospi200');
    const [formats, setFormats] = useState(() => ['MA50']);

    const updateA = 'Start - 9:2, Update - 지수분봉'
    // const updateB = 'Updates-5m'
    // const updateC = 'Updates-2m'
    const updateD = 'Start - 9:20, Update - 5m'
    const updateE = 'Update - 1Day'

    const fetchData = async () => {
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
        await axios.get(`${API}/elwData/ElwPutCallRatioData`).then((response) => {
            setElwPutCallRatioData([{
                name: '1-day Put/Call %',
                data: response.data.Day1, type: 'spline', color: 'tomato', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '2-days Put/Call %',
                data: response.data.Day2, type: 'spline', color: 'gold', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '3-days Put/Call %',
                data: response.data.Day3, type: 'spline', color: 'forestgreen', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '4-days Put/Call %',
                data: response.data.Day4, type: 'spline', color: '#00F3FF', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '5-days Put/Call %',
                data: response.data.Day5, type: 'spline', color: 'dodgerblue', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '20-days Put/Call %',
                data: response.data.Day20, type: 'spline', color: 'violet', dashStyle: 'Dash', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '100-days Put/Call %',
                data: response.data.Day100, type: 'spline', color: '#efe9e9ed', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }])
        });

    }
    const handleFormat = (event, newFormats) => { setFormats(newFormats); };
    const handleMainData = (event, newAlignment) => { setMainData(newAlignment); };

    useEffect(() => { fetchData(); }, [])

    // 5분 주기 업데이트
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
    let chartData;
    switch (mainData) {
        case 'Kospi200':
            chartData = Kospi200;
            break;
        case 'Kospi':
            chartData = Kospi;
            break;
        case 'Kosdaq':
            chartData = Kosdaq;
            break;
        case 'Invers':
            chartData = Invers;
            break;
        default:
            chartData = Kospi200;
    }

    // formats에 따른 데이터 변형 로직
    if (formats.includes('MA50')) {
        chartData = [...chartData, ...IndexMA.MA50]
    }

    if (formats.includes('MA112')) {
        chartData = [...chartData, ...IndexMA.MA112]
    }

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} >
                <Grid container spacing={1} >
                    <Grid item xs={5} >
                        <IndexChart data={ElwPutCallRatioData} height={343} name={'ElwPutCallRatioData'} hidenLegend={true} rangeSelector={0} credit={updateD} />
                    </Grid>
                    <Grid item xs={3.5} >
                        <CoreChart data={dayGr.series} height={343} name={'dayGr'} categories={dayGr.categories} credit={updateD} creditsPositionY={66} />
                    </Grid>
                    <Grid item xs={3.5} >
                        <CoreChart data={ElwRatioData.series} height={343} name={'ElwRatioData'} categories={ElwRatioData.categories} type={'column'} credit={updateD} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} >
                <Grid container>
                    <Grid item xs={5.6}>
                        <div style={{ fontSize: '4em', position: 'absolute', transform: 'translate(1.5vw, 9vh)', backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2 }}> VIX :
                            {Vix.net > 0 ?
                                <span style={{ color: 'tomato' }}> {`${Vix.value} ( + ${Vix.net} )`} </span> :
                                <span style={{ color: 'deepskyblue' }}> {`${Vix.value} ( ${Vix.net} )`} </span>
                            }
                        </div>
                        <Box sx={{ position: 'absolute', transform: 'translate(27vw, 9vh)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1 }}>
                            <MarketCurrentValue MarketDetail={MarketDetail} />
                        </Box>

                        <IndexChart data={VixMA} height={580} name={'VixMA'} rangeSelector={0} credit={updateE} />

                    </Grid>
                    <Grid item xs={0.4}>
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
                        <Box>
                            <ToggleButtonGroup
                                value={formats}
                                onChange={handleFormat}
                                orientation="vertical"
                                aria-label="text formatting"
                            >
                                <StyledToggleButton aria-label="MA50" value="MA50">MA50</StyledToggleButton>
                                <StyledToggleButton aria-label="MA112" value="MA112">MA112</StyledToggleButton>
                                {/* <StyledToggleButton aria-label="ADR" value="ADR">ADR</StyledToggleButton> */}
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>

                        <IndexChart data={chartData} height={580} name={'IndexMA'} rangeSelector={2} xAxisType={'datetime'} credit={updateA} creditsPositionX={1} />

                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    )
}
