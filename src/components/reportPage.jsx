import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, IconButton, Stack, Typography, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './Motions/MotionsColumns';
import { DataTableStyleDefault } from './LeadSectors/tableColumns';
import { blue } from '@mui/material/colors';
import { API, STOCK } from './util/config.jsx';
import StockChart_MA from './util/stockChart_MA';
import LeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import RightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { monthColumns, dayColumns } from './Report/columns.jsx';
import Chart from './Report/Chart.jsx';

export default function TestPage({ swiperRef, baseStockName }) {
    // state
    const [date, setDate] = useState(() => {
        const today = new Date();
        return { year: today.getFullYear(), month: today.getMonth() + 1 };
    });

    // Month Data
    const [monthData, setMonthData] = useState([]);
    // const [whiteMonthData, setWhiteMonthData] = useState([]);

    // Day Data 
    const [dayData, setDayData] = useState([]);

    // Boxplot Data
    const [boxplotCci, setBoxplotCci] = useState({ categories: [], data: [] });
    const [boxplotDmi, setBoxplotDmi] = useState({ categories: [], data: [] });
    const [boxplotWillr, setBoxplotWillr] = useState({ categories: [], data: [] });
    const [boxplotVolume, setBoxplotVolume] = useState({ categories: [], data: [] });
    const [boxplotRank, setBoxplotRank] = useState({ categories: [], data: [] });
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
        setBoxplotCci(res.data.boxplot_cci);
        setBoxplotDmi(res.data.boxplot_dim);
        setBoxplotWillr(res.data.boxplot_willr);
        setBoxplotVolume(res.data.boxplot_volume);
        setBoxplotRank(res.data.boxplot_rank);
        // setWhiteMonthData(res.data.white_box);

    }

    // handler
    const changeMonth = (offset) => {
        setDate((prevDate) => {
            let newMonth = prevDate.month + offset;
            let newYear = prevDate.year;

            if (newMonth < 1) {
                newMonth = 12;
                newYear -= 1;
            } else if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
            }

            // 2024년 8월 미만으로 넘어가지 않도록 제한
            if (newYear < 2024 || (newYear === 2024 && newMonth < 8)) {
                return prevDate;
            }
            const today = new Date();
            if (newYear > today.getFullYear() || newMonth > today.getMonth() + 1) {
                return prevDate
            }
            return { year: newYear, month: newMonth };
        });
    };
    const getCellClick = async (row) => {
        const res = await axios.post(`${API}/report/getDayData`, { 날짜: row.날짜.split('T')[0], type: row.type });
        setDayData(res.data);
    }
    const handleSelectedChartType = async (event, value) => {
        if (value !== null) { setSelectedChartType(value) }
    }
    const getInfo = async (item) => {
        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            if (res.status === 200) {
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
            }
            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            }
        } else {
            setStockChart({ price: [], volume: [] });
        }

    }

    useEffect(() => {
        if (date && date.year && date.month) {
            get_data(date);
        }
    }, [date]);

    const getSelectedChartType = async () => {
        if (typeof stock.종목코드 !== "undefined") {
            var res = await axios.get(`${STOCK}/get/${stock.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            }
        }
    }
    useEffect(() => {
        getSelectedChartType()
    }, [stock, selectedChartType])
    return (
        <Grid container spacing={1}>
            {/* <Grid item container xs={12}>
                <Typography>Report Page</Typography>
            </Grid> */}

            {/* Month Stats Data */}
            <Grid item container xs={2}>

                {/* Calendar */}
                <Grid item xs={12} >
                    <Stack direction='row' alignItems="center" justifyContent="center" >
                        <IconButton size="large" onClick={() => changeMonth(-1)}>
                            <LeftIcon fontSize="large" sx={{ color: '#efe9e9ed' }} />
                        </IconButton>
                        <Typography>{date.year}. {date.month}</Typography>
                        <IconButton size="large" onClick={() => changeMonth(1)}>
                            <RightIcon fontSize="large" sx={{ color: '#efe9e9ed' }} />
                        </IconButton>
                    </Stack>
                </Grid>
                <Grid item container >
                    <TableContainer sx={{ height: 800 }}
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
                                    '& .MuiDataGrid-row.Mui-selected': {
                                        backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                    },
                                }}
                            />
                        </ThemeProvider>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* Chart, Day Stats Data */}
            <Grid item container xs={6.5}>
                <Grid item container>
                    <StockChart_MA
                        height={580}
                        boxTransform={`translate(10px, 235px)`}
                        stockName={stock.종목명} price={stock.현재가}
                        info={stockChart.info} series={stockChart.series}
                        selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                        baseStockName={baseStockName} getInfo={getInfo}

                    />
                </Grid>
                <TableContainer sx={{ height: 300, mt: 1 }}
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

            <Grid item xs={3.5}>
                <Grid item xs={12}>
                    <Chart data={boxplotCci} />
                </Grid>
                <Grid item xs={12}>
                    <Chart data={boxplotDmi} />
                </Grid>
                <Grid item xs={12}>
                    <Chart data={boxplotWillr} />
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <Chart data={boxplotVolume} />
                    </Grid>
                    <Grid item xs={6}>
                        <Chart data={boxplotRank} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    )
}
