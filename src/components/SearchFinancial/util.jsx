import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '11px',
                        color: '#efe9e9ed'
                    },
                },
                columnHeader: {
                    fontSize: '9px',
                    color: '#efe9e9ed'
                },
            },
        },
    },
});



export const baseColumns = [{
    field: '업종명', headerName: '업종명', width: 80,
    align: 'left', headerAlign: 'center',
}, {
    field: '종목명', headerName: '종목명', width: 85,
    align: 'left', headerAlign: 'center',
}, {
    field: '등락률', headerName: '%', width: 30,
    align: 'right', headerAlign: 'center',
    valueFormatter: (params) => {
        if (params.value == null) { return ''; }
        return `${params.value.toFixed(1)}`;
    }
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
}, {
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
}]
export const trendColumns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, ...baseColumns
]

export const eventColumns = [
    {
        field: '날짜', headerName: '날짜', width: 85,
        align: 'center', headerAlign: 'center',
    }, ...baseColumns,
]