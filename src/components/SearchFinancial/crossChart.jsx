import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function CrossChart({ data, height, onCode }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'scatter', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '영업이익 성장률 %' },
            labels: {
                style: { color: '#404040', fontSize: '9px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            tickLength: 0,
            plotLines: [{
                value: 0, width: 1
            }]
        },
        yAxis: {
            title: { text: '매출 성장률 %' },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '9px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            plotLines: [{ width: 1, value: 0 },],
            gridLineWidth: 0.2,
            tickAmount: 5
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                // console.log(this.point)
                return `${this.point.name}<br/>매출 : ${this.point.y} %<br/>영업이익 : ${this.point.x} %<br/>당기순이익: ${this.point.당기순이익증가율}%`

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
                data: data.map(group => ({
                    x: group['영업이익증가율'], // x축 값은 랜덤
                    y: group['매출액증가율'], // y축 값은 '공모가 대비' 비율
                    name: group['종목명'], // 포인트 이름 설정
                    color: group['당기순이익증가율'] > 0 ? 'tomato' : 'dodgerblue',
                    당기순이익증가율: group['당기순이익증가율'],
                    종목코드: group['종목코드'],
                    종목명: group['종목명'],
                    업종명: group['업종명'],
                    marker: {
                        // radius: 2.4 // 마커 크기 설정
                        radius: Math.sqrt(Math.abs(group['당기순이익증가율']) / 10) + 3 // 마커 크기 설정
                    }
                })),
                point: {
                    events: {
                        click: function () {
                            onCode(this.options);
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
