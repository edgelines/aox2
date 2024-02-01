import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import { Skeleton } from '@mui/material';
require('highcharts/indicators/indicators-all')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function Chart({ data = [], height, name, hidenLegend, rangeSelector, xAxisType, credit, creditsPositionX, creditsPositionY }) {
    const chartRef = useRef(null)
    const chartInstance = useRef(null);

    const yAxisConfig = {
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
            plotLines: [{
                color: 'red',
                width: 1,
                value: 80,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: '#efe9e9ed',
                width: 1,
                value: 50,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: 'skyblue',
                width: 1,
                value: 15,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: 'dodgerblue',
                width: 1,
                value: 10,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }],
            height: '70%'
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
                align: 'right',
                x: -6, y: 4.5,
                style: {
                    color: '#efe9e9ed',
                    fontSize: '12px'
                }, formatter: function () {
                    return `${this.value}%`;
                },
            },
            gridLineWidth: 0.2,
            height: '70%'
        }],
    }
    const legendConfig = hidenLegend ? { enabled: false } : { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 0, };
    const credits = credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -12, y: creditsPositionY ? creditsPositionY : 40, align: 'right' } } : { enabled: false }
    const options = {
        rangeSelector: {
            selected: rangeSelector, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" },
            buttons: [
                { type: "month", count: 3, text: "3M", title: "View 3 months" }, { type: "month", count: 5, text: "5M", title: "View 5 months" }, { type: "month", count: 11, text: "11M", title: "View 11 months" },
                { type: "year", count: 1, text: "1Y", title: "View 1 Year" }, { type: "year", count: 2, text: "2Y", title: "View 2 Year" }, { type: "year", count: 3, text: "3Y", title: "View 3 Year" },
                { type: "all", text: "All", title: "View All" },],
        },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: credits, title: { text: ' ' },
        xAxis: { type: xAxisType ? xAxisType : 'datetime', labels: { style: { color: '#efe9e9ed', fontSize: '11px' }, format: "{value:%y-%m-%d}", }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside', },
        yAxis: yAxisConfig[name],
        navigation: { buttonOptions: { enabled: false }, },
        navigator: {
            height: 15, margin: 12,
            series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
        },
        legend: legendConfig,
        tooltip: {
            split: true,
            shared: true,
            crosshairs: true,
            hideDelay: 2,
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.name == '코스피 200') {
                                return point.series.name + ' : ' + parseFloat(point.y).toFixed(2);
                            }
                            else if (point.series.name == '인버스') {
                                return point.series.name + ' : ' + point.y;
                            } else if (name === 'Modeling') {
                                if (point.series.options.isCandle) {
                                    return `${point.series.name}<br/>시가 : ${point.point.open}<br/> 고가 : ${point.point.high}<br/> 저가 : ${point.point.low}<br/> 종가 : ${point.point.close}`;
                                } else if (point.series.options.isPercent) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else if (point.series.options.isADR) {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                } else {
                                    return point.series.name + ' : ' + parseInt(point.y) + '%';
                                }
                            }
                            else {
                                return point.series.name + ' : ' + parseInt(point.y * 100) + '%';
                            }
                        }) : []
                );
            },
            backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
        plotOptions: {
            series: {
                animation: false,
            },
        },
        boost: { enabled: true, useGPUTranslations: true },
        series: data
    }
    useEffect(() => {
        if (data && Array.isArray(data)) {
            // if (chartRef.current) {
            if (!chartInstance.current) {
                chartInstance.current = Highcharts.stockChart(chartRef.current, options);
            } else {
                // 기본 시리즈('candlestick') 데이터 업데이트
                const mainSeriesData = data.find(series => series.id === 'candlestick');
                const linkedSeriesData = data.filter(series => series.linkedTo === 'candlestick');

                // candlestick 시리즈 데이터 업데이트
                const mainSeries = chartInstance.current.get(mainSeriesData.id) || chartInstance.current.get(mainSeriesData.name);
                if (mainSeries) {
                    mainSeries.setData(mainSeriesData.data || [], false);  // redraw를 false로 설정하여 즉시 다시 그리지 않게 함
                } else {
                    chartInstance.current.addSeries(mainSeriesData, false);  // redraw를 false로 설정
                }

                // 연결된 시리즈 데이터 업데이트
                linkedSeriesData.forEach((seriesData) => {
                    const existingSeries = chartInstance.current.get(seriesData.id) || chartInstance.current.get(seriesData.name);
                    if (existingSeries) {
                        existingSeries.setData(seriesData.data || [], false);  // redraw를 false로 설정
                    } else {
                        chartInstance.current.addSeries(seriesData, false);  // redraw를 false로 설정
                    }
                });

                // 모든 데이터 업데이트 후 차트 다시 그리기
                chartInstance.current.redraw();
            }
            // console.log(data);
        }
    }, [data]);
    useEffect(() => {
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null; // 차트 인스턴스를 null로 설정
            }
        };
    }, []);
    return (
        <>
            {data ?
                <div ref={chartRef} />
                : <Skeleton variant="rounded" height={height} animation="wave" />
            }
        </>
    );
}