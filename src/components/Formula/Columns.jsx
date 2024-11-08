import React, { useState, useEffect, useRef } from 'react';
import { createTheme } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { renderCrossTRIMA, renderMaCell, renderWilliamsCell, renderDmiCell, renderEnvelopePercent } from './RenderCell';

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

export const Short_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: '7종삼', headerName: '7종삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '7종가삼각')
    }, {
        field: '13저삼', headerName: '13저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '13저가삼각')
    }, {
        field: '15저삼', headerName: '15저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '15저가삼각')
    }, {
        field: '18저삼', headerName: '18저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '18저가삼각')
    }, {
        field: '18중삼', headerName: '18중삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '18중간삼각')
    }, {
        field: '18고삼', headerName: '18고삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderMaCell(params, 'Short', '18고가삼각')
    }, {
        field: 'w6', headerName: 'W.6', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '6')
    }, {
        field: 'w9', headerName: 'W.9', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'W.14', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'DMI_1', headerName: 'd.1', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '1')
    }, {
        field: 'DMI_9_단', headerName: 'D.9', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_18_단', headerName: 'D.18', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_18')
    }, {
        field: 'DMI_21_단', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_21')
    }, {
        field: 'DMI_33', headerName: 'd.33', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '33')
    }, {
        field: 'DMI_40_단', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_40')
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

export const under_envelope_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'env', headerName: 'Env%', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderEnvelopePercent(params, 'compare_envelop_close_return_inx')
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
        field: 'DMI_7_단', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
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
        field: 'DMI_21_단', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_21')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_38_단', headerName: 'D.38', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_38')
    }, {
        field: 'DMI_40_단', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_40')
    }, {
        field: 'DMI_44_단', headerName: 'D.44', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_44')
    }, {
        field: 'DMI_64_단', headerName: 'D.64', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_64')
    }
]

export const under_envelope_2_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'env', headerName: 'Env%', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderEnvelopePercent(params, 'compare_envelop_close_return_inx_2')
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
        field: 'DMI_7_단', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
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
        field: 'DMI_21_단', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_21')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_38_단', headerName: 'D.38', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_38')
    }, {
        field: 'DMI_40_단', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_40')
    }, {
        field: 'DMI_44_단', headerName: 'D.44', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_44')
    }, {
        field: 'DMI_64_단', headerName: 'D.64', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_64')
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