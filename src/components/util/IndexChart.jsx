import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
// import { Skeleton } from '@mui/material';
import HighchartsReact from 'highcharts-react-official'
require('highcharts/indicators/indicators-all')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function Chart({ data = [], height, name, hidenLegend, rangeSelector, xAxisType, credit, creditsPositionX, creditsPositionY }) {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(data);
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            selected: rangeSelector, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" },
            buttons: [
                { type: "month", count: 3, text: "3M", title: "View 3 months" }, { type: "month", count: 5, text: "5M", title: "View 5 months" }, { type: "month", count: 11, text: "11M", title: "View 11 months" },
                { type: "year", count: 1, text: "1Y", title: "View 1 Year" }, { type: "year", count: 2, text: "2Y", title: "View 2 Year" }, { type: "year", count: 3, text: "3Y", title: "View 3 Year" },
                { type: "all", text: "All", title: "View All" },],
        },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -12, y: creditsPositionY ? creditsPositionY : 40, align: 'right' } } : { enabled: false }, title: { text: null },
        xAxis: {
            type: xAxisType ? xAxisType : 'datetime', labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                // formatter: function () {
                //     return Highcharts.dateFormat('%y-%m-%d', this.value);
                // }
                format: "{value:%y-%m-%d}",
            }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside',
        },
        navigation: { buttonOptions: { enabled: false }, },
        navigator: {
            height: 15, margin: 12,
            series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
        },
        legend: hidenLegend ? { enabled: false } : { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 0, },
        tooltip: {
            split: true,
            shared: true,
            crosshairs: true,
            hideDelay: 2,
            distance: 55,
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.name == '코스피 200') {
                                return point.series.name + ' : ' + parseFloat(point.y).toFixed(2);
                            } else if (point.series.name == '인버스') {
                                return point.series.name + ' : ' + point.y;
                                // } else if (name === 'ElwPutCallRatioData') {
                                //     return point.series.name + ' : ' + point.y.toFixed(2);
                            } else if (name === 'VixMA' || name === 'moneyIndex') {
                                if (point.series.options.isCandle) {
                                    return `${point.series.name}<br/>시가 : ${point.point.open.toFixed(2)}<br/> 고가 : ${point.point.high.toFixed(2)}<br/> 저가 : ${point.point.low.toFixed(2)}<br/> 종가 : ${point.point.close.toFixed(2)}`;
                                } else {
                                    return point.series.name + ' : ' + point.y.toFixed(2);
                                }
                            } else if (name === 'IndexMA') {
                                if (point.series.options.isCandle) {
                                    return `${point.series.name}<br/>시가 : ${point.point.open}<br/> 고가 : ${point.point.high}<br/> 저가 : ${point.point.low}<br/> 종가 : ${point.point.close}`;
                                } else if (point.series.options.isPercent) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else if (point.series.options.isADR) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else {
                                    return ''
                                }
                            } else if (name === 'Modeling') {
                                if (point.series.options.isCandle) {
                                    return ``;
                                    // return `${point.series.name}<br/>시가 : ${point.point.open}<br/> 고가 : ${point.point.high}<br/> 저가 : ${point.point.low}<br/> 종가 : ${point.point.close}`;
                                } else if (point.series.options.isPercent) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else if (point.series.options.isADR) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                }
                            } else if (name === 'CPI') {
                                return point.series.name + ' : ' + point.y + '%';
                            }
                            else {
                                return point.series.name + ' : ' + parseInt(point.y * 100) + '%';
                            }
                        }) : []
                );
            },
            backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
        plotOptions: { series: { animation: false, } },
        boost: { enabled: true, useGPUTranslations: true },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 600
                },
                chartOptions: {
                    legend: {
                        enabled: false,
                    }
                }
            }]
        }
    })

    useEffect(() => { setChartData(data) }, [data]);
    useEffect(() => {
        const yAxisConfig = {
            VixMA: [{
                title: { enabled: false },
                labels: { align: 'right', x: -5, y: 4.5, style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () { return this.value; }, },
                opposite: false,
                gridLineWidth: 0.2,
                plotLines: [{
                    color: '#efe9e9ed',
                    width: 1,
                    value: 20,
                    dashStyle: 'shortdash',//라인 스타일 지정 옵션
                }, {
                    color: 'tomato',
                    width: 1,
                    value: 35,
                    dashStyle: 'shortdash',//라인 스타일 지정 옵션
                    // label: { text: '14', align: 'right', x: 10, y: 4, style: { color:'#efe9e9ed', fontSize:'7.5px'} }
                }],
                crosshair: { width: 2, }
            }],


            moneyIndex: [{
                title: { enabled: false },
                labels: {
                    align: 'right', x: -5, y: 4.5,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return (this.value).toLocaleString('ko-KR');
                    },
                },
                opposite: false,
                gridLineWidth: 0.2,
                crosshair: { width: 2, }
            }, {
                title: { enabled: false },
                labels: {
                    align: 'left',
                    x: 6, y: 4.5,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return (this.value).toLocaleString('ko-KR');
                    },
                },
                gridLineWidth: 0.2
            }, { visible: false, }],
            Modeling: [{
                title: { enabled: false },
                labels: {
                    align: 'right', x: -5, y: 4.5,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return (this.value).toLocaleString('ko-KR');
                    },
                },
                opposite: false,
                gridLineWidth: 0.2,
                height: '70%',
                crosshair: { width: 2, }
            }, {
                title: { enabled: false },
                labels: {
                    align: 'left',
                    x: 6, y: 4.5,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return `${this.value}%`;
                    },

                },
                gridLineWidth: 0.2,
                top: '70%',
                height: '30%',
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
                height: '70%',
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
            }],
            CPI: [{
                title: { enabled: false },
                labels: {
                    align: 'right', x: -3, y: -4,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return `${this.value}%`;
                    },
                },
            }]
        }
        setChartOptions({
            yAxis: yAxisConfig[name],
            series: chartData
        });

    }, [name, chartData]);


    useEffect(() => {
        if (data && data.length > 0) {
            updateLastCandle(data);
        }
    }, [data])
    /** 새로운 데이터 읽어왔을때 마지막 값만 변환 */
    const updateLastCandle = (newData) => {
        // chartData의 모든 오브젝트를 순회
        const chart = chartRef.current.chart;
        chart.series.forEach((series, index) => {
            const lastDataIndex = series.data.length - 1;
            if (lastDataIndex >= 0) {
                // newData 배열에서 해당 시리즈의 새 데이터 포인트를 찾습니다.
                const newLastData = newData[index];
                // 새 데이터 포인트로 마지막 값 업데이트
                series.data[lastDataIndex].update(newLastData);
            }
        });
        // const series = chart.series[0];
        // const lastIndex = chartData.length - 1;

        // const lastCandle = series.data[lastIndex];
        // console.log(chartData, lastIndex, lastCandle);

        // // console.log(lastCandle);
        // // Update the last candle data
        // // lastCandle.update(newData);
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
            ref={chartRef}
        />
    );
}