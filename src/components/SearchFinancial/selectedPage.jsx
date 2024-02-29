import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from '../util/util';
import TreeMap from './treeMap';
import CrossChartPage from './crossChartPage';

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                columnHeader: {
                    fontSize: '9px',
                    color: '#efe9e9ed'
                },
            },
        },
    },
});

const table_columns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, {
        field: '순위', headerName: '업종순위', width: 60,
        align: 'center', headerAlign: 'left',
    }, {
        field: '업종명', headerName: '업종명', width: 120,
        align: 'left', headerAlign: 'center',
    }, {
        field: '집계_매출', headerName: '매출', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '집계_영업이익', headerName: '영업이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '집계_당기순이익', headerName: '순이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_매출', headerName: '매출', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_영업이익', headerName: '영업이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_당기순이익', headerName: '순이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자_영업이익', headerName: '영업이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자_당기순이익', headerName: '순이익', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '전년동분기대비', headerName: '전년 동분기', width: 70,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계', headerName: '미집계', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '전체종목수', headerName: '전체종목수', width: 65,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자기업', headerName: '흑자기업', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '순이익기업', headerName: '순이익기업%', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            return `${parseInt(params.value)} %`;
        }
    }
]

export function Table({ swiperRef, tableData, getIndustryStockData }) {

    return (
        <Grid container>
            <Grid item container>
                <Grid item xs={2.1}></Grid>
                <Grid item xs={1.9}>집계</Grid>
                <Grid item xs={1.6}>분기</Grid>
                <Grid item xs={1.3}>흑자</Grid>
            </Grid>
            <Grid item container sx={{ height: 440, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={tableData}
                        columns={table_columns}
                        rowHeight={25}
                        onCellClick={(params, event) => {
                            getIndustryStockData(params);
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            color: 'white', border: 'none',
                            ...DataTableStyleDefault,
                            [`& .${gridClasses.cell}`]: { py: 1, },
                            '.MuiTablePagination-root': { color: '#efe9e9ed' },
                            '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                            '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                            '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="분기_매출"]': { borderLeft: '1.5px solid #ccc' },
                            '[data-field="분기_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="전년동분기대비"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="흑자_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="전체종목수"]': { borderLeft: '1.5px solid #ccc', borderRight: '1.5px solid #ccc' },
                            '[data-field="흑자기업"]': { borderRight: '1.5px solid #ccc' },
                        }}
                    />
                </ThemeProvider>

            </Grid>

        </Grid>
    )
}

export function Tree({ tableData, onIndustryClick }) {

    return (
        <Grid container>
            <TreeMap data={tableData} onIndustryClick={onIndustryClick} height={440} />
        </Grid>
    )
}

export function Cross({ swiperRef, tableData }) {

    return (
        <Grid container>
            <CrossChartPage swiperRef={swiperRef} data={tableData} />
        </Grid>
    )
}