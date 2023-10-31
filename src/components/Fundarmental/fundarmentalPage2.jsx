import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './fundarmentalChart'
import { JSON } from '../util/config';
// 에너지, 비트코인, 금, 환율, 오일
export default function FundarmentalPage2({ swiperRef }) {
    const chartHeight = 470
    const [mortgage, setMortgage] = useState();
    const [NonMetals, setNonMetals] = useState();
    const [interest, setInterest] = useState();
    const [deposit, setDeposit] = useState();

    useEffect(() => {
        axios.get(JSON + "/mortgage").then((response) => {
            var FIXHAI = [], RHORUSQ156N = [], MDSP = []
            response.data.forEach((value, index, array) => {
                FIXHAI.push([value.DATE, value.FIXHAI])
                RHORUSQ156N.push([value.DATE, value.RHORUSQ156N])
                MDSP.push([value.DATE, value.MDSP])
            })
            setMortgage(
                [{
                    name: "Housing Affordability Index",
                    data: FIXHAI,
                    type: 'spline',
                    color: 'silver',
                    yAxis: 0,
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }, {
                    name: "Homeownership Rate",
                    data: RHORUSQ156N,
                    type: 'spline',
                    yAxis: 1,
                    color: 'forestgreen',
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }, {
                    name: "Mortgage Debt Service Payments",
                    data: MDSP,
                    type: 'spline',
                    yAxis: 2,
                    color: 'gold',
                    zIndex: 2,
                    animation: false,
                    lineWidth: 1
                }]
            )
        });
        axios.get(JSON + "/NonMetals").then((response) => {
            var Aluminium = [], Copper = []
            response.data.forEach((value, index, array) => {
                Aluminium.push([value.Date, value.Aluminium])
                Copper.push([value.Date, value.Copper])
            })
            setNonMetals([{
                name: 'Aluminium',
                data: Aluminium,
                type: 'spline',
                color: 'silver',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: 'Copper',
                data: Copper,
                type: 'spline',
                yAxis: 1,
                color: '#A47C6D',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(JSON + "/interest_rate").then((response) => {
            var 기준금리 = [], IORB = []
            response.data.forEach((value, index, array) => {
                기준금리.push([value.DATE, value.기준금리])
                IORB.push([value.DATE, value.IORB])
            })
            setInterest([{
                name: "한국기준금리",
                data: 기준금리,
                type: 'spline',
                color: 'silver',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: "Interest Rate on Reserve Balances",
                data: IORB,
                type: 'spline',
                color: 'gold',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(JSON + "/deposit").then((response) => {
            var 고객예탁금 = [], 신용잔고 = [], 전일대비 = '', 고객예탁금_전일대비 = '', 신용잔고_전일대비 = '';
            response.data.forEach((value, index, array) => {
                고객예탁금.push([value.날짜, value.고객예탁금])
                신용잔고.push([value.날짜, value.신용잔고])
            })
            let 고객예탁금_금액 = parseInt(고객예탁금[고객예탁금.length - 1][1] / 10000).toLocaleString('ko-KR') + ' 조';
            let 신용잔고_금액 = parseInt(신용잔고[신용잔고.length - 1][1] / 10000).toLocaleString('ko-KR') + ' 조';

            전일대비 = parseInt((고객예탁금[고객예탁금.length - 1][1] - 고객예탁금[고객예탁금.length - 2][1]) / 10000)
            if (전일대비 > 0) { 고객예탁금_전일대비 = '예탁금 : ' + 고객예탁금_금액 + ' ( <span style="color:#FCAB2F;">+ ' + 전일대비 + ' 조 </span>)' }
            if (전일대비 <= 0) { 고객예탁금_전일대비 = '예탁금 : ' + 고객예탁금_금액 + ' ( <span style="color:#00F3FF;"> ' + 전일대비 + ' 조 </span>)' }

            전일대비 = parseInt((신용잔고[신용잔고.length - 1][1] - 신용잔고[신용잔고.length - 2][1]) / 1000)
            if (전일대비 > 0) { 신용잔고_전일대비 = '신용잔고 : ' + 신용잔고_금액 + ' ( <span style="color:#FCAB2F;">+ ' + 전일대비 + ' 천억 </span>)' }
            if (전일대비 <= 0) { 신용잔고_전일대비 = '신용잔고 : ' + 신용잔고_금액 + ' ( <span style="color:#00F3FF;"> ' + 전일대비 + ' 천억 </span>)' }
            var title = [고객예탁금_전일대비, 신용잔고_전일대비]
            setDeposit([{
                name: title[0],
                data: 고객예탁금,
                type: 'spline',
                color: 'dodgerblue',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: title[1],
                data: 신용잔고,
                type: 'spline',
                yAxis: 1,
                color: 'orangered',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });

    }, []);


    return (
        <>
            <Grid container spacing={1} >
                <Grid item xs={6} >

                    <Chart data={mortgage} height={chartHeight} name={'mortgage'} lengendX={17} />
                    <Chart data={NonMetals} height={chartHeight} lengendX={26} />

                </Grid>
                <Grid item xs={6}>

                    <Chart data={interest} height={chartHeight} lengendX={5} />
                    <Chart data={deposit} height={chartHeight} name={'deposit'} lengendX={-10} />

                </Grid>
            </Grid>
        </>
    )
}




