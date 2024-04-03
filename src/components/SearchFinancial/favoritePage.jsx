import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton, SectorsName15 } from '../util/util';
import CrossChart from './crossChart';
import { customTheme } from './util';
import { API, TEST } from '../util/config';
import { table_columns, trendColumns, ranksThemesColumns, ranksWillrColumns } from './tableColumns';
import SectorChart from '../SectorsPage/sectorChart';
// 
export default function FavoritePage({ swiperRef, getStockCode, getStockChartData }) {
    // List
    const categories1 = [['가결산합산/전년도대비', '가결산'], ['전분기대비', '분기'], ['전년동분기대비', '전년동분기대비']]
    const categories2 = ['매출', '영업이익', '당기순이익']
    const allItemList = [['전체 종목', '전체종목'], ['전체 흑자', '흑자기업'], ['전체 미집계', '미집계']]
    const [tableColumnsName, setTableColumnsName] = useState('themes')
    const [tableData, setTableData] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState(null);
    const [filter, setFilter] = useState({ field: null, industry: null })
    const [stockTableData, setStockTableData] = useState([]);
    const [chartType, setChartType] = useState(true); // true : cross, false : industry
    const [SectorsName, setSectorsName] = useState('');
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
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
        if (params.field !== '순위') {
            setChartType(true);
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
                    setCategory1('가결산');
                    setAggregated(null);
                    setSurplus(false);
                    break;
            }
            setSelectedIndustries(params.row.업종명);
            setFilter({ field: params.field, industry: params.row.업종명 })
            setAllItem(null);
        } else {
            setChartType(false);
            sectorSelected(params.row)
        }
    };
    const handleTableColumnsChange = (event, value) => { if (value !== null) { setTableColumnsName(value); } }
    const sectorSelected = async (sector) => { // 업종 클릭시 
        const name = SectorsName15(sector.업종명)
        setSectorsName(sector.업종명)
        const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        if (!excludedNames.includes(name)) {
            const res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
            setSectorsChartDataSelected(res.data);
        }
    }
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
            aggregated: aggregated,
            surplus: surplus,
            target_industry: [selectedIndustries],
            target_category1: [category1],
            target_category2: category2,
            favorite: true,
            tableColumnsName: tableColumnsName
        }
        // const res = await axios.post(`${TEST}/crossChart`, postData);
        const res = await axios.post(`${API}/formula/crossChart`, postData);
        setChartData(res.data.chart);
        setStockTableData(res.data.table);
        // console.log(res.data);
        // console.log(field, industry);
    }

    const fetchData = async () => {
        // const res = await axios.get(`${TEST}/searchFinancialFavorite`);
        const res = await axios.get(`${API}/formula/searchFinancialFavorite`);
        setTableData(res.data);
    }
    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        getCrossChartData();

    }, [tableColumnsName, selectedIndustries, aggregated, surplus, category1, category2])

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
                                    '&& .MuiDataGrid-cell:focus': { outline: 'solid #ff0000 1px;', backgroundColor: 'rgba(255, 0, 0, 0.2)' },
                                    '&& .Mui-selected': { backgroundColor: 'rgba(255, 215, 0, 0.2)' }
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
                    {
                        !chartType ?
                            <Grid container>
                                <SectorChart data={SectorsChartDataSelected} height={300} sectorName={SectorsName} />
                                <StyledButton fontSize={'12px'} onClick={() => setChartType(true)}>CrossChart</StyledButton>
                            </Grid>
                            :
                            <CrossChart data={chartData} height={380} getStockCode={getStockCode} getStockChartData={getStockChartData} />
                    }
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

            {/* 하단 종목 리스트 */}
            <Grid item container sx={{ height: 440, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={stockTableData}
                        columns={tableColumnsName == 'trima' ? trendColumns : tableColumnsName == 'themes' ? ranksThemesColumns : ranksWillrColumns}
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


