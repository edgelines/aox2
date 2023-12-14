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
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            selected: rangeSelector, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" },
            buttons: [
                { type: "year", count: 1, text: "1Y", title: "View 1 Year" }, { type: "year", count: 2, text: "2Y", title: "View 2 Year" }, { type: "year", count: 3, text: "3Y", title: "View 3 Year" },
                { type: "year", count: 4, text: "4Y", title: "View 4 Year" }, { type: "year", count: 5, text: "5Y", title: "View 5 Year" },
                { type: "all", text: "All", title: "View All" },],
        },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -12, y: creditsPositionY ? creditsPositionY : 40, align: 'right' } } : { enabled: false }, title: { text: null },
        xAxis: {
            type: xAxisType ? xAxisType : 'datetime', labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                format: "{value:%y-%m-%d}",
            }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside',
        },
        navigation: { buttonOptions: { enabled: false }, },
        navigator: {
            height: 15, margin: 12,
            series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
        },
        legend: hidenLegend ? { enabled: false } : { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 15, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 0, y: 0, },
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


                            return point.series.name + ' : ' + (point.y).toFixed(1) + '%';


                        }) : []
                );
            },
            backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
        plotOptions: {
            series: {
                animation: false,
            }
        },
        boost: { enabled: true, useGPUTranslations: true },
        series: data,
    })

    useEffect(() => {
        const yAxisConfig = {
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
            series: data
        })

    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
            ref={chartRef}
        />
    );
}