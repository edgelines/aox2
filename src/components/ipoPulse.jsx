import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { Grid, Stack, Typography, Input, TextField, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { StyledToggleButton, StyledButton, DataTableStyleDefault } from './util/util';
import { StyledTypography, TitleComponent, DataTable, FilteredDataTable, renderProgressBar, StockInfo, StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';
// import StockChart from './util/stockChart';
import StockChart_MA from './util/stockChart_MA';
import { renderProgress, StyledInput } from './util/ipoUtil';
import { API, STOCK } from './util/config';
import ThumbnailChart from './IpoPulse/thumbnailChart';

export default function IpoPulsePage({ swiperRef }) {

    const [filter, setFilter] = useState({
        high: [-44, -80], start: [-30, -100], day: [50, 100]
    })
    // checkBox
    const [checkBox, setCheckBox] = useState({
        high: false, start: false, day: false, all: false,
    })

    // state
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    const handleCheckBox = (name) => {
        setCheckBox((prevStatus) => {
            if (name === 'All') {
                const newStatus = !prevStatus.all;
                return {
                    high: newStatus,
                    start: newStatus,
                    day: newStatus,
                    all: newStatus,
                }
            } else {
                const updatedStatus = {
                    ...prevStatus,
                    [name]: !prevStatus[name],
                };
                // 다른 체크박스들의 상태를 확인하여 'All' 체크박스 상태 결정
                const isAllChecked = updatedStatus.high && updatedStatus.start && updatedStatus.day;
                return {
                    ...updatedStatus,
                    all: !isAllChecked
                };
            }

        });
    }
    const handleRangeValue = (event, name, index) => {
        const value = event.target.value;

        setFilter((prevStatus) => {
            const newRange = [...prevStatus[name]];
            newRange[index] = value;
            return {
                ...prevStatus,
                [name]: newRange
            }
        });
    }

    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
        // console.log(res.data);
        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트
        })
    }

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume })
    }

    const fetchData = async (checkBox, filter) => {
        const postData = {
            high: checkBox.high == true ? filter.high : null,
            start: checkBox.start == true ? filter.start : null,
            day: checkBox.day == true ? filter.day : null,
        }
        // console.log(postData);
        const res = await axios.post(`${API}/ipoPulse/data`, postData);

        setTableData(res.data.table);
        setChartData(res.data.chart);

    }

    useEffect(() => { fetchData(checkBox, filter) }, [checkBox, filter])

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
        let intervalId
        const startUpdates = () => {
            intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(checkBox, filter);
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

    // ChartData
    useEffect(() => {
        if (stock.종목코드 != null) { getStockChartData(stock.종목코드); }
    }, [stock])

    const table_columns = [
        {
            field: '종목명', headerName: '종목명', width: 120,
            align: 'left', headerAlign: 'center',
        }, {
            field: '업종명', headerName: '업종명', width: 120,
            align: 'left', headerAlign: 'center',
        }, {
            field: '상장예정일', headerName: '상장일', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '경과일수', headerName: '경과일수', width: 65,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가', headerName: '최고가', width: 80,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최저가', headerName: '최저가', width: 80,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가대비', headerName: '최고가대비', width: 80,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '공모가', headerName: '공모가', width: 80,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return parseInt(params.value).toLocaleString('kr');
            }
        }, {
            field: '공모가대비', headerName: '공모가대비', width: 80,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '현재가', headerName: '현재가', width: 80,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '등락률', headerName: '등락률', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '보호예수', headerName: '보호예수', width: 300,
            align: 'left', headerAlign: 'center',
        }
    ]

    const inputStyle = { width: 60, height: 27.5, color: '#efe9e9ed', fontSize: '12px', pl: 2, pt: 1.5 }
    return (
        <>
            <Grid container>
                <Grid container>
                    {chartData ?
                        Object.entries(chartData).map(([quarter, items], index) => (
                            <Grid item xs={0.92} key={quarter}>
                                <>
                                    <Grid container sx={{ width: '100%' }}>
                                        <Grid item xs={10}>
                                            <ThumbnailChart data={items} height={130} />

                                        </Grid>
                                    </Grid>

                                    <Grid container direction='row' alignItems="center" justifyContent="center" sx={{ mt: -2, zIndex: 999 }}>
                                        <Typography sx={{ fontSize: '12px' }}>{quarter}</Typography>
                                    </Grid>
                                    <Grid container direction='row' alignItems="center" justifyContent="center">
                                        Total : {items.length}
                                    </Grid>
                                </>
                            </Grid>
                        ))
                        : <div>Loading...</div>
                    }
                </Grid>
                <Grid container direction='row' justifyContent="end">
                    <Typography align='right' sx={{ fontSize: '9px' }}>최고가대비</Typography>
                </Grid>

            </Grid>
            <Grid container sx={{ mt: 2, height: 60 }}>

                <Grid item container xs={9}>
                    <Grid item xs={3.5} container direction='row' alignItems="center" justifyContent="center" sx={{ height: 41 }}>
                        <FormControlLabel control={
                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, } }}
                                checked={checkBox.high}
                                onChange={() => handleCheckBox('high')}
                            />
                        } labelPlacement="start" label="최고가대비(%)" sx={{ pt: 1 }} />
                        {/* <Typography sx={{ fontSize: '13px', pt: 1 }}>최고가대비(%)</Typography> */}
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.high[0]}
                            onChange={(event) => handleRangeValue(event, 'high', 0)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                        />
                        <Typography sx={{ fontSize: '13px', ml: 2, mr: 1, pt: 1 }}>~</Typography>
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.high[1]}
                            onChange={(event) => handleRangeValue(event, 'high', 1)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                        />
                        {/* <Checkbox size="small" sx={{ color: pink[800], '&.Mui-checked': { color: grey.A200, }, pt: 2 }} /> */}
                    </Grid>
                    <Grid item xs={3.5} container direction='row' alignItems="center" justifyContent="center" sx={{ height: 41 }}>
                        <FormControlLabel control={
                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, } }}
                                checked={checkBox.start}
                                onChange={() => handleCheckBox('start')}
                            />
                        } labelPlacement="start" label="공모가대비(%)" sx={{ pt: 1 }} />
                        {/* <Typography sx={{ fontSize: '13px', pt: 1 }}>공모가대비(%)</Typography> */}
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.start[0]}
                            onChange={(event) => handleRangeValue(event, 'start', 0)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                        />
                        <Typography sx={{ fontSize: '13px', ml: 2, mr: 1, pt: 1 }}>~</Typography>
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.start[1]}
                            onChange={(event) => handleRangeValue(event, 'start', 1)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                        />
                        {/* <Checkbox size="small" sx={{ color: pink[800], '&.Mui-checked': { color: grey.A200, }, pt: 2 }} /> */}
                    </Grid>
                    <Grid item xs={3.5} container direction='row' alignItems="center" justifyContent="center" sx={{ height: 41 }}>
                        <FormControlLabel control={
                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, } }}
                                checked={checkBox.day} onChange={() => handleCheckBox('day')} />
                        } labelPlacement="start" label="상장일" sx={{ pt: 1 }} />
                        {/* <Typography sx={{ fontSize: '13px', pt: 1 }}>상장일</Typography> */}
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.day[0]}
                            onChange={(event) => handleRangeValue(event, 'day', 0)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                        />
                        <Typography sx={{ fontSize: '13px', ml: 2, mr: 1, pt: 1 }}>~</Typography>
                        <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.day[1]}
                            onChange={(event) => handleRangeValue(event, 'day', 1)}
                            endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                        />
                        {/* <Checkbox size="small" sx={{ color: pink[800], '&.Mui-checked': { color: grey.A200, }, pt: 2 }} /> */}
                    </Grid>

                    <Grid item xs={1.5} container direction='row' alignItems="center" justifyContent="center" sx={{ height: 41 }}>
                        <FormControlLabel control={
                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, } }}
                                onChange={() => handleCheckBox('All')}
                            />
                        } labelPlacement="start" label="All" sx={{ pt: 1 }} />
                    </Grid>

                </Grid>

                {/* 우측 기업 정보 */}
                <Grid item xs={3}>
                    {
                        Array.isArray(stock.기업개요) ?
                            <>
                                <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                                    <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{stock.종목명}</StyledTypography_StockInfo></Grid>
                                    <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{stock.업종명}</StyledTypography_StockInfo></Grid>
                                    <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{stock.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
                                </Grid>
                                <Grid item container>
                                    <Stack direction='row' spacing={5} sx={{ pl: 2, pr: 2 }}>
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


            </Grid>
            <Grid container sx={{ mt: 1 }} spacing={2}>
                <Grid item xs={8} sx={{ height: 700, width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={table_columns}
                            // getRowHeight={() => 'auto'}
                            rowHeight={25}
                            onCellClick={(params, event) => {
                                getStockCode(params.row);
                                getStockChartData(params.row.종목코드);
                                console.log(params.row.종목코드);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: {
                                    py: 1,
                                },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                            }}
                        />
                    </ThemeProvider>
                </Grid>

                {/* 우측 기업 정보 */}
                <Grid item xs={4}>
                    <Grid item container sx={{ minHeight: 109 }}>
                        <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                            {
                                Array.isArray(stock.기업개요) ?
                                    stock.기업개요.map(item => (
                                        <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                    ))
                                    : <></>
                            }
                        </Stack>
                    </Grid>
                    <Grid item container sx={{ minHeight: 233 }}>
                        <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                    </Grid>
                    <Grid item container sx={{ mt: 1 }}>
                        {
                            Array.isArray(stockChart.price) ?
                                <StockChart_MA height={280} stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} boxTransform={'translate(10px, 140px)'} />
                                : <></>
                        }
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px',
                        color: '#efe9e9ed'
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