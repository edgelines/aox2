import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)

require('highcharts/modules/accessibility')(Highcharts)

export default function FilterStockChart({ data, height, yAxis, getInfo }) {
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bubble',
            // plotBorderWidth: 0.5,
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
            opposite: true,
            linkedTo: 0
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

        },

        tooltip: {
            // useHTML: true,
            // headerFormat: '<table>',
            // pointFormat: '<tr><th colspan="2"><h3>{point.종목명}</h3></th></tr>' +
            //     '<tr><th>등락률:</th><td>{point.x}%</td></tr>' +
            //     '<tr><th>업종명:</th><td>{point.업종명}</td></tr>',
            // footerFormat: '</table>',
            // followPointer: true,
            formatter: function () {
                return `<b>${this.point.종목명}</b><br/><p>등락률 : ${this.point.x}</p><br/><p>전일대비% : ${parseInt(this.point.전일대비거래량 * 100)}%</p>`
                // return '<b>' + this.series.name + '  /  ' + this.point.category + '</b><br/>'
            },
        },

        plotOptions: {

            bubble: {
                minSize: 20,
                maxSize: 20,
                point: {
                    events: {
                        click: function () {
                            const msg = { 종목코드: this.options.종목코드, 업종명: this.options.업종명, 종목명: this.options.종목명 };
                            getInfo(msg)
                            // getStockCode(this.options.종목코드);
                            // getIndustry(this.options.업종명);
                            // onCode(this.options);
                            // getStockCode(this.options);
                            // getStockChartData(this.options.종목코드);
                            // setStockCode(this.options.종목코드);
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

