import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Switch, FormControlLabel, Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/modules/accessibility')(Highcharts)

export default function ELW_BarChart({ data, height, credit }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'bar', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: credit ? { enabled: true, text: credit } : { enabled: false },
        legend: { align: 'left', verticalAlign: 'top', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 0, },
        navigation: { buttonOptions: { enabled: false }, },
        yAxis: {
            title: { text: null },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '12px' },
                formatter: function () {
                    return (Math.abs(this.value) / 1000000).toLocaleString('ko-KR') + ' 백만원';
                },
            },
            plotLines: [{ color: 'paleturquoise', width: 2, value: 0, zIndex: 5, }],
            tickAmount: 5  // 축 갯수
            // tickInterval: y_tickinterval, //축 간격
        },
        plotOptions: { series: { animation: false, } },
        tooltip: {
            crosshairs: true, distance: 55,
            formatter: function () {
                return '<b>' + this.series.name + '<br/>행사가 : <span style="color:greenyellow;">' + this.point.category + '</b></span><br/>' +
                    '거래량: ' + Math.abs(this.point.y).toLocaleString('ko-KR');
            },
            backgroundColor: '#404040', style: { color: '#e8e3e3' }
            // '종목명 : ' + this.point.call_list +
        },
    })
    // const chartRef = useRef(null)
    useEffect(() => {

        setChartOptions({
            title: {
                text: '<span style="color:greenyellow;">한국증권</span>' + ' ELW 거래대금 (잔존만기일 : ' + '<span style="color:greenyellow;">' + data.title + '</span>' + '일) ' + data.비율,
                style: { color: '#efe9e9ed', fontSize: '13px' }, margin: -5,
            },
            xAxis: [
                {
                    categories: data.행사가,
                    labels: { step: 1, style: { color: '#FCAB2F', fontSize: '12px' } },
                    tickInterval: 1,
                    reversed: false,
                }, {
                    categories: data.행사가,
                    labels: { step: 1, style: { color: '#00F3FF', fontSize: '12px' } },
                    tickInterval: 1,
                    opposite: true,
                    reversed: false,
                    linkedTo: 0,
                },
            ],
            series: [{
                name: 'Call (5일평균)',
                data: data.콜5일,
                color: '#FCAB2F',
                pointWidth: 6, //bar 너비 지정.
                grouping: false
            }, {
                name: data.콜범주,
                data: data.콜,
                color: 'forestgreen',
                pointWidth: 1, //bar 너비 지정.
                grouping: false
            }, {
                name: 'Put (5일평균)',
                data: data.풋5일,
                color: 'darkgray',
                pointWidth: 6, //bar 너비 지정.
                grouping: false
            }, {
                name: data.풋범주,
                data: data.풋,
                color: 'hotpink',
                pointWidth: 1, //bar 너비 지정.
                grouping: false
            }]
        })

        // if (chartRef.current) {
        //     Highcharts.chart(chartRef.current, {

        //         series: ,
        //     });
        // }
    }, [data]);
    return (
        // <>
        //     {data ?
        //         // <div ref={chartRef} />
        //         <HighchartsReact
        //             highcharts={Highcharts}
        //             options={chartOptions}
        //         // constructorType={'stockChart'}
        //         />
        //         : <Skeleton variant="rounded" height={height} animation="wave" />
        //     }
        // </>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    );
};