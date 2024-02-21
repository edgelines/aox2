import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { Grid, Stack, Typography, Input, InputAdornment, Checkbox, FormControlLabel, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses, GridColumnGroupingModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault } from './util/util';
import { StyledTypography_StockInfo, Financial } from './util/htsUtil';
import StockChart_MA from './util/stockChart_MA';
import { renderProgress, StyledInput } from './util/ipoUtil';
import { API, STOCK } from './util/config';
import ThumbnailChart from './IpoPulse/thumbnailChart';

export default function SearchFinancial({ swiperRef }) {

    const [filter, setFilter] = useState({ field: null, industry: null })
    // checkBox

    const [selectedIndustries, setSelectedIndustries] = useState([]);

    // state
    const [tableData, setTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    // const [chartData, setChartData] = useState({});
    // const [industryTable, setIndustryTable] = useState([]);
    // const [totalCount, setTotalCount] = useState('')
    // const [stock, setStock] = useState({});
    // const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    // Handler

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


    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume })
    }
    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;
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
    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        // console.table(res.data);
        setTableData(res.data);

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
            field: '전년동분기대비', headerName: '전년 동분기', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기매출', headerName: '분기 매출', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기영업이익', headerName: '영업이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '분기당기순이익', headerName: '순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_매출', headerName: '흑자 매출', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_영업이익', headerName: '영업이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자_당기순이익', headerName: '순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '전체종목수', headerName: '전체종목수', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자기업', headerName: '흑자기업', width: 55,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자기업수', headerName: '흑자기업수', width: 70,
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
            field: '유보율', headerName: '유보율', width: 60,
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
            <Grid container sx={{ mt: 1 }} spacing={1}>
                {/* 좌 */}
                <Grid item xs={8}>
                    <Grid item container sx={{ height: 500, width: "100%" }}
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
                                    '[data-field="분기_매출"]': { backgroundColor: '#6E6E6E' },
                                    '[data-field="분기_영업이익"]': { backgroundColor: '#6E6E6E' },
                                    '[data-field="분기_당기순이익"]': { backgroundColor: '#6E6E6E', borderRight: '1.5px solid #ccc' },
                                    '[data-field="흑자_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                                    // [`& .highlight`]: {
                                    //     color: 'tomato',
                                    // },
                                }}
                            />
                        </ThemeProvider>
                    </Grid>

                    <Grid item container sx={{ height: 500, width: "100%" }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        <ThemeProvider theme={customTheme}>
                            <DataGrid
                                rows={stockTableData}
                                columns={stockTable_columns}
                                rowHeight={25}
                                // onCellClick={(params, event) => {
                                //     getIndustryStockData(params);
                                //     // getStockCode(params.row);
                                //     // getStockChartData(params.row.종목코드);
                                // }}
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

