import React, { useEffect, useRef } from 'react';
import { Skeleton } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)


export default function Chart({ data, height, name }) {
    const chartRef = useRef(null)

    useEffect(() => {
        if (chartRef.current) {
            Highcharts.chart(chartRef.current, {
                chart: { type: 'scatter', zoomType: 'xy', backgroundColor: 'rgba(255, 255, 255, 0)', height: height, },
                credits: { enabled: false }, title: { text: null },
                xAxis: {
                    title: {
                        text: name,
                        style: { color: '#efe9e9ed' }
                    },
                    labels: {
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        }, formatter: function () {
                            return this.value;
                        },
                    }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside',
                    plotLines: [{
                        color: 'rgba(555,555,000,0.75)', from: 1, to: 1
                    }, {
                        color: 'tomato', from: 1.2, to: 1.2
                    }]
                },
                yAxis: [{
                    title: {
                        text: 'PER',
                        style: { color: '#efe9e9ed' }
                    },
                    labels: {
                        align: 'right',
                        x: -5,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        }, formatter: function () {
                            return this.value;
                        },
                    },
                    gridLineWidth: 0.2,
                    plotLines: [{
                        color: 'rgba(555,555,000,0.75)', from: 10, to: 10
                    }, {
                        color: 'tomato', from: 13, to: 13
                    }]
                }],
                navigation: { buttonOptions: { enabled: false }, },
                legend: { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '14px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 10, y: 0, },
                tooltip: {
                    split: true,
                    shared: true,
                    hideDelay: 1,
                    backgroundColor: '#404040', style: { fontSize: '13px', color: '#fcfcfc' },
                    pointFormat: 'PBR: {point.x} <br/> PER: {point.y}'
                },
                plotOptions: {},
                // boost: { useGPUTranslations: true },
                series: data,
            });
        }
    }, [data]);
    return (
        <>
            {data ?
                <div ref={chartRef} />
                : <Skeleton variant="rectangular" height={height} animation="wave" />}
        </>

    );
};