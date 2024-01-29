import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Stack, Divider, Input } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styledComponents from 'styled-components';
import { DataTableStyleDefault } from './util';


export const renderProgress = (params) => {
    let color;
    if (params.value < -60) {
        color = '#FCAB2F';  // 값이 증가했다면 빨간색
    }

    if (params.value == null) {
        return '';
    } else {
        return (

            <div style={{ color: color }}> {`${parseInt(params.value).toLocaleString('kr')} %`} </div>
        );
    }
}

export const StyledInput = styled(Input)(({ theme, fontSize }) => ({
    '& MuiInput-root': {
        color: '#fff',
        textAlign: 'center'
    }
    // backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    // fontSize: fontSize ? fontSize : '8px',
    // color: '#efe9e9ed', // 비활성화 상태에서의 글자색
    // '&.Mui-selected': { // 활성화 상태에서의 스타일
    //     backgroundColor: '#efe9e9ed', // 활성화 상태에서의 배경색
    //     color: '#404040', // 활성화 상태에서의 글자색
    //     '&:hover': { // 마우스 오버 상태에서의 스타일
    //         backgroundColor: '#d8d8d8', // 마우스 오버 상태에서의 배경색
    //     },
    // },
    // '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
    //     backgroundColor: '#505050', // 비활성화 상태에서의 마우스 오버 배경색
    // },
}));