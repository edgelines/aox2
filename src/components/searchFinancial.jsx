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

export default function SearchFinancial({ swiperRef }) {

    const [filter, setFilter] = useState({
        high: [-44, -80], start: [-30, -100], day: [50, 100], selected: null, finance: null, lockUp: [10, 30]
    })
    // checkBox
    const [checkBox, setCheckBox] = useState({
        high: false, start: false, day: false, all: false, order: false, lockUp: false
    })
    const [selectedIndustries, setSelectedIndustries] = useState([]);

    // state
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [industryTable, setIndustryTable] = useState([]);
    const [totalCount, setTotalCount] = useState('')
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

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

    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        console.table(res.data);
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
            field: '당기순이익', headerName: '당기순이익', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '잠정실적', headerName: '잠정실적', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '전년동분기대비', headerName: '전년 동분기', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '전체종목수', headerName: '전체종목수', width: 60,
            align: 'right', headerAlign: 'center',
        }, {
            field: '흑자기업수', headerName: '흑자기업수', width: 70,
            align: 'right', headerAlign: 'center',
        }
    ]

    const inputStyle = { width: 60, height: 20, color: '#efe9e9ed', fontSize: '12px', pl: 2 }
    return (
        <>

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
                            // onCellClick={(params, event) => {
                            //     getStockCode(params.row);
                            //     getStockChartData(params.row.종목코드);
                            // }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="전년동분기대비"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="공모가대비"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="등락률"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="PBR"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="현재가"]': { backgroundColor: '#6E6E6E' },
                                // [`& .highlight`]: {
                                //     color: 'tomato',
                                // },
                            }}
                        />
                    </ThemeProvider>
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