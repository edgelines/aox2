import React, { useState, useEffect, useRef } from 'react';
import { createTheme } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { renderCrossTRIMA, renderMaCell, renderWilliamsCell, renderDmiCell } from './RenderCell';

export const base_columns = [{
    field: '업종명', headerName: '업종명', width: 85,
    align: 'left', headerAlign: 'left',
    renderCell: (params) => {
        return (
            <span style={{ backgroundColor: params.row.color, color: '#404040' }}>{params.value}</span>
        )
    }
}, {
    field: '테마명', headerName: '테마명', width: 125,
    align: 'left', headerAlign: 'left',
}, {
    field: '종목명', headerName: '종목명', width: 85,
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
    field: '등락률', headerName: 'R %', width: 50,
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

export const base_columns2 = [{
    field: '업종명', headerName: '업종명', width: 80,
    align: 'left', headerAlign: 'left',
    renderCell: (params) => {
        return (
            <span style={{ backgroundColor: params.row.color, color: '#404040' }}>{params.value}</span>
        )
    }
}, {
    field: 'WhiteBox_id', headerName: 'F_id', width: 120,
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
    field: '등락률', headerName: 'R %', width: 50,
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
        field: 'w9', headerName: 'W.9', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w33', headerName: 'W.33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '33')
    }, {
        field: 'DMI_4', headerName: 'd.4', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'TRIMA_14', headerName: 'T.14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, '14시가삼각')
    }, {
        field: 'TRIMA_16', headerName: 'T.16', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, '16시가삼각')
    }, {
        field: 'TRIMA_18', headerName: 'T.18', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, '18시가삼각')
    }, {
        field: 'TRIMA_20', headerName: 'T.20', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, '20시가삼각')
    }
]

export const B1_columns = [
    ...base_columns,
    {
        field: 'w9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_7_단', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_8_단', headerName: 'D.8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_8')
    }, {
        field: 'DMI_9', headerName: 'd.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_9_단', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_14_단', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_17_단', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_33_단', headerName: 'D.33', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_33')
        // }, {
        //     field: 'CCI_4', headerName: 'C.4', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderCciCell(params, '4')
        // }, {
        //     field: 'CCI_2_Sig', headerName: 'C.4S', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderCciCell(params, 'Sig_4_2')
        // }, {
        //     field: 'CCI_11', headerName: 'C.11', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderCciCell(params, '11')
        // }, {
        //     field: 'CCI_4_Sig', headerName: 'C.11S', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderCciCell(params, 'Sig_11_4')
    }
]

export const Envelope_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'Env19_10', headerName: '19,10', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_10')
    }, {
        field: 'Env19_9', headerName: '19,9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_9')
    }, {
        field: 'Env19_8', headerName: '19,8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_8')
    }, {
        field: 'Env14_8', headerName: '14,8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env14_8')
    }, {
        field: 'Env14_7', headerName: '14,7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env14_7')
    }, {
        field: 'Env9_5', headerName: '9,5', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_5')
    }, {
        field: 'Env9_4', headerName: '9,4', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_4')
    }, {
        field: 'w9', headerName: 'W.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_9', headerName: 'D.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_11', headerName: 'd.11', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '11')
    }, {
        field: 'DMI_14', headerName: 'D.14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_17_단', headerName: 'D.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }
]


export const Short_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        //     field: '단기검색조건1', headerName: '1->2', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건1')
        // }, {
        //     field: '단기검색조건2', headerName: '1->3', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건2')
        // }, {
        //     field: '단기검색조건3', headerName: '2>3', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건3')
        // }, {
        //     field: '단기검색조건4', headerName: '2<3', width: 50,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건4')
        // }, {
        field: '단기검색조건5', headerName: '4종지', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '조건5')
    }, {
        field: '단기검색조건6', headerName: '5종지', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '조건6')
    }, {
        field: '단기검색조건7', headerName: '6종지', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '조건7')
    }, {
        field: '단기검색조건8', headerName: '7종지', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '조건8')
    }, {
        field: '단기검색조건11', headerName: '9종지', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '조건11')
    }, {
        //     field: '단기검색조건9', headerName: '1>7', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건9')
        // }, {
        //     field: '단기검색조건10', headerName: '1<112', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderShortCell(params, '조건10')
        // }, {
        field: 'w9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_7_단', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_8_단', headerName: 'D.8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_8')
    }, {
        field: 'DMI_9', headerName: 'd.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_9_단', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_14_단', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_17_단', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }
]

export const DMI_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'f_id', headerName: 'id', width: 90,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'w9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_7_단', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_8_단', headerName: 'D.8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_8')
    }, {
        field: 'DMI_9', headerName: 'd.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_9_단', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_14_단', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_17_단', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_33_단', headerName: 'D.33', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_33')
    }
]




export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10.5px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10.5px', // 헤더 높이를 원하는 값으로 설정합니다.
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