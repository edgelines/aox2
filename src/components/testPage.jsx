import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, ToggleButtonGroup, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterStockChart from './LeadSectors/chart';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
import Chart from './Test/chart';
import SampleChart from './Test/sampleChart';
import { API_WS } from './util/config';



export default function TestPage({ }) {
    const [message, setMessage] = useState('');
    const [field, setField] = useState('재무'); // 상태 추가
    const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리
    const [dataset2, setDataset2] = useState({ time: [], data: [] });
    const [timeLine, setTimeLine] = useState(null);
    const [dataset, setDataset] = useState(null);
    const handlePage = (event, value) => { if (value !== null) { setField(value); console.log(value) } }

    // const fetchData = async () => {
    //     // const response = await fetch('https://demo-live-data.highcharts.com/population.json');
    //     // const data = await response.json();
    //     // setDataset(data);

    //     const res = await axios.get(`http://cycleofnature.iptime.org:2441/api/test/getPowerVolumeChart/20240614`);
    //     const tmp = res.data.Data.map(item => ({
    //         name: item.time,
    //         data: item.data,
    //     }))
    //     console.log('get data : ', tmp);
    //     setDataset2(tmp);
    //     setTimeLine(res.data.시간);
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    // useEffect(() => {
    //     const websocket = new WebSocket(`${API_WS}/TestKeyworld`);

    //     websocket.onopen = () => {
    //         console.log('Connected to the server');
    //     };

    //     websocket.onmessage = (event) => {

    //         const res = JSON.parse(event.data)
    //         console.log(res);

    //     };

    //     websocket.onerror = (error) => {
    //         console.log('WebSocket error: ', error);
    //     };

    //     setWs(websocket); // 웹소켓 인스턴스를 상태에 저장
    //     // console.log(websocket);

    //     // 컴포넌트 언마운트 시 웹소켓 연결 종료
    //     return () => {
    //         websocket.close();
    //     };
    // }, []);

    // useEffect(() => {
    //     // field 상태가 변경될 때 데이터 전송
    //     const sendData = (field) => {
    //         if (ws && ws.readyState === WebSocket.OPEN && field) {
    //             const data = { key: field };
    //             ws.send(JSON.stringify(data));
    //         }
    //     };
    //     sendData(field);
    // }, [ws, field]); // field 또는 ws 상태가 변경될 때마다 실행

    const legend = {
        에너지: '#00FF99',
        반도체: 'red',
        건설: '#c9c9c9',
        금융: '#00B0F0',
        필수소재: '#fffc33',
        사치재: 'orange',
        게임: 'white',
        바이오: '#70AD47',
        기타: '#996633'
    };

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            {Object.keys(legend).map((sector) => (
                <Sector key={sector} legend={legend} name={sector} />
            ))}



        </Grid>

    )
}


const Sector = ({ legend, name }) => {
    const color = legend[name];

    return (
        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body5" sx={{ color }}>
                &#x25CF;
            </Typography>
            <Typography variant="body2">
                {name}
            </Typography>
        </Grid>
    )
}