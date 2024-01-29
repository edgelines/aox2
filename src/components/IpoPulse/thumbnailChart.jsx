import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box, Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function ThumbnailChart({ data, height }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'scatter', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            labels: { y: 20, style: { color: '#404040', fontSize: '10px' } },
        },
        yAxis: {
            title: { text: null },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '9px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            plotLines: [{ color: '#efe9e9ed', width: 1, value: 0 },],
            gridLineWidth: 0.2,
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            formatter: function () {
                return `${this.point.name}`
                // return `${this.point.x} ${this.point.name}`
            },
        },
    })
    const plotOption = {
        scatter: {
            showInLegend: false,
            animation: false,
            marker: {
                radius: 2,
                symbol: 'circle'
            },
            jitter: { x: 0.3 }
        }
    };



    useEffect(() => {
        setChartOptions({
            plotOptions: plotOption,
            // series: data.map(function (group) {
            //     return {
            //         // name: group.name,
            //         data: {
            //             x: Math.random(),
            //             y: group['공모가대비'],
            //             // color: sector_colors[point.Category],
            //             // Category: point.Category,
            //             name: group['종목명'],
            //             marker: {
            //                 radius: Math.sqrt(group['공모가'] / 1000)
            //             }
            //         }
            //     };
            // })
            series: [{
                name: '종목',
                data: data.map(group => ({
                    x: Math.random(), // x축 값은 랜덤
                    y: group['최고가대비'], // y축 값은 '공모가 대비' 비율
                    name: group['종목명'], // 포인트 이름 설정
                    marker: {
                        radius: 3 // 마커 크기 설정
                        // radius: Math.sqrt(group['공모가'] / 1000) // 마커 크기 설정
                    }
                }))
            }]

        })
    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}
