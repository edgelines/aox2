import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styledComponents from 'styled-components';
import { StyledToggleButton, DataTableStyleDefault } from './util/util';
import { API } from './util/config';


export default function FundarmentalPage({ swiperRef }) {
    const [page, setPage] = useState('kosdaq');

    const [외국, set외국] = useState([]);
    const [기관, set기관] = useState([]);
    const [투신, set투신] = useState([]);
    const [보험기타, set보험기타] = useState([]);
    const [은행, set은행] = useState([]);
    const [연기금, set연기금] = useState([]);
    const [국가, set국가] = useState([]);
    const [기타법인, set기타법인] = useState([]);

    const handlePage = (event, value) => {
        if (value !== null) { setPage(value); }
    }

    const fetchData = async (page) => {

        try {
            const res = await axios.get(`${API}/hts/trends?name=${page}`);

            set외국(res.data.외국);
            set기관(res.data.기관);
            set보험기타(res.data.보험기타);
            set투신(res.data.투신);
            set은행(res.data.은행);
            set연기금(res.data.연기금);
            set국가(res.data.국가);
            set기타법인(res.data.기타법인);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => {
        if (page) { fetchData(page); }
    }, [page])

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

            <Grid item container>
                <Grid item xs={4}>
                    <StyledTypography>외국계</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={외국} />
                </Grid>
                <Grid item xs={4}>
                    <StyledTypography>기관계</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={기관} />
                </Grid>
                <Grid item xs={4}>
                    <StyledTypography>투신</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={투신} />
                </Grid>
            </Grid>

            <Grid item container>
                <Grid item xs={4}>
                    <StyledTypography>은행</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={은행} />
                </Grid>
                <Grid item xs={4}>
                    <StyledTypography>연기금</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={연기금} />
                </Grid>
                <Grid item xs={4}>
                    <StyledTypography>기타법인</StyledTypography>
                    <DataTable swiperRef={swiperRef} data={기타법인} />
                </Grid>
            </Grid>



        </Grid>
    )
}

const DataTable = ({ swiperRef, data }) => {

    const columns = [
        {
            field: '종목명', headerName: '종목명', width: 70,
            align: 'left', headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <span style={{ textAlign: 'left', lineHeight: 'normal', whiteSpace: 'normal' }}>
                        {params.value}
                    </span>
                );
            }
        }, {
            field: '시가총액', headerName: '시총(억)', width: 50,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                // return `${params.value}`;
                return `${params.value.toLocaleString('kr')}`;
            },
        }, {
            field: '등락율', headerName: '등락', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '전일대비거래량', headerName: '전일%', width: 45,
            align: 'right', headerAlign: 'center',
        }, {
            field: '외국인', headerName: '외국계', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '기관계', headerName: '기관계', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '투신', headerName: '투신', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '보험기타금융', headerName: '보험기타금융', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '연기금', headerName: '연기금', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '은행', headerName: '은행', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '개인', headerName: '개인', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '국가지자체', headerName: '국가', width: 10,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }

    ];

    const renderProgress = (params) => {
        let color;
        if (params.value > 0) {
            color = 'tomato';  // 값이 증가했다면 빨간색
        }

        return (
            // <div style={{ color: color }}> {`${params.value}`} </div>
            <div style={{ color: color }}> {`${params.value.toLocaleString('kr')}`} </div>
        );
    }


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
        <Grid container sx={{ height: 430, width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <ThemeProvider theme={customTheme}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    sx={{
                        ...DataTableStyleDefault,
                        border: 0,
                        '.MuiInput-input': { color: 'white' },
                        '.MuiSvgIcon-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
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


const StyledTypography = styledComponents(Typography)`    
    font-size: 12px;
    text-align : start;
    // color: ;
    // line-height: calc(var(--base-space) * 6) !important;
    // margin-top: calc(var(--base-space) * 1) !important;
`;