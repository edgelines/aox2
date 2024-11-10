import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const Charts = ({ dataset, timeLine, height, getInfo, xAxisText, yAxisText, isSingle, isUnderEnvelope, isAxisPlotLinesName }) => {
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height : 400, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy'
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '12.5px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 15 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0.2,
            tickLength: 0,
            tickAmount: 10,
            // max: 1000,
            // min: 0
            // min: 50
        },
        yAxis: {
            title: { text: '', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            // plotLines: [{ value: 0, width: 1, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: isSingle ? 22 : 12,
            // max: 30,
            // min: -3
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                if (this.point.x1) {
                    return `
                        ${this.point.종목명}<br/>
                        ${xAxisText} : ${this.point.x}<br/>
                        - ${this.point.x1 ? `${this.point.x1_name} : ${this.point.x1}` : ''}<br/>
                        - ${this.point.x2 ? `${this.point.x2_name} : ${this.point.x2}` : ''}<br/>
                        ${yAxisText} : ${this.point.y}<br/>
                        - ${this.point.y1_name ? `${this.point.y1_name} : ${this.point.y1}` : ''}<br/>
                        - ${this.point.y2_name ? `${this.point.y2_name} : ${this.point.y2}` : ''}<br/>
                    `;
                }

                else if (isSingle) {
                    return `
                        ${this.point.종목명}<br/>
                        DMI 가중 17 : ${this.point.DMI_17}<br/>
                        DMI 단순 17 : ${this.point.DMI_단순_17}<br/>
                        DMI 평균 : ${this.point.x}<br/>
                        ${this.point.y_name}<br/>
                    `;
                }


                return `
                        ${this.point.종목명}<br/>
                        ${xAxisText} : ${this.point.x}<br/>
                        ${yAxisText} : ${this.point.y}<br/>
                        - ${this.point.y1_name ? `${this.point.y1_name} : ${this.point.y1}` : ''}<br/>
                        - ${this.point.y2_name ? `${this.point.y2_name} : ${this.point.y2}` : ''}<br/>
                    `;
            },
        },
        plotOptions: {
            scatter: {
                showInLegend: false,
                animation: false,
                marker: {
                    radius: isSingle ? 3.6 : 3.2,
                    symbol: 'circle'
                },
                // jitter: { x: 0.3 },
            },
            series: {
                animation: {
                    duration: 2000
                },
                point: {
                    events: {
                        click: function () {
                            getInfo(this.options);
                        }
                    }
                }
            }
        },
    })

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;

            setChartOptions({
                series: dataset,
                yAxis: { title: { text: yAxisText } },
                xAxis: { title: { text: xAxisText } },
            })
        }

        // chart = chartComponent.current.chart;
        // if (chart && chart.series && chart.series[0]) {
        //     const newData = getData(dataset, selectedIndustry, selectedThemes, marketGap, reserve);
        //     chart.series[0].update(newData);
        // }

    }, [dataset])

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            if (timeLine) {
                chart.update({
                    subtitle: {
                        text: timeLine
                    }
                });
            }
        }
    }, [timeLine])

    useEffect(() => {
        let chart

        const y_categories_1 = ['Bottom', '27.7', '26.7', '25.7', '24.7', '23.7', '22.7', '21.7', '20.7', '19.7', '18.7', '17.7', '16.7', '15.7', '14.7', '13.7', '12.7', '11.7', '10.7', '9.7', '8.7']
        const y_categories_2 = ['9, 8.0', '9, 7.0', '9, 6.0', '9, 5.0', '14, 8.0', '14, 7.0', '19, 10.7', '19, 9.7', '19, 8.7', '19, 7.7', '19, 6.7']

        const under_envelope_plot_lines = [
            { value: 14, width: 1, color: 'red', dashStyle: 'dash', zIndex: 2 },
            { value: 12, width: 1, color: 'dodgerblue', dashStyle: 'dash', zIndex: 2 },
            { value: 9, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 }
        ]

        const under_envelope_2_plot_lines = [
            { value: 6, width: 1, color: 'dodgerblue', dashStyle: 'dash', zIndex: 2 },
            { value: 4, width: 1, color: 'red', dashStyle: 'dash', zIndex: 2 },
            { value: 2, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 }
        ]

        if (isSingle) {
            chart = chartComponent.current.chart;

            chart.update({
                yAxis: {
                    categories: isUnderEnvelope == 'under_envelope' ? y_categories_1 : y_categories_2,
                    plotLines: isUnderEnvelope == 'under_envelope' ? under_envelope_plot_lines : under_envelope_2_plot_lines,
                },
            });

        }

    }, [isUnderEnvelope])

    useEffect(() => {
        let chart

        const xAxisPlotLines = {
            'W9,3': [
                { value: -60, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 },
                { value: -75, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 },
            ],
        }
        const yAxisPlotLines = {
            'W9,3': [
                { value: -60, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 },
                { value: -75, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 },
            ],
            '주봉DMI': [
                { value: 12.8, width: 1, color: 'white', dashStyle: 'dash', zIndex: 2 },
            ]
        }


        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            if (isAxisPlotLinesName) {
                chart.update({
                    xAxis: { plotLines: xAxisPlotLines[isAxisPlotLinesName] },
                    yAxis: { plotLines: yAxisPlotLines[isAxisPlotLinesName] }
                });
            }
        }
    }, [isAxisPlotLinesName])

    // useEffect(() => {
    //     let chart
    //     if (chartComponent.current && dataset.length > 0) {
    //         chart = chartComponent.current.chart;
    //         if (xAxisPlotLines) {
    //             chart.update({
    //                 xAxis: {
    //                     plotLines: [
    //                         {
    //                             value: -130, width: 1, color: 'gold', dashStyle: 'dash', zIndex: 2
    //                         }, {
    //                             value: -100, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
    //                         }, {
    //                             value: 0, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
    //                         }, {
    //                             value: 100, width: 1, color: 'tomato', dashStyle: 'dash', zIndex: 2
    //                         }],
    //                 },
    //             });
    //         }
    //     }
    // }, [xAxisPlotLines])

    if (!dataset) return <div>Loading...</div>;



    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartComponent}
        />

    );
};



export default Charts;
