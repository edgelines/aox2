import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from './util/util';
// import { StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';
import SearchFinancialInfo from './SearchFinancial/info';
import TreeMap from './SearchFinancial/treeMap';
import CrossChartPage from './SearchFinancial/crossChartPage';
// import StockChart_MA from './util/stockChart_MA';
import { API, STOCK } from './util/config';


export default function SearchFinancial({ swiperRef }) {

    const [page, setPage] = useState('Table');
    const [filter, setFilter] = useState({ field: null, industry: null })

    const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        setTableData(res.data);
    }

    const onIndustryClick = (data) => {
        const params = { field: '흑자기업', row: { 업종명: data } }
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

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury })
    }
    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;
        // console.log(field, industry, industry.length);
        setFilter({ field: field, industry: industry })

        if (field != 'id' && field != '업종명' && field != '흑자기업수') {
            const postData = {
                target_category: field == '전체종목수' ? null : [field], target_industry: [industry], WillR: 'O'
            }
            const res = await axios.post(`${API}/formula/findData`, postData);
            setStockTableData(res.data);
        }

        // console.log(field, industry);
    }

    useEffect(() => { fetchData() }, [])

    const table_columns = [
        {
            field: 'id', headerName: '순번', width: 20,
            align: 'center', headerAlign: 'center',
            valueFormatter: (params) => {
                return parseInt(params.value) + 1;
            }
        }, {
            field: '업종명', headerName: '업종명', width: 120,
            align: 'left', headerAlign: 'center',
        }, {
            field: '매출', headerName: '매출', width: 50,
            align: 'right', headerAlign: 'center',
        }, {
            field: '영업이익', headerName: '영업이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '당기순이익', headerName: '순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '잠정실적', headerName: '잠정실적', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '전년동분기대비', headerName: '전년 동분기', width: 70,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기매출', headerName: '분기 매출', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기영업이익', headerName: '영업이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기당기순이익', headerName: '순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_매출', headerName: '흑자 매출', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_영업이익', headerName: '영업이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_당기순이익', headerName: '순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '전체종목수', headerName: '전체종목수', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자기업', headerName: '흑자기업', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자기업수', headerName: '흑자기업수', width: 75,
            align: 'right', headerAlign: 'center',
        }
    ]
    const stockTable_columns = [
        {
            field: 'id', headerName: '순번', width: 20,
            align: 'center', headerAlign: 'center',
            valueFormatter: (params) => {
                return parseInt(params.value) + 1;
            }
        }, {
            field: '업종명', headerName: '업종명', width: 120,
            align: 'left', headerAlign: 'center',
        }, {
            field: '종목명', headerName: '종목명', width: 120,
            align: 'left', headerAlign: 'center',
        }, {
            field: '동일업종PER', headerName: '동 PER', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'PER', headerName: 'PER', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'PBR', headerName: 'PBR', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '부채비율', headerName: '부채비율', width: 65,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return `${(parseInt(params.value)).toLocaleString('kr')} %`;
            }
        }, {
            field: '유보율', headerName: '유보율', width: 70,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return `${(parseInt(params.value)).toLocaleString('kr')} %`;
            }
        }, {
            field: '이벤트', headerName: 'Event', width: 250,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'WillR9', headerName: 'WillR9', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'WillR14', headerName: 'WillR14', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'WillR33', headerName: 'WillR33', width: 60,
            align: 'right', headerAlign: 'center',
        }
    ]

    return (
        <Grid container>
            <Grid item container sx={{ mt: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="Table">Table</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="Tree">Tree</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="Cross">Cross</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item container>
                {/* 좌 : Table, TreeMap, ChrossChart */}
                <Grid item xs={8}>

                    <Grid item container sx={{ height: 440, width: "100%" }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        {
                            page === 'Table' ?
                                <ThemeProvider theme={customTheme}>
                                    <DataGrid
                                        rows={tableData}
                                        columns={table_columns}
                                        // getRowHeight={() => 'auto'}
                                        rowHeight={25}
                                        onCellClick={(params, event) => {
                                            getIndustryStockData(params);
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
                                            '[data-field="전년동분기대비"]': { borderRight: '1.5px solid #ccc' },
                                            '[data-field="분기매출"]': { backgroundColor: '#6E6E6E' },
                                            '[data-field="분기영업이익"]': { backgroundColor: '#6E6E6E' },
                                            '[data-field="분기당기순이익"]': { backgroundColor: '#6E6E6E', borderRight: '1.5px solid #ccc' },
                                            '[data-field="흑자_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                                            // [`& .highlight`]: {
                                            //     color: 'tomato',
                                            // },
                                        }}
                                    />
                                </ThemeProvider>
                                : page === 'Tree' ? <>
                                    <TreeMap data={tableData} onIndustryClick={onIndustryClick} height={440} />
                                </> :
                                    <>
                                        <CrossChartPage swiperRef={swiperRef} data={tableData} />
                                    </>
                        }
                    </Grid>

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
                                    '[data-field="이벤트"]': { borderLeft: '1.5px solid #ccc', borderRight: '1.5px solid #ccc' },
                                }}
                            />
                        </ThemeProvider>
                    </Grid>
                </Grid>

                {/* 우 : 종목정보 */}
                <Grid item xs={4}>
                    <SearchFinancialInfo swiperRef={swiperRef} stock={stock} stockChart={stockChart} />
                </Grid>

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

