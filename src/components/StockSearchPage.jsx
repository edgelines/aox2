import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, RadioGroup, Radio, FormLabel, FormControlLabel, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StockChart from './SectorsPage/stockChart'
import { SectorsName15 } from './util/util';
import { API, JSON, STOCK } from './util/config';
import CSS from './TreasuryStock.module.css'

export default function TreasuryStockPage({ swiperRef, StockSearch }) {

    useEffect(() => {
        console.log(StockSearch);
    }, [StockSearch])

    return (
        <Grid container>

            test

        </Grid>
    )
}

const CutomTable = ({ data, title, 업종명을상위컴포넌트로전달 }) => {
    const 업종선택 = (item) => { 업종명을상위컴포넌트로전달(item); }
    return (
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell align='center' colSpan={2} sx={{ color: '#efe9e9ed' }}>
                        {title}
                    </TableCell>
                </TableRow>
                {data.map(item => (
                    <TableRow key={item.업종명} onClick={() => 업종선택(item)} className={CSS.listGroupitem} >
                        <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }}>{(item.업종명).slice(0, 6)}</TableCell>
                        <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px', width: '20px' }}>{item.갯수}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10.5px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10.5px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                },
            },
            defaultProps: {
                headerHeight: 20,
            },
        },
    },
});