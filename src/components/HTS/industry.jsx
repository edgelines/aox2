import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { API, STOCK } from '../util/config';
import { SectorsName15 } from '../util/util';
import SectorChart from '../SectorsPage/sectorChart';
import { TrendTables, StockInfoFinnacial } from './commonComponents'
import { createTheme, ThemeProvider } from '@mui/material/styles';

export function Industry({ swiperRef, market, time, date, SectorsChartData }) {

    // Table State
    const [dataOrigin, setDataOrigin] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [consecutiveMax, secConsecutiveMax] = useState({})
    const [countBtn, setCountBtn] = useState({
        table1: null, table2: null, table3: null
    })

    // Low Industry ( 65th Lower )
    const [tableLeft, setTableLeft] = useState('');
    const [tableRight, setTableRight] = useState('');
    const [tableToday, setTableToday] = useState('');
    const [tableB1, setTableB1] = useState('');
    const [tableB2, setTableB2] = useState('');
    const [day, setDay] = useState({ now: '', b1: '', b2: '' })

    // 구분별 업종 
    const [SectorsName, setSectorsName] = useState('');
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    // 기능
    // const [keyword, setKeyword] = useState({ type: null, value: null });
    // 공란
    const handleFilteredTable = async (type, item, market, date, time) => { }
    const getStockCode = async (params) => { }
    // 하단 업종 또는 테마를 누를 경우
    const handleFindIndustryThemes = async (params, type, market, date, time) => {
        try {
            const postData = {
                type: type === '업종' ? '업종명' : '테마명',
                split: '1',
                name: params,
                market: market,
                date: date ? date : 'null',
                time: time ? time : 'null'
            }

            const res = await axios.post(`${API}/hts/findData`, postData)

            setDataOrigin(res.data);
            setData5(res.data.industry);
            setData6(res.data.themes);
            setStatistics(res.data.statistics);
            setCountBtn({
                table1: [res.data.consecutive[0].min, res.data.consecutive[0].max],
                table2: [res.data.consecutive[1].min, res.data.consecutive[1].max],
                table3: [res.data.consecutive[2].min, res.data.consecutive[2].max]
            })
            secConsecutiveMax({
                table1: res.data.consecutive[0].max,
                table2: res.data.consecutive[1].max,
                table3: res.data.consecutive[2].max
            })

            if (type === '업종') {
                setSectorsName(params);
                const name = SectorsName15(params)
                setSectorsChartDataSelected(SectorsChartData[name]);
            }

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }

    }
    const handleValueChange = (type, newValue) => {
        setCountBtn(prev => ({
            ...prev,
            [type]: newValue

        }))
    };

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

    const fetchData = async (market, date, time) => {
        try {
            // setKeyword({ type: null, value: null });
            await axios.get(`${API}/lowSectorsRankDf`).then((res) => { setTableLeft(res.data) });
            await axios.get(`${API}/sectorsRankDf4`).then((res) => { setTableRight(res.data); });
            await axios.get(`${API}/theme/lowSectorsRankDfTop3`).then((res) => {
                setTableB2(res.data[0].data);
                setTableB1(res.data[1].data);
                setTableToday(res.data[2].data);
            });

            const postData = {
                type: 'null',
                split: '하위업종',
                name: 'null',
                market: market,
                date: date ? date : 'null',
                time: time ? time : 'null'
            }
            const res = await axios.post(`${API}/hts/findData`, postData)


            setDataOrigin(res.data);
            setData5(res.data.industry);
            setData6(res.data.themes);
            setStatistics(res.data.statistics);
            setCountBtn({
                table1: [res.data.consecutive[0].min, res.data.consecutive[0].max],
                table2: [res.data.consecutive[1].min, res.data.consecutive[1].max],
                table3: [res.data.consecutive[2].min, res.data.consecutive[2].max]
            })
            secConsecutiveMax({
                table1: res.data.consecutive[0].max,
                table2: res.data.consecutive[1].max,
                table3: res.data.consecutive[2].max
            })


        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    // 데이터 업데이트
    useEffect(() => { if (market != null && date != null) { fetchData(market, date, time); } }, [market, date, time])
    // useEffect(() => { fetchData(market, date, time, keyword); }, [date, time, keyword])

    // 날짜 랜더링
    useEffect(() => {
        const today = setDate();
        const b1 = weekCheck(today)
        const b2 = weekCheck(b1)
        setDay({ now: today, b1: b1, b2: b2 })
    }, []);

    // 외국계
    useEffect(() => {
        if (dataOrigin && dataOrigin.df1) {
            const filteredData = dataOrigin.df1.filter(item => (item['연속거래일'] >= countBtn.table1[0] && item['연속거래일'] <= countBtn.table1[1]));
            setData1(filteredData);
        }
    }, [countBtn.table1])

    // 기관계
    useEffect(() => {
        if (dataOrigin && dataOrigin.df2) {
            const filteredData = dataOrigin.df2.filter(item => (item['연속거래일'] >= countBtn.table2[0] && item['연속거래일'] <= countBtn.table2[1]));
            setData2(filteredData);
        }
    }, [countBtn.table2])

    // 외국기관 합산
    useEffect(() => {
        if (dataOrigin && dataOrigin.df3) {
            const filteredData = dataOrigin.df3.filter(item => (item['연속거래일'] >= countBtn.table3[0] && item['연속거래일'] <= countBtn.table3[1]));
            setData3(filteredData);
        }
    }, [countBtn.table3])

    // 5분 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 31)) {
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
                    fetchData(market, date, time);
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
        <Grid container>
            <TrendTables swiperRef={swiperRef} statistics={statistics} data1={data1} data2={data2} data3={data3} data5={data5} data6={data6} consecutiveMax={consecutiveMax} countBtn={countBtn}
                market={market} date={date} time={time}
                getStockCode={getStockCode} handleFilteredTable={handleFilteredTable} handleValueChange={handleValueChange} />

            {/* Information */}
            <Grid container spacing={1} >
                <Grid item xs={4}>
                    <div style={{ height: '400px', width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        {tableLeft ?
                            <ThemeProvider theme={customTheme}>
                                <DataGrid rows={tableLeft} hideFooter rowHeight={25} columns={tableLeftCols} sx={DataTableStyleDefault}
                                    onCellClick={(params, event) => {
                                        if (params.field === '테마명') {
                                            handleFindIndustryThemes(params.value, '테마', market, date, time)
                                        }
                                        if (params.field === '업종명') {
                                            handleFindIndustryThemes(params.value, '업종', market, date, time)
                                        }
                                    }}
                                />
                            </ThemeProvider>
                            : <Skeleton variant="rectangular" height={200} animation="wave" />
                        }
                    </div>

                </Grid>
                <Grid item xs={5.5}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <div style={{ width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                            >
                                {tableToday ?
                                    <ThemeProvider theme={customTheme}>
                                        <DataGrid rows={tableToday} hideFooter rowHeight={25} columns={tableDayCols}
                                            onCellClick={(params, event) => {
                                                if (params.field === '중복_업종명') {
                                                    handleFindIndustryThemes(params.value, '업종', market, date, time)
                                                }
                                            }}
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
                            <div style={{ width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                            >
                                {tableB1 ?
                                    <ThemeProvider theme={customTheme}>
                                        <DataGrid rows={tableB1} hideFooter rowHeight={25} columns={tableDayCols}
                                            onCellClick={(params, event) => {
                                                if (params.field === '중복_업종명') {
                                                    handleFindIndustryThemes(params.value, '업종', market, date, time)
                                                }
                                            }}
                                            sx={DataTableStyleDefault} />
                                    </ThemeProvider>
                                    : <Skeleton variant="rectangular" height={200} animation="wave" />
                                }
                            </div>
                            <Box sx={{ fontSize: '14px', mt: 2 }}> {day.b1} (B-1) </Box></Grid>
                        <Grid item xs={4}>
                            <div style={{ width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                            >
                                {tableB2 ?
                                    <ThemeProvider theme={customTheme}>
                                        <DataGrid rows={tableB2} hideFooter rowHeight={25} columns={tableDayCols}
                                            onCellClick={(params, event) => {
                                                if (params.field === '중복_업종명') {
                                                    handleFindIndustryThemes(params.value, '업종', market, date, time)
                                                }
                                            }}
                                            sx={DataTableStyleDefault} />
                                    </ThemeProvider>
                                    : <Skeleton variant="rectangular" height={200} animation="wave" />
                                }
                            </div>
                            <Box sx={{ fontSize: '14px', mt: 2 }}> {day.b2} (B-2) </Box></Grid>
                    </Grid>

                    <Grid container sx={{ mt: 2 }}>
                        <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} />
                    </Grid>

                </Grid>
                <Grid item xs={2.5}>
                    <div style={{ height: '400px', width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        {tableRight ?
                            <ThemeProvider theme={customTheme}>
                                <DataGrid rows={tableRight} hideFooter rowHeight={25} columns={tableRightCols}
                                    sortModel={[{ field: '순위', sort: 'desc' }]} sortingOrder={['desc', 'asc']}
                                    onCellClick={(params, event) => {
                                        if (params.field === '업종명') {
                                            handleFindIndustryThemes(params.value, '업종', market, date, time)
                                        }
                                    }}
                                    sx={DataTableStyleDefault} />
                            </ThemeProvider>
                            : <Skeleton variant="rectangular" height={200} animation="wave" />
                        }
                    </div>
                </Grid>
            </Grid>


        </Grid>
    )
}


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



// https://api.finance.naver.com/siseJson.naver?symbol=007860&requestType=1&startTime=20220601&endTime=20231228&timeframe=day
// https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:005930|SERVICE_RECENT_ITEM:005930&_callback=window.__jindo2_callback._3495