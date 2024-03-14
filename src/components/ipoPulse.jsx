import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { Grid, Stack, Typography, Input, InputAdornment, Checkbox, FormControlLabel, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault } from './util/util';
import { StyledTypography_StockInfo, Financial } from './util/htsUtil';
import StockChart_MA from './util/stockChart_MA';
import { renderProgress, StyledInput } from './util/ipoUtil';
import { API, STOCK } from './util/config';
import ThumbnailChart from './IpoPulse/thumbnailChart';

export default function IpoPulsePage({ swiperRef }) {

    const [filter, setFilter] = useState({
        high: [-44, -80], start: [-30, -100], day: [50, 100], selected: null, finance: null, lockUp: [10, 30]
    })
    // checkBox
    const [checkBox, setCheckBox] = useState({
        high: false, start: false, day: false, all: false, order: false, lockUp: false
    })
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [postData, setPostData] = useState({
        high: checkBox.high == true ? filter.high : null,
        start: checkBox.start == true ? filter.start : null,
        day: checkBox.day == true ? filter.day : null,
        selected: filter.selected,
        finance: filter.finance,
        order: checkBox.order == true ? 'ok' : null,
        lockUp: checkBox.lockUp == true ? filter.lockUp : null,
        industry: selectedIndustries
    })

    // state
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [industryTable, setIndustryTable] = useState([]);
    const [totalCount, setTotalCount] = useState('')
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    // Handler
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
    const handleSelectedBtn = (name, value) => {
        // handleSelectedIndustries(value)
        setFilter((prevStatus) => {
            return {
                ...prevStatus,
                [name]: value
            }
        });
        // setSelectedIndustries([])
    }
    const handleReset = () => {
        setCheckBox({ high: false, start: false, day: false, all: false, order: false, lockUp: false })
        setFilter((prevStatus) => {
            return {
                ...prevStatus,
                selected: null,
                finance: null
            }
        });
    }
    // 키워드 클릭 시 호출되는 함수
    const handleSelectedIndustries = (keyword) => {
        if (selectedIndustries.includes(keyword)) {
            // 이미 선택된 키워드를 다시 클릭한 경우, 배열에서 제거
            setSelectedIndustries(selectedIndustries.filter(k => k !== keyword));
        } else {
            // 선택되지 않은 키워드를 클릭한 경우, 배열에 추가
            setSelectedIndustries([...selectedIndustries, keyword]);
        }
    };

    // Action
    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
        // console.log(res.data);
        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수
        })
    }

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume, willR: res.data.willR, net: res.data.net })
    }
    const fetchChartData = async () => {
        const res = await axios.get(`${API}/ipoPulse/chart`);
        setChartData(res.data);
    }
    const fetchData = async (postData) => {
        const res = await axios.post(`${API}/ipoPulse/data`, postData);
        // console.table(postData);
        // console.table(res.data.table);
        setTableData(res.data.table);
        setIndustryTable(res.data.industry);
        setTotalCount(res.data.total);

    }
    useEffect(() => {
        setPostData({
            high: checkBox.high == true ? filter.high : null,
            start: checkBox.start == true ? filter.start : null,
            day: checkBox.day == true ? filter.day : null,
            selected: filter.selected,
            finance: filter.finance,
            order: checkBox.order == true ? 'ok' : null,
            lockUp: checkBox.lockUp == true ? filter.lockUp : null,
            industry: selectedIndustries
        })
    }, [checkBox, filter, selectedIndustries])
    useEffect(() => { fetchChartData(); }, [])
    useEffect(() => { fetchData(postData) }, [postData])

    // ChartData
    useEffect(() => {
        if (stock.종목코드 != null) { getStockChartData(stock.종목코드); }
    }, [stock])

    const table_columns = [
        {
            field: '종목명', headerName: '종목명', width: 110,
            align: 'left', headerAlign: 'center',
        }, {
            field: '업종명', headerName: '업종명', width: 100,
            align: 'left', headerAlign: 'center',
        }, {
            field: '상장예정일', headerName: '상장일', width: 75,
            align: 'right', headerAlign: 'center',
        }, {
            field: '경과일수', headerName: '경과일수', width: 57,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가', headerName: '최고가', width: 70,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최저가', headerName: '최저가', width: 65,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가대비', headerName: '대비', width: 60,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '공모가', headerName: '공모가', width: 70,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return parseInt(params.value).toLocaleString('kr');
            }
        }, {
            field: '공모가대비', headerName: '대비', width: 60,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '현재가', headerName: '현재가', width: 75,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '등락률', headerName: '등락률', width: 55,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'PBR', headerName: 'PBR', width: 55,
            align: 'right', headerAlign: 'center',
        }, {
            field: '보호예수', headerName: '보호예수', width: 280,
            align: 'left', headerAlign: 'center',
        }
    ]

    const inputStyle = { width: 60, height: 20, color: '#efe9e9ed', fontSize: '12px', pl: 2 }
    return (
        <>
            {/* Thumnail Chart */}
            <Grid container sx={{ mt: -0.5 }}>
                <Grid container>
                    {chartData ?
                        Object.entries(chartData).map(([quarter, items], index) => (
                            <Grid item xs={0.92} key={quarter}>
                                <>
                                    <Grid container sx={{ width: '100%' }}>
                                        <Grid item xs={10}>
                                            <ThumbnailChart data={items['Data']} height={130} onCode={getStockCode} />

                                        </Grid>
                                    </Grid>

                                    <Grid container onClick={() => handleSelectedBtn('selected', quarter)}>
                                        <Grid container direction='row' alignItems="center" justifyContent="center" sx={{ zIndex: 999 }}>
                                            <Typography sx={{ fontSize: '12px' }}>{quarter}</Typography>
                                        </Grid>
                                        <Grid container direction='row' alignItems="center" justifyContent="center">
                                            Total : {items.Length}
                                        </Grid>
                                        <Grid container direction='row' alignItems="center" justifyContent="center">
                                            {items.Days}
                                        </Grid>
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

            {/* Filter */}
            <Grid container sx={{ height: 60 }}>

                <Grid item container xs={9}>
                    {/* 좌측 선택 */}
                    <Grid container item xs={2.6} >
                        <table>
                            <tbody>
                                <tr>
                                    <td>최고가대비(%)</td>
                                    <td><FormControlLabel control={
                                        <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, }, height: 18, width: 20, pl: 3 }}
                                            checked={checkBox.high}
                                            onChange={() => handleCheckBox('high')}
                                        />} />
                                    </td>
                                    <td>
                                        <Grid container direction='row' alignItems="center" justifyContent="center" >
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.high[0]}
                                                onChange={(event) => handleRangeValue(event, 'high', 0)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                                            />
                                            <Typography sx={{ fontSize: '13px', ml: 2, mr: 1 }}>~</Typography>
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.high[1]}
                                                onChange={(event) => handleRangeValue(event, 'high', 1)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                                            />
                                        </Grid>
                                    </td>
                                </tr>
                                <tr>
                                    <td>공모가대비(%)</td>
                                    <td>
                                        <FormControlLabel control={
                                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, }, height: 18, width: 20, pl: 3 }}
                                                checked={checkBox.start}
                                                onChange={() => handleCheckBox('start')}
                                            />} />
                                    </td>
                                    <td>
                                        <Grid container direction='row' alignItems="center" justifyContent="center" >
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.start[0]}
                                                onChange={(event) => handleRangeValue(event, 'start', 0)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                                            />
                                            <Typography sx={{ fontSize: '13px', ml: 2, mr: 1 }}>~</Typography>
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.start[1]}
                                                onChange={(event) => handleRangeValue(event, 'start', 1)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>%</div></InputAdornment>}
                                            />
                                        </Grid>
                                    </td>
                                </tr>
                                <tr>
                                    <td>상장일</td>
                                    <td>
                                        <FormControlLabel control={
                                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, }, height: 18, width: 20, pl: 3 }}
                                                checked={checkBox.day} onChange={() => handleCheckBox('day')} />} />
                                    </td>
                                    <td>
                                        <Grid container direction='row' alignItems="center" justifyContent="center" >
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.day[0]}
                                                onChange={(event) => handleRangeValue(event, 'day', 0)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                                            />
                                            <Typography sx={{ fontSize: '13px', ml: 2, mr: 1 }}>~</Typography>
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.day[1]}
                                                onChange={(event) => handleRangeValue(event, 'day', 1)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                                            />
                                        </Grid>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Grid>

                    {/* All, Reset */}
                    <Grid container item xs={1.3} >
                        <Grid container>
                            <Grid container direction='row' alignItems="center" justifyContent="center">
                                Total : {totalCount}
                            </Grid>
                            {filter.selected ?
                                <Grid container>
                                    <Grid container direction='row' alignItems="center" justifyContent="center">
                                        {filter.selected} : {chartData[filter.selected].Length}
                                    </Grid>
                                </Grid>
                                :
                                <Grid container>
                                    <Grid container direction='row' alignItems="center" justifyContent="center">
                                        All : {tableData.length}
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        <Grid container direction='row' alignItems="center" justifyContent="center">
                            <StyledButton fontSize={'11px'} onChange={() => handleCheckBox('All')} >All</StyledButton>
                            <StyledButton fontSize={'11px'} onClick={() => handleReset()}>Reset</StyledButton>
                        </Grid>
                    </Grid>

                    <Grid container item xs={1}>
                        <StyledButton fontSize={'11px'} onClick={() => handleSelectedBtn('finance', 'finance')}>잠정&확정 실적</StyledButton>
                    </Grid>

                    <Grid container item xs={2.3}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>저PBR순</td>
                                    <td><FormControlLabel control={
                                        <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, }, height: 18, width: 20, pl: 3 }}
                                            checked={checkBox.order}
                                            onChange={() => handleCheckBox('order')}
                                        />} />
                                    </td>

                                </tr>
                                <tr>
                                    <td>보호예수</td>
                                    <td>
                                        <FormControlLabel control={
                                            <Checkbox size="small" sx={{ color: grey.A200, '&.Mui-checked': { color: grey.A200, }, height: 18, width: 20, pl: 3 }}
                                                checked={checkBox.lockUp}
                                                onChange={() => handleCheckBox('lockUp')}
                                            />} />
                                    </td>
                                    <td>
                                        <Grid container direction='row' alignItems="center" justifyContent="center" >
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.lockUp[0]}
                                                onChange={(event) => handleRangeValue(event, 'start', 0)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                                            />
                                            <Typography sx={{ fontSize: '13px', ml: 2, mr: 1 }}>~</Typography>
                                            <Input label="Outlined" variant="outlined" size="small" sx={inputStyle} value={filter.lockUp[1]}
                                                onChange={(event) => handleRangeValue(event, 'start', 1)}
                                                endAdornment={<InputAdornment position="end"><div style={{ color: '#efe9e9ed' }}>일</div></InputAdornment>}
                                            />
                                        </Grid>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </Grid>

                </Grid>

                {/* 우측 기업 정보 */}
                <Grid item xs={3}>
                    {
                        Array.isArray(stock.기업개요) ?
                            <>
                                <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                                    <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' sx={{ color: stock.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{stock.종목명}</StyledTypography_StockInfo></Grid>
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
                                <Grid item container>
                                    <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                                        <StyledTypography_StockInfo fontSize="12px">보호예수</StyledTypography_StockInfo>
                                        <StyledTypography_StockInfo fontSize="12px" sx={{ color: '#FCAB2F' }}>{stock.보호예수}</StyledTypography_StockInfo>
                                    </Stack>
                                </Grid>
                            </>
                            : <></>
                    }
                </Grid>


            </Grid>

            {/* Table */}
            <Grid container sx={{ mt: 1 }} spacing={2}>
                <Grid item xs={7.5} sx={{ height: 700, width: "100%" }}
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
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="경과일수"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="최고가대비"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="공모가대비"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="등락률"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="PBR"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="현재가"]': { backgroundColor: '#6E6E6E' },
                                // [`& .highlight`]: {
                                //     color: 'tomato',
                                // },
                            }}
                        />
                    </ThemeProvider>
                </Grid>

                <Grid item container xs={1}>
                    <TableContainer sx={{ height: 650 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {industryTable && industryTable.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {industryTable.map(item => (
                                        <TableRow key={item.업종명} onClick={() => handleSelectedIndustries(item.업종명)}
                                            // <TableRow key={item.업종명} onClick={() => handleSelectedBtn('industry', item.업종명)}
                                            sx={{
                                                '&:hover': { backgroundColor: '#6E6E6E' }, // 마우스 오버 시 배경색 변경
                                                backgroundColor: selectedIndustries.includes(item.업종명) ? '#6E6E6E' : 'transparent', // 선택된 업종명에 대한 배경색
                                                '.MuiTableCell-root': {
                                                    color: selectedIndustries.includes(item.업종명) ? '#FCAB2F' : '#efe9e9ed', // 선택된 업종명에 대한 글꼴 색상
                                                    fontSize: '10px',
                                                    p: 0.2
                                                }
                                            }}
                                        >
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

                {/* 우측 기업 정보 */}
                <Grid item xs={3.5}>
                    <Grid container sx={{ minHeight: 109 }}>
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
                    <Grid container sx={{ minHeight: 233 }}>
                        <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>
                        {
                            Array.isArray(stockChart.price) ?
                                // <Grid item container sx={{ width: '98%' }}>
                                <StockChart_MA height={280} boxTransform={'translate(10px, 140px)'}
                                    stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} net={stockChart.net}
                                    willR={stockChart.willR} />
                                // </Grid>
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