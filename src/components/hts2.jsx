import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, ThemeProvider } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StyledToggleButton } from './util/util';
import { renderProgress, StyledTypography, TitleComponent, DataTable, DatePickerTheme, disablePastDatesAndWeekends } from './util/htsUtil';
import { API } from './util/config';

export default function HtsPage2({ swiperRef }) {
    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;

    const [page, setPage] = useState('kosdaq');
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(dateString);
    const [data1, setData1] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);
    const [statistics, setStatistics] = useState([]);

    // Handler
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }
    const handleTime = (event, value) => { setTime(value); }
    const handleDate = async (event) => {
        const getDate = `${event.$y}-${event.$M + 1}-${event.$D}`
        setDate(getDate)
    }

    const fetchData = async (page, date, time) => {
        try {
            let res;
            if (date && time) {
                res = await axios.get(`${API}/hts/trends?name=${page}&page=1&date=${date}&time=${time}`);
            } else if (date) {
                res = await axios.get(`${API}/hts/trends?name=${page}&page=1&date=${date}`);
            } else {
                res = await axios.get(`${API}/hts/trends?name=${page}&page=1`);
            }
            setData1(res.data.df1);
            setData4(res.data.df4);
            setData5(res.data.industry);
            setData6(res.data.themes);
            setStatistics(res.data.statistics);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => { if (page) { fetchData(page, date, time); } }, [page, date, time])

    // 5분 주기 업데이트
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
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
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
            }, 1000 * 60 * 5);
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
            field: '시가총액', headerName: '시총(억)', width: 65,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${params.value.toLocaleString('kr')}`;
            },
        }, {
            field: '대비율', headerName: '검색%', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '등락률', headerName: '현재%', width: 45,
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
        }, {
            field: '연기금', headerName: '연기금', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '기타법인', headerName: '기타법인', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '은행', headerName: '은행', width: 35,
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
            <Grid item container sx={{ pt: 1, pb: 1 }}>
                <Grid item container xs={1} direction="row" alignItems="center">
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
                <Grid item xs={1.5}>
                    <ThemeProvider theme={DatePickerTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date picker" defaultValue={dayjs(today)} views={['year', 'month', 'day']}
                                    onChange={handleDate} shouldDisableDate={disablePastDatesAndWeekends} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </ThemeProvider>
                </Grid>
                <Grid item container xs={2} direction="row" alignItems="center">
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={time}
                        onChange={handleTime}
                        sx={{ pl: 1.3 }}
                    >
                        <StyledToggleButton fontSize={'10px'} value="9:30">9:30</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="10:00">10:00</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="11:20">11:20</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="13:20">13:20</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="14:30">14:30</StyledToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid item container spacing={1}>
                <Grid item xs={3.3}>
                    <TitleComponent title={'보험,기타금융,연기금,기타법인,은행 합산 상위'} statistics={statistics[0]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data1} columns={columns_data1} />
                </Grid>

                <Grid item xs={2.4}>
                    <TitleComponent title={'개인'} statistics={statistics[1]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data4} columns={columns_data4} />
                </Grid>
                <Grid item xs={1}>
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
                <Grid item xs={1.1}>
                    <StyledTypography>테마</StyledTypography>
                    <TableContainer sx={{ height: 800 }}>
                        {data6 && data6.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data6.map(item => (
                                        <TableRow key={item.테마명}>
                                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.테마명.slice(0, 11)}</TableCell>
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

// const DataTable = ({ swiperRef, data, columns }) => {

//     // const columns = [
//     //       {
//     //         field: '보험기타금융', headerName: '보험기타금융', width: 45,
//     //         align: 'right', headerAlign: 'center',
//     //         renderCell: (params) => renderProgress(params)
//     //     }, {
//     //         field: '연기금', headerName: '연기금', width: 45,
//     //         align: 'right', headerAlign: 'center',
//     //         renderCell: (params) => renderProgress(params)
//     //     }, {
//     //         field: '은행', headerName: '은행', width: 45,
//     //         align: 'right', headerAlign: 'center',
//     //         renderCell: (params) => renderProgress(params)
//     //     }, {
//     //         field: '개인', headerName: '개인', width: 45,
//     //         align: 'right', headerAlign: 'center',
//     //         renderCell: (params) => renderProgress(params)
//     //     }, {
//     //         field: '국가지자체', headerName: '국가', width: 10,
//     //         align: 'right', headerAlign: 'center',
//     //         renderCell: (params) => renderProgress(params)
//     //     }

//     // ];




//     const customTheme = createTheme({
//         components: {
//             MuiDataGrid: {
//                 styleOverrides: {
//                     root: {
//                         '& .MuiDataGrid-row': {
//                             fontSize: '10px',
//                             color: '#efe9e9ed',
//                         },
//                     },
//                     columnHeaderWrapper: {
//                         minHeight: '9px',
//                         // lineHeight: '20px',
//                     },
//                     columnHeader: {
//                         fontSize: '10px',
//                         color: '#efe9e9ed'
//                     },
//                 },
//                 defaultProps: {
//                     headerHeight: 15,
//                 },
//             },
//         },
//     });

//     return (
//         <Grid container sx={{ height: 800, width: "100%" }}
//             onMouseEnter={() => swiperRef.current.mousewheel.disable()}
//             onMouseLeave={() => swiperRef.current.mousewheel.enable()}
//         >
//             <ThemeProvider theme={customTheme}>
//                 <DataGrid
//                     rows={data}
//                     columns={columns}
//                     rowHeight={20}
//                     sx={{
//                         ...DataTableStyleDefault,
//                         border: 0,
//                         '.MuiInput-input': { color: 'white' },
//                         '.MuiSvgIcon-root': { color: '#efe9e9ed' },
//                         '.MuiTablePagination-root': { color: '#efe9e9ed' },
//                         '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', fontSize: '0px' },
//                         '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
//                         [`& .${gridClasses.cell}`]: {
//                             py: 1,
//                         },
//                     }}
//                 />
//             </ThemeProvider>
//         </Grid>
//     );
// };

// const renderProgress = (params) => {
//     let color;
//     if (params.value > 0) {
//         color = 'tomato';  // 값이 증가했다면 빨간색
//     }

//     if (params.value == null) {
//         return '';
//     } else {
//         return (
//             // <div style={{ color: color }}> {`${params.value}`} </div>
//             <div style={{ color: color }}> {`${params.value.toLocaleString('kr')}`} </div>
//         );
//     }
// }

// const StyledTypography = styledComponents(Typography)`
//     font-size: 12px;
//     text-align : start;
//     // color: ;
//     // line-height: calc(var(--base-space) * 6) !important;
//     // margin-top: calc(var(--base-space) * 1) !important;
// `;