import React, { useState, useEffect, useRef } from 'react';
import { formatDate } from '../util/formatDate.jsx';

export const monthColumns = [{
    field: '날짜', headerName: '날짜', width: 100,
    align: 'center', headerAlign: 'center',
    valueFormatter: (params) => {
        return `${formatDate(params.value)}`;
    }
}, {
    field: '전체', headerName: '수익/전체', width: 100,
    align: 'center', headerAlign: 'center',
    renderCell: (params) => {
        const 수익 = params.row.수익;
        const 전체 = params.value;
        return `${수익} / ${전체} ( ${parseInt(수익 / 전체 * 100)} % )`;
    }
}, {
    field: '수익률', headerName: '수익률', width: 100,
    align: 'right', headerAlign: 'center',
}, {
    field: '투자일수', headerName: '투자일수', width: 100,
    align: 'right', headerAlign: 'center',

}]

export const dayColumns = [{
    field: 'Type', headerName: 'Type', width: 50,
    align: 'center', headerAlign: 'center',
}, {
    field: '종목명', headerName: '종목명', width: 90,
    align: 'center', headerAlign: 'center',
    renderCell: (params) => {
        const color = params.row.수익률 > 10 ? 'tomato' : params.row.수익률 > 0 ? '#FCAB2F' : 'deepskyblue'
        return (
            <span style={{ color: color }}> {params.value}</span>
        )
    }
}, {
    // field: '매입가', headerName: '매입가', width: 70,
    // align: 'right', headerAlign: 'center',
    // valueFormatter: (params) => {
    //     return `${params.value.toLocaleString('kr')}`;
    // }
    field: '수익률', headerName: '수익률', width: 50,
    align: 'right', headerAlign: 'center',
    renderCell: (params) => {
        const color = params.value > 10 ? 'tomato' : params.value > 0 ? '#FCAB2F' : 'deepskyblue'
        return (
            <span style={{ color: color }}> {params.value.toFixed(1)}</span>
        )
    }
}, {
    field: 'w9', headerName: 'w9', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.WillR9
    }
}, {
    field: 'N_w9', headerName: 'N_w9', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.WillR9
        } else {
            return '-'
        }
    }
}, {
    field: 'w14', headerName: 'w14', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.WillR14
    }
}, {
    field: 'N_w14', headerName: 'N_w14', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.WillR14
        } else {
            return '-'
        }
    }
}, {
    field: 'w33', headerName: 'w33', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.WillR33
    }
}, {
    field: 'N_w33', headerName: 'N_w33', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.WillR33
        } else {
            return '-'
        }
    }
}, {
    field: 'D7', headerName: 'D7', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.DMI_7
    }
}, {
    field: 'N_D7', headerName: 'N_D7', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.DMI_7
        } else {
            return '-'
        }
    }
}, {
    field: 'D17', headerName: 'D17', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.DMI_17
    }
}, {
    field: 'N_D17', headerName: 'N_D17', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.DMI_17
        } else {
            return '-'
        }
    }
}, {
    field: 'T14', headerName: 'T14', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_14 ? '★' : ''
    }
}, {
    field: 'T16', headerName: 'T16', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_16 ? '★' : ''
    }
}, {
    field: 'T18', headerName: 'T18', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_18 ? '★' : ''
    }
}, {
    field: 'T20', headerName: 'T20', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_20 ? '★' : ''
    }



}]