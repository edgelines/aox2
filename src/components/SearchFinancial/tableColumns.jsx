// import * as React from 'react';
import { createTheme } from '@mui/material/styles';
// import Chip from '@mui/material/Chip';

export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                // columnHeaderWrapper: {
                //     minHeight: '9px',
                //     // lineHeight: '20px',
                // },
                columnHeader: {
                    fontSize: '9px',
                    color: '#efe9e9ed'
                },
                // rowSelected: {
                //     backgroundColor: 'rgba(255, 215, 0, 0.55)', // 선택된 행의 배경색 변경
                //     '&:hover': {
                //         backgroundColor: 'rgba(255, 215, 0, 0.75)', // 호버 상태일 때의 배경색 변경
                //     },
                // },
            },
            // defaultProps: {
            //     headerHeight: 15,
            // },
        },
    },
});

// Cross, Favorite 좌측상단 Table Columns
export const table_columns = [
    {
        field: '순위', headerName: '업종순위', width: 65,
        align: 'center', headerAlign: 'left',
    }, {
        field: '업종명', headerName: '업종명', width: 135,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전일대비', headerName: '전일대비', width: 60,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전체종목수', headerName: '전체종목수', width: 65,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자기업', headerName: '흑자기업', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계', headerName: '미집계', width: 60,
        align: 'right', headerAlign: 'center',
    }
]



// Bottom Table Columns Modules
export const baseColumns = [{
    field: '업종명', headerName: '업종명', width: 80,
    align: 'left', headerAlign: 'center',
}, {
    field: '종목명', headerName: '종목명', width: 85,
    align: 'left', headerAlign: 'center',
}]

export const ratioColumns = [
    {
        field: '등락률', headerName: '%', width: 30,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${params.value.toFixed(1)}`;
        }
    },
]

export const financialColumns = [
    {
        field: '시가총액', headerName: '시가총액', width: 70,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value / 100000000)).toLocaleString('kr')}`;
        }
    }, {
        field: '연간', headerName: '전년도 순이익합', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '1Q', headerName: '1Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '2Q', headerName: '2Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '3Q', headerName: '3Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '4Q', headerName: '4Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '부채비율', headerName: '부채비율', width: 70,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }, {
        field: '유보율', headerName: '유보율', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }
]

export const maColumns = [
    {
        field: 'TRIMA_8', headerName: '8', width: 40,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_16', headerName: '16', width: 40,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_27', headerName: '27', width: 40,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_41', headerName: '41', width: 40,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'MA_14', headerName: '14', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'MA_high_14', headerName: '14_H', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'MA_18', headerName: '18', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'MA_high_18', headerName: '18_H', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }
]

export const willrColumns = [
    {
        field: 'WillR9', headerName: 'W 9', width: 60,
        align: 'right', headerAlign: 'center'
    }, {
        field: 'WillR14', headerName: 'W 14', width: 60,
        align: 'right', headerAlign: 'center'
    }, {
        field: 'WillR33', headerName: 'W 33', width: 60,
        align: 'right', headerAlign: 'center'
    }
]

export const themeColumns = [
    {
        field: '테마명', headerName: '테마명', width: 400,
        align: 'left', headerAlign: 'center',
    }
]

// cross columns
export const stockTable_columns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, ...baseColumns, ...financialColumns, ...themeColumns
]





export const trendColumns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...maColumns
]

// 순번 + 기본 + 등락률 + 재무 + 테마
export const ranksThemesColumns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...themeColumns
]

export const ranksWillrColumns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...willrColumns
]

export const eventColumns = [
    {
        field: '날짜', headerName: '날짜', width: 85,
        align: 'center', headerAlign: 'center',
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...maColumns
]

// 순번 + 기본 + 등락률 + 재무 + 테마
export const dateThemesColumns = [
    {
        field: '날짜', headerName: '날짜', width: 85,
        align: 'center', headerAlign: 'center',
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...themeColumns
]

export const dateWillrColumns = [
    {
        field: '날짜', headerName: '날짜', width: 85,
        align: 'center', headerAlign: 'center',
    }, ...baseColumns, ...ratioColumns, ...financialColumns, ...willrColumns
]