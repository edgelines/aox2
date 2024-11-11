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
        field: 'WillR_9', headerName: 'W.9', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_33', headerName: 'W.33', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_4', headerName: 'd.4', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'CROSS_14시가삼각', headerName: 'T.14', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'CROSS_16시가삼각', headerName: 'T.16', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'CROSS_18시가삼각', headerName: 'T.18', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }, {
        field: 'CROSS_20시가삼각', headerName: 'T.20', width: 55,
        align: 'right', headerAlign: 'center',
        renderCell: renderCrossTRIMA
    }
]

export const B1_columns = [
    ...base_columns,
    {
        field: 'WillR_9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_7', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_8', headerName: 'D.8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_9', headerName: 'd.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_9', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_14', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_17', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_33', headerName: 'D.33', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }
]

export const Short_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'Short_8종가삼각', headerName: '8종삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'Short_13저가삼각', headerName: '13저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'Short_15저가삼각', headerName: '15저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'Short_18저가삼각', headerName: '18저삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'Short_18중간삼각', headerName: '18중삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'Short_18고가삼각', headerName: '18고삼', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderMaCell
    }, {
        field: 'WillR_6', headerName: 'W.6', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_9', headerName: 'W.9', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: renderWilliamsCell
    }, {
        field: 'DMI_1', headerName: 'd.1', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_9', headerName: 'D.9', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_18', headerName: 'D.18', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_21', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_33', headerName: 'd.33', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }, {
        field: 'DMI_단순_40', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: renderDmiCell
    }
]

export const DMI_columns = [
    ...base_columns.filter(col => col.field !== '테마명'),
    {
        field: 'f_id', headerName: 'id', width: 90,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'WillR_9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'WillR_26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'DMI_7', headerName: 'd.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '7')
    }, {
        field: 'DMI_단순_7', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_단순_8', headerName: 'D.8', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_8')
    }, {
        field: 'DMI_9', headerName: 'd.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '9')
    }, {
        field: 'DMI_단순_9', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_단순_14', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_단순_17', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_단순_33', headerName: 'D.33', width: 50,
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
        field: 'WillR_9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'WillR_26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'DMI_단순_7', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_단순_9', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_단순_14', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_단순_17', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_단순_21', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_21')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_단순_38', headerName: 'D.38', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_38')
    }, {
        field: 'DMI_단순_40', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_40')
    }, {
        field: 'DMI_단순_44', headerName: 'D.44', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_44')
    }, {
        field: 'DMI_단순_64', headerName: 'D.64', width: 50,
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
        field: 'WillR_9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'WillR_14', headerName: 'W.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'WillR_26', headerName: 'W.26', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '26')
    }, {
        field: 'DMI_단순_7', headerName: 'D.7', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_7')
    }, {
        field: 'DMI_단순_9', headerName: 'D.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_9')
    }, {
        field: 'DMI_단순_14', headerName: 'D.14', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_14')
    }, {
        field: 'DMI_17', headerName: 'd.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '17')
    }, {
        field: 'DMI_단순_17', headerName: 'D.17', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_17')
    }, {
        field: 'DMI_단순_21', headerName: 'D.21', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_21')
    }, {
        field: 'DMI_22', headerName: 'd.22', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '22')
    }, {
        field: 'DMI_단순_38', headerName: 'D.38', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_38')
    }, {
        field: 'DMI_단순_40', headerName: 'D.40', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_40')
    }, {
        field: 'DMI_단순_44', headerName: 'D.44', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderDmiCell(params, '단순_44')
    }, {
        field: 'DMI_단순_64', headerName: 'D.64', width: 50,
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