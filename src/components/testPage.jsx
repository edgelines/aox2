import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, ToggleButtonGroup, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterStockChart from './LeadSectors/chart';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
import Chart from './Test/chart';
import { API_WS, TEST } from './util/config';



export default function TestPage({ }) {
    const [message, setMessage] = useState('');
    const [field, setField] = useState('재무'); // 상태 추가
    const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리

    const handlePage = (event, value) => { if (value !== null) { setField(value); console.log(value) } }

    useEffect(() => {
        const websocket = new WebSocket(`${API_WS}/TestKeyworld`);

        websocket.onopen = () => {
            console.log('Connected to the server');
        };

        websocket.onmessage = (event) => {

            const res = JSON.parse(event.data)
            console.log(res);

        };

        websocket.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };

        setWs(websocket); // 웹소켓 인스턴스를 상태에 저장
        // console.log(websocket);

        // 컴포넌트 언마운트 시 웹소켓 연결 종료
        return () => {
            websocket.close();
        };
    }, []);

    useEffect(() => {
        // field 상태가 변경될 때 데이터 전송
        const sendData = (field) => {
            if (ws && ws.readyState === WebSocket.OPEN && field) {
                const data = { key: field };
                ws.send(JSON.stringify(data));
            }
        };
        sendData(field);
    }, [ws, field]); // field 또는 ws 상태가 변경될 때마다 실행

    return (
        <Grid container >
            {/* <ToggleButtonGroup
                color='info'
                exclusive
                size="small"
                value={field}
                onChange={handlePage}
                sx={{ pl: 1.3 }}
            >
                <StyledToggleButton fontSize={'10px'} value="재무">재무</StyledToggleButton>
                <StyledToggleButton fontSize={'10px'} value="사업내용">사업내용</StyledToggleButton>
                <StyledToggleButton fontSize={'10px'} value="테마">테마</StyledToggleButton>
                <StyledToggleButton fontSize={'10px'} value="주요">주요제품/주요주주</StyledToggleButton>
            </ToggleButtonGroup> */}
            <Grid item xs={12}>
                <Chart />

            </Grid>

        </Grid>

    )
}
