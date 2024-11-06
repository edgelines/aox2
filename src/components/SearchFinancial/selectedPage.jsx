import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault, StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo } from '../util/htsUtil';
import { customTheme } from './util';
import CrossChartPage from './crossChartPage';
import TreeMap from './treeMap';
import FavoritePage from './favoritePage';
// import CoreChart from '../util/CoreChart';
import { API } from '../util/config';
import { trendColumns, eventColumns, ranksThemesColumns, ranksWillrColumns, dateThemesColumns, dateWillrColumns } from './tableColumns';
import SectorsChartPage from '../sectorsChartPage.jsx';
import { blue } from '@mui/material/colors';

export const ContentsComponent = ({ swiperRef, page, tableData, eventDrop, onIndustryClick, getStockCode, getStockChartData }) => {

    switch (page) {
        case 'Tree':
            return <Tree tableData={tableData} onIndustryClick={onIndustryClick} />
        case 'Favorite':
            return <Favorite swiperRef={swiperRef} getStockCode={getStockCode} getStockChartData={getStockChartData} ></Favorite>
        case 'Industry':
            return <SectorsChartPage />
        case 'Event':
            return <EventPage swiperRef={swiperRef} eventDrop={eventDrop} getStockCode={getStockCode} getStockChartData={getStockChartData} />
        default:
            return <Cross swiperRef={swiperRef} tableData={tableData} getStockCode={getStockCode} getStockChartData={getStockChartData} />
    }

}



function Tree({ tableData, onIndustryClick }) {
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

function Cross({ swiperRef, tableData, onIndustryClick, getStockCode, getStockChartData }) {
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

const EventPage = ({ swiperRef, eventDrop, getStockCode, getStockChartData }) => {
    const [data, setData] = useState([]);
    const [past, setPast] = useState(false);
    const [tableColumnsName, setTableColumnsName] = useState('themes')
    const handleTableColumnsChange = (event, value) => { if (value !== null) { setTableColumnsName(value); } }
    const fetchData = async (eventDrop) => {
        const postData = { past: past, event: eventDrop, tableColumnsName: tableColumnsName }
        const res = await axios.post(`${API}/formula/eventData`, postData);
        setData(res.data);
    }
    useEffect(() => {
        fetchData(eventDrop);
    }, [past, eventDrop, tableColumnsName])

    return (
        <Grid container sx={{ pr: 1 }}>
            <Grid item container sx={{ mt: 1, mb: 1 }}>
                <Grid item xs={1}>
                    <StyledToggleButton
                        value='check'
                        selected={past}
                        onChange={() => {
                            setPast(!past);
                        }}
                        sx={{ fontSize: '9px' }}>
                        {past ? '과거부터' : '현재부터'}
                    </StyledToggleButton>
                </Grid>

                <Grid item xs={3}>
                    <StyledTypography_StockInfo fontSize={'16px'} sx={{ ml: 10, pt: 1 }}>
                        Event : {eventDrop ? eventDrop : ''}
                    </StyledTypography_StockInfo>
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
                            {/* <StyledToggleButton fontSize={'10px'} value="trima">Trima</StyledToggleButton> */}
                            <StyledToggleButton fontSize={'10px'} value="willR">WiilR</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item container sx={{ height: 800, width: "100%" }}
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={data}
                        columns={tableColumnsName == 'trima' ? eventColumns : tableColumnsName == 'themes' ? dateThemesColumns : dateWillrColumns}
                        // getRowHeight={() => 'auto'}
                        rowHeight={25}
                        onCellClick={(params, event) => {
                            getStockCode(params.row);
                            getStockChartData(params.row.종목코드);
                        }}
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
                            '[data-field="TRIMA_41"]': { borderRight: '1.5px solid #ccc' },
                            '&& .Mui-selected': { backgroundColor: blue['A200'] }
                        }}
                    />
                </ThemeProvider>
            </Grid>
        </Grid>
    )
}

