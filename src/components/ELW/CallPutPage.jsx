import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, ToggleButtonGroup } from '@mui/material';
import IndexChart from '../util/IndexChart.jsx';
import CoreChart from '../util/CoreChart.jsx';
import { StyledToggleButton } from '../util/util.jsx'
import MarketCurrentValue from '../Index/marketCurrentValue.jsx'
import { API, JSON } from '../util/config.jsx';
export default function ELW_PutCallPage({ swiperRef, Vix, VixMA, Kospi200, Kospi, Kosdaq, Invers, IndexMA, MarketKospi200, MarketDetail }) {
    const [ElwPutCallRatioData, setElwPutCallRatioData] = useState(null);
    const [dayGr, setDayGr] = useState({ series: null, categories: null });
    const [ElwRatioData, setElwRatioData] = useState({ series: null, categories: null });
    const [mainData, setMainData] = useState('Kospi200');
    const [formats, setFormats] = useState(() => ['MA50']);
    const [adrNum, setAdrNum] = useState(20);
    // const [adrRaw, setAdrRaw] = useState([]);
    const [adrData, setAdrData] = useState([]);
    const updateA = 'Start - 9:2, Update - 지수분봉'
    // const updateB = 'Updates-5m'
    // const updateC = 'Updates-2m'
    const updateD = 'Start - 9:20, Update - 5m'
    const updateE = 'Update - 1Day'

    const fetchData = async () => {
        await axios.get(API + "/DayGr").then((response) => {
            var data = response.data, Day = [], data1 = [], data2 = [], data3 = [], data4 = [];
            data.forEach((value, index, array) => {
                if (value.권리유형 == '콜1') { data1.push(parseInt(value.거래대금)); }
                if (value.권리유형 == '콜2') { data2.push(parseInt(value.거래대금)); }
                if (value.권리유형 == '풋1') { data3.push(parseInt(value.거래대금)); }
                if (value.권리유형 == '풋2') { data4.push(parseInt(value.거래대금)); }
                if (index % 4 === 0) {
                    let nextValue = array[index + 1]; // Get the next value
                    Day.push(value.날짜.substr(4, 2) + '.' + value.날짜.substr(6, 2) + '.<br>' + value.영업일 + '일<br>' + nextValue.영업일 + '일');
                }
            });
            var 잔존만기1 = data[data.length - 2].잔존만기, 잔존만기2 = data[data.length - 1].잔존만기
            var callName1 = " (<span style='color:greenyellow;'>" + String(parseInt(data[data.length - 4].거래대금 / 100000000).toLocaleString('ko-KR')).padStart(4, " ") + "</span> 억 ) [ 영업 : " + data[data.length - 2].영업일 + ' ]';
            var callName2 = " (<span style='color:greenyellow;'>" + String(parseInt(data[data.length - 3].거래대금 / 100000000).toLocaleString('ko-KR')).padStart(4, " ") + "</span> 억 ) [ 영업 : " + data[data.length - 1].영업일 + ' ]';
            var putName1 = " (<span style='color:greenyellow;'>" + String(parseInt(data[data.length - 2].거래대금 / 100000000).toLocaleString('ko-KR')).padStart(4, " ") + "</span> 억 ) [ 영업 : " + data[data.length - 2].영업일 + ' ]';
            var putName2 = " (<span style='color:greenyellow;'>" + String(parseInt(data[data.length - 1].거래대금 / 100000000).toLocaleString('ko-KR')).padStart(4, " ") + "</span> 억 ) [ 영업 : " + data[data.length - 1].영업일 + ' ]';
            setDayGr({
                series: [{
                    name: 'Call 잔존 : ' + 잔존만기1 + callName1,
                    data: data1,
                    color: '#FCAB2F',
                    yAxis: 0
                }, {
                    name: 'Put 잔존 : ' + 잔존만기1 + putName1,
                    data: data3,
                    color: '#00F3FF',
                    yAxis: 0
                }, {
                    name: 'Call 잔존 : ' + 잔존만기2 + callName2,
                    data: data2,
                    color: 'tomato',
                }, {
                    name: 'Put 잔존 : ' + 잔존만기2 + putName2,
                    data: data4,
                    color: 'dodgerblue',
                }], categories: Day
            })
        })
        await axios.get(JSON + "/ElwRatioData").then((response) => {
            var data1 = [], data2 = [], category = []
            response.data.forEach((value, index, array) => {
                var 콜비율 = parseFloat((value.콜_거래대금 / (value.콜_거래대금 + value.풋_거래대금) * 100).toFixed(2))
                var 풋비율 = parseFloat((value.풋_거래대금 / (value.콜_거래대금 + value.풋_거래대금) * 100).toFixed(2))
                data1.push(콜비율);
                data2.push(풋비율);
                category.push(value['날짜'].slice(4, 6) + '.' + value['날짜'].slice(6, 8) + '<br><span style="color:#FCAB2F">' + 콜비율 + ' %</span><br><span style="color:#00F3FF">' + 풋비율 + ' %</span>');
            })
            setElwRatioData({
                series: [
                    {
                        name: '콜',
                        color: '#FCAB2F',
                        pointPlacement: -0.08,
                        pointWidth: 20, //bar 너비 지정.
                        grouping: false,
                        data: data1
                    }, {
                        name: '풋',
                        color: '#00A7B3',
                        pointPlacement: 0.08,
                        pointWidth: 20, //bar 너비 지정.
                        grouping: false,
                        data: data2
                    }],
                categories: category
            })
        });
        await axios.get(JSON + "/ElwPutCallRatioData").then((response) => {
            var Day1 = [], Day2 = [], Day3 = [], Day4 = [], Day5 = [], Day20 = [], Day100 = []
            response.data.forEach((value, index, array) => {
                Day1.push([value.날짜, (value.풋_거래대금 / value.콜_거래대금)]);
                Day2.push([value.날짜, value.비율_2일]);
                Day3.push([value.날짜, value.비율_3일]);
                Day4.push([value.날짜, value.비율_4일]);
                Day5.push([value.날짜, value.비율_5일]);
                Day20.push([value.날짜, value.비율_20일]);
                Day100.push([value.날짜, value.비율_100일]);
            })
            setElwPutCallRatioData([{
                name: '1-day Put/Call %',
                data: Day1, type: 'spline', color: 'tomato', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '2-days Put/Call %',
                data: Day2, type: 'spline', color: 'gold', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '3-days Put/Call %',
                data: Day3, type: 'spline', color: 'forestgreen', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '4-days Put/Call %',
                data: Day4, type: 'spline', color: '#00F3FF', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '5-days Put/Call %',
                data: Day5, type: 'spline', color: 'dodgerblue', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '20-days Put/Call %',
                data: Day20, type: 'spline', color: 'violet', dashStyle: 'Dash', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }, {
                name: '100-days Put/Call %',
                data: Day100, type: 'spline', color: '#efe9e9ed', yAxis: 0, animation: false, zIndex: 3, lineWidth: 1
            }])

        });
        if (MarketKospi200 && MarketKospi200.length > 0) {
            // console.log(MarketKospi200);
            getRollingADR(MarketKospi200)
        }
    }
    const handleFormat = (event, newFormats) => { setFormats(newFormats); };
    const handleMainData = (event, newAlignment) => { setMainData(newAlignment); };
    const handleAdrNumUp = () => { if (adrNum < 40) { setAdrNum(prev => prev + 1); } };
    const handleAdrNumDown = () => { if (adrNum > 1) { setAdrNum(prev => prev - 1); } };
    const getRollingADR = (data) => {
        const adrValues = rolling_adr(data, adrNum);
        const ADR = data.map((data, index) => {
            // const formattedDate = `${data.날짜.slice(0, 4)}-${data.날짜.slice(4, 6)}-${data.날짜.slice(6, 8)}`;
            const timestamp = new Date(data.날짜).getTime();
            return [timestamp, adrValues[index]]
        });
        const result = [{
            name: '코스피200 ADR', isADR: true,
            data: ADR, type: 'spline', color: 'magenta', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
        }]
        setAdrData(result);
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
    useEffect(() => { fetchData(); getRollingADR(MarketKospi200.data); }, [])

    // 2분 주기 업데이트
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
    useEffect(() => {
        getRollingADR(MarketKospi200.data);
    }, [adrNum])
    // formats에 따른 데이터 변형 로직
    if (formats.includes('MA50')) {
        chartData = [...chartData, ...IndexMA.MA50]
    }

    if (formats.includes('MA112')) {
        chartData = [...chartData, ...IndexMA.MA112]
    }
    // if (formats.includes('ADR')) {
    //     // ADR에 따른 데이터 변형 로직
    //     chartData = [...chartData, ...adrData]
    // }
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
                        {/* <Box sx={{ height: '10vh', mt: 3 }}>
                            <StyledButton onClick={handleAdrNumUp}>UP</StyledButton>
                            {adrNum}
                            <StyledButton onClick={handleAdrNumDown}>Down</StyledButton>
                        </Box> */}
                    </Grid>
                    <Grid item xs={6}>

                        <IndexChart data={chartData} height={580} name={'IndexMA'} rangeSelector={2} xAxisType={'datetime'} credit={updateA} creditsPositionX={1} />

                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    )
}
