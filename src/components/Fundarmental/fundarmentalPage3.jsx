import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './fundarmentalChart'
import { API } from '../util/config';
// 에너지, 비트코인, 금, 환율, 오일
export default function FundarmentalPage3({ swiperRef }) {
    const chartHeight = 470
    const [bond, setBond] = useState();
    const [ppi, setPPI] = useState();
    const [cpi, setCPI] = useState();
    const [inventories, setInventories] = useState();
    const getData = async (name) => { return await axios.get(`${API}/fundamental/${name}`); }
    const fetchData = async () => {
        const promises = [];
        promises.push(getData('bond'));
        promises.push(getData('ppi'));
        promises.push(getData('cpi'));
        promises.push(getData('inventories'));

        const [bond, ppi, cpi, inventories] = await Promise.all(promises);
        setBond(
            [{
                name: '10-Years',
                data: bond.data.T10Y2Y,
                type: 'spline',
                color: 'silver',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: '5-Years',
                data: bond.data.T5YFF,
                type: 'spline',
                color: 'forestgreen',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: '1-Year',
                data: bond.data.T1YFF,
                type: 'spline',
                color: 'gold',
                zIndex: 2,
                animation: false,
                lineWidth: 1
            }]
        );
        setPPI([{
            name: "PPI : Mining Industries",
            data: ppi.data.PCUOMINOMIN,
            type: 'spline',
            color: 'silver',
            yAxis: 0,
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }, {
            name: "Median CPI",
            data: ppi.data.MEDCPIM158SFRBCLE,
            type: 'spline',
            yAxis: 1,
            color: 'gold',
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }])
        setCPI([{
            name: 'CPI',
            data: cpi.data,
            type: 'spline',
            color: 'silver',
            yAxis: 0,
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }])
        setInventories([{
            name: "Inventories to Sales Ratio",
            data: inventories.data.ISRATIO,
            type: 'spline',
            color: 'silver',
            yAxis: 0,
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }, {
            name: 'Retailers Inventories',
            data: inventories.data.RETAILIMSA,
            type: 'spline',
            yAxis: 1,
            color: 'forestgreen',
            animation: false,
            zIndex: 3,
            lineWidth: 1
        }, {
            name: 'Retailers: Inventories to Sales Ratio',
            data: inventories.data.RETAILIRSA,
            type: 'spline',
            yAxis: 0,
            color: 'gold',
            zIndex: 2,
            animation: false,
            lineWidth: 1
        }])
    }


    useEffect(() => { fetchData(); }, []);

    return (
        <>

            <Grid container spacing={1} >
                <Grid item xs={6} >

                    <Chart data={bond} height={chartHeight} name={'Bond'} lengendX={10} />
                    <Chart data={ppi} height={chartHeight} name={'ppi'} lengendX={18} />

                </Grid>
                <Grid item xs={6}>

                    <Chart data={cpi} height={chartHeight} name={'cpi'} lengendX={16} />
                    <Chart data={inventories} height={chartHeight} name={'inventories'} lengendX={20} />

                </Grid>
            </Grid>
        </>
    )
}
