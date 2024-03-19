import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)

require('highcharts/modules/accessibility')(Highcharts)

export default function GroupDataChart_Min({ data, height, categories, type, hidenLegend, lengendX, lengendY, credit, creditsPositionX, creditsPositionY }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, type: type ? type : 'spline', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -20, y: creditsPositionY ? creditsPositionY : -40, align: 'right' } } : { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        legend: hidenLegend ? { enabled: false } : { align: 'left', verticalAlign: 'top', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 10, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: lengendX ? lengendX : 62, y: lengendY ? lengendY : 0, },
        yAxis: [{
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
        tooltip: {
            crosshairs: true,
            shared: true,
            backgroundColor: "rgba(64, 64, 64, 0.25)", style: { color: "#e8e3e3" },
            formatter: function () {
                return ['<b>' + this.x + '</b><br/>'].concat(
                    this.points ?
                        this.points.map(function (point) {
                            return `${point.series.name} : ${parseFloat(point.y).toFixed(1)} % <br/>`;
                        }) : []
                );
            },
        }
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

        const plotOptionsRender = () => {
            const result = { series: { cursor: 'pointer', marker: { radius: 0.6, lineWidth: 0, symbol: 'circle' }, animation: false, }, }
            return result

        }
        const xAxisRender = () => {
            const plotLinesLabelY = 210;
            const plotLinesLabelStyle = { color: '#efe9e9ed', fontSize: '11px' }
            const texts = ["B<br/>5", "B<br/>4", "B<br/>3", "B<br/>2", "B<br/>1", "09:07", "", "10:00", "", "11:00", "", "12:00", "", "13:00", "", "14:00", "", "15:00"];
            const positions = [0, 1, 2, 3, 4, 7, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78];
            const result = {
                categories: categories,
                labels: { y: 20, style: { color: '#efe9e9ed', fontSize: '10px' }, },
                lineColor: '#efe9e9ed', // x축 하단 라인 색상
                gridLineWidth: 0,// x축 그래프 뒤에 깔리는 선 굵기 지정.(0으로 지정 시 사라짐)
                labels: { y: 15, style: { color: "#404040", fontSize: "19px", }, rotation: 0, zIndex: -1, },
                plotBands: [{ color: "rgba(111,111,111,0.4)", from: -1, to: 4, },],
                plotLines: texts.map((text, index) => createPlotLine(text, positions[index], plotLinesLabelStyle, plotLinesLabelY)),
                tickWidth: 0,
                tickColor: "#cfcfcf",
                tickPosition: "inside",
                max: 84
            }
            return result;
        }

        setChartOptions({
            series: data ? data : [],
            plotOptions: plotOptionsRender(),
            xAxis: xAxisRender(),

        })



    }, [data]);
    return (

        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
}