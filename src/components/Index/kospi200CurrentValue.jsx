import React, { useEffect, useState } from 'react';
import { Grid, Box, Table } from '@mui/material';
import axios from 'axios';
import { API, JSON } from '../util/config';

export default function Kospi200CurrentValue({ hiddenTitle, valueFont, valueTitle }) {
    const [net, setNet] = useState(null);
    const [marketValue, setMarketValue] = useState(null);

    const fetchData = async () => {
        const response = await axios.get(`${API}/MarketDetail`);
        const 전일대비 = response.data[0].전일대비;
        const 지수 = response.data[0].지수.toFixed(2) + ' ( ' + 전일대비 + '% )'
        setNet(전일대비);
        setMarketValue(지수)
    }
    useEffect(() => {
        fetchData();
    }, [])

    // 2분 주기 업데이트
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();
            const dayOfWeek = now.getDay();

            if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
                fetchData()
            }

        }, 1000 * 60 * 2);
        return () => clearInterval(intervalId);
    }, [])

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} >
                <div>
                    {!hiddenTitle && <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi 200 : </span>}
                    {
                        net ?
                            <>
                                {net > 0 ?
                                    <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '34px', fontWeight: 'bolder' }}> {marketValue} </span>
                                    : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '34px', fontWeight: 'bolder' }}> {marketValue} </span>}
                            </>
                            : ''
                    }
                </div>
            </Grid>
        </Grid>

    )
}