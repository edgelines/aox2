import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { API } from '../util/config';
import { SectorsName15 } from '../util/util';
import { Financial, StyledTypography_StockInfo } from '../util/htsUtil';
import SectorChart from '../SectorsPage/sectorChart';
import { TrendTables, StockInfoFinnacial } from './commonComponents'
import { createTheme, ThemeProvider } from '@mui/material/styles';

export function Industry({ swiperRef, market, time, date, apiReset }) {

    // Post Params
    const [paramsType, setParamsType] = useState('null');
    const [paramsName, setParamsName] = useState('null');

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
    // const [tableLeft, setTableLeft] = useState('');
    const [stock, setStock] = useState({
        종목명: null, 종목코드: null,
    })
    const [tableRight, setTableRight] = useState('');
    const [tableToday, setTableToday] = useState('');
    const [tableB1, setTableB1] = useState('');
    const [tableB2, setTableB2] = useState('');
    const [day, setDay] = useState({ now: '', b1: '', b2: '' })

    // 구분별 업종 
    const [SectorsName, setSectorsName] = useState('');
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);

    // 하단 업종 또는 테마를 누를 경우
    const handleFilteredTable = async (type, item) => {
        try {
            setParamsType(type);
            const name = type === '업종명' ? item.업종명 || item.중복_업종명 : item.테마명
            const cleanedName = name.replace(/ ★/g, '').replace(/\[[1-9]\] /g, '');
            setParamsName(cleanedName);

            if (type === '업종명') {
                setSectorsName(cleanedName);
                const name = SectorsName15(cleanedName)
                const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
                if (!excludedNames.includes(name)) {
                    const res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
                    setSectorsChartDataSelected(res.data);
                }

                // if (name15 !== '없음' && name15 !== '카드' && name15 !== '손해보험' && name15 !=='복합유틸리티'&& name15 !=='복합기업'&& name15 !=='전기유틸리티'&& name15 !=='생명보험'&& name15 !=='다각화된소비자서비스'&& name15 !=='사무용전자제품'&& name15 !=='담배'&& name15 !=='기타금융'&& name15 !=='문구류'&& name15 !=='판매업체'&& name15 !=='전문소매'&& name15 !=='출판' ) {
                //     setSectorsChartDataSelected(SectorsChartData[name15]);
                // }
            }

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    // 공란
    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
        console.log(res.data);
        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수
        })
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

    const fetchData = async (market, date, time, paramsType, paramsName) => {
        try {
            // setKeyword({ type: null, value: null });
            // await axios.get(`${API}/industry/LowRankTable`).then((res) => { setTableLeft(res.data) });
            await axios.get(`${API}/industry/RankTable`).then((res) => { setTableRight(res.data); });
            await axios.get(`${API}/industry/LowRankTableTop3`).then((res) => {
                setTableB2(res.data[0].data);
                setTableB1(res.data[1].data);
                setTableToday(res.data[2].data);
            });

            const postData = {
                type: paramsType,
                split: '하위업종',
                name: paramsName,
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
    useEffect(() => { if (market != null && date != null) { fetchData(market, date, time, paramsType, paramsName); } }, [market, date, time, paramsType, paramsName]);
    useEffect(() => { setParamsType('null'); setParamsName('null'); }, [apiReset]);
    // useEffect(() => { if (market != null && date != null) { fetchData(market, date, time); } }, [market, date, time])

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
        if (hour < 9 || (hour === 9 && minutes < 35)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        let intervalId;
        const startUpdates = () => {
            intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(market, date, time, paramsType, paramsName);
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

        // return () => clearTimeout(timeoutId);
        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
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
                    <Financial annual={stock.연간실적} quarter={stock.분기실적} />

                    <Grid container sx={{ mt: 2 }}>
                        {
                            Array.isArray(stock.기업개요) ?
                                <>
                                    <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                                        <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{stock.종목명}</StyledTypography_StockInfo></Grid>
                                        <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{stock.업종명}</StyledTypography_StockInfo></Grid>
                                        <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{stock.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Stack direction='row' spacing={5} sx={{ pl: 2, pr: 2, pt: 2 }}>
                                            <StyledTypography_StockInfo fontSize="12px">시가총액</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{parseInt((parseInt(stock.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">상장주식수</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{parseInt(stock.상장주식수).toLocaleString('kr')}</StyledTypography_StockInfo>
                                        </Stack>
                                    </Grid>
                                    <Grid item container>
                                        <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                                            <StyledTypography_StockInfo fontSize="12px">PER</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{stock.PER}</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">PBR</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{stock.PBR}</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">EPS</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{stock.EPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">BPS</StyledTypography_StockInfo>
                                            <StyledTypography_StockInfo fontSize="12px">{stock.BPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                                        </Stack>
                                    </Grid>
                                </>
                                : <></>
                        }
                    </Grid>
                    {/* <div style={{ height: '400px', width: "100%", borderBottom: '1px solid #efe9e9ed' }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        {tableLeft ?
                            <ThemeProvider theme={customTheme}>
                                <DataGrid rows={tableLeft} hideFooter rowHeight={25} columns={tableLeftCols} sx={DataTableStyleDefault}
                                    onCellClick={(params, event) => {
                                        if (params.field === '테마명') {
                                            handleFilteredTable('테마명', params.row)
                                        }
                                        if (params.field === '업종명') {
                                            handleFilteredTable('업종명', params.row)
                                        }
                                    }}
                                />
                            </ThemeProvider>
                            : <Skeleton variant="rectangular" height={200} animation="wave" />
                        }
                    </div> */}

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
                                                    handleFilteredTable('업종명', params.row)
                                                }
                                            }}
                                            sx={DataTableStyleDefault} />
                                    </ThemeProvider>
                                    : <Skeleton variant="rectangular" height={200} animation="wave" />
                                }
                            </div>
                            <Box sx={{ fontSize: '14px', mt: 1 }}>
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
                                                    handleFilteredTable('업종명', params.row)
                                                }
                                            }}
                                            sx={DataTableStyleDefault} />
                                    </ThemeProvider>
                                    : <Skeleton variant="rectangular" height={200} animation="wave" />
                                }
                            </div>
                            <Box sx={{ fontSize: '14px', mt: 1 }}> {day.b1} (B-1) </Box></Grid>
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
                                                    handleFilteredTable('업종명', params.row)
                                                }
                                            }}
                                            sx={DataTableStyleDefault} />
                                    </ThemeProvider>
                                    : <Skeleton variant="rectangular" height={200} animation="wave" />
                                }
                            </div>
                            <Box sx={{ fontSize: '14px', mt: 1 }}> {day.b2} (B-2) </Box></Grid>
                    </Grid>

                    <Grid container sx={{ mt: 0 }}>
                        <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} height={200} legendY={0} />
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
                                            handleFilteredTable('업종명', params.row)
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