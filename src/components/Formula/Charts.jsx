import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import { StyledToggleButton } from '../util/util';
// import { Grid, Box, TableContainer, IconButton, ToggleButtonGroup, Typography, Stack, Modal } from '@mui/material';
// import { DataGrid, gridClasses } from '@mui/x-data-grid';
// import { ThemeProvider } from '@mui/material/styles';
// import { DataTableStyleDefault } from '../LeadSectors/tableColumns';
// import { customTheme, A_columns, B1_columns, Envelope_columns, Short_columns, WhiteBox_columns } from './Columns';
// import { CountTable } from '../Motions/CountTable'
// import { legend } from '../Motions/legend';
// import { blue } from '@mui/material/colors';
// import SettingsIcon from '@mui/icons-material/Settings';

const Charts = ({ dataset, timeLine, height, getInfo, xAxisText, yAxisText }) => {
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height : 400, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy'
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '12.5px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 15 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: xAxisText, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0.2,
            tickLength: 0,
            tickAmount: 10,
            // plotLines: [
            //     { value: 40, width: 1, color: 'gold', dashStyle: 'dash', zIndex: 2 }, {
            //         value: 90, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
            //     }, {
            //         value: 150, width: 1, color: 'tomato', dashStyle: 'dash', zIndex: 2
            //     }],
            // max: 1000,
            // min: 0
            // min: 50
        },
        yAxis: {
            title: { text: yAxisText, style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            // plotLines: [{ value: 0, width: 1, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: 12,
            // max: 30,
            // min: -3
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                return `
                    ${this.point.종목명}<br/>
                    ${xAxisText} : ${this.point.x}<br/>
                    ${yAxisText} : ${this.point.y}<br/>
                    `;
            },
        },
        plotOptions: {
            scatter: {
                showInLegend: false,
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
