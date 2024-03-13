import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function CoreChart({ data, height, name, categories, type, min, hidenLegend, lengendX, lengendY, credit, creditsPositionX, creditsPositionY, yAxis0Abs, yAxis1Abs, yAxis2Abs }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, type: type ? type : 'spline', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -20, y: creditsPositionY ? creditsPositionY : -40, align: 'right' } } : { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        legend: hidenLegend ? { enabled: false } : { align: 'left', verticalAlign: 'top', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 10, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: lengendX ? lengendX : 62, y: lengendY ? lengendY : 0, },
    })
    // const chartRef = useRef(null)

    // Market xAxis
    const createPlotLine = (text, from_to, plotLinesLabelStyle, plotLinesLabelY) => ({
        color: "rgba(111,111,111,0.75)",
        label: {
            text,
            style: plotLinesLabelStyle,
            y: plotLinesLabelY,
        },
        from: from_to, to: from_to,
    });

    useEffect(() => {

        const yAxisConfig = {
            dayGr: [{
                title: { enabled: false },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                        return (this.value / 100000000).toLocaleString('ko-KR') + ' 억원';
                    }
                },
                gridLineWidth: 0.2
            }],
            ElwRatioData: [{
                title: { text: null }, labels: { style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () { return this.value.toLocaleString('ko-KR') + ' %'; }, },
                plotLines: [{ color: 'paleturquoise', width: 2, value: 0, zIndex: 5, },
                { color: 'greenyellow', width: 2, value: 30, dashStyle: 'shortdash', zIndex: 5, },
                { color: '#e8e3e3', width: 2, value: 35, dashStyle: 'shortdash', zIndex: 5, },
                { color: '#e8e3e3', width: 2, value: 60, dashStyle: 'shortdash', zIndex: 5, },
                { color: 'greenyellow', width: 2, value: 70, dashStyle: 'shortdash', zIndex: 5, }],
                gridLineWidth: 0.2, tickAmount: 9, max: 80,
            }],
            // xValue: [
            //     {
            //         title: { text: "" },
            //         gridLineWidth: 0.3,
            //         labels: {
            //             align: 'right', x: -5, y: 4.5,
            //             style: {
            //                 color: '#efe9e9ed',
            //                 fontSize: '12px'
            //             },
            //         },
            //         min: min,
            //     },
            // ],
            // xValue1: [
            //     {
            //         title: { text: "" },
            //         gridLineWidth: 0.3,
            //         labels: {
            //             align: 'right', x: -5, y: 4.5,
            //             style: {
            //                 color: '#efe9e9ed',
            //                 fontSize: '12px'
            //             },
            //         },
            //     },
            // ],
            mixedX: [
                {
                    title: { text: null },
                    gridLineWidth: 0.3,
                    labels: {
                        align: 'right', x: -5, y: 4.5,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        },
                    },
                    min: min,
                },
                {
                    title: { text: null },
                    opposite: true,
                    gridLineWidth: 0.3,
                    labels: {
                        align: 'right', x: -1, y: 4.5,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        },
                    },
                    plotLines: [
                        {
                            color: "coral",
                            width: 1,
                            value: 65,
                            dashStyle: "shortdash",
                            label: {
                                text: "65",
                                align: "right",
                                x: -1,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "dodgerblue",
                            width: 1,
                            value: 35,
                            dashStyle: "shortdash",
                            label: {
                                text: "35",
                                align: "right",
                                x: -1,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                    ],

                },
            ],
            VixColumn: [{ title: { text: null }, labels: { style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () { return this.value; }, }, max: 100, min: 0, plotLines: [{ color: 'paleturquoise', width: 2, value: 20, zIndex: 5, }], gridLineWidth: 0.2, tickAmount: 6 }],
            Kospi200GroupBubble: {
                lineWidth: 0,
                gridLineWidth: 0.5,
                gridLineDashStyle: 'longdash',
                gridLineColor: 'darkgray',
                gridZIndex: -1,
                labels: {
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    },
                    formatter: function () {
                        return (this.value) + ' %';
                    },
                },
                title: { enabled: false, },
                plotLines: [{
                    color: '#FCAB2F',
                    width: 2,
                    value: 0,
                    zIndex: -1
                }],
            },
            groupDataMin: [{
                title: { enabled: false },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                        return this.value + ' %';
                    }
                },
                ceiling: 100,
                gridLineWidth: 0,
            }, {
                title: { enabled: false },
                gridLineWidth: 0,
                labels: {
                    enabled: false,
                    style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                        return parseInt(this.value) + ' %';
                    }
                },
                plotLines: [
                    {
                        color: "violet",
                        width: 1,
                        value: 76.4,
                        dashStyle: "shortdash",
                        label: {
                            text: "76.4%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "red",
                        width: 2,
                        value: 61.8,
                        dashStyle: "shortdash",
                        label: {
                            text: "61.8%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "coral",
                        width: 1,
                        value: 50,
                        dashStyle: "shortdash",
                        label: {
                            text: "50%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "gold",
                        width: 1,
                        value: 38.2,
                        dashStyle: "solid",
                        label: {
                            text: "38.2%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "skyblue",
                        width: 2,
                        value: 23.6,
                        dashStyle: "shortdash",
                        label: {
                            text: "23.6%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "dodgerblue",
                        width: 2,
                        value: 10,
                        dashStyle: "shortdash",
                        label: {
                            text: "10%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                    {
                        color: "dodgerblue",
                        width: 2,
                        value: 80,
                        dashStyle: "shortdash",
                        label: {
                            text: "80%",
                            align: "right",
                            x: 0,
                            y: -5,
                            style: {
                                color: "#efe9e9ed",
                            },
                        },
                    },
                ],
                opposite: true,
                ceiling: 100,
                tickAmount: 5,
                gridLineWidth: 0.2,
                max: 100
            }],
            groupData: [{
                title: { enabled: false },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                        return this.value + ' %';
                    }
                },
                ceiling: 100,
                gridLineWidth: 0.2,
            }, {
                title: { enabled: false },
                gridLineWidth: 0,
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                        return parseInt(this.value) + ' %';
                    }
                },
                opposite: true,
                ceiling: 100,
                tickAmount: 5,
                gridLineWidth: 0.2,
                max: 100
            }],
            trendData: [{
                title: { text: null },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' },
                    formatter: function () {
                        return (this.value / 1000).toLocaleString('ko-KR') + ' K억';
                    },
                },
                plotLines: [{
                    color: 'paleturquoise',
                    width: 2,
                    value: 0,
                    zIndex: 5,
                }],
                gridLineWidth: 0.2,
                tickAmount: 5,  // 축 갯수
                max: yAxis0Abs,
                min: -yAxis0Abs
            }, {
                title: { text: null },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' },
                    formatter: function () {
                        return (this.value / 100).toLocaleString('ko-KR') + ' 억';
                    },
                },
                opposite: true,
                // max: 50000,
                // min: -50000,
                max: yAxis1Abs,
                min: -yAxis1Abs,
                tickAmount: 5,  // 축 갯수
                gridLineWidth: 0.01,
                visible: false
            }, {
                title: { text: null },
                labels: {
                    style: { color: '#efe9e9ed', fontSize: '12px' },
                    formatter: function () {
                        return (this.value / 1000).toLocaleString('ko-KR') + ' K억';
                    },
                },
                plotLines: [{
                    color: 'paleturquoise',
                    width: 2,
                    value: 0,
                    zIndex: 5,
                }],
                opposite: true,
                // max: 25000,
                // min: -25000,
                max: yAxis2Abs,
                min: -yAxis2Abs,
                gridLineWidth: 0.2,
                tickAmount: 5,  // 축 갯수
            }],
            market: [
                {
                    title: { text: "" },
                    max: 1,
                    min: 0,
                    gridLineWidth: 0,
                    labels: { enabled: false, format: "{value:.1%}" },
                    plotLines: [
                        {
                            className: "market_labels",
                            color: "violet",
                            width: 1,
                            value: 0.85,
                            dashStyle: "shortdash",
                            label: {
                                text: "85%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            className: "market_labels",
                            color: "red",
                            width: 2,
                            value: 0.75,
                            dashStyle: "shortdash",
                            label: {
                                text: "75%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "coral",
                            width: 1,
                            value: 0.55,
                            dashStyle: "shortdash",
                            label: {
                                text: "55%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "gold",
                            width: 1,
                            value: 0.4,
                            dashStyle: "solid",
                            label: {
                                text: "40%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "skyblue",
                            width: 2,
                            value: 0.2,
                            dashStyle: "shortdash",
                            label: {
                                text: "20%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "dodgerblue",
                            width: 2,
                            value: 0.1,
                            dashStyle: "shortdash",
                            label: {
                                text: "10%",
                                align: "right",
                                x: 0,
                                y: -5,
                                style: {
                                    color: "#efe9e9ed",
                                },
                            },
                        },
                        {
                            color: "#efe9e9ed",
                            width: 2,
                            value: 1,
                            dashStyle: "solid",
                            label: {
                                text: "ELW Put",
                                align: "right",
                                x: 0,
                                y: 18,
                                style: {
                                    color: "#efe9e9ed",
                                    fontSize: "12px",
                                    // fontWeight: 'bold',
                                },
                            },
                        },
                        {
                            color: "#efe9e9ed",
                            width: 0,
                            value: 0,
                            dashStyle: "solid",
                            label: {
                                text: "ELW Call",
                                align: "right",
                                x: 0,
                                y: -6,
                                style: {
                                    color: "#efe9e9ed",
                                    fontSize: "12px",
                                    // fontWeight: 'bold',
                                },
                            },
                        },
                    ],
                },
            ],
        }
        const tooltip = {
            dayGr: {
                split: true,
                shared: true,
                crosshairs: true,
                formatter: function () {
                    return ['<b>' + this.x + '</b>'].concat(
                        this.points ?
                            this.points.map(function (point) {
                                return point.series.name + ' : ' + parseInt(point.y / 100000000).toLocaleString('ko-KR') + ' 억원';
                            }) : []
                    );
                },
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' }
            },
            ElwRatioData: {
                crosshairs: true,
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' },
                formatter: function () {
                    return '<b>' + this.series.name + '  /  ' + this.point.category + '</b><br/>'
                },
            },
            // xValue: { hideDelay: 2, shared: true, crosshairs: true, backgroundColor: "rgba(64, 64, 64, 0.25)", style: { color: "#fcfcfc" }, formatter: function () { return ["<b>" + this.x + "</b><br/>"].concat(this.points ? this.points.map(function (point) { return ("<b>" + point.series.name + "</b>" + " : " + parseFloat(point.y).toFixed(3) + "<br/>"); }) : []); }, },
            // xValue1: { hideDelay: 2, shared: true, crosshairs: true, backgroundColor: "rgba(64, 64, 64, 0.25)", style: { color: "#fcfcfc" }, formatter: function () { return ["<b>" + this.x + "</b><br/>"].concat(this.points ? this.points.map(function (point) { return ("<b>" + point.series.name + "</b>" + " : " + parseFloat(point.y).toFixed(3) + "<br/>"); }) : []); }, },
            // mixedX: { hideDelay: 2, shared: true, crosshairs: true, backgroundColor: "rgba(64, 64, 64, 0.25)", style: { color: "#fcfcfc" }, formatter: function () { return ["<b>" + this.x + "</b><br/>"].concat(this.points ? this.points.map(function (point) { return ("<b>" + point.series.name + "</b>" + " : " + parseFloat(point.y).toFixed(3) + "<br/>"); }) : []); }, },
            VixColumn: { enabled: false },
            Kospi200GroupBubble: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr> <th colspan="2" style="font-size:15px;"><p>{point.name}</p></th></tr>' +
                    '<tr> <th>등락률 : </th><td> {point.y} %</td></tr>' +
                    '<tr> <th>시가총액 : </th><td> {point.z} 조</td></tr>',
                footerFormat: '</table>',
                followPointer: true,
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' }
            },
            Kospi200GroupDataLine: {
                split: true,
                shared: true,
                crosshairs: true,
                hideDelay: 2,
                formatter: function () {
                    return ['<b>' + this.x + '</b>'].concat(
                        this.points ?
                            this.points.map(function (point) {
                                return point.series.name + ' : ' + parseFloat(point.y).toFixed(1) + ' %';
                            }) : []
                    );
                },
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' }
            },
            Kospi200GroupData: {
                split: true,
                shared: true,
                crosshairs: true,
                hideDelay: 2,
                formatter: function () {
                    return ['<b>' + this.x + '</b>'].concat(
                        this.points ?
                            this.points.map(function (point) {
                                return point.series.name + ' : ' + parseFloat(point.y).toFixed(1) + ' %';
                            }) : []
                    );
                },
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' }
            },
            trendData: {
                crosshairs: true,
                hideDelay: 10,
                backgroundColor: '#404040',
                style: { color: '#e8e3e3' },
                formatter: function () {
                    if (this.series.name == '콜옵션') {
                        if (this.point.y > 0) {
                            var detail = '순매수: <span style="color:#FCAB2F"><b>' + parseInt(this.point.y / 100).toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                        if (this.point.y <= 0) {
                            var detail = '순매도: <span style="color:#00F3FF"><b>' + parseInt(this.point.y / 100).toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                    }
                    else if (this.series.name == '풋옵션') {
                        if (this.point.y > 0) {
                            var detail = '순매수: <span style="color:#FCAB2F"><b>' + parseInt(this.point.y / 100).toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                        if (this.point.y <= 0) {
                            var detail = '순매도: <span style="color:#00F3FF"><b>' + parseInt(this.point.y / 100).toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                    }
                    else {
                        if (this.point.y > 0) {
                            var detail = '순매수: <span style="color:#FCAB2F"><b>' + this.point.y.toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                        if (this.point.y <= 0) {
                            var detail = '순매도: <span style="color:#00F3FF"><b>' + this.point.y.toLocaleString('ko-KR') + '</b></span> 억원';
                        }
                    }
                    return '<b>' + this.series.name + '  /  ' + this.point.category + '</b><br/>' +
                        detail;
                },
            },
            market: { hideDelay: 2, shared: true, crosshairs: true, backgroundColor: "#404040", style: { color: "#fcfcfc" }, formatter: function () { return ["<b>" + this.x + "</b><br/>"].concat(this.points ? this.points.map(function (point) { return ("<b>" + point.series.name + "</b>" + " : " + parseInt(point.y * 100) + "%<br/>"); }) : []); }, },
        }

        const plotOptionsRender = () => {
            const result = { series: { cursor: 'pointer', marker: { lineWidth: 0, symbol: 'circle' }, animation: false, }, }
            if (name === 'xValue' || name === 'xValue1' || name === 'mixedX' || name === 'market') {
                return { series: { animation: false, marker: { radius: 1.8, lineWidth: 0, symbol: "circle", }, lineWidth: 1, }, }
            } else if (name === 'VixColumn') {
                return {
                    column: {
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.point.y.toFixed(2);
                            },
                            style: { color: '#efe9e9ed', fontSize: '12px' },
                        },
                    },
                }
            } else if (name === 'Kospi200GroupBubble') {
                return {
                    bubble: {
                        minSize: 3,
                        maxSize: 35,
                        zMin: 0,
                        zMax: 100
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}',
                            style: {
                                fontSize: '12px'
                            },
                        },
                    }
                }
            } else if (name === 'trendData') {
                result.series.marker = { radius: 3, linewidth: 0, symbol: 'circle' }
                return result
            } else {
                return result
            }
        }
        const xAxisRender = () => {
            const result = {
                categories: categories,
                labels: { y: 20, style: { color: '#efe9e9ed', fontSize: '10px' }, },
                lineColor: '#efe9e9ed', // x축 하단 라인 색상
                gridLineWidth: 0,// x축 그래프 뒤에 깔리는 선 굵기 지정.(0으로 지정 시 사라짐)
            }
            // if (name === 'xValue') {
            //     const x축라벨 = { color: "#efe9e9ed", fontSize: "11px" };
            //     const y축이동 = 238;
            //     const texts = ["B<br/>5", "B<br/>4", "B<br/>3", "B<br/>2", "B<br/>1", "09:07", "09:30", "10:00",
            //         "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
            //     const positions = [0, 1, 2, 3, 4, 8, 13, 19, 25, 31, 37, 43, 49, 55, 61, 67, 73, 79];
            //     result.plotLines = texts.map((text, index) => createPlotLine(text, positions[index], x축라벨, y축이동));
            //     result.labels = { y: 26, style: { color: "#404040", fontSize: "19px", }, rotation: 0, };
            //     result.plotBands = [{ color: "rgba(111,111,111,0.4)", from: -1, to: 5, },];

            //     result.gridLineWidth = 0;
            //     result.tickWidth = 0;
            //     result.max = 86;
            //     return result;
            if (name === 'trendData') {
                result.tickInterval = 3;
                result.labels = { style: { color: '#FCAB2F', fontSize: '11px' } };
                result.categories = categories;
                return result;
            } else if (name === 'groupDataMin') {
                const plotLinesLabelY = 210;
                const plotLinesLabelStyle = { color: '#efe9e9ed', fontSize: '11px' }
                const texts = ["B<br/>5", "B<br/>4", "B<br/>3", "B<br/>2", "B<br/>1", "09:07", "", "10:00", "", "11:00", "", "12:00", "", "13:00", "", "14:00", "", "15:00"];
                const positions = [0, 1, 2, 3, 4, 7, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78];
                result.labels = { y: 15, style: { color: "#404040", fontSize: "19px", }, rotation: 0, zIndex: -1, };
                result.plotBands = [{ color: "rgba(111,111,111,0.4)", from: -1, to: 4, },];
                result.plotLines = texts.map((text, index) => createPlotLine(text, positions[index], plotLinesLabelStyle, plotLinesLabelY));
                result.tickWidth = 0;
                result.tickColor = "#cfcfcf";
                result.tickPosition = "inside";
                result.max = 84;
                // result.max = 49;
                return result;
            } else if (name === 'market') {
                const plotLinesLabelY = 280;
                const plotLinesLabelStyle = { color: '#efe9e9ed', fontSize: '11px' }
                const texts = ["B<br/>5", "B<br/>4", "B<br/>3", "B<br/>2", "B<br/>1", "09:07", "09:30", "10:00",
                    "10:30", "11:00", "11:30", "12:00", "12:30<br>★", "13:00<br>★", "13:30<br>★", "14:00", "14:30", "15:00"];
                const positions = [0, 1, 2, 3, 4, 7, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78];

                result.labels = { y: 15, style: { color: "#404040", fontSize: "19px", }, rotation: 0, zIndex: -1, };
                result.plotBands = [{ color: "rgba(111,111,111,0.4)", from: -1, to: 4, },];
                result.plotLines = texts.map((text, index) => createPlotLine(text, positions[index], plotLinesLabelStyle, plotLinesLabelY));
                result.tickWidth = 0;
                result.tickColor = "#cfcfcf";
                result.tickPosition = "inside";
                result.max = 84;
                return result;
            } else {
                return result;
            }
        }

        setChartOptions({
            series: data,
            plotOptions: plotOptionsRender(),
            xAxis: xAxisRender(),
            yAxis: yAxisConfig[name],
            tooltip: tooltip[name],
        })



    }, [data]);
    return (
        // <>
        //     {data ?
        //         <div ref={chartRef} />
        //         : <Skeleton variant="rounded" height={height} animation="wave" />
        //     }
        // </>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}