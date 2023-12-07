import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import Chart from './fundarmentalChart'
import { API } from '../util/config';

// 에너지, 비트코인, 금, 환율, 오일
export default function FundarmentalPage1({ swiperRef }) {
    const chartHeight = 310
    const url = `${API}/fundamental`
    const [energy, setEnergy] = useState();
    const [metals, setMetals] = useState();
    const [UsdOil, setUsdOil] = useState();
    const [cryptocurrency, setCryptocurrency] = useState();
    const [moneyIndex, setMoneyIndex] = useState();
    const [UsdGold, setUsdGold] = useState();

    const fetchData = async () => {
        const energy = await axios.get(`${url}/energy`);
        setEnergy(
            [{
                name: "Brent_Oil (Candle)",
                data: energy.data.BrentOil,
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
                data: energy.data.Wti,
                type: 'spline',
                yAxis: 1,
                color: "silver",
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: "Natural_Gas",
                data: energy.data.Gas,
                type: 'spline',
                color: "lime",
                yAxis: 2,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }]
        );
        const metals = await axios.get(`${url}/metals`);
        setMetals([{
            name: 'Gold (Candle)',
            data: metals.data.Gold,
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
            data: metals.data.Silver,
            type: 'spline',
            yAxis: 1,
            color: "silver",
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }]);
        const usdOil = await axios.get(`${url}/usdOil`);
        setUsdOil([{
            name: "Brent_Oil",
            data: usdOil.data.BrentOil,
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
            data: usdOil.data.UsdKrw,
            type: 'candlestick',
            yAxis: 0,
            lineColor: 'dodgerblue',
            color: 'dodgerblue', // 하락캔들 몸통
            upLineColor: 'orangered', // docs
            upColor: 'orangered',
            zIndex: 2,
            animation: false,
        }],)
        const crypto = await axios.get(`${url}/crypto`);
        setCryptocurrency([{
            name: 'BTC/USD (Candle)',
            data: crypto.data.Btc,
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
            data: crypto.data.Eth,
            type: 'spline',
            yAxis: 1,
            color: "silver",
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }, {
            name: 'XRP/USD',
            data: crypto.data.Xrp,
            type: 'spline',
            color: "lime",
            yAxis: 2,
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }])
        const moneyIndex = await axios.get(`${url}/moneyIndex`);
        setMoneyIndex([{
            name: "USD/KRW (Candle)",
            data: moneyIndex.data.USD,
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
            data: moneyIndex.data.EUR,
            type: 'spline',
            yAxis: 1,
            color: "silver",
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }, {
            name: "USD/CNY",
            data: moneyIndex.data.CNY,
            type: 'spline',
            color: "lime",
            yAxis: 2,
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }])
        const usdGold = await axios.get(`${url}/usdGold`);
        setUsdGold([{
            name: "Gold",
            data: usdGold.data.Gold,
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
            data: usdGold.data.UsdKrw,
            type: 'candlestick',
            yAxis: 1,
            lineColor: 'dodgerblue',
            color: 'dodgerblue', // 하락캔들 몸통
            upLineColor: 'orangered', // docs
            upColor: 'orangered',
            zIndex: 2,
            animation: false,
        }])
    }

    useEffect(() => { fetchData() }, []);

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

