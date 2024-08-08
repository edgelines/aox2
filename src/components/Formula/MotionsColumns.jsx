import React, { useState, useEffect, useRef } from 'react';
// import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { williamsColor } from '../Motions/MotionsColumns';
// import { renderProgress } from '../sectorSearchPage';


export const base_columns = [{
    field: '업종명', headerName: '업종명', width: 80,
    align: 'left', headerAlign: 'left',
    renderCell: (params) => {
        return (
            <span style={{ backgroundColor: params.row.color, color: '#404040' }}>{params.value}</span>
        )
    }
}, {
    field: '테마명', headerName: '테마명', width: 120,
    align: 'left', headerAlign: 'left',
}, {
    field: '테마갯수', headerName: '테마#', width: 50,
    align: 'right', headerAlign: 'left',
}, {
    field: '종목명', headerName: '종목명', width: 70,
    align: 'left', headerAlign: 'left',
    renderCell: (params) => {
        const filter_A = params.row.filter_A

        const bgColor = filter_A ? '#FCAB2F' : null
        const color = filter_A ? '#404040' : null

        return (
            <span style={{ backgroundColor: bgColor, color: color }}>{params.value}</span>
        )
    }
}, {
    field: 'y', headerName: 'R %', width: 50,
    align: 'right', headerAlign: 'center',
    renderCell: (params) => {
        const color = params.value > 10 ? 'tomato' : '#FCAB2F'
        return (
            <span style={{ color: color }}> {params.value.toFixed(1)}</span>
        )
    }
}, {
    field: '전일대비거래량', headerName: 'V %', width: 60,
    align: 'right', headerAlign: 'center',
    valueFormatter: (params) => {
        return `${params.value.toLocaleString('kr')} %`;
    }
}]

export const now_columns = [
    ...base_columns,
    {
        field: 'w9', headerName: 'w9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'w14', headerName: 'w14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'w33', headerName: 'w33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'CCI_4', headerName: 'C4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 130 ? '#FCAB2F' : null
            return (
                <span style={{ color: color }}> {params.value.toFixed(1)}</span>
            )
        }
    }, {
        field: 'CCI_2_Sig', headerName: 'C4S', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'CCI_11', headerName: 'C11', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'CCI_4_Sig', headerName: 'C11S', width: 40,
        align: 'right', headerAlign: 'center',
    }
]

export const b1_columns = [
    ...base_columns,
    {
        field: 'B1_w9', headerName: 'w9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B1_w14', headerName: 'w14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B1_w33', headerName: 'w33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B1_CCI_4', headerName: 'C4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 130 ? '#FCAB2F' : null
            return (
                <span style={{ color: color }}> {params.value.toFixed(1)}</span>
            )
        }
    }, {
        field: 'B1_CCI_2_Sig', headerName: 'C4S', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'B1_CCI_11', headerName: 'C11', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'B1_CCI_4_Sig', headerName: 'C11S', width: 40,
        align: 'right', headerAlign: 'center',
    }
]

export const b2_columns = [
    ...base_columns,
    {
        field: 'B2_w9', headerName: 'w9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B2_w14', headerName: 'w14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B2_w33', headerName: 'w33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = williamsColor(params.value)
            return (
                <span style={{ backgroundColor: color, width: 40, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: 'B2_CCI_4', headerName: 'C4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 130 ? '#FCAB2F' : null
            return (
                <span style={{ color: color }}> {params.value.toFixed(1)}</span>
            )
        }
    }, {
        field: 'B2_CCI_2_Sig', headerName: 'C4S', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'B2_CCI_11', headerName: 'C11', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'B2_CCI_4_Sig', headerName: 'C11S', width: 40,
        align: 'right', headerAlign: 'center',
    }
]


export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    color: '#efe9e9ed'
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '11px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    color: '#efe9e9ed'
                },
            },
            defaultProps: {
                headerHeight: 15,
            },
        },
    },
});