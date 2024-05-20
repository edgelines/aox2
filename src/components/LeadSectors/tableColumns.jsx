// import * as React from 'react';
import React, { useEffect, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { renderProgress } from '../sectorSearchPage';
import { Box } from '@mui/material';

// DataTable Style Default
export const DataTableStyleDefault = {
    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '.MuiDataGrid-columnHeaders': {
        minHeight: '30px !important',  // 원하는 높이 값으로 설정
        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
        backgroundColor: 'rgba(230, 230, 230, 0.3)'
    },
}

export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '9px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '9px', // 헤더 높이를 원하는 값으로 설정합니다.
                    color: '#efe9e9ed'
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    color: '#efe9e9ed'
                },
            },
            defaultProps: {
                headerHeight: 15,
            },
        },
    },
});


// Lead Sector 중앙 상단 Table Columns
export const themesTableColumns = [
    {
        field: '순위', headerName: '순위', width: 50,
        align: 'center', headerAlign: 'left',
    }, {
        field: '테마명', headerName: '테마명', width: 75,
        align: 'left', headerAlign: 'left',
    }, {
        field: '등락률', headerName: '등락률', width: 50,
        align: 'left', headerAlign: 'left',
        renderCell: (params) => {
            const progress = renderProgress({ value: params.value, valueON: true, color: '#e89191', val2: 8 })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                        {params.value.toFixed(1)} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }, {
        field: '종목수', headerName: '갯수', width: 50,
        align: 'center', headerAlign: 'center',
    }
]

export const stockTableColumns = [
    {
        field: '종목명', headerName: '종목명', width: 80,
        align: 'left', headerAlign: 'left',
    }, {
        field: '등락률', headerName: '등락률', width: 70,
        align: 'left', headerAlign: 'center',
        // valueFormatter: (params) => {
        //     if (params.value == null) { return ''; }
        //     return `${params.value} %`;
        // }
        renderCell: (params) => {
            const row = params.row;
            const progress = renderProgress({ value: row.등락률, valueON: true, val2: 5, color: '#e89191' })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1 }}>
                        {params.value} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }, {
        field: '전일대비거래량', headerName: '전일%', width: 70,
        align: 'left', headerAlign: 'center',
        // valueFormatter: (params) => {
        //     if (params.value == null) { return ''; }
        //     return `${params.value.toLocaleString('ko-KR')} %`;
        // }
        renderCell: (params) => {
            const row = params.row;
            const progress = renderProgress({ value: row.전일대비거래량, valueON: true, val2: 0.2, color: '#91bde8' })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1 }}>
                        {(params.value * 100).toLocaleString('kr')} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }
]

export const industryColumns = [
    {
        field: '업종명', headerName: '업종명', width: 160,
        align: 'left', headerAlign: 'left',
    }, {
        field: '전체종목수', headerName: '갯수', width: 50,
        align: 'right', headerAlign: 'center',
    }
]

export const themesTableColumns_search = [
    {
        field: '순위', headerName: '순위', width: 50,
        align: 'center', headerAlign: 'left',
    }, {
        field: '테마명', headerName: '테마명', width: 75,
        align: 'left', headerAlign: 'left',
    }, {
        field: '등락률', headerName: '등락률', width: 50,
        align: 'left', headerAlign: 'left',
        renderCell: (params) => {
            const progress = renderProgress({ value: params.value, valueON: true, color: '#e89191', val2: 8 })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                        {params.value.toFixed(1)} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }
]


// 전체 업종 등락률
// 왼쪽 업종명/전일대비
export const industryTableColumns = [
    { field: '업종명', headerName: '업종명', width: 72 },
    {
        field: "전일대비",
        headerName: "전일대비",
        width: 60,
        renderCell: (params) => {
            const progress = renderProgress({ value: params.value, valueON: true, color: '#e89191', val2: 8 })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                        {params.value.toFixed(2)} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    },
];