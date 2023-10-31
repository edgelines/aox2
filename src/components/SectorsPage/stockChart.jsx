import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import { trima } from 'indicatorts';
import HighchartsReact from 'highcharts-react-official'
import { numberWithCommas } from '../util/util'
require('highcharts/indicators/indicators')(Highcharts)
// require('highcharts/indicators/indicators-all')(Highcharts)
// require('highcharts/indicators/pivot-points')(Highcharts)
// require('highcharts/indicators/dmi')(Highcharts)
// require('highcharts/indicators/williams-r')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)



Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

const StockChart = ({ stockItemData, timeSeries, rangeSelect, volumeData, 거래일datetime, 최대값, 최소값, 평균단가, height }) => {
    const [전일대비, set전일대비] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : 360, },
        credits: { enabled: false }, title: { text: null },
        legend: {
            // enabled: false,
            enabled: true,
            align: 'right', verticalAlign: 'top',
            symbolWidth: 0, itemDistance: 3,
            itemStyle: { fontSize: '11px' },
            y: -38,
            labelFormatter: function () {
                var series = this.chart.series,
                    color = '',
                    exclude = ['candlestick', 'volume']; // 제외할 항목들
                if (exclude.indexOf(this.name) === -1) {
                    for (var i = 0; i < series.length; i++) {
                        if (series[i].name === this.name) {
                            color = series[i].color;
                            break;
                        }
                    }
                    return '<span style="color: ' + color + '">' + this.name + '</span>';
                } else {
                    return null; // 제외할 항목은 null 반환
                }
            }
        },
        navigation: { buttonOptions: { enabled: false }, },
        yAxis: [{
            enabled: true,
            height: '75%',
            labels: {
                style: { fontSize: '11px' }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
        }, {
            top: '75%',
            height: '25%',
            offset: 0,
            labels: {
                align: 'right',
                x: -3
            },
            title: { text: 'Volume' }
        }],
        xAxis: {
            type: 'datetime',
            labels: {
                style: { fontSize: '9px' }, y: 15, formatter: function () {
                    return Highcharts.dateFormat('%m.%d', this.value);
                }
            },
            tickLength: 6,
            crosshair: { width: 2, }
        },
        time: { timezone: 'Asia/Seoul', timezoneOffset: -540, }, // KST offset from UTC in minutes
        navigator: {
            height: 15, margin: 12, series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
            xAxis: {
                events: {
                    afterSetExtremes: function (e) {
                        if (e.trigger === 'navigator') return;
                        const chart = this.chart;
                        const dataMax = chart.xAxis[0].dataMax;
                        const range = e.max - e.min;
                        chart.xAxis[0].setExtremes(dataMax - (range / 2), dataMax);
                    }
                }
            }
        },
        tooltip: {
            crosshairs: true,
            hideDelay: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            style: { fontSize: '10px', },
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {

                            if (point.series.options.isCandle) {
                                return `${timeSeries}<br/> 종가 : ${numberWithCommas(point.point.close)}`;

                            } else {
                                return ''
                            }

                        }) : []
                );
            },
        },
        plotOptions: {
            series: {
                showInLegend: true,
                boostThreshold: 1, // Boost 모듈 사용을 위한 boostThreshold 옵션 활성화
            }
        },
        boost: {
            enabled: true, // Boost 모듈 사용 활성화
            useGPUTranslations: true,
            usePreallocated: true,
        },
    })
    const chartRef = useRef(null)
    const 일봉 = {
        selected: 0,
        inputEnabled: false,
        buttons: [{
            type: 'month',
            count: 7,
            text: '일봉',
            // title: 'View 3 months'
        }],
        labelStyle: { fontSize: 0, },
        // floating: true,
        // y: 20,
    }
    const 주봉 = {
        selected: 0,
        inputEnabled: false,
        buttons: [{
            type: 'month',
            count: 거래일datetime ? 15 : 12,
            text: '주봉',
            // title: 'View 1 year'
        }, {
            type: 'all',
            text: '월봉',
            // title: 'View all'
        }],
        labelStyle: { fontSize: 0, },
    }
    // date, open, high, low, close
    const lows = stockItemData.map(data => { return data[3]; })
    var tmp31 = trima(31, lows);
    const 저삼31 = stockItemData.map((data, index) => { return [data[0], tmp31[index]]; });
    var tmp41 = trima(41, lows);
    const 저삼41 = stockItemData.map((data, index) => { return [data[0], tmp41[index]]; });
    var tmp51 = trima(51, lows);
    const 저삼51 = stockItemData.map((data, index) => { return [data[0], tmp51[index]]; });
    var tmp90 = trima(90, lows);
    const 저삼90 = stockItemData.map((data, index) => { return [data[0], tmp90[index]]; });
    var tmp100 = trima(100, lows);
    const 저삼100 = stockItemData.map((data, index) => { return [data[0], tmp100[index]]; });

    const getSeriesData = (rangeSelect) => {
        // 겹치는 데이터를 먼저 생성합니다.
        let seriesData = [{
            data: stockItemData, name: timeSeries, showInLegend: false, isCandle: true,
            id: 'candlestick', type: 'candlestick', upLineColor: "orangered", upColor: "orangered", lineColor: "dodgerblue", color: "dodgerblue",
        }, {
            type: 'column', id: 'volume', name: 'volume', showInLegend: false,
            data: volumeData, animation: false, yAxis: 1,
            // }, {
            //     type: 'spline', animation: false, yAxis: 0, linkedTo: 'candlestick', dashStyle: 'shortdash',//라인 스타일 지정 옵션
            //     color: "red",
            //     name: '31',
            //     data: 저삼31,
            //     lineWidth: 0.5
        }, {
            type: 'sma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "green",
            name: '20 저단',
            lineWidth: 0.5,
            params: { index: 2, period: 20 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'sma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "blue",
            name: '26 저단',
            lineWidth: 0.5,
            params: { index: 2, period: 26 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "brown",
            name: '112 저지',
            lineWidth: 1,
            params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "forestgreen",
            name: '224 저지',
            lineWidth: 1,
            params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "deeppink",
            name: '336 저지',
            lineWidth: 1,
            params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }, {
            type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
            color: "darkviolet",
            name: '448 저지',
            lineWidth: 1,
            params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        }];
        // const williamsDay = [{
        //     type: 'williamsr', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
        //     color: 'tomato',
        //     dashStyle: 'shortdash',
        //     name: 'Williams-R-1', id: 'williamsr',
        //     lineWidth: 1,
        //     params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        // }];
        // const williamsWeek = [{
        //     type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
        //     color: 'tomato',
        //     dashStyle: 'shortdash',
        //     name: 'Williams-R-1', id: 'williamsr',
        //     lineWidth: 1,
        //     params: { index: 3, period: 5 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        // }, {
        //     type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
        //     color: 'dodgerblue',
        //     dashStyle: 'shortdash',
        //     name: 'Williams-R-2', id: 'williamsr2',
        //     lineWidth: 1,
        //     params: { index: 3, period: 7 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
        // }];
        // rangeSelect 값에 따라 추가적인 데이터를 생성합니다.

        if (rangeSelect === 4) {
            seriesData.push({
                type: 'spline', animation: false, yAxis: 0, linkedTo: 'candlestick', dashStyle: 'shortdash',//라인 스타일 지정 옵션
                color: "red",
                name: '31',
                data: 저삼31,
                lineWidth: 0.5
            }, {
                type: 'spline', animation: false, yAxis: 0, linkedTo: 'candlestick', dashStyle: 'shortdash',//라인 스타일 지정 옵션
                data: 저삼41,
                color: "green",
                name: '41',
                lineWidth: 0.5
            }, {
                type: 'spline', animation: false, linkedTo: 'candlestick', yAxis: 0,
                data: 저삼51,
                color: "blue",
                name: '51',
                lineWidth: 0.5
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
                color: "black",
                name: '9 저지',
                lineWidth: 0.5,
                params: { index: 2, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
                color: "black",
                name: '18 저지',
                lineWidth: 0.5,
                params: { index: 2, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
                color: "black",
                name: '27 저지',
                lineWidth: 0.5,
                params: { index: 2, period: 27 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'ema', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false },
                color: "black",
                name: '36 저지',
                lineWidth: 0.5,
                params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
                color: 'tomato',
                dashStyle: 'shortdash',
                name: 'W-5', id: 'williamsr',
                lineWidth: 1,
                params: { index: 3, period: 5 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
                color: 'dodgerblue',
                dashStyle: 'shortdash',
                name: 'W-7', id: 'williamsr2',
                lineWidth: 1,
                params: { index: 3, period: 7 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            });
        } else if (!rangeSelect) {
            seriesData.push({
                type: 'spline', animation: false, yAxis: 0, linkedTo: 'candlestick',
                data: 저삼90,
                color: "peru",
                name: '90',
                lineWidth: 0.5
            }, {
                type: 'spline', animation: false, yAxis: 0, linkedTo: 'candlestick',
                data: 저삼100,
                color: "purple",
                name: '100',
                lineWidth: 0.5
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false }, showInLegend: true,
                color: 'tomato',
                dashStyle: 'shortdash',
                name: 'W-14', id: 'williamsr',
                lineWidth: 1,
                params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            })
        }

        // if (거래일datetime && !rangeSelect) {
        //     seriesData.push(williamsDay)
        // } else if (거래일datetime && rangeSelect === 4) {

        //     console.log(거래일datetime);
        //     seriesData.push(williamsWeek)

        // }

        return seriesData;
    };

    useEffect(() => {
        if (거래일datetime) {
            setChartOptions({
                rangeSelector: rangeSelect ? 주봉 : 일봉,
                series: getSeriesData(rangeSelect),
                xAxis: {
                    plotLines: [{
                        color: 'red', width: 2, value: 거래일datetime, label: {
                            text: `★거래일`, // 레이블 텍스트
                            rotation: 0,
                            y: -3,
                            x: -6,
                            // align: 'right',
                        },
                    }]
                },
                yAxis: [{
                    enabled: true,
                    height: '60%',
                    labels: {
                        style: { fontSize: '11px' }, formatter: function () {
                            return (this.value).toLocaleString('ko-KR');
                        },
                    },
                    plotLines: [
                        { color: 'black', width: 1, dashStyle: 'shortdash', value: 최대값 ? 최대값 : null, label: { text: '최대값', style: { fontWeight: 600 } } },
                        { color: 'black', width: 1, dashStyle: 'shortdash', value: 최소값 ? 최소값 : null, label: { text: '최소값', y: 15, style: { fontWeight: 600 } } },
                    ]
                }, {
                    top: '60%',
                    height: '20%',
                    offset: 0,
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: { text: 'Volume' }
                }, {
                    title: { enabled: false },
                    labels: {
                        align: 'left',
                        x: -34, y: 4.5,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        }, formatter: function () {
                            return `${this.value}%`;
                        },
                    },
                    gridLineWidth: 0.2,
                    top: '80%',
                    height: '20%',
                    plotLines: [{
                        color: 'red',
                        width: 0.5,
                        value: 120,
                        dashStyle: 'shortdash',//라인 스타일 지정 옵션
                        // zIndex: 5,
                    }, {
                        color: '#efe9e9ed',
                        width: 0.5,
                        value: 100,
                        dashStyle: 'shortdash',//라인 스타일 지정 옵션
                        // zIndex: 5,
                    }, {
                        color: 'skyblue',
                        width: 0.5,
                        value: 70,
                        dashStyle: 'shortdash',//라인 스타일 지정 옵션
                        // zIndex: 5,
                    }, {
                        color: 'dodgerblue',
                        width: 0.5,
                        value: 60,
                        dashStyle: 'shortdash',//라인 스타일 지정 옵션
                        // zIndex: 5,
                    }],
                    crosshair: { width: 2, }
                }]
            })
        } else {
            setChartOptions({
                rangeSelector: rangeSelect ? 주봉 : 일봉,
                series: getSeriesData(rangeSelect),
            })
        }

        const 오늘종가 = stockItemData.length > 0 ? stockItemData[stockItemData.length - 1][4] : null;
        const 어제종가 = stockItemData.length > 0 ? stockItemData[stockItemData.length - 2][4] : null;
        const 전일대비등락률 = stockItemData.length > 0 ? (오늘종가 - 어제종가) / 어제종가 * 100 : null;
        stockItemData.length > 0 ? set전일대비(전일대비등락률.toFixed(2)) : set전일대비(null);
    }, [stockItemData]);
    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={'stockChart'}
            />
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: 'translate(10px, -142px)', zIndex: 100 }}>
                {stockItemData.length > 0 ?
                    <>
                        <Typography sx={{ color: 'black', fontWeight: 600 }}>
                            {평균단가 ?
                                <span style={{ fontSize: '20px' }}>
                                    평단 : {(parseInt(평균단가)).toLocaleString('KR-KO')} 원
                                </span>
                                : <></>}
                        </Typography>
                        <Typography sx={{ color: 'black', fontWeight: 600 }}>
                            전일 :
                            {전일대비 ?
                                <span style={{ fontSize: '30px', color: 전일대비 > 0 ? 'red' : 'blue' }}>
                                    {전일대비}
                                </span>
                                : <></>}
                            %
                        </Typography>
                    </>
                    : <></>
                }
            </Box>
        </>
        // <div ref={chartRef} />
    );
};

export default StockChart;
