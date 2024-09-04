import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Stack, ToggleButtonGroup, TableBody } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { numberWithCommas, StyledToggleButton } from './util'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/boost')(Highcharts)
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});


const StockChart = ({ stockName, willR, height, price, net, boxTransform, volumeRatio, DMI, series, selectedChartType, handleSelectedChartType, selectedSubChartType, handleSelectedSubChartType }) => {

    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : 360, },
        credits: { enabled: false }, title: { text: null },
        legend: {
            enabled: true,
            align: 'left', verticalAlign: 'top',
            symbolWidth: 0, itemDistance: 3,
            itemStyle: { fontSize: '10.5px' },
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
        xAxis: {
            labels: {
                style: { fontSize: '9px' }, y: 15,
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
                        chart.xAxis[0].setExtremes(dataMax - (range / 1.8), dataMax);
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
                return [Highcharts.dateFormat('%y.%m.%d %H %M', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.options.isCandle) {
                                return `종가 : ${numberWithCommas(point.point.close)}`;
                            } else if (point.series.options.isPercent) {
                                return `${point.series.name} : ${parseInt(point.y)} %`;
                            } else if (point.series.options.isIndicator) {
                                return `${point.series.name} : ${parseInt(point.y)}`;
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
                boostThreshold: 50, // Boost 모듈 사용을 위한 boostThreshold 옵션 활성화
                // turboThreshold: 1,
            }
        },
        boost: {
            enabled: true, // Boost 모듈 사용 활성화
            useGPUTranslations: true,
            usePreallocated: true,
            seriesThreshold: 10
        },
        rangeSelector: { enabled: false }
    })

    const yAxis_A = [{
        enabled: true,
        height: '60%',
        labels: {
            x: 30,
            style: { fontSize: '11px' }, formatter: function () {
                return (this.value).toLocaleString('ko-KR');
            },
        },
    }, {
        top: '60%',
        height: '20%',
        offset: 0,
        labels: {
            align: 'right',
            x: -3,
            style: { fontSize: '0px' },
        },
        title: { text: 'Volume' },
        gridLineWidth: 0,
    }, {
        // Williams R
        title: { enabled: false },
        gridLineWidth: 0.2,
        top: '60%',
        opposite: false,
        height: '20%',
        labels: {
            style: { fontSize: '0px' }
        },
        plotLines: [{
            color: 'black',
            width: 0.5,
            value: -100,
            label: {
                align: 'right',
                text: '-100', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: -90,
            label: {
                align: 'right',
                text: '-90', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 1,
            value: -80,
            dashStyle: 'shortdash',
            label: {
                align: 'right',
                text: '-80', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: -50,
            dashStyle: 'shortdash',
            label: {
                align: 'right',
                text: '-50', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'red',
            width: 1,
            value: -20,
            label: {
                align: 'right',
                text: '-20', y: 0,
                style: { fontSize: '10px' }
            },
        }],
        crosshair: { width: 2, }
    }, {
        // DMI
        title: { text: 'DMI' },
        gridLineWidth: 0.2,
        offset: 0,
        top: '80%',
        height: '20%',
        labels: {
            align: 'right',
            x: 5,
            style: { fontSize: '0px' }
        },
        plotLines: [{
            color: 'red',
            width: 1,
            value: 80,
            label: {
                align: 'right',
                text: '80',
                y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: 50,
            label: {
                align: 'right',
                text: '50', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'red',
            width: 0.5,
            value: 20,
            dashStyle: 'shortdash',
            label: {
                align: 'right',
                text: '20', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 0.5,
            value: 10,
            dashStyle: 'shortdash',
            label: {
                align: 'right',
                text: '10', y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: 5,
            label: {
                align: 'right',
                text: '5', y: 0,
                style: { fontSize: '10px' }
            },
        }],
        crosshair: { width: 2, },
    }, {
        top: '80%',
        height: '20%',
        offset: 0,
        opposite: false,
        labels: {
            align: 'right',
            x: -3,
            style: { fontSize: '0px' },
        },
        gridLineWidth: 0,
        plotLines: [{
            color: 'red',
            width: 1,
            value: -90,
            dashStyle: 'shortdash',
            label: {
                align: 'left',
                text: '-90',
                x: -10, y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 1,
            value: -80,
            dashStyle: 'shortdash',
            label: {
                align: 'left',
                text: '-80',
                x: -10, y: 0,
                style: { fontSize: '10px' }
            },
        }]
    }]

    const yAis_B = [
        {
            enabled: true,
            height: '100%',
            labels: {
                x: 30,
                style: { fontSize: '11px' }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
        }
    ]

    useEffect(() => {
        setChartOptions({
            series: series,
            yAxis: selectedChartType == 'B' ? yAis_B : yAxis_A,
            // tooltip: {
            //     formatter: selectedChartType === 'A' ? tooltip('%y.%m.%d') : selectedChartType === 'B' ? tooltip('%y.%m.%d') : tooltip('%y.%m.%d %H:%M')
            // }
        })
    }, [series]);

    const typographyStyle = { color: 'black', fontWeight: 600, textAlign: 'left', fontSize: '15px' }

    return (
        <Grid container direction='row' sx={{ alignItems: 'center', justifyContent: "space-between" }}>
            <Grid item>
                <Stack direction='row' alignItems="center" justifyContent="center">
                    <ToggleButtonGroup
                        // orientation="vertical"
                        color='info'
                        exclusive
                        size="small"
                        value={selectedChartType}
                        onChange={handleSelectedChartType}
                    >
                        <StyledToggleButton fontSize={10} value="5" >5분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="10">10분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="30">30분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="60">60분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="A">A-Type</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="B">B-Type</StyledToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Grid>

            {/* 보조지표 */}
            <Grid item>
                <StyledToggleButton
                    value='check'
                    selected={selectedSubChartType}
                    onChange={handleSelectedSubChartType}
                    fontSize={10}
                >
                    보조차트
                </StyledToggleButton>
            </Grid>
            {/* Charts */}
            <Grid item xs={11.9}>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: boxTransform ? boxTransform : `translate(10px, 300px)`, zIndex: 100 }}>
                    {(Array.isArray(series)) && series.length > 0 ?
                        <>
                            <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }} useFlexGap flexWrap="wrap">
                                <Typography sx={typographyStyle}>{stockName}</Typography>
                                <Typography sx={typographyStyle}>
                                    {(parseInt(price)).toLocaleString('KR-KO')} 원
                                </Typography>
                                <Typography sx={{ ...typographyStyle, color: net > 0 ? 'red' : 'blue' }}>
                                    {net} %
                                </Typography>
                                <Typography sx={{ ...typographyStyle, color: volumeRatio > 100 ? 'red' : 'blue' }}>
                                    / {volumeRatio ? volumeRatio.toLocaleString('KR-KO') : '-'} %
                                </Typography>
                            </Stack>
                            <Grid item container sx={{ pl: 2 }}>
                                <TableBody>
                                    <tr>
                                        <td style={{ ...typographyStyle, width: 40 }}>W33</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{willR.w33}</td>
                                        <td style={{ width: 50 }}></td>
                                        <td style={{ ...typographyStyle, width: 80 }}>DMI-22</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{DMI.dmi_22}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...typographyStyle, color: 'forestgreen', width: 40 }}>W14</td>
                                        <td style={{ ...typographyStyle, color: 'forestgreen', width: 30, textAlign: 'right' }}>{willR.w14}</td>
                                        <td style={{ width: 50 }}></td>
                                        <td style={{ ...typographyStyle, width: 80 }}>DMI-17</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{DMI.dmi_17}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...typographyStyle, color: 'tomato', width: 40 }}>W9</td>
                                        <td style={{ ...typographyStyle, color: 'tomato', width: 30, textAlign: 'right' }}>{willR.w9}</td>
                                        <td style={{ width: 50 }}></td>
                                        <td style={{ ...typographyStyle, width: 80 }}>DMI 7</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{DMI.dmi_7}</td>
                                    </tr>

                                </TableBody>
                            </Grid>
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


// const 종가단순 = {
//     type: 'sma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } },
// }
// const 저가가중 = {
//     type: 'wma', animation: false, yAxis: 0, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } },
// }
// const 이평기본 = { type: 'spline', animation: false, }



// const getSeriesData = () => {

//     if (MA) {
//         let seriesData = [{
//             data: stockItemData, name: stockName, showInLegend: false, isCandle: true, marker: { enabled: false, states: { hover: { enabled: false } } },
//             id: 'candlestick', type: 'candlestick', upLineColor: "orangered", upColor: "orangered", lineColor: "dodgerblue", color: "dodgerblue",
//         }, {
//             type: 'column', id: 'volume', name: 'volume', showInLegend: false, animation: false, yAxis: 1,
//             data: volumeData.map((item, index) => {
//                 const curr = volumeData[index][1];
//                 const prev = index > 0 ? volumeData[index - 1][1] : curr;
//                 const isUp = curr > prev;
//                 const color = isUp ? 'orangered' : 'dodgerblue';
//                 return {
//                     x: item[0],
//                     y: item[1],
//                     color: color
//                 }
//             }),
//         }, {
//             ...이평기본, data: MA.wma_5, color: "black", name: '5저가', lineWidth: 0.5,
//         }, {
//             ...이평기본, data: MA.wma_6, color: "black", name: '6중가', lineWidth: 0.5,
//         }, {
//             ...이평기본, data: MA.gmean_6, color: "black", name: '6고기', lineWidth: 0.5,
//         }, {
//             ...이평기본, data: MA.ma_83, color: "orange", name: '83저단', lineWidth: 1,
//         }, {
//             ...이평기본, data: MA.ema_112, color: "brown", name: '112저지', lineWidth: 1,
//         }, {
//             ...이평기본, data: MA.ema_224, color: "green", name: '224저지', lineWidth: 1,
//         }, {
//             ...이평기본, data: MA.ema_448, color: "darkviolet", name: '448저지', lineWidth: 1,
//         }, {
//             ...이평기본, data: MA.trima_11, color: "red", name: '11시삼', lineWidth: 1, dashStyle: 'LongDash'
//         }, {
//             ...이평기본, data: MA.trima_14, color: "orange", name: '14시삼', lineWidth: 1, dashStyle: 'LongDash'
//         }, {
//             ...이평기본, data: MA.trima_17, color: "green", name: '17시삼', lineWidth: 1, dashStyle: 'LongDash'
//         }, {
//             ...이평기본, data: MA.trima_20, color: "dodgerblue", name: '20시삼', lineWidth: 1, dashStyle: 'LongDash'
//         }, {
//             ...이평기본, data: MA.trima_112, color: "tomato", name: '112저삼', lineWidth: 2, dashStyle: 'LongDash'
//         }, {
//             ...이평기본, data: MA.trima_155, color: "black", name: '155저삼', lineWidth: 2, dashStyle: 'ShortDash'
//         }, {
//             ...이평기본, data: MA.trima_515, color: "dodgerblue", name: '515저삼', lineWidth: 1,
//         }, {
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'tomato', dashStyle: 'shortdash',
//             name: 'W-9', id: 'williamsr-9',
//             lineWidth: 1,
//             params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//             // ...이평기본, marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             // color: 'tomato', dashStyle: 'shortdash',
//             // data: MA.w_9, name: 'W-9', lineWidth: 1, yAxis: 2,
//         }, {
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'forestgreen', dashStyle: 'shortdash',
//             name: 'W-14', id: 'williamsr-14',
//             lineWidth: 1,
//             params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//             // ...이평기본, marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             // color: 'forestgreen', dashStyle: 'shortdash',
//             // data: MA.w_14, name: 'W-14', lineWidth: 1, yAxis: 2,
//         }, {
//             // ...이평기본, marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             // color: 'black', dashStyle: 'shortdash',
//             // data: MA.w_33, name: 'W-33', lineWidth: 1, yAxis: 2,
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'black', dashStyle: 'shortdash',
//             name: 'W-33', id: 'williamsr-33',
//             lineWidth: 1,
//             params: { index: 3, period: 33 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...이평기본, data: MA.dmi_7, color: "tomato", name: 'DMI-7', lineWidth: 0.5, yAxis: 3, isIndicator: true,
//         }, {
//             ...이평기본, data: MA.dmi_17, color: "dodgerblue", name: 'DMI-17', lineWidth: 0.5, yAxis: 3, isIndicator: true,
//         }, {
//             ...이평기본, data: MA.dmi_22, color: "green", name: 'DMI-22', lineWidth: 0.5, yAxis: 3, isIndicator: true,

//         }, {
//             ...이평기본, marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: false, isPercent: true,
//             color: 'black', dashStyle: 'shortdash',
//             data: MA.w_33, name: 'W-33', lineWidth: 1, yAxis: 4,
//         }];

//         return seriesData
//     } else {
//         let seriesData = [{
//             data: stockItemData, name: stockName, showInLegend: false, isCandle: true, marker: { enabled: false, states: { hover: { enabled: false } } },
//             id: 'candlestick', type: 'candlestick', upLineColor: "orangered", upColor: "orangered", lineColor: "dodgerblue", color: "dodgerblue",
//         }, {
//             type: 'column', id: 'volume', name: 'volume', showInLegend: false,
//             data: volumeData, animation: false, yAxis: 1,
//             // color: 'rgba(0,0,0,0.2)', // 거래량의 기본 색상 설정
//             color: 'rgba(0,0,0,0.2)', // 거래량의 기본 색상 설정
//             upColor: 'red', // 상승할 때의 색상 설정
//             borderColor: 'rgba(0,0,0,0.2)', // 거래량의 테두리 색상 설정
//             threshold: null
//         }, {
//             ...종가단순, color: "black", name: '3', lineWidth: 0.5,
//             params: { index: 3, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "green", name: '5', lineWidth: 0.5,
//             params: { index: 3, period: 5 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "tomato", name: '9', lineWidth: 0.5,
//             params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "orange", name: '14', lineWidth: 0.5,
//             params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "blue", name: '18', lineWidth: 1,
//             params: { index: 3, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "red", name: '55', lineWidth: 1,
//             params: { index: 3, period: 55 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "brown", name: '112', lineWidth: 1,
//             params: { index: 3, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "forestgreen", name: '224', lineWidth: 1,
//             params: { index: 3, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...종가단순, color: "forestgreen", name: '448 종단', lineWidth: 1,
//             params: { index: 3, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...저가가중, color: "black", name: '165', lineWidth: 0.5,
//             params: { index: 2, period: 165 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             ...저가가중, color: "black", name: '175 저가', lineWidth: 0.5,
//             params: { index: 2, period: 175 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'tomato',
//             dashStyle: 'shortdash',
//             name: 'W-9', id: 'williamsr-9',
//             lineWidth: 1,
//             params: { index: 3, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'forestgreen',
//             dashStyle: 'shortdash',
//             name: 'W-14', id: 'williamsr-14',
//             lineWidth: 1,
//             params: { index: 3, period: 14 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }, {
//             type: 'williamsr', animation: false, yAxis: 2, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, isPercent: true,
//             color: 'black',
//             dashStyle: 'shortdash',
//             name: 'W-33', id: 'williamsr-33',
//             lineWidth: 1,
//             params: { index: 3, period: 33 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
//         }];

//         return seriesData;
//     }


// };