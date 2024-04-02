import React, { useEffect, useRef, useState } from 'react';
import { numberWithCommas } from '../util/util'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function CrossChart({ data, height, getStockCode, getStockChartData }) {
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
        console.log(data);
        setChartOptions({
            plotOptions: plotOption,
            series: [{
                name: '종목',
                data: data.map(group => ({
                    x: group['영업이익증가율'], // x축 값은 랜덤
                    y: group['매출액증가율'], // y축 값은 '공모가 대비' 비율
                    name: group['종목명'], // 포인트 이름 설정
                    color: group['당기순이익증가율'] > 0 ? 'tomato' : 'dodgerblue',
                    당기순이익증가율: group['당기순이익증가율'],
                    종목코드: group['종목코드'],
                    종목명: group['종목명'],
                    업종명: group['업종명'],
                    매출액: group['매출액'],
                    영업이익: group['영업이익'],
                    당기순이익: group['당기순이익'],
                    marker: {
                        radius: Math.sqrt(Math.abs(group['당기순이익증가율']) / 30) > 2 ? Math.sqrt(Math.abs(group['당기순이익증가율']) / 60) + 1 : 3 // 마커 크기 설정
                    }
                })),
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
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}
