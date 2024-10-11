import React, { useState, useEffect, useRef } from 'react';
import { createTheme } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { renderCrossTRIMA, renderMaCell, renderWilliamsCell, renderTrixCell, renderCciCell, renderCciCell_Keys, renderDmiCell, renderShortCell } from './RenderCell';

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
        field: 'DMI_4', headerName: 'D.4', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'D.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_17', headerName: 'D.17', width: 55,
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
        field: 'w6', headerName: 'W.6', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '6')
    }, {
        field: 'w14', headerName: 'W.14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w33', headerName: 'W.33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '33')
    }, {
        field: 'DMI_4', headerName: 'D.4', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'D.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_9', headerName: 'D.9', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_17', headerName: 'D.17', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'CCI_4', headerName: 'C.4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, '4')
    }, {
        field: 'CCI_2_Sig', headerName: 'C.4S', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, 'Sig_4_2')
    }, {
        field: 'CCI_11', headerName: 'C.11', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, '11')
    }, {
        field: 'CCI_4_Sig', headerName: 'C.11S', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, 'Sig_11_4')
    }
]

export const Envelope_columns = [
    ...base_columns,
    {
        field: 'Env19_10', headerName: '19,10.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_10')
    }, {
        field: 'Env19_9', headerName: '19,9.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_9')
    }, {
        field: 'Env19_8', headerName: '19,8.7', width: 50,
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
        field: 'Env9_5', headerName: '9,5', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_5')
    }, {
        field: 'Env9_4', headerName: '9,4', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_4')
    }, {
        field: 'DMI_7', headerName: 'D.7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_9', headerName: 'D.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_17', headerName: 'D.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'w9', headerName: 'W.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w33', headerName: 'W.33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '33')
    }
]

export const WhiteBox_columns = [
    ...base_columns2,
    {
        field: 'Env19_10', headerName: '19,10.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_10')
    }, {
        field: 'Env19_9', headerName: '19,9.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env19_9')
    }, {
        field: 'Env19_8', headerName: '19,8.7', width: 50,
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
        field: 'Env9_5', headerName: '9,5', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_5')
    }, {
        field: 'Env9_4', headerName: '9,4', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCrossTRIMA(params, 'Env9_4')
    }, {
        field: 'DMI_7', headerName: 'D.7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_9', headerName: 'D.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_17', headerName: 'D.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'w9', headerName: 'W.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w33', headerName: 'W.33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '33')
    }
]

export const Short_columns = [
    ...base_columns,
    {
        field: '단기검색조건1', headerName: '1->2', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건1')
    }, {
        field: '단기검색조건2', headerName: '1->3', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건2')
    }, {
        field: '단기검색조건3', headerName: '2>3', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건3')
    }, {
        field: '단기검색조건4', headerName: '2<3', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건4')
    }, {
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
        field: '단기검색조건9', headerName: '1>7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건9')
    }, {
        field: '단기검색조건10', headerName: '1<112', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderShortCell(params, '조건10')
    }, {
        field: 'DMI_4', headerName: 'D4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'D7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }
]
export const TRIX_columns = [
    ...base_columns,
    {
        field: '15', headerName: 'T.15', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '15', 'Sig_15_5')
    }, {
        field: '17', headerName: 'T.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '17', 'Sig_17_5')
    }, {
        field: '19', headerName: 'T.19', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '19', 'Sig_19_5')
    }, {
        field: '22', headerName: 'T.22', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '22', 'Sig_22_6')
    }, {
        field: '24', headerName: 'T.24', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '24', 'Sig_24_9')
    }, {
        field: '26', headerName: 'T.26', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '26', 'Sig_26_9')
    }, {
        field: '112', headerName: 'C.112', width: 60,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell_Keys(params, '112')
    }, {
        field: 'Sig_112_18', headerName: 'C.S.18', width: 60,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell_Keys(params, 'Sig_112_18')
    }, {
        field: 'W.6', headerName: 'W.6', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '6')
    }, {
        field: 'W.14', headerName: 'W.14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'DMI_4', headerName: 'D4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'D7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }
]

export const Rainbow_columns = [
    {
        field: '업종명', headerName: '업종명', width: 80,
        align: 'left', headerAlign: 'left',
        renderCell: (params) => {
            return (
                <span style={{ backgroundColor: params.row.color, color: '#404040' }}>{params.value}</span>
            )
        }
    }, {
        field: '15', headerName: 'T.15', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '15', 'Sig_15_5')
    }, {
        field: '17', headerName: 'T.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '17', 'Sig_17_5')
    }, {
        field: '19', headerName: 'T.19', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '19', 'Sig_19_5')
    }, {
        field: '22', headerName: 'T.22', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderTrixCell(params, '22', 'Sig_22_6')
        // }, {
        //     field: '24', headerName: 'T.24', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderTrixCell(params, '24', 'Sig_24_9')
        // }, {
        //     field: '26', headerName: 'T.26', width: 40,
        //     align: 'right', headerAlign: 'center',
        //     renderCell: (params) => renderTrixCell(params, '26', 'Sig_26_9')
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
    }, {
        field: 'w26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'w18', headerName: 'W.18', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '18')
    }, {
        field: 'w14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w6', headerName: 'W.6', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '6')
    }, {
        field: 'DMI_4', headerName: 'D.4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '4')
    }, {
        field: 'DMI_7', headerName: 'D.7', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_9', headerName: 'D.9', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_17', headerName: 'D.17', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'CCI_4', headerName: 'C.4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, '4')
    }, {
        field: 'CCI_2_Sig', headerName: 'C.4S', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, 'Sig_4_2')
    }, {
        field: 'CCI_11', headerName: 'C.11', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, '11')
    }, {
        field: 'CCI_4_Sig', headerName: 'C.11S', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, 'Sig_11_4')
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