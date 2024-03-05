import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from '../util/util';
import CrossChart from './crossChart';
import { customTheme } from './util';
import { API } from '../util/config';

// 
export default function CrossChartPage({ swiperRef, data, getStockCode, getStockChartData, setStockCode }) {
    // List
    const categories1 = [['가결산합산/전년도대비', '가결산'], ['전분기대비', '분기'], ['전년동분기대비', '전년동분기대비']]
    const categories2 = ['매출', '영업이익', '당기순이익']

    const [selectedIndustries, setSelectedIndustries] = useState(data[0].업종명);
    const [filter, setFilter] = useState({ field: null, industry: null })
    const [stockTableData, setStockTableData] = useState([]);
    const [category, setCategory] = useState(true);
    const [category1, setCategory1] = useState(() => ['가결산', '분기', '전년동분기대비'])
    const [category2, setCategory2] = useState(() => ['매출', '영업이익', '당기순이익'])
    const [chartData, setChartData] = useState([]);

    // 키워드 클릭 시 호출되는 함수
    const handleSelectedIndustries = (keyword) => {
        setSelectedIndustries(keyword);
    };

    const handleCategory1 = (event, newCategory) => {
        if (newCategory.length) {
            setCategory1(newCategory);
        }
    };
    const handleCategory2 = (event, newCategory) => {
        if (newCategory.length) {
            setCategory2(newCategory);
        }
    };


    const getCrossChartData = async () => {
        let check
        if (category) {
            check = '흑자'
        } else {
            check = 'All'
        }
        console.log(check);
        const postData = {
            check: check, target_industry: [selectedIndustries], target_category1: category1, target_category2: category2,
        }
        // console.log(postData);
        const res = await axios.post(`${API}/formula/crossChart`, postData);
        setChartData(res.data);
        // console.log(res.data);
        // console.log(field, industry);
    }

    const getIndustryStockData = async (params) => {
        let field = params.field;
        let industry = params.row.업종명;

        setFilter({ field: field, industry: industry })

        if (field != 'id' && field != '업종명' && field != '흑자기업수') {
            const postData = {
                target_category: field == '전체종목수' ? null : [field], target_industry: [industry], WillR: 'O', market: null
            }
            const res = await axios.post(`${API}/formula/findData`, postData);
            setStockTableData(res.data);
        }
    }

    useEffect(() => { getCrossChartData() }, [selectedIndustries, category, category1, category2])

    return (
        <Grid container sx={{ mt: 1 }}>
            {/* 업종list */}
            <Grid item xs={5}>
                <Grid item container sx={{ height: 410 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={data}
                            columns={table_columns}
                            rowHeight={25}
                            onCellClick={(params, event) => {
                                handleSelectedIndustries(params.row.업종명);
                                getIndustryStockData(params);
                                // onIndustryClick(params.row.업종명);
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
                    </ThemeProvider>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <Grid item container sx={{ pl: 2 }}>

                    <StyledToggleButton
                        value='check'
                        selected={category}
                        onChange={() => {
                            setCategory(!category);
                        }}
                        sx={{ pl: 1, fontSize: '9px' }}>
                        흑자
                    </StyledToggleButton>


                    <ToggleButtonGroup
                        value={category1}
                        onChange={handleCategory1}
                        size="small"
                        sx={{ pl: 1 }}
                    >
                        {categories1.map(item => (
                            <StyledToggleButton key={item[1]} value={item[1]} sx={{ fontSize: '9px' }}>
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

                <Grid item container>
                    <CrossChart data={chartData} height={380} getStockCode={getStockCode} getStockChartData={getStockChartData} setStockCode={setStockCode} />
                </Grid>
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

        </Grid>
    )
}

const table_columns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, {
        field: '순위', headerName: '업종순위', width: 60,
        align: 'center', headerAlign: 'left',
    }, {
        field: '업종명', headerName: '업종명', width: 120,
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