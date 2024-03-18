import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
import SearchFinancialInfo from './SearchFinancial/info';
// import TreeMap from './SearchFinancial/treeMap';
import { ContentsComponent } from './SearchFinancial/selectedPage';
import { stockTable_columns, customTheme } from './SearchFinancial/tableColumns';
// import CrossChartPage from './SearchFinancial/crossChartPage';
import { API, STOCK } from './util/config';

export default function SearchFinancial({ swiperRef, Kospi200BubbleCategoryGruop }) {
    const [page, setPage] = useState('Cross');
    const [timeframe, setTimeframe] = useState('day')
    const [filter, setFilter] = useState({ field: null, industry: null })

    const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }
    const handleTimeframe = (event, value) => { if (value !== null) { setTimeframe(value); } }
    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }
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
        // console.log(code);
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, willR: res.data.willR, net: res.data.net })
    }
    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;
        let market = params.market ? params.market : null
        setFilter({ field: field, industry: industry })

        if (field != 'id' && field != '업종명' && field != '흑자기업수' && field != '순위') {
            const postData = {
                aggregated: null,
                target_category: field == '전체종목수' ? null : [field], target_industry: [industry], market: market, favorite: false
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
                    </ToggleButtonGroup>
                </Grid>

                <ContentsComponent
                    swiperRef={swiperRef} page={page} tableData={tableData}
                    Kospi200BubbleCategoryGruop={Kospi200BubbleCategoryGruop}
                    getIndustryStockData={getIndustryStockData} onIndustryClick={onIndustryClick} getStockCode={getStockCode} getStockChartData={getStockChartData} />
                {page !== 'Cross' && page !== 'Favorite' && page !== 'Industry' ?
                    <>

                        <Grid item container sx={{ minHeight: 30 }}>
                            {
                                filter.field === null ? '' :
                                    <Typography>{filter.industry}, {filter.field}</Typography>
                            }
                        </Grid>
                        <Grid item container sx={{ height: 440, width: "100%" }}
                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                        >
                            <ThemeProvider theme={customTheme}>
                                <DataGrid
                                    rows={stockTableData}
                                    columns={stockTable_columns}
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