import React, { useEffect, useRef, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import axios from 'axios';
import { API } from '../util/config';
import Highcharts from 'highcharts/highstock'
require('highcharts/modules/accessibility')(Highcharts)

const WeatherChart = () => {
    const chartRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [lowest, setLowest] = useState([]);
    const [highest, setHighest] = useState([]);
    const fetchData = async () => {
        const res = await axios.get(`${API}/etc/weather`);
        setCategories(res.data.날짜);
        setLowest(res.data.최저);
        setHighest(res.data.최고);
    }

    useEffect(() => { fetchData() }, []);

    useEffect(() => {
        if (chartRef.current) {
            Highcharts.chart(chartRef.current, {
                chart: { animation: false, type: 'spline', height: 600, backgroundColor: '#404040' },
                credits: { enabled: false },
                title: { text: null },
                xAxis: {
                    labels: {
                        y: 20,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        },
                    },
                    categories: categories,
                    plotBands: [{ color: 'rgba(111,111,111,0.3)', from: -1, to: 21.5 }],
                    lineColor: '#efe9e9ed', // x축 하단 라인 색상
                    gridLineWidth: 0,// x축 그래프 뒤에 깔리는 선 굵기 지정.(0으로 지정 시 사라짐)
                    tickWidth: 1,//x축 label 사이 표지자 너비(0으로 지정 시 사라지며, 차트 타입에 따라 default로 지정되어 있을 수 있음)
                    tickColor: '#cfcfcf',
                    tickPosition: 'inside',// outside가 default 이며, x축 선 기준 아래를 바라봄. inside는 위를 바라봄.
                },
                yAxis: {
                    title: {
                        text: '',
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '13px'
                        }
                    },
                    gridLineWidth: 0.2,
                    plotBands: [{
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(0,0,0,0)'],
                                [0.2, 'rgba(0,37, 255,0)'],
                                [1, 'rgba(0, 37, 255, 0.25)'],
                            ]
                        },
                        from: -20, to: 0
                    }, {
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(255, 37, 0, 0.25)'],
                                [0.5, 'rgba(255, 37, 0,0)'],
                                [1, 'rgba(0,0,0,0)'],
                            ]
                        },
                        from: 28, to: 45
                    }],
                    // lineColor :'white',
                    labels: {
                        // y: 20,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        },
                    },
                },
                navigation: { buttonOptions: { enabled: false } },
                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    symbolRadius: 4,//범례 심볼 radius 지정
                    symbolWidth: 25,
                    symbolHeight: 15,
                    itemDistance: 25,//범례 간 간격 지정.
                    itemStyle: { // 선택시
                        color: '#efe9e9ed',
                        fontSize: '14px',
                        fontWeight: '400'
                    },
                    itemHiddenStyle: { // 선택해제시
                        color: "#000000"
                    },
                    itemHoverStyle: {
                        color: "gold"
                    },
                    x: 22,//가로 위치 지정.
                    y: -3,//세로 위치 지정.
                },
                tooltip: { shared: true, crosshairs: true },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        marker: {
                            symbol: 'circle',
                            radius: 6,
                        },
                        animation: false,
                        lineWidth: 2.4,
                    },
                },
                series: [{
                    name: 'Highest',
                    data: highest,
                    color: 'red',
                }, {
                    name: 'Lowest',
                    data: lowest,
                    color: 'dodgerblue'
                }]
            });
        }
    }, [categories]);

    return (
        <>
            {categories ?
                <div ref={chartRef} /> : <Skeleton variant="rectangular" height={200} animation="wave" />

            }
            <Box sx={{ textAlign: 'right', p: 3 }}>
                출처 : 웨더체널(weather.com)
            </Box>
        </>


    );
};

export default WeatherChart;