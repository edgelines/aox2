import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { myJSON } from '../util/config';

// import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/modules/accessibility')(Highcharts)

export default function OldStockPage({ swiperRef }) {
    const 상단높이 = '40vh'
    const [tableLeft, setTableLeft] = useState('');
    const [tableRight, setTableRight] = useState('');
    const [tableToday, setTableToday] = useState('');
    const [tableB1, setTableB1] = useState('');
    const [tableB2, setTableB2] = useState('');
    const [day, setDay] = useState({ now: '', b1: '', b2: '' })
    const [grStates, setGrStates] = useState(Array(9).fill(''));

    const fetchData = async () => {
        await grStates.forEach((gr, i) => {
            axios.get(`${myJSON}/low_sector_Gr${i}`).then((response) => {
                var index = response.data.index;
                var data1 = response.data.data[0];
                var data2 = response.data.data[1];
                setGrStates(prevStates => {
                    const newStates = [...prevStates];
                    newStates[i] = { index, data1, data2 };
                    return newStates;
                });
            });
        });

        await axios.get(myJSON + "/low_sectors_rank_df").then((response) => {
            var data = response.data.map((item, i) => ({ ...item, id: i }))
            setTableLeft(data)
        });
        await axios.get(myJSON + "/sectors_rank_df_4").then((response) => {
            var data = response.data.map((item, i) => ({ ...item, id: i }))
            data = data.sort((a, b) => b.순위 - a.순위);
            setTableRight(data)
        });
        await axios.get(myJSON + "/low_sectors_rank_df_top3").then((response) => {
            var data = response.data.map((item, i) => ({ ...item, id: i }))
            setTableToday(data)
        });
        await axios.get(myJSON + "/low_sectors_rank_df_top3_b1").then((response) => {
            var data = response.data.map((item, i) => ({ ...item, id: i }))
            setTableB1(data)
        });
        await axios.get(myJSON + "/low_sectors_rank_df_top3_b2").then((response) => {
            var data = response.data.map((item, i) => ({ ...item, id: i }))
            setTableB2(data)
        });
    }

    useEffect(() => {
        fetchData()
        const today = setDate();
        const b1 = weekCheck(today)
        const b2 = weekCheck(b1)
        setDay({ now: today, b1: b1, b2: b2 })
    }, []);

    // 업데이트 주기
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();
            const dayOfWeek = now.getDay();

            if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
                fetchData()
            }

        }, 1000 * 60 * 5);
        return () => clearInterval(intervalId);
    }, [])

    // Day
    const setDate = () => {
        let date = new Date();
        let day = date.getDay();

        // If it's Saturday (5), subtract one day
        if (day === 6) {
            date.setDate(date.getDate() - 1);
        }
        // If it's Sunday (0), subtract two days
        else if (day === 0) {
            date.setDate(date.getDate() - 2);
        }

        // Format the date as YYYY-MM-DD
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dayOfMonth = date.getDate();

        // Ensure month and day are always two digits
        month = month < 10 ? '0' + month : month;
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

        return `${year}-${month}-${dayOfMonth}`;
    };

    const weekCheck = (currentDate) => {
        let date = new Date(currentDate);
        var day_of_week = new Date(currentDate).getDay();

        if (day_of_week === 0) {
            date.setDate(date.getDate() - 3);
        } else if (day_of_week === 6) {
            date.setDate(date.getDate() - 2);
        } else {
            date.setDate(date.getDate() - 1);
        }
        // Format the date as YYYY-MM-DD
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dayOfMonth = date.getDate();

        // Ensure month and day are always two digits
        month = month < 10 ? '0' + month : month;
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

        return `${year}-${month}-${dayOfMonth}`;
    }

    //DataTable Columns
    const tableLeftCols = [ // 테마리스트 테마명/등락률/순위
        { field: '#', headerName: '#', width: 10, },
        { field: '테마명', headerName: '테마명', width: 200 },
        { field: '중복', headerName: '중복', width: 10, },
        { field: '%', headerName: '%', width: 60, },
        { field: '#테마', headerName: '#테마', width: 10, },
        { field: '업종명', headerName: '업종명', width: 150 },
        { field: '#업종', headerName: '#업종', width: 10, },
    ]
    const tableDayCols = [
        { field: '#업종', headerName: '#업종', width: 10, },
        { field: '중복_업종명', headerName: '중복_업종명', width: 130 },
        { field: '중복', headerName: '중복', width: 10, },
        { field: '%', headerName: '%', width: 10, },
    ]
    const tableRightCols = [
        { field: '순위', headerName: '순위', width: 10, },
        { field: '업종명', headerName: '업종명', width: 150 },
        { field: '상승%', headerName: '상승%', width: 80, },
        {
            field: '%', headerName: '%', width: 80, valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${(params.value * 100).toFixed(2)} %`;
            }
        },
    ]
    return (

        <Grid container spacing={1} >
            <Grid item xs={12} >
                <Box sx={{ fontSize: '0.85rem', color: '#999999', position: 'relative', zIndex: 3, transform: 'translate(45vw, 42vh)' }}>
                    Start - 9:5, Update - 5m
                </Box>
                <Grid container spacing={1} >
                    <Grid item xs={4}>
                        <div style={{ height: 상단높이, width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                        >
                            {tableLeft ?
                                <ThemeProvider theme={customTheme}>
                                    <DataGrid rows={tableLeft} hideFooter rowHeight={25} columns={tableLeftCols}
                                        sx={DataTableStyleDefault} />
                                </ThemeProvider>
                                : <Skeleton variant="rectangular" height={200} animation="wave" />
                            }
                        </div>

                    </Grid>
                    <Grid item xs={5.5}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <div style={{ maxHeight: 상단높이, width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                >
                                    {tableToday ?
                                        <ThemeProvider theme={customTheme}>
                                            <DataGrid rows={tableToday} hideFooter rowHeight={25} columns={tableDayCols}
                                                sx={DataTableStyleDefault} />
                                        </ThemeProvider>
                                        : <Skeleton variant="rectangular" height={200} animation="wave" />
                                    }
                                </div>
                                <Box sx={{ fontSize: '14px', mt: 2 }}>
                                    {day.now} (Today)
                                </Box>

                            </Grid>
                            <Grid item xs={4}>
                                <div style={{ maxHeight: 상단높이, width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                >
                                    {tableB1 ?
                                        <ThemeProvider theme={customTheme}>
                                            <DataGrid rows={tableB1} hideFooter rowHeight={25} columns={tableDayCols}
                                                sx={DataTableStyleDefault} />
                                        </ThemeProvider>
                                        : <Skeleton variant="rectangular" height={200} animation="wave" />
                                    }
                                </div>
                                <Box sx={{ fontSize: '14px', mt: 2 }}> {day.b1} (B-1) </Box></Grid>
                            <Grid item xs={4}>
                                <div style={{ maxHeight: 상단높이, width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                >
                                    {tableB2 ?
                                        <ThemeProvider theme={customTheme}>
                                            <DataGrid rows={tableB2} hideFooter rowHeight={25} columns={tableDayCols}
                                                sx={DataTableStyleDefault} />
                                        </ThemeProvider>
                                        : <Skeleton variant="rectangular" height={200} animation="wave" />
                                    }
                                </div>
                                <Box sx={{ fontSize: '14px', mt: 2 }}> {day.b2} (B-2) </Box></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2.5}>
                        <div style={{ height: 상단높이, width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                        >
                            {tableRight ?
                                <ThemeProvider theme={customTheme}>
                                    <DataGrid rows={tableRight} hideFooter rowHeight={25} columns={tableRightCols}
                                        sx={DataTableStyleDefault} />
                                </ThemeProvider>
                                : <Skeleton variant="rectangular" height={200} animation="wave" />
                            }
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
                {/* <Box sx={{ fontSize: '9px', color: 'rgb(153, 153, 153)', position: 'relative', zIndex: 3, transform: 'translate(47vw, 18vh)' }}>
                    Updates-5m
                </Box> */}
                <Grid container spacing={1} >
                    {grStates.map((gr, i) => (
                        <Grid xs={4} key={i} sx={{ mt: -1 }}>
                            {gr ? <Chart data={gr} height={185} /> : <Skeleton variant="rectangular" height={160} animation="wave" />}
                        </Grid>
                    ))}
                </Grid>

            </Grid>
        </Grid>

    )
}


const Chart = ({ data, height }) => {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, type: 'spline', backgroundColor: 'rgba(255, 255, 255, 0)', height: height, },
        credits: { enabled: false, }, title: { text: null },
        xAxis: { categories: ['NOW', 'TOM', 'B-1', 'B-2', 'B-3', 'B-4', 'B-5', 'B-6', 'B-7', 'B-8',], labels: { y: 20, style: { color: '#efe9e9ed', fontSize: '12px' }, }, reversed: true, type: 'category', lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 0, tickColor: '#cfcfcf', tickPosition: 'inside' },
        yAxis: [{
            labels: { enabled: false, format: '{value}위', style: { color: Highcharts.getOptions().colors[0] } },
            title: { enabled: false, text: '', style: { color: Highcharts.getOptions().colors[0] } },
            reversed: true,
            max: 80,
            min: 1,
            plotLines: [{
                color: '#efe9e9ed',
                width: 1,
                value: 14,
                dashStyle: 'shortdash',
                label: {
                    text: '14',
                    align: 'right',
                    x: 11,
                    y: 3,
                    style: {
                        color: '#efe9e9ed',
                    }
                }
            }, {
                color: 'yellow',
                width: 1,
                value: 20,
                dashStyle: 'shortdash',
                label: {
                    text: '20',
                    align: 'right',
                    x: 11,
                    y: 5,
                    style: {
                        color: '#efe9e9ed',
                    }
                }
            }, {
                value: 40,
                label: {
                    text: '40',
                    align: 'right',
                    x: 11,
                    y: 3,
                    style: {
                        color: '#efe9e9ed',
                    }
                }
            }, {
                color: 'dodgerblue',
                width: 2,
                value: 70,
                dashStyle: 'Solid',
                label: {
                    text: '70',
                    align: 'right',
                    x: 11,
                    y: 3,
                    style: {
                        color: '#efe9e9ed',
                    }
                }
            },],
        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                enabled: false,
                text: '테마순위',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                enabled: false,
                format: '{value}위',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true,
            reversed: true,
            gridLineColor: '#404040',
            lineColor: '#404040',
            max: 290,
            min: 1,

        }],
        navigation: { buttonOptions: { enabled: false } },
        legend: { align: 'left', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 0, y: -3, },
        tooltip: { shared: true, crosshairs: true, hideDelay: 200, backgroundColor: '#404040', style: { color: '#fcfcfc' }, },
        plotOptions: {
            series: {
                cursor: 'pointer',
                marker: {
                    lineWidth: 0,
                    symbol: 'circle'
                },
                animation: false,
            },
        },
    })

    useEffect(() => {

        setChartOptions({
            series: [{
                name: data.index[0],
                data: data.data1,
                yAxis: 0,
                color: 'magenta'
            }, {
                name: data.index[1],
                data: data.data2,
                yAxis: 1,
                color: 'greenyellow'
            }],
        })
    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
};

// DataTable Style Default
const DataTableStyleDefault = {
    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '.MuiDataGrid-columnHeaders': {
        minHeight: '30px !important',  // 원하는 높이 값으로 설정
        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
        // backgroundColor: 'rgba(230, 230, 230, 0.3)'
    },
    border: 0,
}
const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '11px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed',
                    },
                    '& .MuiDataGrid-cell': {
                        border: 0, // 셀 줄지우기
                    }
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '11px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    color: '#efe9e9ed',
                },
            },
        },
    },
});