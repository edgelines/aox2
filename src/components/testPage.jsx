import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterStockChart from './LeadSectors/chart';
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
import { API_WS, TEST } from './util/config';

HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function TestPage({ }) {
    // const [message, setMessage] = useState('');
    // const [field, setField] = useState(''); // 상태 추가
    // const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리

    const [data, setData] = useState({ data: [], yAxis: { categories: null } });

    // const fetchData = async () => {
    //     const res = await axios.get(`${TEST}/LeadSectors`);
    //     console.log(res.data);
    //     setData(res.data);
    // }

    // useEffect(() => {
    //     fetchData();
    // }, [])

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/LeadSectors`);

        ws.onopen = () => {
            console.log('LeadSectors WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setData(res);
        };

        ws.onerror = (error) => {
            console.error('LeadSectors WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('LeadSectors WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함



    return (
        <Grid container spacing={1} >
            <FilterStockChart data={data.series} height={950} yAxis={data.yAxis} />
        </Grid>
    )
}
