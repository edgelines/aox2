import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, ToggleButtonGroup, Skeleton } from '@mui/material';
// import { styled } from '@mui/material/styles';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTable from './weightAvgTable'
import IndexChart from '../util/IndexChart'
import WeightAvgCheck from './weightAvgCheck';
// import Chart from '../Fundarmental/fundarmentalChart'
import { StyledToggleButton } from '../util/util';
import { API } from '../util/config';
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)


export default function WeightAvgPage3({ swiperRef, ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck, Exchange, MarketDetail }) {
    // const updateA = 'Start - 9:2, Update - 지수분봉'
    // const updateB = 'Updates-5m'
    // const updateC = 'Updates-2m'
    const updateD = 'Start - 9:20, Update - 5m'
    const updateE = 'Update - 1Day'
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);
    const [kospiPbr, setKospiPbr] = useState();
    const [kospi200Pbr, setKospi200Pbr] = useState();
    const [kosdaqPbr, setKosdaqPbr] = useState();
    const [moneyIndex, setMoneyIndex] = useState();
    // const [exchange, setExchange] = useState({});
    const [page, setPage] = useState('Kospi200');
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }
    const fetchData = async () => {
        await axios.get(`${API}/elwMonth6`).then((res) => {
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
            setMonth1Value(CTP1)
        })
    };

    const fetchData1Day = async () => {
        const 코스피200PBR = await axios.get(`${API}/indices/Kospi200PBR`);
        setKospi200Pbr(코스피200PBR.data);
        const 코스피PBR = await axios.get(`${API}/indices/KospiPBR`);
        setKospiPbr(코스피PBR.data);
        const 코스닥PBR = await axios.get(`${API}/indices/KosdaqPBR`);
        setKosdaqPbr(코스닥PBR.data);
        await axios.get(`${API}/fundamental/moneyIndex?ta=true`).then((res) => {
            setMoneyIndex([{
                name: "USD/KRW (Candle)",
                data: res.data.USD,
                type: 'candlestick',
                yAxis: 0,
                lineColor: "gold", color: "gold", upLineColor: "orangered", upColor: "orangered",
                zIndex: 2,
                animation: false,
                id: 'candlestick',
                isCandle: true,
            }, {
                name: "USD/EUR",
                data: res.data.EUR,
                type: 'spline',
                color: "silver",
                yAxis: 1,
                animation: false,
                zIndex: 3,
                lineWidth: 1,
                visible: false,
            }, {
                name: "USD/CNY",
                data: res.data.CNY,
                type: 'spline',
                color: "lime",
                yAxis: 2,
                animation: false,
                zIndex: 3,
                lineWidth: 1,
                visible: false,
            }, {
                name: '3 저지', lineWidth: 1, color: '#efe9e9ed', dashStyle: 'shortdash', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[0],
            }, {
                name: '9', lineWidth: 1, color: 'coral', dashStyle: 'shortdash', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
                data: res.data.emaList[1],
            }, {
                name: '18', lineWidth: 1, color: 'dodgerblue', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[2],
            }, {
                name: '27', lineWidth: 1, color: 'skyblue', dashStyle: 'shortdash', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
                data: res.data.emaList[3],
            }, {
                name: '36', lineWidth: 1, color: 'mediumseagreen', dashStyle: 'shortdash', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[4],
            }, {
                name: '66', lineWidth: 1, color: 'red', dashStyle: 'shortdash', animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[5],
            }, {
                name: '112', lineWidth: 2, color: "orange", animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[6],
            }, {
                name: '224', lineWidth: 2, color: "forestgreen", animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[7],
            }, {
                name: '336', lineWidth: 2, color: "pink", animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[8],
            }, {
                name: '448', lineWidth: 2, color: "magenta",
                animation: false, yAxis: 0, marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[9],
            }, {
                name: '560', lineWidth: 2, color: "skyblue", animation: false, yAxis: 0,
                marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                data: res.data.emaList[10],
                // params: { index: 2, period: 560 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }])
        });
    }
    useEffect(() => {
        fetchData();
        fetchData1Day();
    }, [])

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
    }, [])

    const renderPbrValue = (pbrData, label) => {
        if (!pbrData || pbrData.length < 2) return null;

        const 마지막값 = pbrData[pbrData.length - 1][1];
        const 비교값 = pbrData[pbrData.length - 2][1];
        const 차이 = 마지막값 - 비교값;
        const color = 차이 > 0 ? 'tomato' : 'deepskyblue';
        const sign = 차이 > 0 ? '+' : '';

        return (
            <Box sx={{ textAlign: 'left' }}>
                <span>{label} : </span>
                <span style={{ color: color }}> {마지막값.toFixed(2)} ( {sign} {차이.toFixed(2)} )</span>
            </Box>
        );
    };

    return (
        <Grid container spacing={1} >
            <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >3</Box>
            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.3rem', fontWeight: 'bold', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', position: 'absolute', transform: 'translate(37vw, 97px)' }}>
                    {Exchange.value ?
                        <>
                            {Exchange.comparison === '상승' ?
                                <span style={{ color: 'tomato' }}> {Exchange.value} 원 ( + {Exchange.net} )</span> : Exchange.comparison === '하락' ?
                                    <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( - {Exchange.net} )</span> : <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( {Exchange.net} )</span>}
                        </>
                        : <Skeleton variant="rounded" height={20} animation="wave" />}

                </Box>
                {/* <div
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                </div> */}
                <IndexChart data={moneyIndex} name={'moneyIndex'} height={455} rangeSelector={5} />

                <Box sx={{ position: 'absolute', transform: 'translate(19vw, 1vh)', zIndex: 10 }}>
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={page}
                        onChange={handlePage}
                    >
                        <StyledToggleButton fontSize={'12px'} value="Kospi200">Kospi200 PBR</StyledToggleButton>
                        <StyledToggleButton fontSize={'12px'} value="Kospi">Kospi PBR</StyledToggleButton>
                        <StyledToggleButton fontSize={'12px'} value="Kosdaq">Kosdaq PBR</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ fontSize: '1.3rem', fontWeight: 'bold', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', position: 'absolute', transform: 'translate(35vw, 120px)' }}>
                    {kospi200Pbr && kospi200Pbr.length > 0 ?
                        <>
                            {renderPbrValue(kospi200Pbr, 'Kospi200')}
                            {renderPbrValue(kospiPbr, 'Kospi')}
                            {renderPbrValue(kosdaqPbr, 'Kosdaq')}
                        </>
                        : <Skeleton variant="rounded" height={20} animation="wave" />}
                </Box>
                <Box sx={{ mt: 2.5 }}>
                    {/* <div
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                    </div> */}
                    {page === 'Kospi200' && kospi200Pbr && kospi200Pbr.length > 0 ?
                        <PbrChart data={kospi200Pbr} height={465} credits={updateE} name={'Kospi200'} /> :
                        page === 'Kospi' ?
                            <PbrChart data={kospiPbr} height={465} credits={updateE} name={'Kospi'} /> :
                            <PbrChart data={kosdaqPbr} height={465} credits={updateE} name={'Kosdaq'} />
                    }
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA4</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 3</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 5</span> [거래대금]
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>
                <MonthChart data={month2Data.series} height={840} categories={month2Data.categories} min={month2Data.min} credit={updateD} />

                <Box sx={{ position: 'absolute', transform: 'translate(2.6vw, -280px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MonthTable ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} /></Box>

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


const PbrChart = ({ data, height, credits, name }) => {
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            enabled: true,
            selected: 1, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" },
            buttons: [{ type: "month", count: 5, text: "5m", title: "View 5 months" }, { type: "year", count: 2, text: "2y", title: "View 2 year" }, { type: "all", text: "All", title: "View all" },],
        },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: { enabled: true, text: credits, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: -10, y: 70 } }, title: { text: '' },
        navigation: { buttonOptions: { enabled: false }, },
        navigator: { enabled: true, height: 15, margin: 12, series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 }, },
        legend: { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 12, y: 0, },
        plotOptions: {},
        xAxis: { labels: { style: { color: '#efe9e9ed', fontSize: '12px' }, format: "{value:%y-%m-%d}", }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside', },
        yAxis: [{
            title: { enabled: false }, labels: { align: 'right', x: -3, y: 4, style: { color: '#efe9e9ed', fontSize: '12px' } }, opposite: false, gridLineWidth: 0.2,
            plotLines: [{
                className: 'market_labels',
                color: 'tomato',
                width: 1,
                value: 1.75,
                dashStyle: 'shortdash',
            }, {
                className: 'market_labels',
                color: 'orange',
                width: 1,
                value: 1.65,
                dashStyle: 'shortdash',
                label: { text: '1.65', align: 'left', x: -29, y: 4, style: { color: '#efe9e9ed', } }
            }, {
                className: 'market_labels',
                color: 'gold',
                width: 1,
                value: 1,
                dashStyle: 'shortdash',
            }, {
                className: 'market_labels',
                color: '#00F3FF',
                width: 1,
                value: 0.9,
                dashStyle: 'shortdash',
                label: { align: 'left', x: -23, y: 2, style: { color: '#efe9e9ed', } }
            }, {
                className: 'market_labels',
                color: 'deepskyblue',
                width: 1,
                value: 0.8,
                dashStyle: 'shortdash',
                label: { align: 'left', x: -23, y: 1, style: { color: '#efe9e9ed', } }
            }],
            crosshair: {
                width: 2,
                // color: 'gray',
                // dashStyle: 'shortdot'
            }

        }],
        tooltip: {
            split: true, crosshairs: true, hideDelay: 1, distance: 55, backgroundColor: '#404040', style: { color: '#fcfcfc' },
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {

                            if (point.series.options.isCandle) {
                                return `${point.series.name}<br/>시가 : ${point.point.open}<br/> 고가 : ${point.point.high}<br/> 저가 : ${point.point.low}<br/> 종가 : ${point.point.close}`;
                            } else {
                                return point.series.name + ' : ' + point.y.toFixed(1);
                            }
                            // return point.series.name + ' : ' + Highcharts.dateFormat('%y.%m.%d', point.x) + '<br><br>시가 : ' + point.point.open + '<br>고가 : ' + point.point.high + '<br>저가 : ' + point.point.low + '<br>종가 : ' + point.point.close;
                        }) : []
                );
            },
        },
    })

    useEffect(() => {
        setChartOptions({
            series: [{
                name: "PBR",
                data: data,
                type: 'candlestick',
                id: 'candlestick',
                yAxis: 0,
                lineColor: 'dodgerblue',
                color: 'dodgerblue', // 하락캔들 몸통
                upLineColor: 'orangered', // docs
                upColor: 'orangered',
                isCandle: true,
                animation: false,
                zIndex: 2,
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: 'mediumseagreen',
                dashStyle: 'shortdash',
                name: '36',
                lineWidth: 1,
                params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: 'red',
                dashStyle: 'shortdash',
                name: '66',
                lineWidth: 1,
                params: { index: 2, period: 66 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: "orange",
                name: '112',
                lineWidth: 2,
                params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: "forestgreen",
                name: '224',
                lineWidth: 2,
                params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: "pink",
                name: '336',
                lineWidth: 2,
                params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: "magenta",
                name: '448',
                lineWidth: 2,
                params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
                color: "skyblue",
                name: '560',
                lineWidth: 2,
                params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }],
            yAxis: [{
                plotLines: [
                    { color: '#efe9e9ed', width: 1, value: data && data.length > 0 ? data[data.length - 1][4] : null, label: { text: `${name} PBR`, style: { color: '#efe9e9ed', } } },
                ]
            }, {}]
        })

    }, [data]);
    return (

        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
    );
};
