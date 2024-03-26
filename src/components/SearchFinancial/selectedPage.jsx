import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo } from '../util/htsUtil';
import { customTheme } from './util';
import CrossChartPage from './crossChartPage';
import TreeMap from './treeMap';
import FavoritePage from './favoritePage';
import { API } from '../util/config';
import SectorsChartPage from '../sectorsChartPage.jsx';

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
        field: '가결산_매출', headerName: '매출+', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '가결산_영업이익', headerName: '영업이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '가결산_당기순이익', headerName: '순이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_매출', headerName: '매출+', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_영업이익', headerName: '영업이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '분기_당기순이익', headerName: '순이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자_매출', headerName: '매출+', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자_영업이익', headerName: '영업이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자_당기순이익', headerName: '순이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '전년동분기대비', headerName: '전년 동분기', width: 70,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계_매출', headerName: '매출+', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계_영업이익', headerName: '영업이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계_당기순이익', headerName: '순이익', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계', headerName: '전체', width: 55,
        align: 'right', headerAlign: 'center',
    }, {
        field: '전체종목수', headerName: '전체종목수', width: 65,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자기업', headerName: '흑자기업', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '순이익기업', headerName: '순이익기업%', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            return `${parseInt(params.value)} %`;
        }
    }
]


export const ContentsComponent = ({ swiperRef, page, tableData, eventDrop, getIndustryStockData, onIndustryClick, getStockCode, getStockChartData }) => {

    switch (page) {
        case 'Tree':
            return <Tree tableData={tableData} onIndustryClick={onIndustryClick} />
        case 'Table':
            return <Table swiperRef={swiperRef} tableData={tableData} getIndustryStockData={getIndustryStockData} />
        case 'Favorite':
            return <Favorite swiperRef={swiperRef} getStockCode={getStockCode} getStockChartData={getStockChartData} ></Favorite>
        case 'Industry':
            return <SectorsChartPage />
        case 'Event':
            return <EventPage swiperRef={swiperRef} eventDrop={eventDrop} getStockCode={getStockCode} getStockChartData={getStockChartData} />
        case 'Treasury':
            return <TreasuryPage swiperRef={swiperRef} getStockCode={getStockCode} getStockChartData={getStockChartData} />
        default:
            return <Cross swiperRef={swiperRef} tableData={tableData} getStockCode={getStockCode} getStockChartData={getStockChartData} />
    }

}


export function Table({ swiperRef, tableData, getIndustryStockData }) {
    return (
        <Grid container sx={{ pr: 2 }}>
            <Grid item container>
                <Grid item xs={2.2}></Grid>
                <Grid item xs={1.8} sx={{ backgroundColor: 'rgba(191, 49, 252, 0.6)' }} >가결산합산/전년도대비 (A)</Grid>
                <Grid item xs={1.2} sx={{ backgroundColor: 'rgba(191, 49, 252, 0.6)' }} >전분기대비 (B)</Grid>
                <Grid item xs={1.6} sx={{ backgroundColor: 'rgba(191, 49, 252, 0.6)' }} >흑자 (A or B)</Grid>
                <Grid item xs={0.9} sx={{ backgroundColor: 'rgba(191, 49, 252, 0.6)' }} ></Grid>
                <Grid item xs={2.2} sx={{ backgroundColor: 'rgba(252, 171, 49, 0.6)' }}>미집계</Grid>
            </Grid>
            <Grid item container sx={{ height: 440, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={tableData}
                        columns={table_columns}
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
                            '[data-field="분기_매출"]': { borderLeft: '1.5px solid #ccc' },
                            '[data-field="분기_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="흑자_당기순이익"]': { borderRight: '1.5px solid #ccc' },
                            '[data-field="전년동분기대비"]': { borderRight: '2.5px solid #FCAB2F' },
                            '[data-field="전체종목수"]': { borderLeft: '2.5px solid #FCAB2F', borderRight: '1.5px solid #ccc' },
                            '[data-field="흑자기업"]': { borderRight: '1.5px solid #ccc' },
                        }}
                    />
                </ThemeProvider>

            </Grid>

        </Grid>
    )
}

export function Tree({ tableData, onIndustryClick }) {
    const [page, setPage] = useState('All');
    const [treeMapData, setTreeMapData] = useState({});
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchMarket`);
        setTreeMapData(res.data);
    }

    useEffect(() => { fetchData() }, [])

    return (
        <Grid container>
            <Grid item sx={{ mt: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="All">All</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="Selected">코스피/코스닥</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>

            {Array.isArray(treeMapData.Kospi_data) ?
                <Grid item xs={8} container direction='row' alignItems="center" justifyContent="center" >
                    <Grid item xs={8}>
                        <Stack direction='row' spacing={2} sx={{ pl: 10, pt: 1 }}>
                            <StyledTypography_StockInfo fontSize="15px">코스피</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{treeMapData.Kospi_profitable}</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">/</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{treeMapData.Kospi_total}</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{parseInt(treeMapData.Kospi_profitable / treeMapData.Kospi_total * 100)}%</StyledTypography_StockInfo>
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                        <Stack direction='row' spacing={2} sx={{ pl: 5, pt: 1 }}>
                            <StyledTypography_StockInfo fontSize="15px">코스닥</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{treeMapData.Kosdaq_profitable}</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">/</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{treeMapData.Kosdaq_total}</StyledTypography_StockInfo>
                            <StyledTypography_StockInfo fontSize="15px">{parseInt(treeMapData.Kosdaq_profitable / treeMapData.Kosdaq_total * 100)}%</StyledTypography_StockInfo>
                        </Stack>
                    </Grid>
                </Grid>
                : <></>
            }

            <Grid item container>
                {
                    page === 'All' ?
                        <TreeMap data={tableData} onIndustryClick={(업종명) => onIndustryClick(업종명, null, '흑자기업')} height={420} />
                        :
                        <Grid item container>
                            <Grid item container xs={6}>
                                <TreeMap data={treeMapData.Kospi_data} onIndustryClick={(업종명) => onIndustryClick(업종명, 'Kospi', '흑자기업')} height={420} />
                            </Grid>
                            <Grid item container xs={6}>
                                <TreeMap data={treeMapData.Kosdaq_data} onIndustryClick={(업종명) => onIndustryClick(업종명, 'Kosdaq', '흑자기업')} height={420} />
                            </Grid>
                        </Grid>

                }
            </Grid>
        </Grid>
    )
}

export function Cross({ swiperRef, tableData, onIndustryClick, getStockCode, getStockChartData }) {
    return (
        <Grid container>
            <CrossChartPage swiperRef={swiperRef}
                getStockCode={getStockCode} tableData={tableData}
                onIndustryClick={(업종명) => onIndustryClick(업종명, null, '흑자기업')} getStockChartData={getStockChartData} />
        </Grid>
    )
}

const Favorite = ({ swiperRef, onIndustryClick, getStockCode, getStockChartData }) => {
    return (
        <Grid container>
            <FavoritePage swiperRef={swiperRef}
                getStockCode={getStockCode}
                onIndustryClick={(업종명) => onIndustryClick(업종명, null, '흑자기업')} getStockChartData={getStockChartData} />
        </Grid>
    )
}

const eventColumns = [
    {
        field: '날짜', headerName: '날짜', width: 85,
        align: 'center', headerAlign: 'center',
    }, {
        field: '업종명', headerName: '업종명', width: 125,
        align: 'left', headerAlign: 'center',
    }, {
        field: '종목명', headerName: '종목명', width: 125,
        align: 'left', headerAlign: 'center',
    }, {
        field: '시가총액', headerName: '시가총액', width: 70,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value / 100000000)).toLocaleString('kr')}`;
        }
    }, {
        field: '연간', headerName: '전년도 순이익합', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '1Q', headerName: '1Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '2Q', headerName: '2Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '3Q', headerName: '3Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '4Q', headerName: '4Q', width: 60,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')}`;
        }
    }, {
        field: '부채비율', headerName: '부채비율', width: 70,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }, {
        field: '유보율', headerName: '유보율', width: 75,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == null) { return ''; }
            return `${(parseInt(params.value)).toLocaleString('kr')} %`;
        }
    }, {
        field: 'TRIMA_8', headerName: '8', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_16', headerName: '16', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_27', headerName: '27', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }, {
        field: 'TRIMA_41', headerName: '41', width: 50,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            if (params.value == true) { return '◎'; }
            return '';
        }
    }
]

const EventPage = ({ swiperRef, eventDrop, getStockCode, getStockChartData }) => {
    const [data, setData] = useState([]);
    const [past, setPast] = useState(false);
    const fetchData = async (eventDrop) => {
        const postData = {
            past: past, event: eventDrop,
        }
        const res = await axios.post(`${API}/formula/eventData`, postData);
        setData(res.data);
    }
    useEffect(() => {
        fetchData(eventDrop);
    }, [past, eventDrop])

    return (
        <Grid container sx={{ pr: 1 }}>
            <Grid item container sx={{ mt: 1, mb: 1 }}>
                <StyledToggleButton
                    value='check'
                    selected={past}
                    onChange={() => {
                        setPast(!past);
                    }}
                    sx={{ fontSize: '9px' }}>
                    {past ? '과거부터' : '현재부터'}
                </StyledToggleButton>

                <StyledTypography_StockInfo fontSize={'16px'} sx={{ ml: 10, pt: 1 }}>
                    Event : {eventDrop ? eventDrop : ''}
                </StyledTypography_StockInfo>
            </Grid>

            <Grid item container sx={{ height: 800, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={data}
                        columns={eventColumns}
                        // getRowHeight={() => 'auto'}
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
                            '[data-field="부채비율"]': { borderLeft: '1.5px solid #ccc' },
                            '[data-field="테마명"]': { borderLeft: '1.5px solid #ccc' },
                        }}
                    />
                </ThemeProvider>
            </Grid>
        </Grid>
    )
}

const TreasuryPage = ({ swiperRef, getStockCode, getStockChartData }) => {
    const [data, setData] = useState([]);
    const [treasury, setTreasury] = useState(true);
    const fetchData = async () => {
        const postData = { treasury: treasury }
        const res = await axios.post(`${API}/formula/treasuryData`, postData);
        setData(res.data);
    }
    useEffect(() => {
        fetchData();
    }, [treasury])

    return (
        <Grid container sx={{ pr: 1 }}>
            <Grid item container sx={{ mt: 1, mb: 1 }}>
                <StyledToggleButton
                    value='check'
                    selected={treasury}
                    onChange={() => {
                        setTreasury(!treasury);
                    }}
                    sx={{ fontSize: '9px' }}>
                    {treasury ? '취득' : '처분'}
                </StyledToggleButton>
            </Grid>

            <Grid item container sx={{ height: 800, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={data}
                        columns={eventColumns}
                        // getRowHeight={() => 'auto'}
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
                            '[data-field="부채비율"]': { borderLeft: '1.5px solid #ccc' },
                            '[data-field="테마명"]': { borderLeft: '1.5px solid #ccc' },
                        }}
                    />
                </ThemeProvider>
            </Grid>
        </Grid>
    )
}