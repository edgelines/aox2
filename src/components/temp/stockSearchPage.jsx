import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import SearchFinancialInfo from './SearchFinancial/info';
import SectorChart from './SectorsPage/sectorChart';
import { API, STOCK } from './util/config';
import { SectorsName15 } from './util/util';
import { customTheme, themesTableColumns_search, DataTableStyleDefault } from './LeadSectors/tableColumns';
import { renderProgress } from './sectorSearchPage';

export default function StockSearchPange({ swiperRef }) {

    const [baseStockName, setBaseStockName] = useState([]);
    const [value, setValue] = useState(null);

    const [timeframe, setTimeframe] = useState('day');
    const [stockTableData, setStockTableData] = useState([]); // 업종에 속한 종목들
    const [themesTableData, setThemesTableData] = useState([]); // 종목을 소환하면 거기에 속한 테마들 출력
    const [sectorsName, setSectorsName] = useState(null); // 업종 이름
    const [sectorsChartDataSelected, setSectorsChartDataSelected] = useState([]); // 업종 차트
    const [stock, setStock] = useState({ 종목명: null }); // 종목 정보
    const [stockChart, setStockChart] = useState({ price: [], volume: [] }); // 종목 차트
    const [selectedChartType, setSelectedChartType] = useState('A')
    // handler
    const handleTimeframe = (event, value) => { if (value !== null) { setTimeframe(value); } }
    const handleFavorite = async () => {
        setStock(prevStock => ({
            ...prevStock,
            Favorite: !prevStock.Favorite
        }));
        try {
            await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }
    const handleInvest = async () => {
        setStock(prevStock => ({
            ...prevStock,
            InvestCount: prevStock.InvestCount + 1
        }));
        try {
            await axios.get(`${API}/stockInvest/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }

    const handleInvestCancel = async () => {
        setStock(prevStock => ({
            ...prevStock,
            Invest: !prevStock.Invest,
            InvestCount: 0
        }));
        try {
            await axios.get(`${API}/del/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }
    const handleSelectedChartType = async (event, value) => {
        if (value !== null) { setSelectedChartType(value) }
    }
    // func
    const fetchData = async () => {
        const res = await axios.get(`${API}/industry/stockName`);
        setBaseStockName(res.data);
    }

    const getInfo = async (item) => {

        var res = await axios.get(`${API}/industry/LeadSectorsTable/${item.업종명}`);
        setStockTableData(res.data);

        // 업종 차트
        const name = SectorsName15(item.업종명)
        setSectorsName(item.업종명);

        const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        if (!excludedNames.includes(name)) {
            var res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
            setSectorsChartDataSelected(res.data);
        }

        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            if (res.status === 200) {
                setStock({
                    종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
                    시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                    PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                    N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                    이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요,
                    분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                    주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    테마명: res.data.테마명
                })
            }

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })

            }
            //     console.log(res.data); ${item.종목코드}

            const postData = { stockCode: item.종목코드 };
            var res = await axios.post(`${API}/themes/getStockThemes`, postData);
            if (res.status === 200) {
                setThemesTableData(res.data);
            }

        } else {
            setStock({ 종목명: null });
            setStockChart({ price: [], volume: [] });
        }

    }


    useEffect(() => { fetchData(); }, [])
    const getSelectedChartType = async () => {
        if (typeof stock.종목코드 !== "undefined") {
            var res = await axios.get(`${STOCK}/get/${stock.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            }
        }
    }
    useEffect(() => {
        getSelectedChartType()
    }, [selectedChartType])

    return (
        <Grid container spacing={1} >
            <Grid item xs={4}>
                <StyledAutocomplete
                    // disablePortal
                    disableClearable
                    getOptionLabel={(option) => option.종목명} // 옵션을 어떻게 표시할지 결정합니다. 객체의 속성에 따라 조정해야 합니다.
                    options={baseStockName}
                    sx={{ width: 300 }}
                    value={value}
                    onChange={async (event, newValue) => {
                        setValue(newValue);
                        getInfo(newValue);
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="종목명 검색"
                            variant="filled"
                        />}
                />
            </Grid>
            {/* 중앙 : Grid */}
            <Grid item xs={4} container>
                <SectorChart data={sectorsChartDataSelected} sectorName={sectorsName} height={190} />

                <Grid item container>
                    {sectorsName ?
                        <Typography>{sectorsName}</Typography>
                        : <></>
                    }
                </Grid>

                <Grid item xs={6}
                    sx={{ height: '600px', p: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography sx={{ fontSize: '12px', mb: 1 }}>업종</Typography>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={stockTableData}
                            columns={stockTableColumns}
                            hideFooter rowHeight={20}
                            onCellClick={(params, event) => {
                                getInfo(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                            }}
                        />
                    </ThemeProvider>
                </Grid>

                <Grid item xs={6}
                    sx={{ height: '600px', p: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography sx={{ fontSize: '12px', mb: 1 }}>테마</Typography>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={themesTableData}
                            columns={themesTableColumns_search}
                            hideFooter rowHeight={20}
                            onCellClick={(params, event) => {
                                getInfoTheme(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                            }}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>
            {/* 우 : Grid */}
            <Grid item xs={4}>
                <SearchFinancialInfo swiperRef={swiperRef} stock={stock} stockChart={stockChart} handleFavorite={handleFavorite} timeframe={timeframe} handleTimeframe={handleTimeframe}
                    handleInvest={handleInvest} handleInvestCancel={handleInvestCancel}
                    selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                />
            </Grid>
        </Grid>

    );
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-inputRoot': {
        color: '#efe9e9ed',
        '&.Mui-focused .MuiAutocomplete-input': {
            color: '#efe9e9ed',
        },
    },
    '& .MuiAutocomplete-option': {
        color: '#efe9e9ed',
    },
    '& .MuiAutocomplete-option.Mui-focused': {
        backgroundColor: '#d8d8d8',
    },
    '& .MuiAutocomplete-option.Mui-selected': {
        backgroundColor: '#404040',
        color: '#efe9e9ed',
    },
    '& .MuiInputLabel-root': {
        color: '#efe9e9ed',
    },
}));


const stockTableColumns = [
    {
        field: '종목명', headerName: '종목명', width: 80,
        align: 'left', headerAlign: 'left',
    }, {
        field: '등락률', headerName: '등락률', width: 70,
        align: 'left', headerAlign: 'center',
        // valueFormatter: (params) => {
        //     if (params.value == null) { return ''; }
        //     return `${params.value} %`;
        // }
        renderCell: (params) => {
            const row = params.row;
            const progress = renderProgress({ value: row.등락률, valueON: true, val2: 5, color: '#e89191' })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1 }}>
                        {params.value} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }, {
        field: '전일대비거래량', headerName: '전일%', width: 70,
        align: 'left', headerAlign: 'center',
        renderCell: (params) => {
            const row = params.row;
            const progress = renderProgress({ value: row.전일대비거래량, valueON: true, val2: 0.2, color: '#91bde8' })
            return (
                <Box sx={{ position: 'relative', mt: -2 }}>
                    <Box sx={{ position: 'absolute', zIndex: 1 }}>
                        {(params.value).toLocaleString('kr')} %
                    </Box>
                    <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                        {progress}
                    </Box>
                </Box>
            )
        }
    }]