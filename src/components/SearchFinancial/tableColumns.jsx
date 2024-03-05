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
        field: '동일업종PER', headerName: '동 PER', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'PER', headerName: 'PER', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'PBR', headerName: 'PBR', width: 60,
        align: 'right', headerAlign: 'center',
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
        field: '이벤트', headerName: 'Event', width: 350,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'WillR9', headerName: 'WillR9', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'WillR14', headerName: 'WillR14', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: 'WillR33', headerName: 'WillR33', width: 60,
        align: 'right', headerAlign: 'center',
    }
]