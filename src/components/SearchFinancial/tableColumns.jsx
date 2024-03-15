// import * as React from 'react';
import { createTheme } from '@mui/material/styles';
// import Chip from '@mui/material/Chip';

export const stockTable_columns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, {
        field: '업종명', headerName: '업종명', width: 120,
        align: 'left', headerAlign: 'center',
    }, {
        field: '종목명', headerName: '종목명', width: 120,
        align: 'left', headerAlign: 'center',
    }, {
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
        field: '부채비율', headerName: '부채비율', width: 65,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }, {
        field: '유보율', headerName: '유보율', width: 70,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }, {
        field: '테마명', headerName: '테마명', width: 400,
        align: 'left', headerAlign: 'center',
        // valueFormatter: (params) => {
        //     console.log(params.value);
        //     if (params.value == null) { return ''; }
        //     return params.value.map(item => (<Chip label={item} size='small' color='primary' variant='outlined' />));
        // }
        // renderCell: (params) => (
        //     <>
        //         {params.value.map((item, index) => (
        //             <Chip key={index} label={item} size="small" variant="outlined" sx={{
        //                 height: 'auto',
        //                 fontSize: '11px',
        //                 color: '#efe9e9ed',
        //                 '& .MuiChip-label': {
        //                     display: 'block',
        //                     whiteSpace: 'normal',
        //                 }
        //             }} />
        //         ))}
        //     </>
        // )
    }
]

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