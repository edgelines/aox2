import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styledComponents from 'styled-components';
import { StyledToggleButton, DataTableStyleDefault } from './util/util';
import { API } from './util/config';

export default function HtsPage2({ swiperRef }) {
    const [page, setPage] = useState('kosdaq');

    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);


    const handlePage = (event, value) => {
        if (value !== null) { setPage(value); }
    }

    const fetchData = async (page) => {

        try {
            const res = await axios.get(`${API}/hts/trends?name=${page}&page=1`);
            setData1(res.data.df1);
            setData2(res.data.df2);
            setData3(res.data.df3);
            setData4(res.data.df4);
            setData5(res.data.industry);
            setData6(res.data.themes);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => { if (page) { fetchData(page); } }, [page])

    // 10분 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 10) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(page);
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 10);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [])

    const columns = [
        {
            field: '종목명', headerName: '종목명', width: 80,
            align: 'left', headerAlign: 'center',
        }, {
            field: '시가총액', headerName: '시총(억)', width: 60,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${params.value.toLocaleString('kr')}`;
            },
        }, {
            field: '등락률', headerName: '등락', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '전일대비거래량', headerName: '전일%', width: 45,
            align: 'right', headerAlign: 'center',
        }
    ]
    const columns_data1 = [
        ...columns,
        {
            field: '보험기타금융', headerName: '보험', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }
    ]
    const columns_data2 = [...columns,
    {
        field: '연기금', headerName: '연기금', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    },
    ]
    const columns_data3 = [...columns,
    {
        field: '은행', headerName: '은행', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }
    ]
    const columns_data4 = [...columns,
    {
        field: '개인', headerName: '개인', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    },
    ]
    return (
        <Grid container>
            <Grid item sx={{ pt: 1, pb: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="kospi">Kospi</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="kosdaq">Kosdaq</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>

            <Grid item container spacing={1}>
                <Grid item xs={2.1}>
                    <StyledTypography>보험, 기타금융</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={data1} columns={columns_data1} />
                </Grid>
                <Grid item xs={2.1}>
                    <StyledTypography>연기금</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={data2} columns={columns_data2} />
                </Grid>
                <Grid item xs={2.4}>
                    <StyledTypography>은행</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={data3} columns={columns_data3} />
                </Grid>
                <Grid item xs={2.1}>
                    <StyledTypography>개인</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={data4} columns={columns_data4} />
                </Grid>
                <Grid item xs={0.2}></Grid>
                <Grid item xs={1.5}>
                    <StyledTypography>업종</StyledTypography>
                    <TableContainer sx={{ height: 800 }}>
                        {data5 && data5.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data5.map(item => (
                                        <TableRow key={item.업종명}>
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.업종명.slice(0, 10)}</TableCell>
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}>{item.갯수}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }
                    </TableContainer>
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={1.5}>
                    <StyledTypography>테마</StyledTypography>
                    <TableContainer sx={{ height: 800 }}>
                        {data6 && data6.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data6.map(item => (
                                        <TableRow key={item.테마명}>
                                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.테마명.slice(0, 15)}</TableCell>
                                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}>{item.갯수}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    )
}

const DataTable = ({ swiperRef, data, columns }) => {

    // const columns = [
    //       {
    //         field: '보험기타금융', headerName: '보험기타금융', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '연기금', headerName: '연기금', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '은행', headerName: '은행', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '개인', headerName: '개인', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '국가지자체', headerName: '국가', width: 10,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }

    // ];




    const customTheme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        '& .MuiDataGrid-row': {
                            fontSize: '10px',
                            color: '#efe9e9ed',
                        },
                    },
                    columnHeaderWrapper: {
                        minHeight: '9px',
                        // lineHeight: '20px',
                    },
                    columnHeader: {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                defaultProps: {
                    headerHeight: 15,
                },
            },
        },
    });

    return (
        <Grid container sx={{ height: 800, width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <ThemeProvider theme={customTheme}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    rowHeight={20}
                    sx={{
                        ...DataTableStyleDefault,
                        border: 0,
                        '.MuiInput-input': { color: 'white' },
                        '.MuiSvgIcon-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', fontSize: '0px' },
                        '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                        [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                    }}
                />
            </ThemeProvider>
        </Grid>
    );
};

const renderProgress = (params) => {
    let color;
    if (params.value > 0) {
        color = 'tomato';  // 값이 증가했다면 빨간색
    }

    if (params.value == null) {
        return '';
    } else {
        return (
            // <div style={{ color: color }}> {`${params.value}`} </div>
            <div style={{ color: color }}> {`${params.value.toLocaleString('kr')}`} </div>
        );
    }
}

const StyledTypography = styledComponents(Typography)`    
    font-size: 12px;
    text-align : start;
    // color: ;
    // line-height: calc(var(--base-space) * 6) !important;
    // margin-top: calc(var(--base-space) * 1) !important;
`;