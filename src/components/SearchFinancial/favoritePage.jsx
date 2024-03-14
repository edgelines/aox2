import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from '../util/util';
import CrossChart from './crossChart';
import { customTheme } from './util';
import { API, TEST } from '../util/config';
import { stockTable_columns } from './tableColumns';

// 
export default function FavoritePage({ swiperRef, industry, getStockCode, getStockChartData }) {
    // List
    const categories1 = [['가결산합산/전년도대비', '가결산'], ['전분기대비', '분기'], ['전년동분기대비', '전년동분기대비']]
    const categories2 = ['매출', '영업이익', '당기순이익']
    const allItemList = [['전체 종목', '전체종목'], ['전체 흑자', '흑자기업'], ['전체 미집계', '미집계']]

    const [tableData, setTableData] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState(industry);
    const [filter, setFilter] = useState({ field: null, industry: null })
    const [stockTableData, setStockTableData] = useState([]);

    // chart data params
    const [aggregated, setAggregated] = useState(null); // 집계 미집계 
    const [surplus, setSurplus] = useState(false); // 흑자, 전체
    const [category1, setCategory1] = useState('분기')
    const [category2, setCategory2] = useState(() => ['매출', '영업이익', '당기순이익'])
    const [chartData, setChartData] = useState([]);
    const [allItem, setAllItem] = useState(null);
    // 키워드 클릭 시 호출되는 함수

    /** 업종 Table Click Event */
    const handleSelectedIndustries = async (params) => {
        switch (params.field) {
            case '흑자기업':
                setAggregated(true);
                setSurplus(true);
                break;

            case '미집계':
                setAggregated(false);
                setSurplus(false);
                break;

            default:
                setAggregated(null);
                setSurplus(false);
                break;
        }
        setSelectedIndustries(params.row.업종명);
        setFilter({ field: params.field, industry: params.row.업종명 })
        setAllItem(null);
    };

    const handleCategory1 = (event, value) => {
        if (value !== null) { setCategory1(value); }
    };
    const handleCategory2 = (event, newCategory) => {
        if (newCategory.length) {
            setCategory2(newCategory);
        }
    };
    const handleAllItem = (event, value) => {
        setAllItem(value);
        switch (value) {
            case '전체종목':
                setAggregated(null);
                setSurplus(false);
                break;
            case '흑자기업':
                setAggregated(true);
                setSurplus(true);
                break;
            case '미집계':
                setAggregated(false);
                setSurplus(false);
                break;
        }
        setSelectedIndustries(null);
    }

    const getCrossChartData = async () => {
        const postData = {
            aggregated: aggregated, surplus: surplus,
            target_industry: [selectedIndustries], target_category1: [category1], target_category2: category2, favorite: true
        }
        const res = await axios.post(`${TEST}/crossChart`, postData);
        // const res = await axios.post(`${API}/formula/crossChart`, postData);
        setChartData(res.data);
        // console.log(res.data);
        // console.log(field, industry);
    }

    // < 하단 테이블 >
    const handlerIndustryStockData = async () => {
        const postData = {
            target_category: surplus == true ? ['흑자'] : null,
            target_industry: [selectedIndustries], market: null, favorite: true
        }
        const res = await axios.post(`${TEST}/findData`, postData);
        // const res = await axios.post(`${API}/formula/findData`, postData);
        setStockTableData(res.data);
        // console.log(res.data);
    }

    const fetchData = async () => {
        const res = await axios.get(`${TEST}/searchFinancialFavorite`);
        setTableData(res.data);
    }
    useEffect(() => { fetchData() }, [])
    useEffect(() => {
        setSelectedIndustries(industry);
    }, [industry])
    useEffect(() => {
        getCrossChartData();
        handlerIndustryStockData();
        // if (selectedIndustries !== null) {
        //     getCrossChartData();
        //     handlerIndustryStockData()
        // }
    }, [selectedIndustries, aggregated, surplus, category1, category2])

    return (
        <Grid container sx={{ mt: 1, pr: 1 }}>
            {/* 업종list */}
            <Grid item xs={5}>
                <Grid item container sx={{ height: 410 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                    <ThemeProvider theme={customTheme}>
                        {tableData && tableData.length > 0 ? (
                            <DataGrid
                                rows={tableData}
                                columns={table_columns}
                                rowHeight={25}
                                onCellClick={(params, event) => {
                                    handleSelectedIndustries(params);
                                    // getIndustryStockData(params);
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
                                    '[data-field="전체종목수"]': { borderLeft: '1.5px solid #ccc', borderRight: '1.5px solid #ccc' },
                                    '[data-field="흑자기업"]': { borderRight: '1.5px solid #ccc' },
                                }}
                            />
                        ) : (<div>로딩 중...</div>)}
                    </ThemeProvider>
                </Grid>
            </Grid>

            {/* Cross Chart */}
            <Grid item xs={6} >

                {/* Filter */}
                <Grid item container sx={{ pl: 2 }}>
                    <StyledToggleButton
                        value='check'
                        selected={surplus}
                        onChange={() => {
                            setSurplus(!surplus);
                        }}
                        sx={{ ml: 1, fontSize: '9px' }}>
                        {surplus ? '흑자' : '전체'}
                    </StyledToggleButton>


                    <ToggleButtonGroup
                        exclusive
                        value={category1}
                        onChange={handleCategory1}
                        size="small"
                        sx={{ pl: 1 }}
                    >
                        {categories1.map(item => (
                            <StyledToggleButton key={item[1]} value={item[1]} sx={{ fontSize: '9px' }}
                                // selected={!aggregated && (item[1] === '가결산')}
                                disabled={!aggregated && (item[1] === '분기' || item[1] === '전년동분기대비')}
                            >
                                {item[0]}
                            </StyledToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                        value={category2}
                        onChange={handleCategory2}
                        size="small"
                        sx={{ pl: 1 }}
                    >
                        {categories2.map(item => (
                            <StyledToggleButton key={item} value={item} sx={{ fontSize: '9px' }}>
                                {item}
                            </StyledToggleButton>
                        ))}
                    </ToggleButtonGroup>


                </Grid>

                {/* Chart */}
                <Grid item container>
                    <CrossChart data={chartData} height={380} getStockCode={getStockCode} getStockChartData={getStockChartData} />
                </Grid>
            </Grid>

            {/* 전체 클릭 Filter */}
            <Grid item xs={1}>
                <ToggleButtonGroup
                    orientation="vertical"
                    exclusive
                    value={allItem}
                    onChange={handleAllItem}
                    size="small"
                    sx={{ pl: 1 }}
                >
                    {allItemList.map(item => (
                        <StyledToggleButton key={item[1]} value={item[1]} sx={{ fontSize: '10px' }}>
                            {item[0]}
                        </StyledToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Grid>

            {/* 업종명 / 선택자 */}
            <Grid item container sx={{ minHeight: 30 }}>
                {
                    filter.field === null ? '' :
                        <Typography>{filter.industry}, {filter.field}</Typography>
                }
            </Grid>

            {/* 하단 종목 리스트 */}
            <Grid item container sx={{ height: 440, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={stockTableData}
                        columns={stockTable_columns}
                        getRowHeight={() => 'auto'}
                        // rowHeight={25}
                        onCellClick={(params, event) => {
                            getStockCode(params.row);
                            // setStockCode(params.row.종목코드);
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

        </Grid>
    )
}

const table_columns = [
    // {
    //     field: 'id', headerName: '순번', width: 20,
    //     align: 'center', headerAlign: 'center',
    //     valueFormatter: (params) => {
    //         return parseInt(params.value) + 1;
    //     }
    // }, 
    {
        field: '순위', headerName: '업종순위', width: 65,
        align: 'center', headerAlign: 'left',
    }, {
        field: '업종명', headerName: '업종명', width: 135,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전일대비', headerName: '전일대비', width: 60,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전체종목수', headerName: '전체종목수', width: 65,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자기업', headerName: '흑자기업', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계', headerName: '미집계', width: 60,
        align: 'right', headerAlign: 'center',
    }
]