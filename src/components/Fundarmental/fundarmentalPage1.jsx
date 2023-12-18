import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Skeleton } from '@mui/material';
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
    const [isLoading, setIsLoading] = useState(false);
    const getData = async (name) => { return await axios.get(`${url}/${name}`); }
    const fetchData = async () => {
        setIsLoading(true);
        const promises = [];
        promises.push(getData('energy'));
        promises.push(getData('metals'));
        promises.push(getData('usdOil'));
        promises.push(getData('crypto'));
        promises.push(getData('moneyIndex'));
        promises.push(getData('usdGold'));

        const [energy, metals, usdOil, crypto, moneyIndex, usdGold] = await Promise.all(promises);
        setIsLoading(false);
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


        // const energy = await axios.get(`${url}/energy`);
        // const metals = await axios.get(`${url}/metals`);
        // const usdOil = await axios.get(`${url}/usdOil`);
        // const crypto = await axios.get(`${url}/crypto`);
        // const moneyIndex = await axios.get(`${url}/moneyIndex`);
        // const usdGold = await axios.get(`${url}/usdGold`);
    }

    useEffect(() => { fetchData() }, []);

    return (
        <>
            {isLoading ? (
                <Skeleton variant="rectangular" height={'100%'} animation="wave" />
            ) : (
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

            )}

        </>
    )
}

