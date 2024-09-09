import React, { useState, useEffect, useRef } from 'react';
// import { Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { williamsColor } from '../Motions/MotionsColumns';
import { yellow } from '@mui/material/colors';
// import { renderProgress } from '../sectorSearchPage';

// 5중가, 6중가, 6고기 컬럼 렌더링
const renderMaCell = (params) => {
    if (typeof params.value !== 'number') return <span> </span>;
    const color = params.value > 0 ? '#FCAB2F' : 'deepskyblue';
    return <span style={{ color }}> {params.value.toFixed(1)} %</span>;
};

// 시가삼각가중 돌파 여부
const renderCrossTRIMA = (params) => {
    if (typeof params.value !== 'boolean') return <span> </span>;
    return <span> {params.value === false ? '' : '★'}</span>
}

// Williams Rander Cell
const renderWilliamsCell = (params) => {
    if (typeof params.value !== 'number') return <span> </span>;
    const color = williamsColor(params.value);
    return <span style={{ backgroundColor: color, width: 55, color: '#404040' }}>{params.value}</span>
}

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
    field: '종목명', headerName: '종목명', width: 75,
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
        const color = params.value > 10 ? 'tomato' : params.value > 0 ? '#FCAB2F' : 'deepskyblue'
        return (
            <span style={{ color: color }}> {params.value.toFixed(1)}</span>
        )
    }
}, {
    field: '전일대비거래량', headerName: 'V %', width: 55,
    align: 'right', headerAlign: 'center',
    valueFormatter: (params) => {
        return `${params.value.toLocaleString('kr')} %`;
    }
}]

export const A_columns = [
    ...base_columns,
    {
        field: 'w9', headerName: 'w9', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w14', headerName: 'w14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w33', headerName: 'w33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_7', headerName: 'D7', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_17', headerName: 'D17', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'TRIMA_14', headerName: 'T14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'TRIMA_16', headerName: 'T16', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'TRIMA_18', headerName: 'T18', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'TRIMA_20', headerName: 'T20', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }
]

export const B1_columns = [
    ...base_columns,
    {
        field: 'w6', headerName: 'w6', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w14', headerName: 'w14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w33', headerName: 'w33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_4', headerName: 'D4', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_7', headerName: 'D7', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_9', headerName: 'D9', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_17', headerName: 'D17', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'CCI_4', headerName: 'C4', width: 40,
        align: 'right', headerAlign: 'center',
        // renderCell: (params) => {
        //     const color = params.value > 130 ? '#FCAB2F' : null
        //     return (
        //         <span style={{ color: color }}> {params.value}</span>
        //     )
        // }
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

export const B2_columns = [
    ...base_columns,
    {
        field: 'w6', headerName: 'w6', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w14', headerName: 'w14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'w33', headerName: 'w33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_4', headerName: 'D4', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_7', headerName: 'D7', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_9', headerName: 'D9', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_17', headerName: 'D17', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'mid_wma_5', headerName: '5중가', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'mid_wma_6', headerName: '6중가', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'high_gmean_6', headerName: '6고기', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }
]

export const Envelope_columns = [
    ...base_columns,
    {
        field: 'Env19_10', headerName: '19,10.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env19_9', headerName: '19,9.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env19_8', headerName: '19,8.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env14_8', headerName: '14,8', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env14_7', headerName: '14,7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env9_5', headerName: '9,5', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'Env9_4', headerName: '9,4', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'DMI_7', headerName: 'D7', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_9', headerName: 'D9', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'DMI_17', headerName: 'D17', width: 55,
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