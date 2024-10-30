import React, { useState, useEffect, useRef } from 'react';
import { createTheme } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { renderWilliamsCell, renderCciCell } from '../Formula/RenderCell';



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
        field: '등락률', headerName: 'R %', width: 50,
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
        field: 'w9', headerName: 'W.9', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '9')
    }, {
        field: 'w14', headerName: 'w14', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '14')
    }, {
        field: 'w33', headerName: 'w33', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderWilliamsCell(params, '33')
    }, {
        field: 'CCI_4', headerName: 'C4', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            if (!params.row.CCI || typeof params.row.CCI['4'] === 'undefined') {
                return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
            }
            const _value = params.row.CCI['4']
            const color = _value > 130 ? '#FCAB2F' : null
            if (typeof _value !== 'number') return <span> </span>;
            return <span style={{ color: color }}> {_value}</span>

        }
    }, {
        field: 'CCI_2_Sig', headerName: 'C4S', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, 'Sig_4_2')
    }, {
        field: 'CCI_11', headerName: 'C11', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderCciCell(params, '11')
    }, {
        field: 'CCI_4_Sig', headerName: 'C11S', width: 40,
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