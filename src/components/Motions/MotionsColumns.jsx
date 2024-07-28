import React, { useState, useEffect, useRef } from 'react';
// import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// import { renderProgress } from '../sectorSearchPage';

export const columns = [
    {
        field: '업종명', headerName: '업종명', width: 80,
        align: 'left', headerAlign: 'left',
    }, {
        field: '테마명', headerName: '테마명', width: 180,
        align: 'left', headerAlign: 'left',
    }, {
        field: '종목명', headerName: '종목명', width: 70,
        align: 'left', headerAlign: 'left',
        renderCell: (params) => {
            return (
                <span style={{ backgroundColor: params.row.color, color: '#404040' }}> {params.value}</span>
            )
        }
    }, {
        field: 'y', headerName: 'R %', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 0 ? '#FCAB2F' : '#00F3FF'
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
    }, {
        field: 'w14', headerName: 'w14', width: 40,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'w33', headerName: 'w33', width: 40,
        align: 'right', headerAlign: 'center',
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