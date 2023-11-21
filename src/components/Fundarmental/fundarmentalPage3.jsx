import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './fundarmentalChart'
import { myJSON } from '../util/config';
// 에너지, 비트코인, 금, 환율, 오일
export default function FundarmentalPage3({ swiperRef }) {
    const chartHeight = 470
    const [bond, setBond] = useState();
    const [ppi, setPPI] = useState();
    const [cpi, setCPI] = useState();
    const [inventories, setInventories] = useState();
    useEffect(() => {
        axios.get(myJSON + "/bond").then((response) => {
            var bond10 = [], bond5 = [], bond1 = []
            response.data.forEach((value, index, array) => {
                bond10.push([value.DATE, value.T10Y2Y])
                bond5.push([value.DATE, value.T5YFF])
                bond1.push([value.DATE, value.T1YFF])
            })
            setBond(
                [{
                    name: '10-Years',
                    data: bond10,
                    type: 'spline',
                    color: 'silver',
                    yAxis: 0,
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }, {
                    name: '5-Years',
                    data: bond5,
                    type: 'spline',
                    color: 'forestgreen',
                    animation: false,
                    zIndex: 3,
                    lineWidth: 1
                }, {
                    name: '1-Year',
                    data: bond1,
                    type: 'spline',
                    color: 'gold',
                    zIndex: 2,
                    animation: false,
                    lineWidth: 1
                }]
            )
        });
        axios.get(myJSON + "/ppi").then((response) => {
            var PPI = [], Median_CPI = []
            response.data.forEach((value, index, array) => {
                PPI.push([value.DATE, value.PCUOMINOMIN])
                Median_CPI.push([value.DATE, value.MEDCPIM158SFRBCLE])
            })
            setPPI([{
                name: "PPI : Mining Industries",
                data: PPI,
                type: 'spline',
                color: 'silver',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: "Median CPI",
                data: Median_CPI,
                type: 'spline',
                yAxis: 1,
                color: 'gold',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(myJSON + "/cpi").then((response) => {
            var CPI = []
            response.data.forEach((value, index, array) => {
                CPI.push([value.DATE, value.STICKCPIM157SFRBATL])
            })
            setCPI([{
                name: 'CPI',
                data: CPI,
                type: 'spline',
                color: 'silver',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }])
        });
        axios.get(myJSON + "/inventories").then((response) => {
            var ISRATIO = [], RETAILIMSA = [], RETAILIRSA = []
            response.data.forEach((value, index, array) => {
                ISRATIO.push([value.DATE, value.ISRATIO])
                RETAILIMSA.push([value.DATE, value.RETAILIMSA])
                RETAILIRSA.push([value.DATE, value.RETAILIRSA])
            })
            setInventories([{
                name: "Inventories to Sales Ratio",
                data: ISRATIO,
                type: 'spline',
                color: 'silver',
                yAxis: 0,
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: 'Retailers Inventories',
                data: RETAILIMSA,
                type: 'spline',
                yAxis: 1,
                color: 'forestgreen',
                animation: false,
                zIndex: 3,
                lineWidth: 1
            }, {
                name: 'Retailers: Inventories to Sales Ratio',
                data: RETAILIRSA,
                type: 'spline',
                yAxis: 0,
                color: 'gold',
                zIndex: 2,
                animation: false,
                lineWidth: 1
            }])
        });

    }, []);




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
