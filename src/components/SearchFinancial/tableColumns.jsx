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
        align: 'right', headerAlign: 'center',
    }
]