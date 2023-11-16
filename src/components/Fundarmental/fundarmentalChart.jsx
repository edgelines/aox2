import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { numberWithCommas } from '../util/util';
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

// function numberWithCommas(num) {
//     var parts = num.toString().split(".");
//     return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
// }

export default function Chart({ data, height, name, lengendX }) {
    const chartRef = useRef(null)
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: { selected: 5, inputDateFormat: '%Y-%m-%d', inputStyle: { color: '#efe9e9ed', }, labelStyle: { color: '#efe9e9ed', }, },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: { enabled: false }, title: { text: null },
        navigation: { buttonOptions: { enabled: false }, },
        navigator: { height: 15, margin: 12, series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 }, },
        legend: { enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '14px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: lengendX ? lengendX : 62, y: 0, },
        plotOptions: {},
        boost: { useGPUTranslations: true },
        xAxis: {
            labels: { style: { color: '#efe9e9ed', fontSize: '12px' }, format: "{value:%y-%m-%d}", },
            tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside',
        },

        tooltip: {
            split: true,
            shared: true,
            crosshairs: true,
            hideDelay: 2,
            distance: 55,
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (nameCheck === 'deposit') {
                                return point.series.name + ' : ' + parseInt(point.y / 10000).toLocaleString('ko-KR') + ' 조'
                            } else if (nameCheck === 'Bond' || nameCheck === 'cpi' || nameCheck === 'ppi') {
                                return point.series.name + ' : ' + parseFloat(point.y).toFixed(2);
                            } else if (point.series.name === 'Inventories to Sales Ratio' || point.series.name === 'Retailers: Inventories to Sales Ratio') {
                                return point.series.name + ' : ' + parseFloat(numberWithCommas(point.y)).toFixed(2);
                            } else {
                                return point.series.name + ' : ' + parseInt(point.y).toLocaleString('ko-KR')
                            }
                        }) : []
                );
            },
            backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
    })
    const nameCheck = name ? name : ''

    const plotLinesConfig = {
        energy: [{
            color: 'violet',
            width: 0.7,
            value: 100,
            dashStyle: 'shortdash',
            label: { text: '100', align: 'left', x: -27, y: 4, style: { color: '#efe9e9ed', } }
        }, {
            color: '#00F3FF',
            width: 0.7,
            value: 48,
            dashStyle: 'shortdash',
            label: { text: '48', align: 'left', x: -20, y: 3, style: { color: '#efe9e9ed', } }
        }, {
            color: 'deepskyblue',
            width: 0.7,
            value: 38,
            dashStyle: 'shortdash',
            label: { text: '38', align: 'left', x: -20, y: 7, style: { color: '#efe9e9ed', } }
        }],
        UsdGold: [{
            color: 'lime',
            width: 0.7,
            value: 1500,
            dashStyle: 'shortdash',
            label: { text: '1,500', align: 'left', x: -39, y: 4, style: { color: '#efe9e9ed', } }
        }],
        Bond: [{
            color: 'deepskyblue',
            width: 0.7,
            value: -0.9,
            dashStyle: 'shortdash',
            label: { text: '-0.9', align: 'left', x: -30, y: -5, style: { color: '#efe9e9ed', } }
        }, {
            color: '#00F3FF',
            width: 0.7,
            value: -0.5,
            dashStyle: 'shortdash',
            label: { text: '-0.5', align: 'left', x: -30, y: -1, style: { color: '#efe9e9ed', } }
        }],
        cpi: [{
            color: 'tomato',
            width: 0.7,
            value: 0.6,
            dashStyle: 'shortdash',
        }, {
            color: '#00F3FF',
            width: 0.7,
            value: 0,
            dashStyle: 'shortdash',
        }],
        inventories: [{
            color: 'tomato',
            width: 0.7,
            value: 1.68,
            dashStyle: 'shortdash',
            label: { text: '1.68', align: 'left', x: -29, y: -1, style: { color: '#efe9e9ed', } }
        }, {
            color: 'orangered',
            width: 0.7,
            value: 1.65,
            dashStyle: 'shortdash',
        }, {
            color: '#00F3FF',
            width: 0.7,
            value: 1.2,
            dashStyle: 'shortdash',
        }, {
            color: 'deepskyblue',
            width: 0.7,
            value: 1.08,
            dashStyle: 'shortdash',
            label: { text: '1.08', align: 'left', x: -29, y: -1, style: { color: '#efe9e9ed', } }
        }]
    }

    const plotLinesConfig2nd = {
        ppi: [{
            color: 'tomato',
            width: 0.7,
            value: 8,
            dashStyle: 'shortdash',
            label: { text: '8', align: 'right', x: 13, y: 0, style: { color: '#efe9e9ed', } }
        }, {
            color: '#00F3FF',
            width: 0.7,
            value: 0.7,
            dashStyle: 'shortdash',
            label: { text: '0.7', align: 'right', x: 24, y: 0, style: { color: '#efe9e9ed', } }
        }, {
            color: 'deepskyblue',
            width: 0.7,
            value: 0,
            dashStyle: 'shortdash',
        }]
    }

    const yAxisRender = () => {
        const result = [{
            title: { enabled: false },
            labels: {
                align: 'right', x: -5, y: 4.5,
                style: {
                    color: '#efe9e9ed',
                    fontSize: '12px'
                }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
            opposite: false,
            gridLineWidth: 0.2
        }, {
            title: { enabled: false },
            labels: {
                align: 'left',
                x: 6, y: 4.5,
                style: {
                    color: '#efe9e9ed',
                    fontSize: '12px'
                }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
            gridLineWidth: 0.2
        }, { visible: false, }]

        if (plotLinesConfig[nameCheck]) {
            result[0].plotLines = plotLinesConfig[nameCheck]
        }
        if (plotLinesConfig2nd[nameCheck]) {
            result[1].plotLines = plotLinesConfig2nd[nameCheck]
        }
        if (nameCheck === 'deposit') {
            result[0].labels = {
                align: 'left', x: -5, y: -5, style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                    return (this.value / 10000).toLocaleString('ko-KR') + ' 조';
                }
            }
            result[1].labels = {
                align: 'left', style: { color: '#efe9e9ed', fontSize: '12px' }, formatter: function () {
                    return (this.value / 10000).toLocaleString('ko-KR') + ' 조';
                }
            }
        } else if (nameCheck === 'mortgage') {
            result[2] = {
                title: { enabled: false },
                labels: {
                    align: 'left',
                    x: 17, y: 4.5,
                    style: {
                        color: '#efe9e9ed',
                        fontSize: '12px'
                    }, formatter: function () {
                        return (this.value).toLocaleString('ko-KR');
                    },
                },
                opposite: true,
                gridLineWidth: 0.2
            }
        }
        return result;
    }

    useEffect(() => {
        setChartOptions({
            series: data,
            yAxis: yAxisRender(),
        })
        if (chartRef.current) {
            Highcharts.stockChart(chartRef.current, {


            });
        }
    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
        // <>
        //     {data ?
        //         <div ref={chartRef} />
        //         : <Skeleton variant="rectangular" height={height} animation="wave" />}
        // </>
    );
};