import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Slider, Grid, IconButton, Switch, FormControl, FormControlLabel, Paper, Box, Divider, Stack, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import SearchFinancialInfo from './SearchFinancial/info';
import SectorChart from './SectorsPage/sectorChart';
import { API, STOCK, TEST } from './util/config';
import { SectorsName15 } from './util/util';
import { customTheme, stockTableColumns, themesTableColumns_search, DataTableStyleDefault } from './LeadSectors/tableColumns';

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

    // handler
    const handleTimeframe = (event, value) => { if (value !== null) { setTimeframe(value); } }
    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }

    // func
    const fetchData = async () => {
        // const res = await axios.get(`${TEST}/stockName`);
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

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}`);
            // console.log(res.data);
            setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, treasuryPrice: res.data.treasuryPrice, willR: res.data.willR, net: res.data.net, MA: res.data.MA })
            //     console.log(res.data); ${item.종목코드}

            const postData = { stockCode: item.종목코드 };
            var res = await axios.post(`${API}/themes/getStockThemes`, postData);
            // var res = await axios.post(`${TEST}/getStockThemes`, postData);
            setThemesTableData(res.data);

        } else {
            setStock({ 종목명: null });
            setStockChart({ price: [], volume: [] });
        }

    }


    useEffect(() => { fetchData(); }, [])

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


                <Grid item xs={6}
                    sx={{ height: '600px', p: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography>업종</Typography>
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
                    <Typography>테마</Typography>
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
                <SearchFinancialInfo swiperRef={swiperRef} stock={stock} stockChart={stockChart} handleFavorite={handleFavorite} timeframe={timeframe} handleTimeframe={handleTimeframe} />
            </Grid>
        </Grid>

    );
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-inputRoot': {
        color: '#efe9e9ed',
        '&.Mui-focused .MuiAutocomplete-input': {
            color: '#404040',
        },
    },
    '& .MuiAutocomplete-option': {
        color: '#efe9e9ed',
    },
    // '& .MuiAutocomplete-option.Mui-focused': {
    //     backgroundColor: '#d8d8d8',
    // },
    // '& .MuiAutocomplete-option.Mui-selected': {
    //     backgroundColor: '#efe9e9ed',
    //     color: '#404040',
    // },
    '& .MuiInputLabel-root': {
        color: '#efe9e9ed',
    },
}));