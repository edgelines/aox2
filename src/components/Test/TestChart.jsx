import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const MotionsChart = ({ dataset, datasetDown, height, post }) => {
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height - 400 : 600, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy', width: 1070,
            // boostThreshold: 1000 // 데이터 포인트가 1000개 이상일 때 Boost 모듈 사용
        },
        boost: {
            useGPUTranslations: true,
            enabled: true
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '12.5px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 30 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: post.xAxis, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0.2,
            tickLength: 0,
            // tickAmount: 21,
            plotLines: [
                { value: 40, width: 1, color: 'gold', dashStyle: 'dash', zIndex: 2 }, {
                    value: 90, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
                }, {
                    value: 150, width: 1, color: 'tomato', dashStyle: 'dash', zIndex: 2
                }],
            // max: 1000,
            // min: 0
            // min: 50
        },
        yAxis: {
            title: { text: post.yAxis, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} %</span>`
                }
            },
            // plotLines: [{ value: 0, width: 1, color: '#fff' },],
            gridLineWidth: 0.2,
            // tickAmount: 13,
            // max: 30,
            // min: -5
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                return `
                    ${this.point.종목코드}<br/>
                    ${post.xAxis} : ${this.point.x} %<br/>
                    ${post.yAxis} : ${this.point.y} %<br/>
                    `;
            },
        },
        plotOptions: {
            scatter: {
                // showInLegend: false,
                animation: false,
                marker: {
                    radius: 3,
                    symbol: 'circle'
                },
                jitter: { x: 0.3 },
            },
            series: {
                animation: {
                    duration: 2000
                },
            }
        },
    })

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;

            setChartOptions({
                series: [{
                    name: '상승',
                    turboThreshold: 0,
                    data: dataset
                }, {
                    name: '하락',
                    turboThreshold: 0,
                    data: datasetDown
                }],
            })
        }

        // chart = chartComponent.current.chart;
        // if (chart && chart.series && chart.series[0]) {
        //     chart.series[0].update(dataset);
        // }

    }, [dataset, datasetDown])

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

