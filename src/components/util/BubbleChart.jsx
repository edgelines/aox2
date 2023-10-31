import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box, Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function NewKospi200Group({ data, height, name }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'scatter', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            labels: name ? { y: 20, style: { color: '#404040', fontSize: '1px' } } : { y: 20, style: { color: '#efe9e9ed', fontSize: '12px' } },
            categories: ['삼성전자', '2위~15위', '16위~50위', '51위~100위', '101위~200위'],
            plotLines: [
                { color: '#efe9e9ed', width: 0.4, value: 0.5, },
                { color: 'paleturquoise', width: 0.2, value: 1, },
                { color: 'paleturquoise', width: 0.2, value: 2, },
                { color: 'paleturquoise', width: 0.2, value: 3, },
                { color: 'paleturquoise', width: 0.2, value: 4, },
                { color: '#efe9e9ed', width: 0.4, value: 1.5, },
                { color: '#efe9e9ed', width: 0.4, value: 2.5, },
                { color: '#efe9e9ed', width: 0.4, value: 3.5, },
                { color: '#efe9e9ed', width: 0.4, value: 4.5, },
            ],
        },
        yAxis: {
            title: { text: null },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '12px' },
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
                return `${this.point.Category}<br><b>업종명 : ${this.point.name}</b><br>등락률 : ${this.point.y.toFixed(2)} %`
            },
        },
    })
    const plotOption = name ? {
        scatter: {
            showInLegend: false,
            animation: false,
            marker: {
                radius: 2,
                symbol: 'circle'
            },
            jitter: { x: 0.3 }
        }
    } : {
        scatter: {
            showInLegend: false,
            animation: false,
            marker: {
                radius: 2,
                symbol: 'circle'
            },
        }
    };
    const sector_colors = {
        '전기': '#00B0F0', '자동차': 'royalblue', '에너지,화학': '#00FF99',
        '반도체': 'red', '디스플레이': '#FF7C80', '필수소재A': '#fffc33', '필수소재B': 'orange', '사치재': '#FF66FF',
        '게임,방송': 'Lawngreen', '교육,기타': '#7030A0', 'IT': 'white', '제약,생물공학': '#70AD47', '의료기기': '#008000',
        '건설,조선,물류': '#c9c9c9', '운송': '#996633', '석유,가스': '#5c787a', '국방,통신': 'aqua', '금융': 'gold'
    }
    const point = [-0.3, -0.15, 0, 0.15, 0.4]
    const offValues = {
        '전기': point[0],
        '자동차': point[0],
        '에너지,화학': point[0],

        '반도체': point[1],
        '디스플레이': point[1],

        '건설,조선,물류': point[2],
        '운송': point[2],
        '석유,가스': point[2],
        '국방,통신': point[2],
        '금융': point[2],

        '필수소재A': point[3],
        '필수소재B': point[3],
        '사치재': point[3],
        '게임,방송': point[3],
        '교육,기타': point[3],

        'IT': point[4],
        '제약,생물공학': point[4],
        '의료기기': point[4]
    };

    useEffect(() => {
        setChartOptions({
            plotOptions: plotOption,
            series: data.map(function (group) {
                return {
                    name: group.name,
                    data: group.data.map(function (point) {
                        let jitterValue = offValues[point.Category]
                        return {
                            x: name ? point.x : point.x + jitterValue,
                            y: point.y,
                            color: sector_colors[point.Category],
                            Category: point.Category,
                            name: point.업종명,
                            marker: {
                                radius: Math.sqrt(point.시가총액 / 280)  // Adjust the factor to get desired sizes
                            }
                        };
                    })
                };
            })
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

export function BubbleChartLegend({ guideNum, girdNum }) {
    return (
        <Grid container spacing={1.5} sx={{ color: '#404040', fontWeight: 'bold' }} >
            <Grid item xs={guideNum}></Grid>
            <Grid item xs={girdNum} >
                <Box sx={{ backgroundColor: '#00B0F0' }}>
                    전기
                </Box>
                <Box sx={{ backgroundColor: 'royalblue', color: '#efe9e9ed' }}>
                    자동차
                </Box>
                <Box sx={{ backgroundColor: '#00FF99' }}>
                    에너지&화학
                </Box>
            </Grid>
            <Grid item xs={girdNum} >
                <Box sx={{ backgroundColor: 'red', color: '#efe9e9ed' }}>
                    반도체
                </Box>
                <Box sx={{ backgroundColor: '#FF7C80' }}>
                    디스플레이
                </Box>
            </Grid>
            <Grid item xs={girdNum} >
                <Box sx={{ backgroundColor: '#c9c9c9' }}>
                    건설,조선,물류
                </Box>
                <Box sx={{ backgroundColor: '#5c787a', color: '#efe9e9ed' }}>
                    석유,가스
                </Box>
                <Box sx={{ backgroundColor: '#996633', color: '#efe9e9ed' }}>
                    운송
                </Box>
                <Box sx={{ backgroundColor: 'aqua' }}>
                    국방,통신
                </Box>
                <Box sx={{ backgroundColor: 'gold' }}>
                    금융
                </Box>
            </Grid>
            <Grid item xs={girdNum} >
                <Box sx={{ backgroundColor: '#fffc33' }}>
                    필수소재A
                </Box>
                <Box sx={{ backgroundColor: 'orange' }}>
                    필수소재B
                </Box>
                <Box sx={{ backgroundColor: '#FF66FF' }}>
                    사치재
                </Box>
                <Box sx={{ backgroundColor: 'Lawngreen' }}>
                    게임,방송
                </Box>
                <Box sx={{ backgroundColor: '#7030A0', color: '#efe9e9ed' }}>
                    교육,기타
                </Box>
            </Grid>
            <Grid item xs={girdNum} >
                <Box sx={{ backgroundColor: 'white' }}>
                    IT
                </Box>
                <Box sx={{ backgroundColor: '#70AD47' }}>
                    제약,생물공학
                </Box>
                <Box sx={{ backgroundColor: '#008000', color: '#efe9e9ed' }}>
                    의료기기
                </Box>
            </Grid>
        </Grid>
    )
}