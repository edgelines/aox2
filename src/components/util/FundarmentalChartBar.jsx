import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import Bullet from "highcharts/modules/bullet";
HighchartsMore(Highcharts)
Bullet(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function BarChart({ data, height, lengendX, lengendY, credit, creditsPositionX, creditsPositionY }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, type: 'bar', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -20, y: creditsPositionY ? creditsPositionY : -40, align: 'right' } } : { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        legend: { align: 'left', verticalAlign: 'top', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 10, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: lengendX ? lengendX : 62, y: lengendY ? lengendY : 0, },

        xAxis: [{
            categories: ['Mining', 'Utilities', 'Construction', 'Manufacturing', 'Durable Manufacturing', 'Nondurable Manufacturing', 'Agriculture, forestry, fishing, and hunting', 'Trade', 'Transportation and warehousing', 'Information', 'Finance, insurance, and real estate', 'Services'],
            labels: { style: { color: '#efe9e9ed', fontSize: '11px' }, },
            // tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickColor: '#efe9e9ed', tickPosition: 'inside',
        }],
        yAxis: [{
            title: { enabled: false },
            gridLineWidth: 0.2,
            labels: {
                style: {
                    color: '#efe9e9ed',
                    fontSize: '12px'
                }
            },
            plotLines: [{ color: '#ccc', width: 2, value: 0, zIndex: 5, }]
        }],
        plotOptions: {
            series: {
                stacking: 'normal',
                animation: false,
            }
        },
        tooltip: {
            split: true,
            shared: true,
            crosshairs: true,
            hideDelay: 2,
            distance: 55,
            backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
    })

    useEffect(() => {
        setChartOptions({
            series: data,
        })

    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
}