import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)

require('highcharts/modules/accessibility')(Highcharts)

export default function FilterStockChart({ data, height, yAxis, getInfo, isThemes }) {
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bubble',
            zoomType: 'xy',
            height: height ? height : null, backgroundColor: 'rgba(255, 255, 255, 0)',
            animation: false,
        },
        navigation: { buttonOptions: { enabled: false } }, credits: { enabled: false },
        legend: { enabled: false }, title: { text: null },


        xAxis: [{
            gridLineWidth: 1,
            title: {
                text: null
            },
            labels: {
                y: 13,
                style: { color: '#efe9e9ed', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            gridLineWidth: 0.2,
            tickWidth: 0,
            plotLines: [{
                color: '#efe9e9ed',
                // dashStyle: 'dot',
                width: 0.7,
                value: 0,
                zIndex: 3
            }],
            max: 31,
            opposite: false,
        }, {
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            tickWidth: 0,
            opposite: true,
            linkedTo: 0
        }, {
            gridLineWidth: 0,
            lineWidth: 0,
            labels: {
                y: 10,
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    return `${(this.value * 100).toLocaleString('kr')} %`
                }
            },
            tickWidth: 0,
        }],

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: null
            },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
            },
            gridLineWidth: 0.2,
            maxPadding: 0.2,
            reversed: true,
            type: 'category'

        },

        tooltip: {
            formatter: function () {
                const { series, 종목명, 업종명, 테마명, 전일대비거래량, x } = this.point;
                const formattedVolume = (x * 100).toLocaleString('kr') + ' %'
                const formattedDiff = parseInt(전일대비거래량 * 100).toLocaleString('kr') + ' %'

                if (series.options.isStock) {
                    return `<b>${종목명}</b><br/><p>등락률 : ${x}</p><br/><p>전일대비% : ${formattedDiff}</p>`;
                }

                const 기준 = series.options.isToday ? '오늘' : '어제';
                const 명칭 = 업종명 != undefined ? 업종명 : 테마명;

                return `<b>${기준}</b> 기준<br/><p>${명칭}</p><br/><p>전일대비평균거래량 : ${formattedVolume}</p><br/>`;

                // if (this.point.series.options.isStock) {
                //     return `<b>${this.point.종목명}</b><br/><p>등락률 : ${this.point.x}</p><br/><p>전일대비% : ${parseInt(this.point.전일대비거래량 * 100).toLocaleString('kr')}%</p>`
                // } else {
                //     if (this.point.series.options.isToday) {
                //         if (this.point?.업종명 !== undefined) {
                //             return `<b>오늘</b> 기준<br/><p>${this.point.업종명}</p><br/><p>전일대비평균거래량 : ${(this.point.x * 100).toLocaleString('kr')} %</p><br/>`
                //         } else {
                //             return `<b>오늘</b> 기준<br/><p>${this.point.테마명}</p><br/><p>전일대비평균거래량 : ${(this.point.x * 100).toLocaleString('kr')} %</p><br/>`
                //         }
                //     }
                //     else {
                //         if (this.point?.업종명 !== undefined) {
                //             return `<b>어제</b> 기준<br/><p>${this.point.업종명}</p><br/><p>전일대비평균거래량 : ${(this.point.x * 100).toLocaleString('kr')} %</p><br/>`
                //         } else {
                //             return `<b>어제</b> 기준<br/><p>${this.point.테마명}</p><br/><p>전일대비평균거래량 : ${(this.point.x * 100).toLocaleString('kr')} %</p><br/>`
                //         }

                //     }
                // }
            },
        },

        plotOptions: {

            bubble: {
                minSize: 13,
                maxSize: 13,
                point: {
                    events: {
                        click: function () {
                            if (this.options.종목코드) {
                                const msg = { 종목코드: this.options.종목코드, 업종명: this.options.업종명, 종목명: this.options.종목명, 테마명: isThemes ? this.options.테마명 : '' };
                                getInfo(msg)
                            }
                        }
                    }
                }

            },
            series: {
                animation: false,
                // dataLabels: {
                //     enabled: true,
                //     format: '{point.name}'
                // }
            },

        },

    })


    useEffect(() => {
        setChartOptions({
            series: data,
            yAxis: yAxis
        })
    }, [data, yAxis]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}

Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
    return ["M", x, y, "L", x + w, y + h, "M", x + w, y, "L", x, y + h, "z"];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}