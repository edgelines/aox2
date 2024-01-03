import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Grid, Box, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, ThemeProvider, Slider } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StyledToggleButton } from './util/util';
import { renderProgress, StyledTypography, TitleComponent, DataTable, DatePickerTheme, disablePastDatesAndWeekends, FilteredDataTable, renderProgressBar, StockInfo, Financial } from './util/htsUtil';
import { API, STOCK } from './util/config';
import StockChart from './util/stockChart';

export default function HtsPage({ swiperRef }) {
    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;

    const [market, setMarket] = useState('kosdaq');
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(dateString);

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

    // Table Click > Filtered Table
    const [filteredDataTable, setFilteredDataTable] = useState([])

    // Infomation State
    const [stock, setStock] = useState({
        종목명: null, 종목코드: null,
    })
    const [stockChart, setStockChart] = useState({
        price: [], volume: []
    })


    const tableHeight = 440

    const handleMarket = (event, value) => { if (value !== null) { setMarket(value); } }
    const handleTime = (event, value) => { setTime(value); }
    const handleDate = async (event) => {
        const getDate = `${event.$y}-${event.$M + 1}-${event.$D}`
        setDate(getDate)
    }
    const handleFilteredTable = async (type, item, market, date, time) => {
        if (type === '업종') {
            let res
            if (date && time) {
                res = await axios.get(`${API}/hts/findIndustry/${item.업종명}?name=${market}&date=${date}&time=${time}`);
            } else if (date) {
                res = await axios.get(`${API}/hts/findIndustry/${item.업종명}?name=${market}&date=${date}`);
            } else {
                res = await axios.get(`${API}/hts/findIndustry/${item.업종명}?name=${market}`);
            }

            setFilteredDataTable(res.data.종목들);
            // const res = await axios.get(`${API}/info/findIndustry/${item.업종명}`);    
        }
        // console.log(item);
        // const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
    }
    const handleValueChange = (type, newValue) => {
        setCountBtn(prev => ({
            ...prev,
            [type]: newValue

        }))
    };

    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);

        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적
        })
    }

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume })
    }



    const fetchData = async (market, date, time) => {
        try {
            let res;
            if (date && time) {
                res = await axios.get(`${API}/hts/trends?name=${market}&date=${date}&time=${time}`);
            } else if (date) {
                res = await axios.get(`${API}/hts/trends?name=${market}&date=${date}`);
            } else {
                res = await axios.get(`${API}/hts/trends?name=${market}`);
            }
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
    useEffect(() => { if (market) { fetchData(market, date, time); } }, [market, date, time])

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
                    fetchData(market);
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

    // ChartData
    useEffect(() => {
        if (stock.종목코드 != null) { getStockChartData(stock.종목코드); }
    }, [stock])

    const columns = [
        {
            field: '연속거래일', headerName: ' ', width: 5,
            align: 'center', headerAlign: 'center',
        }, {
            field: '종목명', headerName: '종목명', width: 90,
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
            field: '대비율', headerName: '검색%', width: 40,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '등락률', headerName: '현재%', width: 40,
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
            field: '외국인', headerName: '외국계', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }
    ]
    const columns_data2 = [...columns,
    {
        field: '기관계', headerName: '기관계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '투신', headerName: '투신', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
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
    }]
    const columns_data3 = [...columns,
    {
        field: '외국인', headerName: '외국계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '기관계', headerName: '기관계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    },
    ]
    const filteredDataTableCols = [
        { field: '종목명', headerName: '종목명', width: 73 },
        {
            field: '등락률', headerName: '등락률', width: 30,
            renderCell: (params) => {
                const row = params.row;
                const progress = renderProgressBar({ value: row.changeRate, valueON: true, val2: 5, color: '#e89191' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {params.value} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: '전일대비거래량', headerName: '전일대비', width: 55, renderCell: (params) => {
                const row = params.row;
                const progress = renderProgressBar({ value: row.volume, valueON: true, val2: 5, color: '#91bde8' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {parseInt(params.value).toLocaleString('kr')} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
    ]
    const indicators = [
        { name: 'table1', adjustWidth: '22px' },
        { name: 'table2', adjustWidth: '465px' },
        { name: 'table3', adjustWidth: '1110px' },
    ]
    return (
        <Grid container>
            {/* 상단 */}
            <Grid item container sx={{ pt: 1, pb: 1 }}>
                <Grid item container xs={1} direction="row" alignItems="center">
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={market}
                        onChange={handleMarket}
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

            {/* Table */}
            <Grid item container spacing={1}>
                <Grid item xs={2.8}>
                    <TitleComponent title={'외국계'} statistics={statistics[0]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data1} columns={columns_data1} height={tableHeight} onParams={getStockCode} />
                </Grid>
                <Grid item xs={4.1}>
                    <TitleComponent title={'기관계 (#투신)'} statistics={statistics[1]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data2} columns={columns_data2} height={tableHeight} onParams={getStockCode} />
                </Grid>
                <Grid item xs={3.1}>
                    <TitleComponent title={'외국 기관 합산'} statistics={statistics[2]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data3} columns={columns_data3} height={tableHeight} onParams={getStockCode} />
                </Grid>

                <Grid item xs={1}>
                    <StyledTypography>업종</StyledTypography>
                    <TableContainer sx={{ height: tableHeight - 45 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {data5 && data5.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data5.map(item => (
                                        <TableRow key={item.업종명} onClick={() => handleFilteredTable('업종', item, market, date, time)}>
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

                <Grid item xs={1}>
                    <StyledTypography>테마</StyledTypography>
                    <TableContainer sx={{ height: tableHeight - 45 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {data6 && data6.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data6.map(item => (
                                        <TableRow key={item.테마명} onClick={() => handleFilteredTable('테마', item)}>
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

            {/* Table 하단 컨트롤러 */}
            <Grid item container>
                {
                    Array.isArray(countBtn.table1) ?
                        indicators.map((indicator, index) => (
                            <Box key={indicator.name} sx={{ position: 'absolute', left: indicator.adjustWidth, top: `${tableHeight + 55}px`, zIndex: 90 }}>
                                <Grid container sx={{ width: '130px' }}>
                                    <Grid item xs={1} container direction="row" alignItems="center" sx={{ pr: 2 }}>
                                        {countBtn[indicator.name][0]}
                                    </Grid>
                                    <Grid item xs={8} container>
                                        <Slider
                                            value={countBtn[indicator.name]}
                                            // value={typeof countBtn[indicator.name] === 'number' ? countBtn[indicator.name] : countBtn[indicator.name][0]}
                                            onChange={(event, newValue) => handleValueChange(indicator.name, newValue)}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            min={1}
                                            max={consecutiveMax[indicator.name]}
                                            size="small"
                                            sx={{ color: '#efe9e9ed' }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} container justifyContent="flex-end" alignItems="center" sx={{ pl: 3 }}>
                                        {countBtn[indicator.name][1]}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                        : <Skeleton />
                }

            </Grid>

            {/* Information */}
            <Grid item container spacing={1}>
                <Grid item xs={3.5}>
                    <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                </Grid>
                <Grid item xs={4}>
                    <StockChart stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} />
                </Grid>
                <Grid item xs={3}>
                    {stock.종목코드 === null ? '' :
                        <StockInfo data={stock} />
                    }
                </Grid>
                <Grid item xs={1.5}>
                    <FilteredDataTable swiperRef={swiperRef} data={filteredDataTable} columns={filteredDataTableCols} height={400} onParams={getStockCode} />
                </Grid>
            </Grid>

        </Grid>
    )
}


// https://api.finance.naver.com/siseJson.naver?symbol=007860&requestType=1&startTime=20220601&endTime=20231228&timeframe=day
// https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:005930|SERVICE_RECENT_ITEM:005930&_callback=window.__jindo2_callback._3495