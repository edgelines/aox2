import React, { useState, useEffect, useRef } from 'react';
// import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
// import { renderProgress } from '../sectorSearchPage';


export const williamsColor = (value) => {
    let color = null;
    if (value >= -20) {
        color = 'tomato';
    } else if (value >= -35) {
        color = 'orange';
    } else if (value >= -50) {
        color = 'gold';
    } else if (value >= -65) {
        color = 'yellow';
    } else if (value >= -80) {
        color = '#98da77';
    } else {
        color = 'dodgerblue';
    }
    return color;
}


export const columns = [
    {
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
            const invest = params.row.Invest
            const bgColor = filter_A ? '#FCAB2F' : invest ? yellow[500] : null
            const color = filter_A ? '#404040' : invest ? '#404040' : null

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
    }, {
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
// field: '체결강도', headerName: '체결강도', width: 70,
// align: 'right', headerAlign: 'center',
// renderCell: (params) => {
//     const color = params.value > 100 ? '#e89191' : 'dodgerblue'
//     const progress = renderProgress({ value: params.value, valueON: true, color: color, val2: 0.07 })
//     return (
//         <Box sx={{ position: 'relative', mt: -2 }}>
//             <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: -2 }}>
//                 {params.value.toLocaleString('kr')}
//             </Box>
//             <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -5.5 }}>
//                 {progress}
//             </Box>
//         </Box>
//     )
// }

export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '11px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '11px', // 헤더 높이를 원하는 값으로 설정합니다.
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