import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
import SearchFinancialInfo from './SearchFinancial/info';
// import TreeMap from './SearchFinancial/treeMap';
import { Table, Tree, Cross } from './SearchFinancial/selectedPage';
import { stockTable_columns } from './SearchFinancial/tableColumns';
// import CrossChartPage from './SearchFinancial/crossChartPage';
import { API, STOCK } from './util/config';



export default function SearchFinancial({ swiperRef }) {

    const [page, setPage] = useState('Cross');
    const [stockCode, setStockCode] = useState(null);
    const [timeframe, setTimeframe] = useState('day')
    const [filter, setFilter] = useState({ field: null, industry: null })

    const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }
    const handleTimeframe = (event, value) => { if (value !== null) { setTimeframe(value); } }

    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        setTableData(res.data);
        console.log(res.data);
        // const res2 = await axios.get(`${API}/formula/searchFinancial_market`);
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
                시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수,
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

    const getStockChartData = async (code, timeframe) => {
        const res = await axios.get(`${STOCK}/get/${code}?week=${timeframe}`);

        console.table(res.data.price);
        setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury })
    }
    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;
        let market = params.market ? params.market : null
        setFilter({ field: field, industry: industry })

        if (field != 'id' && field != '업종명' && field != '흑자기업수' && field != '순위') {
            const postData = {
                target_category: field == '전체종목수' ? null : [field], target_industry: [industry], WillR: 'O', market: market
            }
            const res = await axios.post(`${API}/formula/findData`, postData);
            setStockTableData(res.data);
        }
    }

    useEffect(() => { fetchData() }, [page])
    useEffect(() => {
        if (stockCode != null) {
            getStockChartData(stockCode, timeframe)
        }
    }, [stockCode, timeframe]);

    return (
        <Grid container>
            {/* 좌 : Table, TreeMap, ChrossChart */}
            <Grid item xs={8}>
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
                        <StyledToggleButton fontSize={'10px'} value="Tree">Tree</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="Table">Table</StyledToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                {page !== 'Cross' ?
                    <>
                        <ContentsComponent
                            swiperRef={swiperRef} page={page} tableData={tableData}
                            getIndustryStockData={getIndustryStockData} onIndustryClick={onIndustryClick} getStockCode={getStockCode} getStockChartData={getStockChartData} />

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
                                    rowHeight={25}
                                    onCellClick={(params, event) => {
                                        getStockCode(params.row);
                                        setStockCode(params.row.종목코드);
                                        // getStockChartData(params.row.종목코드, timeframe);
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
                                        '[data-field="이벤트"]': { borderLeft: '1.5px solid #ccc', borderRight: '1.5px solid #ccc' },
                                    }}
                                />
                            </ThemeProvider>
                        </Grid>
                    </>
                    :
                    <Cross swiperRef={swiperRef} tableData={tableData} getStockCode={getStockCode} getStockChartData={getStockChartData} setStockCode={setStockCode} />
                }

            </Grid>

            {/* 우 : 종목정보 */}
            <Grid item xs={4}>
                <SearchFinancialInfo swiperRef={swiperRef} stock={stock} stockChart={stockChart} timeframe={timeframe} handleTimeframe={handleTimeframe} />
            </Grid>

        </Grid>
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
                // columnHeaderWrapper: {
                //     minHeight: '9px',
                //     // lineHeight: '20px',
                // },
                columnHeader: {
                    fontSize: '9px',
                    color: '#efe9e9ed'
                },
            },
            // defaultProps: {
            //     headerHeight: 15,
            // },
        },
    },
});


const ContentsComponent = ({ swiperRef, page, tableData, getIndustryStockData, onIndustryClick, getStockCode, getStockChartData }) => {

    switch (page) {
        case 'Tree':
            return <Tree tableData={tableData} onIndustryClick={onIndustryClick} />

        default:
            return <Table swiperRef={swiperRef} tableData={tableData} getIndustryStockData={getIndustryStockData} />
    }

}
