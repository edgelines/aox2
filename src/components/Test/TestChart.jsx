import React, { useEffect, useRef, useState } from 'react';
import { numberWithCommas } from '../util/util'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function CrossChart({ data, height, getInfo }) {
    const chartRef = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy', animation: false,
        },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '체결강도', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            tickLength: 0,
            plotLines: [{ value: 100, width: 2, color: '#fff', zIndex: 2 }],
        },
        yAxis: {
            title: { text: '전일대비 거래량 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} %</span>`
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
                return `${this.point.name}<br/>
                등락률 : ${this.point.등락률} %<br/>
                전일대비거래량 : ${this.point.y.toLocaleString('kr')} %<br/>
                체결강도 : ${this.point.x.toLocaleString('kr')} <br/>
                ${this.point.당일외국인순매수금액 > 0 ? '당일외국인순매수' : '당일외국인순매도'} : <span style="color : ${this.point.당일외국인순매수금액 > 0 ? 'red' : 'blue'}"> ${this.point.당일외국인순매수금액.toLocaleString('kr')} 백만원</span><br/>
                ${this.point.당일기관순매수금액 > 0 ? '당일기관순매수' : '당일기관순매수'} : <span style="color : ${this.point.당일기관순매수금액 > 0 ? 'red' : 'blue'}"> ${this.point.당일기관순매수금액.toLocaleString('kr')} 백만원</span><br/>`
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
        },
        series: {
            point: {
                events: {
                    click: function () {
                        getInfo(this.options);
                    }
                }
            }
        }
    };

    useEffect(() => {
        setChartOptions({
            plotOptions: plotOption,
            series: data,

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
