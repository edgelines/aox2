import React, { useState, useEffect, useRef } from 'react';
import { formatDate } from '../util/formatDate.jsx';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { API } from '../util/config.jsx';
import PaidIcon from '@mui/icons-material/Paid';

const handleInvest = async (row) => {
    // console.log(row.종목코드, row.Type)
    try {
        await axios.get(`${API}/stockInvest/${row.종목코드}?chart_type=${row.Type}`);
    } catch (err) {
        console.error('API 호출 실패 : ', err)
    }
}

export const monthColumns = [{
    field: '날짜', headerName: '날짜', width: 80,
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
    field: '수익률', headerName: '수익률', width: 80,
    align: 'right', headerAlign: 'center',
}, {
    field: '투자일수', headerName: '투자일수', width: 80,
    align: 'right', headerAlign: 'center',

}]

export const dayColumns = [{
    field: 'Type', headerName: 'Type', width: 40,
    align: 'center', headerAlign: 'center',
}, {
    field: '', headerName: '추매', width: 30,
    align: 'center', headerAlign: 'center',
    renderCell: (params) => {
        return (
            <>
                {/* <Button variant="contained" size="small" color="primary" onClick={() => {
                    handleInvest(params.row)
                }}>
                    +
                </Button> */}

                <IconButton size="small" color="error" onClick={() => handleInvest(params.row)} >

                    <PaidIcon />

                </IconButton>

            </>
        )
    }
}, {
    field: '종목명', headerName: '종목명', width: 50,
    align: 'left', headerAlign: 'center',
    renderCell: (params) => {
        const color = params.row.수익률 > 10 ? 'tomato' : params.row.수익률 > 0 ? '#FCAB2F' : 'deepskyblue'
        return (
            <span style={{ color: color }}> {params.value}</span>

        )
    }
}, {
    field: '수익률', headerName: '수익률', width: 40,
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
    field: 'D4', headerName: 'D4', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.DMI_4 ? params.row.매입보조지표.DMI_4 : '-';
    }
}, {
    field: 'N_D4', headerName: 'N_D4', width: 50,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        if (params.row.수익률 > 3) {
            return params.row.고가보조지표.DMI_4
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
    field: 'T14', headerName: 'T14', width: 40,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_14 ? '★' : ''
    }
}, {
    field: 'T16', headerName: 'T16', width: 40,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_16 ? '★' : ''
    }
}, {
    field: 'T18', headerName: 'T18', width: 40,
    align: 'right', headerAlign: 'center',
    valueGetter: (params) => {
        return params.row.매입보조지표.cross_TRIMA_18 ? '★' : ''
    }
}]