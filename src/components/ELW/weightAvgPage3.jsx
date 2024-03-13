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
import { StyledToggleButton, update_5M, update_1day } from '../util/util';
import { API } from '../util/config';
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)


export default function WeightAvgPage3({ swiperRef, Exchange, Vix }) {
    const [kospiPbr, setKospiPbr] = useState();
    const [kospi200Pbr, setKospi200Pbr] = useState();
    const [kosdaqPbr, setKosdaqPbr] = useState();
    const [moneyIndex, setMoneyIndex] = useState();
    const [VixMA, setVixMA] = useState([])
    const [page, setPage] = useState('Kospi200');
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

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

        const res = await axios.get(`${API}/indices/VixMA`);
        const lineStyle = { type: 'spline', yAxis: 0, animation: false, zIndex: 3, marker: { enabled: false, states: { hover: { enabled: false } } }, }
        const hidenStyle = { dashStyle: 'shortdash', visible: false }
        const vix_ma = [{
            name: 'Vix',
            data: res.data.VIX,
            type: 'candlestick',
            yAxis: 0,
            upLineColor: "orangered",
            upColor: "orangered",
            lineColor: "dodgerblue",
            color: "dodgerblue",
            zIndex: 2,
            animation: false, isCandle: true,

        }, {
            ...lineStyle, ...hidenStyle, name: '2D', color: '#efe9e9ed', data: res.data.MA2, lineWidth: 1.5,
        }, {
            ...lineStyle, name: '3D', color: 'tomato', data: res.data.MA3, lineWidth: 1.5
        }, {
            ...lineStyle, ...hidenStyle, name: '4D', color: 'coral', data: res.data.MA4, lineWidth: 1.5,
        }, {
            ...lineStyle, name: '5D', color: 'gold', data: res.data.MA5, lineWidth: 1.5
        }, {
            ...lineStyle, ...hidenStyle, name: '6D', color: 'orange', data: res.data.MA6, lineWidth: 1.5,
        }, {
            ...lineStyle, ...hidenStyle, name: '9D', color: 'lime', data: res.data.MA9, lineWidth: 1.5,
        }, {
            ...lineStyle, ...hidenStyle, name: '10D', color: 'greenyellow', data: res.data.MA10, lineWidth: 1,
        }, {
            ...lineStyle, name: '12D', color: 'mediumseagreen', data: res.data.MA12, lineWidth: 1
        }, {
            ...lineStyle, ...hidenStyle, name: '15D', color: 'limegreen', data: res.data.MA15, lineWidth: 1,
        }, {
            ...lineStyle, name: '18D', color: 'skyblue', data: res.data.MA18, lineWidth: 1
        }, {
            ...lineStyle, ...hidenStyle, name: '20D', color: 'cadetblue', data: res.data.MA20, lineWidth: 1,
        }, {
            ...lineStyle, ...hidenStyle, name: '25D', color: 'violet', data: res.data.MA25, lineWidth: 1,
        }, {
            ...lineStyle, name: '27D', color: 'dodgerblue', data: res.data.MA27, lineWidth: 1
        }, {
            ...lineStyle, name: '36D', color: 'orchid', data: res.data.MA36, lineWidth: 1
        }, {
            ...lineStyle, name: '45D', color: 'pink', data: res.data.MA45, lineWidth: 1
        }, {
            ...lineStyle, name: '60D', color: 'magenta', data: res.data.MA60, lineWidth: 1
        }, {
            ...lineStyle, name: '112D', color: 'brown', data: res.data.MA112, lineWidth: 1
        }, {
            ...lineStyle, name: '224D', color: '#efe9e9ed', data: res.data.MA224, lineWidth: 1
        }];
        setVixMA(vix_ma);
    }
    useEffect(() => {
        // fetchData();
        fetchData1Day();
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
                    {page === 'Kospi200' && kospi200Pbr && kospi200Pbr.length > 0 ?
                        <PbrChart data={kospi200Pbr} height={465} credits={update_1day} name={'Kospi200'} /> :
                        page === 'Kospi' ?
                            <PbrChart data={kospiPbr} height={465} credits={update_1day} name={'Kospi'} /> :
                            <PbrChart data={kosdaqPbr} height={465} credits={update_1day} name={'Kosdaq'} />
                    }
                </Box>
            </Grid>
            <Grid item xs={6}>
                <div style={{ fontSize: '4em', position: 'absolute', transform: 'translate(1.5vw, 9vh)', backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 2 }}> VIX :
                    {Vix.net > 0 ?
                        <span style={{ color: 'tomato' }}> {`${Vix.value} ( + ${Vix.net} )`} </span> :
                        <span style={{ color: 'deepskyblue' }}> {`${Vix.value} ( ${Vix.net} )`} </span>
                    }
                </div>
                <IndexChart data={VixMA} height={580} name={'VixMA'} rangeSelector={0} credit={update_1day} xAxisType={'timestamp'} />
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
