import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
import SearchFinancialInfo from './SearchFinancial/info';
// import TreeMap from './SearchFinancial/treeMap';
import { ContentsComponent } from './SearchFinancial/selectedPage';
import { stockTable_columns, customTheme, trendColumns, ranksThemesColumns, ranksWillrColumns } from './SearchFinancial/tableColumns';

// import CrossChartPage from './SearchFinancial/crossChartPage';
import { API, STOCK } from './util/config';

export default function SearchFinancial({ swiperRef }) {
    // const [page, setPage] = useState('Tree');
    const [page, setPage] = useState('Cross');
    const [eventDrop, setEventDrop] = useState('');
    const [timeframe, setTimeframe] = useState('day');
    const [filter, setFilter] = useState({ field: null, industry: null })
    const [tableColumnsName, setTableColumnsName] = useState('themes')
    const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    const [stockCode, setStockCode] = useState(null);
    const [stockWS, setStockWS] = useState(null);

    const handlePage = (event, value) => { if (value !== null) { setPage(value); setEventDrop(''); } }
    const handleTimeframe = (event, value) => { if (value !== null) { setTimeframe(value); } }
    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }
    const handleEventChange = (event) => { if (event !== null) { setPage('Event'); setEventDrop(event.target.value); } }
    const handleTableColumnsChange = (event, value) => { if (value !== null) { setTableColumnsName(value); } }
    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        setTableData(res.data);
    }

    const onIndustryClick = (업종명, market, field) => {
        const params = { field: field, row: { 업종명: 업종명 }, market: market }
        getIndustryStockData(params);
    }

    // Action
    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        try {
            const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
            setStock({
                종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
                시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                테마명: res.data.테마명
            })
        } catch (e) {
            console.log(e);
        }
    }
    const getStockChartData = async (code) => {
        setStockCode(code);
        const res = await axios.get(`${STOCK}/get/${code}`);
        // console.log(res.data);
        setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, treasuryPrice: res.data.treasuryPrice, willR: res.data.willR, net: res.data.net, MA: res.data.MA })
    }

    // useEffect(() => {
    //     const websocket = new WebSocket(`${API_WS}/stockChart`);

    //     websocket.onopen = () => {
    //         console.log('Connected to the server');
    //     };

    //     websocket.onmessage = (event) => {

    //         const res = JSON.parse(event.data)
    //         console.log(res);
    //         setStockChart({
    //             price: res.price,
    //             volume: res.volume,
    //             treasury: [],
    //             treasuryPrice: [],
    //             treasury: res.treasury,
    //             treasuryPrice: res.treasuryPrice,
    //             willR: res.willR,
    //             net: res.net
    //         })
    //     };

    //     websocket.onerror = (error) => {
    //         console.log('WebSocket error: ', error);
    //     };

    //     setStockWS(websocket); // 웹소켓 인스턴스를 상태에 저장
    //     // console.log(websocket);

    //     // 컴포넌트 언마운트 시 웹소켓 연결 종료
    //     return () => {
    //         websocket.close();
    //     };
    // }, []);

    // useEffect(() => {
    //     // field 상태가 변경될 때 데이터 전송
    //     const sendData = (stockCode) => {
    //         if (stockWS && stockWS.readyState === WebSocket.OPEN && stockCode) {
    //             const data = { code: stockCode };
    //             stockWS.send(JSON.stringify(data));
    //         }
    //     };
    //     sendData(stockCode);
    // }, [stockWS, stockCode]); // field 또는 ws 상태가 변경될 때마다 실행

    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;
        let market = params.market ? params.market : null
        setFilter({ field: field, industry: industry })

        if (field != 'id' && field != '업종명' && field != '흑자기업수' && field != '순위') {
            const postData = {
                aggregated: null,
                target_category: field == '전체종목수' ? null : [field],
                target_industry: [industry],
                market: market,
                favorite: false,
                tableColumnsName: tableColumnsName
            }
            const res = await axios.post(`${API}/formula/findData`, postData);
            setStockTableData(res.data);
        }
    }
    useEffect(() => { fetchData() }, [page])

    return (
        <Grid container>
            {/* 좌 : Table, TreeMap, ChrossChart */}
            <Grid item xs={page === 'Industry' ? 12 : 8}>
                {/* Selected BTN */}
                <Grid item container sx={{ mt: 0.5 }}>
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={page}
                        onChange={handlePage}
                        sx={{ pl: 1.3 }}
                    >
                        <StyledToggleButton fontSize={'10px'} value="Cross">Cross</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Favorite">Favorite</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Tree">Tree</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Table">Table</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Industry">Industry</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Trend">Trend</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Treasury">Treasury</StyledToggleButton>
                        <FormControl variant="standard" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '12px', color: '#efe9e9ed', pl: 3 }}>Event</InputLabel>
                            <Select
                                value={eventDrop}
                                label="Event"
                                onChange={handleEventChange}
                                sx={{ color: '#efe9e9ed', fontSize: '11px' }}
                            >
                                <MenuItem sx={{ fontSize: '11px' }} value={'IR'}>IR</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'보호예수'}>보호예수</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'유상증자'}>유상증자</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'무상증자'}>무상증자</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'변경상장'}>변경상장</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'주식병합'}>주식병합</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'감자'}>감자</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'CB'}>CB행사</MenuItem>
                                <MenuItem sx={{ fontSize: '11px' }} value={'BW'}>BW전환</MenuItem>
                            </Select>
                        </FormControl>
                    </ToggleButtonGroup>
                </Grid>

                <ContentsComponent
                    swiperRef={swiperRef} page={page} tableData={tableData} eventDrop={eventDrop}
                    getIndustryStockData={getIndustryStockData} onIndustryClick={onIndustryClick} getStockCode={getStockCode} getStockChartData={getStockChartData} />
                {page === 'Tree' || page === 'Table' ?
                    <>
                        <Grid item container sx={{ minHeight: 30 }}>
                            <Grid item xs={4}>
                                {
                                    filter.field === null ? '' :
                                        <Grid item container direction='row' alignItems="center" justifyContent="flex-start">
                                            <Typography>{filter.industry}, {filter.field}</Typography>
                                        </Grid>
                                }
                            </Grid>

                            <Grid item xs={8}>
                                <Grid item container direction='row' alignItems="center" justifyContent="flex-end" sx={{ pr: 3, mb: 1 }}>
                                    <ToggleButtonGroup
                                        color='info'
                                        exclusive
                                        size="small"
                                        value={tableColumnsName}
                                        onChange={handleTableColumnsChange}
                                        sx={{ pl: 1.3 }}
                                    >
                                        <StyledToggleButton fontSize={'10px'} value="themes">Themes</StyledToggleButton>
                                        <StyledToggleButton fontSize={'10px'} value="trima">Trima</StyledToggleButton>
                                        <StyledToggleButton fontSize={'10px'} value="willR">WiilR</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container sx={{ height: 440, width: "100%" }}
                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                        >
                            <ThemeProvider theme={customTheme}>
                                <DataGrid
                                    rows={stockTableData}
                                    columns={tableColumnsName == 'trima' ? trendColumns : tableColumnsName == 'themes' ? ranksThemesColumns : ranksWillrColumns}
                                    // rowHeight={25}
                                    getRowHeight={() => 'auto'}
                                    onCellClick={(params, event) => {
                                        getStockCode(params.row);
                                        getStockChartData(params.row.종목코드);
                                    }}
                                    disableRowSelectionOnClick
                                    sx={{
                                        color: 'white', border: 'none',
                                        ...DataTableStyleDefault,
                                        [`& .${gridClasses.cell}`]: { py: 1, },
                                        '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                        '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                        '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                        '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                                        '[data-field="부채비율"]': { borderLeft: '1.5px solid #ccc' },
                                        '[data-field="테마명"]': { borderLeft: '1.5px solid #ccc' },
                                        '[data-field="TRIMA_41"]': { borderRight: '1.5px solid #ccc' },
                                    }}
                                />
                            </ThemeProvider>
                        </Grid>
                    </>
                    : <></>
                }

            </Grid>
            {/* 우 : 종목정보 */}
            {page !== 'Industry' ?
                <Grid item xs={4}>
                    <SearchFinancialInfo swiperRef={swiperRef} stock={stock} stockChart={stockChart} handleFavorite={handleFavorite} timeframe={timeframe} handleTimeframe={handleTimeframe} />
                </Grid>
                : <></>
            }

        </Grid>
    )
}