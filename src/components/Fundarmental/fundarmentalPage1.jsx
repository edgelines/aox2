import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import Chart from './fundarmentalChart'
import { JSON } from '../util/config';

// 에너지, 비트코인, 금, 환율, 오일
export default function FundarmentalPage1({ swiperRef }) {
    const chartHeight = 310
    const [energy, setEnergy] = useState();
    const [metals, setMetals] = useState();
    const [UsdOil, setUsdOil] = useState();
    const [cryptocurrency, setCryptocurrency] = useState();
    const [moneyIndex, setMoneyIndex] = useState();
    const [UsdGold, setUsdGold] = useState();
    useEffect(() => {
        axios.get(JSON + "/Energy").then((response) => {
            var Oil = [], Wt = [], Gas = []
            response.data.forEach((value, index, array) => {
                Oil.push([value.Date, value.Close, value.Open, value.High, value.Low])
                Wt.push([value.Date, value.WTI])
                Gas.push([value.Date, value.Natural_Gas])
            })
            setEnergy(
                [{
                    name: "Brent_Oil (Candle)",
                    data: Oil,
                    type: 'candlestick',
                    yAxis: 0,
                    lineColor: "gold",
                    color: "gold",
                    upLineColor: "orangered",
                    upColor: "orangered",
                    zIndex: 2,
                    animation: false,
                }, {
                    name: "WTI",
                    data: Wt,
                    type: 'spline',
                    yAxis: 1,
                    color: "silver",
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }, {
                    name: "Natural_Gas",
                    data: Gas,
                    type: 'spline',
                    color: "lime",
                    yAxis: 2,
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }]
            )
        });
        axios.get(JSON + "/Metals").then((response) => {
            var Gold = [], Silver = []
            response.data.forEach((value, index, array) => {
                Gold.push([value.Date, value.Close, value.Open, value.High, value.Low])
                Silver.push([value.Date, value.Silver])
            })
            setMetals([{
                name: 'Gold (Candle)',
                data: Gold,
                type: 'candlestick',
                yAxis: 0,
                lineColor: 'gold',
                color: 'gold', // 하락캔들 몸통
                upLineColor: 'orangered', // docs
                upColor: 'orangered',
                zIndex: 2,
                animation: false,
            }, {
                name: 'Silver',
                data: Silver,
                type: 'spline',
                yAxis: 1,
                color: "silver",
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(JSON + "/UsdOil").then((response) => {
            var USD = [], Oil = []
            response.data.forEach((value, index, array) => {
                USD.push([value.Date, value.USD_Close, value.USD_Open, value.USD_High, value.USD_Low])
                Oil.push([value.Date, value.Oil_Close, value.Oil_Open, value.Oil_High, value.Oil_Low])
            })
            setUsdOil([{
                name: "Brent_Oil",
                data: Oil,
                type: 'candlestick',
                yAxis: 1,
                lineColor: 'silver',
                color: 'silver', // 하락캔들 몸통
                upLineColor: 'gold', // docs
                upColor: 'gold',
                animation: false,
                zIndex: 3,
            }, {
                name: 'USD/KRW',
                data: USD,
                type: 'candlestick',
                yAxis: 0,
                lineColor: 'dodgerblue',
                color: 'dodgerblue', // 하락캔들 몸통
                upLineColor: 'orangered', // docs
                upColor: 'orangered',
                zIndex: 2,
                animation: false,
            }],)
        });
        axios.get(JSON + "/Cryptocurrency").then((response) => {
            var Btc = [], Eth = [], Xrp = []
            response.data.forEach((value, index, array) => {
                Btc.push([value.Date, value.Close, value.Open, value.High, value.Low])
                Eth.push([value.Date, value['ETH/USD']])
                Xrp.push([value.Date, value['XRP/USD']])
            })
            setCryptocurrency([{
                name: 'BTC/USD (Candle)',
                data: Btc,
                type: 'candlestick',
                yAxis: 0,
                lineColor: "orangered",
                color: "orangered", // 하락캔들 몸통
                upLineColor: "gold", // docs
                upColor: "gold",
                zIndex: 2,
                animation: false,
            }, {
                name: 'ETH/USD',
                data: Eth,
                type: 'spline',
                yAxis: 1,
                color: "silver",
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: 'XRP/USD',
                data: Xrp,
                type: 'spline',
                color: "lime",
                yAxis: 2,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(JSON + "/MoneyIndex").then((response) => {
            var USD = [], EUR = [], CNY = []
            response.data.forEach((value, index, array) => {
                USD.push([value.Date, value.Close, value.Open, value.High, value.Low])
                EUR.push([value.Date, value['USD/EUR']])
                CNY.push([value.Date, value['USD/CNY']])
            })
            setMoneyIndex([{
                name: "USD/KRW (Candle)",
                data: USD,
                type: 'candlestick',
                yAxis: 0,
                lineColor: "gold",
                color: "gold",
                upLineColor: "orangered",
                upColor: "orangered",
                zIndex: 2,
                animation: false,
            }, {
                name: "USD/EUR",
                data: EUR,
                type: 'spline',
                yAxis: 1,
                color: "silver",
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: "USD/CNY",
                data: CNY,
                type: 'spline',
                color: "lime",
                yAxis: 2,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(JSON + "/UsdGold").then((response) => {
            var USD = [], Gold = []
            response.data.forEach((value, index, array) => {
                USD.push([value.Date, value.USD_Close, value.USD_Open, value.USD_High, value.USD_Low])
                Gold.push([value.Date, value.Gold_Close, value.Gold_Open, value.Gold_High, value.Gold_Low])
            })
            setUsdGold([{
                name: "Gold",
                data: Gold,
                type: 'candlestick',
                yAxis: 0,
                lineColor: 'silver',
                color: 'silver', // 하락캔들 몸통
                upLineColor: 'gold', // docs
                upColor: 'gold',
                animation: false,
                zIndex: 3,
            }, {
                name: 'USD/KRW',
                data: USD,
                type: 'candlestick',
                yAxis: 1,
                lineColor: 'dodgerblue',
                color: 'dodgerblue', // 하락캔들 몸통
                upLineColor: 'orangered', // docs
                upColor: 'orangered',
                zIndex: 2,
                animation: false,
            }])
        });
    }, []);

    return (
        <>
            <Grid container spacing={1} >
                <Grid item xs={6} >

                    <Chart data={energy} height={chartHeight} name={'energy'} lengendX={17} />
                    <Chart data={metals} height={chartHeight} lengendX={27} />
                    <Chart data={UsdOil} height={chartHeight} lengendX={25} />

                </Grid>
                <Grid item xs={6}>

                    <Chart data={cryptocurrency} height={chartHeight} lengendX={32} />
                    <Chart data={moneyIndex} height={chartHeight} lengendX={25} />
                    <Chart data={UsdGold} height={chartHeight} name={'UsdGold'} lengendX={25} />

                </Grid>
            </Grid>
        </>
    )
}

