import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses, GridColumnGroupingModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import StockChart_MA from '../util/stockChart_MA';
import TreeMap from './treeMap';
import { API, STOCK } from '../util/config';


export default function SearchFinancialTable({ swiperRef, tableData, tableTree }) {

    const [filter, setFilter] = useState({ field: null, industry: null })
    const [page, setPage] = useState('재무');
    // checkBox

    // const [selectedIndustries, setSelectedIndustries] = useState([]);

    // state
    // const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    // Handler
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }
    // // 키워드 클릭 시 호출되는 함수
    // const handleSelectedIndustries = (keyword) => {
    //     if (selectedIndustries.includes(keyword)) {
    //         // 이미 선택된 키워드를 다시 클릭한 경우, 배열에서 제거
    //         setSelectedIndustries(selectedIndustries.filter(k => k !== keyword));
    //     } else {
    //         // 선택되지 않은 키워드를 클릭한 경우, 배열에 추가
    //         setSelectedIndustries([...selectedIndustries, keyword]);
    //     }
    // };

    const onIndustryClick = (data) => {
        console.log(data);
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
                target_category: field == '전체종목수' ? null : field, target_industry: industry
            }
            const res = await axios.post(`${API}/formula/findData`, postData);
            setStockTableData(res.data);
        }

        // console.log(field, industry);
    }
    // const fetchData = async () => {
    //     const res = await axios.get(`${API}/formula/searchFinancial`);
    //     // console.table(res.data);
    //     setTableData(res.data);
    // }


    // useEffect(() => { fetchData() }, [])

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
        <>

            {/* Table */}
            <Grid container sx={{ mt: 0.3 }} spacing={1}>
                {/* 좌 */}
                <Grid item xs={8}>

                    <Grid item container sx={{ height: 440, width: "100%" }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        {
                            tableTree === 'Table' ?
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
                                : <>
                                    <TreeMap data={tableData} onIndustryClick={onIndustryClick} />
                                </>
                        }
                    </Grid>

                    <Grid item container>
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
                                    // '[data-field="분기_매출"]': { backgroundColor: '#6E6E6E' },
                                    // '[data-field="분기_영업이익"]': { backgroundColor: '#6E6E6E' },
                                    // '[data-field="분기_당기순이익"]': { backgroundColor: '#6E6E6E', borderRight: '1.5px solid #ccc' },
                                    // '[data-field="흑자_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                                    // [`& .highlight`]: {
                                    //     color: 'tomato',
                                    // },
                                }}
                            />
                        </ThemeProvider>
                    </Grid>
                </Grid>

                {/* 우 */}
                <Grid item xs={4}>
                    <Grid item container sx={{ minHeight: 200 }}>
                        {Array.isArray(stock.기업개요) ?
                            <StockInfo data={stock} />
                            : <></>
                        }
                        {/* {stock.종목코드 === null ? '' :
                            <StockInfo data={stock} />
                        } */}

                    </Grid>
                    <Grid item container sx={{ mt: 1 }}>
                        <ToggleButtonGroup
                            color='info'
                            exclusive
                            size="small"
                            value={page}
                            onChange={handlePage}
                            sx={{ pl: 1.3 }}
                        >
                            <StyledToggleButton fontSize={'10px'} value="재무">재무</StyledToggleButton>
                            <StyledToggleButton fontSize={'10px'} value="사업내용">사업내용</StyledToggleButton>
                            <StyledToggleButton fontSize={'10px'} value="테마">테마</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item container sx={{ minHeight: 210 }}>
                        <ContentsComponent page={page} annual={stock.연간실적} quarter={stock.분기실적} summary={stock.기업개요} themes={stock.테마명} />
                    </Grid>

                    <Grid item container sx={{ minHeight: 90 }}>
                        <EtcInfo product={stock.주요제품매출구성} shareholder={stock.주요주주} />
                    </Grid>

                    <Grid item container sx={{ mt: 1 }}>
                        <StockChart_MA height={335} stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} boxTransform={`translate(10px, 190px)`} treasury={stockChart.treasury} />
                    </Grid>

                </Grid>


            </Grid>
        </>
    )
}

const StockInfo = ({ data }) => {
    return (
        <Grid container>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={5} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">시가총액</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">상장주식수</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.상장주식수 ? data.상장주식수.toLocaleString('kr') : ''}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">K_PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PER}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">EPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.EPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">N_PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PER}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">BPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.BPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">K_PBR</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PBR}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">N_PBR</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PBR}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">동일업종 PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.동일업종PER}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">보호예수</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.보호예수}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">이벤트</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.이벤트}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
        </Grid>
    )
}

const ContentsComponent = ({ swiperRef, page, annual, quarter, summary, themes }) => {

    switch (page) {
        case '사업내용':
            if (Array.isArray(summary)) {
                return <Grid container sx={{ mt: 3 }}>
                    <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                        {summary.map(item => (
                            <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                        ))}
                    </Stack>
                </Grid>
            }

        case '테마':
            if (Array.isArray(themes)) {
                return <Grid container sx={{ mt: 3 }}>
                    <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                        {themes.map(item => (
                            <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                        ))}
                    </Stack>
                </Grid>
            }



        default:
            if (Array.isArray(annual)) {
                return <Financial annual={annual} quarter={quarter} />
            }
    }


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

