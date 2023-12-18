import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton } from '@mui/material';
import PbrPerChart from './PbrPerChart'
import { API } from '../util/config';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)


// 에너지, 비트코인, 금, 환율, 오일
export default function PBR({ swiperRef }) {

    const [kospiPbr, setKospiPbr] = useState();
    const [kospiPbrPer, setKospiPbrPer] = useState([]);
    const [kosdaqPbrPer, setKosdaqPbrPer] = useState([]);

    const fetchData = async () => {
        const 코스피PBR = await axios.get(`${API}/indices/KospiPBR`);
        setKospiPbr(코스피PBR.data);
        const 코스피PER_PBR = await axios.get(`${API}/indices/PER_PBR?name=Kospi`);
        setKospiPbrPer(코스피PER_PBR.data);
        const 코스닥PER_PBR = await axios.get(`${API}/indices/PER_PBR?name=Kosdaq`);
        setKosdaqPbrPer(코스닥PER_PBR.data);

    }

    useEffect(() => { fetchData() }, []);

    return (
        <>
            <Grid container spacing={1} >
                <Grid xs={12} container>
                    <Grid item xs={6}>
                        <PbrPerChart data={kospiPbrPer} height={470} name={'코스피 PBR / PER'} />
                    </Grid>
                    <Grid item xs={6}>
                        <PbrPerChart data={kosdaqPbrPer} height={470} name={'코스닥 PBR / PER'} />
                    </Grid>
                </Grid>
                <Grid xs={12}>

                    {kospiPbr ?
                        <PbrChart data={kospiPbr} height={475} />
                        : <Skeleton variant="rectangular" height={475} animation="wave" />}

                </Grid>

            </Grid>
        </>
    )
}



const PbrChart = ({ data, height }) => {
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: { selected: 1, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" }, buttons: [{ type: "month", count: 5, text: "5m", title: "View 5 months" }, { type: "all", text: "All", title: "View all" },], },
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', },
        credits: { enabled: false }, title: { text: ' ' },
        navigation: { buttonOptions: { enabled: false }, },
        navigator: { height: 15, margin: 12, series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 }, },
        legend: { enabled: false, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '14px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 50, y: 0, },
        plotOptions: {},
        xAxis: { labels: { style: { color: '#efe9e9ed', fontSize: '12px' }, format: "{value:%y-%m-%d}", }, tickInterval: false, lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 1, tickColor: '#cfcfcf', tickPosition: 'inside', },
        yAxis: [{
            title: { enabled: false }, labels: { align: 'right', x: -3, y: 4, style: { color: '#efe9e9ed', fontSize: '12px' } }, opposite: false, gridLineWidth: 0.2,
            plotLines: [{
                className: 'market_labels',
                color: 'tomato',
                width: 1,
                value: 1.75,
                dashStyle: 'shortdash',
            }, {
                className: 'market_labels',
                color: 'orange',
                width: 1,
                value: 1.65,
                dashStyle: 'shortdash',
                label: { text: '1.65', align: 'left', x: -29, y: 4, style: { color: '#efe9e9ed', } }
            }, {
                className: 'market_labels',
                color: 'gold',
                width: 1,
                value: 1,
                dashStyle: 'shortdash',
            }, {
                className: 'market_labels',
                color: '#00F3FF',
                width: 1,
                value: 0.9,
                dashStyle: 'shortdash',
                label: { text: '0.9', align: 'left', x: -23, y: 2, style: { color: '#efe9e9ed', } }
            }, {
                className: 'market_labels',
                color: 'deepskyblue',
                width: 1,
                value: 0.8,
                dashStyle: 'shortdash',
                label: { text: '0.8', align: 'left', x: -23, y: 1, style: { color: '#efe9e9ed', } }
            }]

        }],
        tooltip: {
            split: true, crosshairs: true, hideDelay: 1, backgroundColor: '#404040', distance: 55, style: { color: '#fcfcfc' },
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            return point.series.name + ' : ' + Highcharts.dateFormat('%y.%m.%d', point.x) + '<br><br>시가 : ' + point.point.open + '<br>고가 : ' + point.point.high + '<br>저가 : ' + point.point.low + '<br>종가 : ' + point.point.close;
                        }) : []
                );
            },
        },
    })

    useEffect(() => {
        setChartOptions({
            series: [{
                name: "PBR",
                data: data,
                type: 'candlestick',
                yAxis: 0,
                lineColor: 'dodgerblue',
                color: 'dodgerblue', // 하락캔들 몸통
                upLineColor: 'orangered', // docs
                upColor: 'orangered',
                animation: false,
                zIndex: 2,
            }],
        })

    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
    );
};