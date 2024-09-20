import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import { blue } from '@mui/material/colors';
HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function ReportStatisticsChart({ data, height }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'boxplot', animation: false, height: height ? height : 230, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: "xy" },
        title: null,
        credits: { enabled: false },
        exporting: { enabled: false },
        tooltip: { shared: true, crosshairs: true, hideDelay: 1, distance: 55, backgroundColor: "rgba(64, 64, 64, 0.70)", style: { color: "#e8e3e3" }, },
        xAxis: [{ labels: { style: { color: "#efe9e9ed", fontSize: "11px" } }, plotBands: { color: "rgba(111,111,111,0.3)", from: 4.5, to: 5.5, } },],
        yAxis: [{ title: { enabled: false }, labels: { style: { color: "#efe9e9ed", fontSize: "12px" } }, gridLineWidth: 0.2, tickInterval: 5 },],
        legend: { align: "left", borderWidth: 0, margin: 0.8, verticalAlign: "top", symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: "#efe9e9ed", fontSize: "12px" }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 5, },
        plotOptions: {
            series: { animation: false },
            boxplot: {
                // 상자(Box) 색상 설정
                fillColor: '#efe9e9ed',
                // 상자 경계선 색상
                // lineColor: blue['A200'],
                // // 중앙값(Median) 선 색상
                // medianColor: blue['A200'],
                // // 수염(Whiskers) 색상
                // whiskerColor: blue['A200'],
                // 선의 두께
                lineWidth: 2
            }
        },
    })

    useEffect(() => {
        setChartOptions({
            series: {
                data: data.data,
                name: data.name,
            },
            xAxis: [{
                categories: data.categories,
            }],
            yAxis: [{
                opposite: data.name === '업종순위' ? true : false,
                reversed: data.name === '업종순위' ? true : false,
            }]
        })
    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
}

