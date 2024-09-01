import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './Motions/MotionsColumns';
import { DataTableStyleDefault } from './LeadSectors/tableColumns';
import { blue } from '@mui/material/colors';
import { API, API_WS, STOCK } from './util/config.jsx';
import dayjs from 'dayjs';
import StockChart_MA from './util/stockChart_MA';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { StyledToggleButton } from './util/util.jsx';

import { monthColumns, dayColumns } from './Report/columns.jsx';
import TestChart from './Test/TestChart.jsx'


export default function TestPage({ swiperRef }) {


    // state
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [_date, set_Date] = useState({ year: null, month: null });
    const [monthData, setMonthData] = useState([]);
    const [dayData, setDayData] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [stock, setStock] = useState({ 종목명: null })
    const [stockChart, setStockChart] = useState({});
    const [selectedChartType, setSelectedChartType] = useState('A') // Chart Type


    const get_data = async (_date) => {
        const postData = {
            year: _date.year,
            month: _date.month
        }
        const res = await axios.post(`${API}/report/getMonthData`, postData);
        // const res = await axios.post('http://localhost:2440/api/report/getMonthData', postData);
        setMonthData(res.data.data);
        setStatistics(res.data.statistics);
    }

    const fetchData = async () => {
        var today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = { year: year, month: month }

        set_Date(date);
        get_data(date);

    }

    // handler
    const getCellClick = async (row) => {
        const res = await axios.post(`${API}/report/getDayData`, { 날짜: row.날짜.split('T')[0] });
        // const res = await axios.post('http://localhost:2440/api/report/getDayData', { 날짜: row.날짜.split('T')[0] });
        setDayData(res.data);
    }
    const handleSelectedChartType = async (event, value) => {
        if (value !== null) { setSelectedChartType(value) }
    }
    const getInfo = async (item) => {
        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            setStock({
                종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
                // 시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                // Invest: res.data.Invest, InvestCount: res.data.InvestCount,
                // PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                // N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                // 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                // 최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요,
                // 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                // 주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                // 테마명: res.data.테마명
            })
            // 종목차트
            // var res = await axios.get(`http://localhost:2440/stockData/get/${item.종목코드}`);
            var res = await axios.get(`${STOCK}/get/${item.종목코드}/${selectedChartType}`);
            setStockChart({
                // price: res.data.price,
                // volume: res.data.volume,
                // MA: res.data.MA,
                // treasury: res.data.treasury,
                // treasuryPrice: res.data.treasuryPrice,
                willR: res.data.willR,
                net: res.data.net,
                volumeRatio: res.data.volumeRatio,
                DMI: res.data.DMI,
                series: res.data.series
            })
        } else {
            setStockChart({ price: [], volume: [] });
        }

    }


    useEffect(() => { fetchData(); }, [])
    useEffect(() => { console.log(value.$y) }, [value])

    const tableCellStyle = { color: '#efe9e9ed', fontSize: '11px' }


    return (
        <Grid container spacing={1}>
            {/* <Grid item container xs={12}>
                <Typography>Report Page</Typography>
            </Grid> */}

            {/* Month Stats Data */}
            <Grid item container xs={3}>

                {/* Calendar */}
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            sx={{
                                '.MuiDateCalendar-root': {
                                    color: '#bbdefb',
                                    borderRadius: '2px',
                                    borderWidth: '1px',
                                    borderColor: '#2196f3',
                                    border: '1px solid',
                                    backgroundColor: '#0d47a1',
                                },
                            }}
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>
                </Grid>

                <TableContainer sx={{ height: 600 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={monthData}
                            columns={monthColumns}
                            rowHeight={20}
                            hideFooter
                            onCellClick={(params, event) => {
                                getCellClick(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '[data-field="테마명"]': { fontSize: '9px' },

                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>
            </Grid>

            {/* Chart, Day Stats Data */}
            <Grid item container xs={5.5}>
                <Grid item container>
                    <StockChart_MA
                        height={500}
                        stockName={stock.종목명} price={stock.현재가} net={stockChart.net} volumeRatio={stockChart.volumeRatio}
                        willR={stockChart.willR} DMI={stockChart.DMI}
                        series={stockChart.series}
                        selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                    // selectedSubChartType={selectedSubChartType} handleSelectedSubChartType={handleSelectedSubChartType}
                    />
                </Grid>
                <TableContainer sx={{ height: 500 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={dayData}
                            columns={dayColumns}
                            rowHeight={20}
                            hideFooter
                            getRowId={(row) => row.id} // id 필드를 고유 식별자로 사용
                            onCellClick={(params, event) => {
                                getInfo(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '[data-field="테마명"]': { fontSize: '9px' },

                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>
            </Grid>

            {/* Statistics */}

            <Grid item container xs={3.5}>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableCellStyle} >보조지표</TableCell>
                                <TableCell sx={tableCellStyle} >min</TableCell>
                                <TableCell sx={tableCellStyle} >max</TableCell>
                                <TableCell sx={tableCellStyle} >avg</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(statistics).map(item => {
                                const columns = ['w9', 'w14', 'w33', 'd7', 'd17']
                                const columns2 = ['T14', 'T16', 'T18', 'T20']
                                if (columns.includes(item)) {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell sx={tableCellStyle}>{item}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['min']}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['max']}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['avg']}</TableCell>
                                        </TableRow>
                                    )
                                } else if (columns2.includes(item)) {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell sx={tableCellStyle}>{item}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]} / {statistics['종목갯수']}</TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>


        </Grid>

    )
}
