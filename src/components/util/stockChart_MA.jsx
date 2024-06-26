import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Stack } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { numberWithCommas } from './util'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

const StockChart = ({ stockItemData, stockName, rangeSelect, volumeData, 거래일datetime, 최대값, 최소값, willR, height, indicators, price, net, boxTransform, treasury, treasuryPrice, MA }) => {

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
            height: '80%',
            labels: {
                style: { fontSize: '11px' }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
        }, {
            top: '80%',
            height: '20%',
            offset: 0,
            labels: {
                align: 'right',
                x: -3
            },
            title: { text: 'Volume' }
        }, {
            title: { enabled: false },
            gridLineWidth: 0.2,
            top: '80%',
            opposite: false,
            height: '20%',
            labels: {
                style: { fontSize: '0px' }
            },
            plotLines: [{
                color: 'tomato',
                width: 0.5,
                value: -80,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }],
            crosshair: { width: 2, }
        }],
        xAxis: {
            // type: 'datetime',
            labels: {
                style: { fontSize: '9px' }, y: 15,
                // format: "{value:%y-%m-%d}",
                // formatter: function () {
                //     return Highcharts.dateFormat('%m.%d', this.value);
                // }
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
            distance: 55,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            style: { fontSize: '10px', },
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.options.isCandle) {
                                return `종가 : ${numberWithCommas(point.point.close)}`;
                                // return `${stockName}<br/> 종가 : ${numberWithCommas(point.point.close)}`;
                            } else if (point.series.options.isPercent) {
                                return `${point.series.name} : ${parseInt(point.y)} %`;
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
    const 일봉 = {
        selected: 0,
        inputEnabled: false,
        buttons: [{
            type: 'month',
            count: 6,
            text: '일봉',
            // title: 'View 3 months'
        }, {
            type: 'year',
            count: 1,
            text: '주봉',
        }],
        labelStyle: { fontSize: 0, },
    }


    const 종가단순 = {
        type: 'sma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } },
    }
    const 저가가중 = {
        type: 'wma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } },
    }
    const 이평기본 = { type: 'spline', animation: false, }

    const getSeriesData = () => {

        if (MA) {
            let seriesData = [{
                data: stockItemData, name: stockName, showInLegend: false, isCandle: true, marker: { enabled: false, states: { hover: { enabled: false } } },
                id: 'candlestick', type: 'candlestick', upLineColor: "orangered", upColor: "orangered", lineColor: "dodgerblue", color: "dodgerblue",
            }, {
                type: 'column', id: 'volume', name: 'volume', showInLegend: false,
                data: volumeData, animation: false, yAxis: 1,
            }, {
                ...이평기본, data: MA.wma_5, color: "black", name: '5저가', lineWidth: 0.5,
            }, {
                ...이평기본, data: MA.wma_6, color: "black", name: '6중가', lineWidth: 0.5,
            }, {
                ...이평기본, data: MA.gmean_6, color: "black", name: '6고기', lineWidth: 0.5,
                // }, {
                //     ...이평기본, data: MA.gmean_105, color: "gray", name: '105고기', lineWidth: 1,
            }, {
                ...이평기본, data: MA.ma_83, color: "orange", name: '83저단', lineWidth: 1,
            }, {
                ...이평기본, data: MA.ema_112, color: "brown", name: '112저지', lineWidth: 1,
            }, {
                ...이평기본, data: MA.ema_224, color: "green", name: '224저지', lineWidth: 1,
            }, {
                ...이평기본, data: MA.trima_112, color: "tomato", name: '112저삼', lineWidth: 2, dashStyle: 'LongDash'
                // }, {
                //     ...이평기본, data: MA.trima_133, color: "dodgerblue", name: '133', lineWidth: 2, dashStyle: 'LongDash'
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'tomato',
                dashStyle: 'shortdash',
                name: 'W-9', id: 'williamsr-9',
                lineWidth: 1,
                params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'forestgreen',
                dashStyle: 'shortdash',
                name: 'W-14', id: 'williamsr-14',
                lineWidth: 1,
                params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'black',
                dashStyle: 'shortdash',
                name: 'W-33', id: 'williamsr-33',
                lineWidth: 1,
                params: { index: 3, period: 33 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }];

            return seriesData
        } else {
            let seriesData = [{
                data: stockItemData, name: stockName, showInLegend: false, isCandle: true, marker: { enabled: false, states: { hover: { enabled: false } } },
                id: 'candlestick', type: 'candlestick', upLineColor: "orangered", upColor: "orangered", lineColor: "dodgerblue", color: "dodgerblue",
            }, {
                type: 'column', id: 'volume', name: 'volume', showInLegend: false,
                data: volumeData, animation: false, yAxis: 1,
            }, {
                ...종가단순, color: "black", name: '3', lineWidth: 0.5,
                params: { index: 3, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "green", name: '5', lineWidth: 0.5,
                params: { index: 3, period: 5 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "tomato", name: '9', lineWidth: 0.5,
                params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "orange", name: '14', lineWidth: 0.5,
                params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "blue", name: '18', lineWidth: 1,
                params: { index: 3, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "red", name: '55', lineWidth: 1,
                params: { index: 3, period: 55 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "brown", name: '112', lineWidth: 1,
                params: { index: 3, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "forestgreen", name: '224', lineWidth: 1,
                params: { index: 3, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...종가단순, color: "forestgreen", name: '448 종단', lineWidth: 1,
                params: { index: 3, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...저가가중, color: "black", name: '165', lineWidth: 0.5,
                params: { index: 2, period: 165 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                ...저가가중, color: "black", name: '175 저가', lineWidth: 0.5,
                params: { index: 2, period: 175 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'tomato',
                dashStyle: 'shortdash',
                name: 'W-9', id: 'williamsr-9',
                lineWidth: 1,
                params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'forestgreen',
                dashStyle: 'shortdash',
                name: 'W-14', id: 'williamsr-14',
                lineWidth: 1,
                params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }, {
                type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
                color: 'black',
                dashStyle: 'shortdash',
                name: 'W-33', id: 'williamsr-33',
                lineWidth: 1,
                params: { index: 3, period: 33 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
            }];

            return seriesData;
        }


    };

    useEffect(() => {
        if (거래일datetime || indicators) {
            setChartOptions({
                rangeSelector: 일봉,
                series: getSeriesData(),
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
                    gridLineWidth: 0.2,
                    top: '80%',
                    height: '20%',
                    labels: {
                        style: { fontSize: '0px' }
                    },
                    plotLines: [{
                        color: 'tomato',
                        width: 0.5,
                        value: -80,
                        dashStyle: 'shortdash',//라인 스타일 지정 옵션
                        // zIndex: 5,
                    }],
                    crosshair: { width: 2, }
                }]
            })
        } else {
            setChartOptions({
                rangeSelector: 일봉,
                xAxis: { plotLines: treasury },
                series: getSeriesData(),
            })
        }


    }, [stockItemData]);

    const typographyStyle = { color: 'black', fontWeight: 600, textAlign: 'left', fontSize: '15px' }

    return (
        <Grid container>
            <Grid item xs={11.8}>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: boxTransform ? boxTransform : `translate(10px, 300px)`, zIndex: 100 }}>
                    {(Array.isArray(stockItemData)) && stockItemData.length > 0 ?
                        <>
                            <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }}>
                                <Typography sx={typographyStyle}>{stockName}</Typography>
                                <Typography sx={{ ...typographyStyle, color: net > 0 ? 'red' : 'blue' }}>
                                    {net} %
                                </Typography>
                                <Typography sx={typographyStyle}>
                                    {(parseInt(price)).toLocaleString('KR-KO')} 원
                                </Typography>
                                <Typography sx={typographyStyle}>
                                    W9 : {willR.w9}
                                </Typography>
                                <Typography sx={typographyStyle}>
                                    W14 : {willR.w14}
                                </Typography>
                                <Typography sx={typographyStyle}>
                                    W33 : {willR.w33}
                                </Typography>
                            </Stack>
                        </>
                        : <></>
                    }
                </Box>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(10px, 300px)`, zIndex: 100 }}>
                    {(Array.isArray(stockItemData)) && stockItemData.length > 0 ?
                        <>
                            <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }}>
                                <Typography sx={typographyStyle}>{treasuryPrice}</Typography>
                            </Stack>
                        </>
                        : <></>
                    }
                </Box>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={'stockChart'}
                />
            </Grid>
        </Grid>
    );
};

export default StockChart;
