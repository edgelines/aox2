import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IndexChart from './util/IndexChart';
import IndexChart2 from './util/IndexChart2';
import CoreChart from './util/CoreChart';
import MonthTable from './ELW/monthTable';
import MonthChart from './ELW/monthChart';
import GpoChart from './ELW/GpoChart';
import { numberWithCommas, StyledToggleButton, StyledButton } from './util/util';
import Kospi200CurrentValue from './Index/kospi200CurrentValue';
import ELW_BarChart from './ELW/BarChart';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
import { customRsi, williamsR } from 'indicatorts';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { MarketKospi200 } from '../store/indexData';
import { API_WS } from './util/config';

HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function TestPage({ swiperRef }) {
    const [message, setMessage] = useState('');
    const [field, setField] = useState(''); // 상태 추가
    const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리

    useEffect(() => {
        const websocket = new WebSocket(`${API_WS}/test`);

        websocket.onopen = () => {
            console.log('Connected to the server');
        };

        websocket.onmessage = (event) => {
            console.log('Message from server ', event.data);
            setMessage(event.data);
        };

        websocket.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };

        setWs(websocket); // 웹소켓 인스턴스를 상태에 저장
        console.log(websocket);

        // 컴포넌트 언마운트 시 웹소켓 연결 종료
        return () => {
            websocket.close();
        };
    }, []);

    useEffect(() => {
        // field 상태가 변경될 때 데이터 전송
        const sendData = () => {
            if (ws && ws.readyState === WebSocket.OPEN && field) {
                const data = { action: "update", data: { id: 1, value: field } };
                ws.send(JSON.stringify(data));
            }
        };
        console.log(field, ws, WebSocket.OPEN);
        sendData();
    }, [field, ws]); // field 또는 ws 상태가 변경될 때마다 실행

    // 예시 버튼 클릭 핸들러
    const handleClick = () => {
        setField('newValue'); // 여기서 실제 필요한 로직으로 `field` 상태 업데이트
    };

    return (
        <Grid container spacing={1} >
            <button onClick={handleClick}>Send Data via WebSocket</button>
            <h2>Server Response</h2>
            <p>{message}</p>
        </Grid>
    )
}
