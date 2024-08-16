import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const MotionsChart = ({ dataset, datasetDown, height, post }) => {
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'heatmap', height: height ? height - 400 : 600, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy', width: 1070, animation: false
        },
        // boost: {
        //     useGPUTranslations: true,
        //     enabled: true
        // },
        credits: { enabled: false }, title: { text: null },
        subtitle: { enabled: false },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: post.xAxis, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0,
        },
        yAxis: {
            title: { text: post.yAxis, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} </span>`
                }
            },
            gridLineWidth: 0,
        },

        colorAxis: {
            min: 0,
            minColor: '#404040',
            maxColor: Highcharts.getOptions().colors[3],
            labels: {
                style: {
                    color: '#efe9e9ed'
                }
            }
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        series: [{
            name: 'Sales per employee',
            // borderWidth: 0.2,
            dataLabels: {
                enabled: true,
                style: {
                    color: '#efe9e9ed', // 글자 색상
                    textOutline: 'none', // 글꼴 테두리 제거
                    fontSize: '11px' // 필요 시 글꼴 크기 설정
                }
                // color: '#000000'
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    yAxis: {
                        labels: {
                            format: '{substr value 0 1}'
                        }
                    }
                }
            }]
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                return `
                    ${post.xAxis} : ${this.point.series.chart.xAxis[0].categories[this.point.x]}<br/>
                    ${post.yAxis} : ${this.point.series.yAxis.categories[this.point.y]}<br/>
                    ${this.point.value} 개<br/>
                    `;
            },
        },
        // plotOptions: {
        //     scatter: {
        //         // showInLegend: false,
        //         animation: false,
        //         marker: {
        //             radius: 3,
        //             symbol: 'circle'
        //         },
        //         jitter: { x: 0.3 },
        //     },
        //     series: {
        //         animation: {
        //             duration: 2000
        //         },
        //     }
        // },
    })

    useEffect(() => {
        let chart
        if (chartComponent.current) {
            chart = chartComponent.current.chart;

            setChartOptions({
                series: [{
                    // name: '상승',
                    // turboThreshold: 0,
                    data: dataset.data
                }],
                xAxis: {
                    categories: dataset.xAxisBins
                },
                yAxis: {
                    categories: dataset.yAxisBins
                },
            })
        }

        // chart = chartComponent.current.chart;
        // if (chart && chart.series && chart.series[0]) {
        //     chart.series[0].update(dataset);
        // }

    }, [dataset])

    if (!dataset) return <div>Loading...</div>;

    return (
        <div>
            {/* Chart */}
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartComponent}
            />
        </div>
    );
};

export default MotionsChart;

