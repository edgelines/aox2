import React, { useEffect, useRef, useState } from 'react';
import { numberWithCommas } from '../util/util'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function CrossChart({ data, height, getStockCode, getStockChartData }) {
    const chartRef = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy', animation: false,
        },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '영업이익 성장률 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            tickLength: 0,
            plotLines: [{ value: 0, width: 2, color: '#fff', zIndex: 2 }],
        },
        yAxis: {
            title: { text: '매출 성장률 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            plotLines: [{ value: 0, width: 2, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: 5,

        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                // console.log(this.point)
                return `${this.point.name}<br/>
                매출 : ${this.point.y > 0 ? '▲' : '▼'} ${numberWithCommas(this.point.y)} % (${numberWithCommas(this.point.매출액)} 억)<br/>
                이익 : ${this.point.x > 0 ? '▲' : '▼'} ${numberWithCommas(this.point.x)} % (${numberWithCommas(this.point.영업이익)} 억)<br/>
                순이익: ${this.point.당기순이익증가율 > 0 ? '▲' : '▼'} ${numberWithCommas(this.point.당기순이익증가율)} % (${numberWithCommas(this.point.당기순이익)} 억)`
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
            series: [{
                name: '종목',
                data: data,
                point: {
                    events: {
                        click: function () {
                            // onCode(this.options);
                            getStockCode(this.options);
                            getStockChartData(this.options.종목코드);
                            // setStockCode(this.options.종목코드);
                        }
                    }
                }
            }]

        })
    }, [data]);

    // useEffect(() => {
    //     if (chartRef && chartRef.current && data) {
    //         chartRef.current.chart.update({
    //             series: [{
    //                 data: data
    //             }]
    //         });
    //     }
    // }, [data]); // chartData가 변경될 때마다 실행


    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}
