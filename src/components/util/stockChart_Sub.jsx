import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Stack, ToggleButtonGroup } from '@mui/material';
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


const StockSubChart = ({ height, series }) => {

    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : 200, },
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
        yAxis: [
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
        ],
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



    useEffect(() => {
        setChartOptions({
            series: series
        })
    }, [series]);

    return (
        <Grid container >
            <Grid item xs={11.9}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={'stockChart'}
                />
            </Grid>
        </Grid>
    );
};

export default StockSubChart;
