import * as React from 'react';
import { Container } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
// require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

function StockChart({ stockItemData, timeSeries }) {
    const stockOptions = {
        chart: { animation: false, height: 220, timezone: 'Asia/Seoul' },
        credits: { enabled: false },
        legend: {
            enabled: true, align: 'left',
            verticalAlign: 'top',
            itemStyle: {
                fontSize: '10px'
            }
        },
        navigation: { buttonOptions: { enabled: false }, },
        series: [{
            data: stockItemData,
            type: 'line',
            name: timeSeries
        }],
        yAxis: {
            enabled: true,
            labels: { style: { fontSize: '11px' }, },
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { hour: '%H:%M' },
            enabled: true,
            timezoneOffset: -540,
            labels: { style: { fontSize: '9px' }, y: 15, },
            tickLength: 6,
        },
        time: {
            timezoneOffset: -540,  // KST offset from UTC in minutes
            timezone: 'Asia/Seoul'
        },
        navigator: { enabled: false },
        rangeSelector: {
            buttonsEnabled: true,
            enabled: false,
        },
        tooltip: {
            crosshairs: true,
            hideDelay: 2,
            // formatter: function () {
            //     const date = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
            //     const point = this.points[0].point;
            //     const close = point.y.toLocaleString('ko-KR')
            //     return `<b>${date}</b><br>
            //             현재가: ${close}<br>`;
            // },
            formatter: function () {
                const dateObject = new Date(this.x);
                const kstFormatter = new Intl.DateTimeFormat('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Seoul'
                });
                const date = kstFormatter.format(dateObject);
                const point = this.points[0].point;
                const close = point.y.toLocaleString('ko-KR')
                return `<b>${date}</b><br>
                        현재가: ${close}<br>`;
            },
            // backgroundColor: '#404040', style: { color: '#fcfcfc' },
        },
    }
    return (
        <Container style={{ margin: 0, padding: 0 }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={stockOptions}
                constructorType={'stockChart'}
            />

        </Container>
    );
}

export default StockChart;
