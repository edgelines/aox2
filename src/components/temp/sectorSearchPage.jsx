import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Slider, Grid, IconButton, Switch, FormControl, FormControlLabel, Paper, Box, Divider, Stack, ListItem, ListItemText, Typography, TextField, useMediaQuery, ListSubheader, Popper,
    Accordion, AccordionSummary, AccordionDetails, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// import StockChart from './SectorsPage/stockChart';
import SectorChart from '../SectorsPage/sectorChart';
import TreeMap from '../SectorsPage/treeMap';
import ColumnChart from '../SectorsPage/columnChart';
import { API, STOCK } from '../util/config';
import { SectorsName15 } from '../util/util';


export default function SectorsRank({ swiperRef }) {

    const [repeatedKeyword, setRepeatedKeyword] = useState([]);

    const [StockSectors, setStockSectors] = useState([]);
    // 검색 정보 가져오기 [{search : '이지홀딩스', 'separator' : '종목'}, {search : '돼지', 'separator' : '테마'} ... ]
    const [SearchInfo, setSearchInfo] = useState([]);
    // 날짜별 종목별 이벤트 정보 가져오기 [{"date":"2023-07-03","item":"KC코트렐","event":"권리락(유상증자)"},{"date":"2023-07-03","item":"큐라티스","event":"추가상장(CB전환 및 주식전환)"},{"date":"2023-07-03","item":"한일단조","event":"추가상장(CB전환)"},{"date":"2023-07-03","item":"인산가","event":"추가상장(CB전환)"},{"date":"2023-07-03","item":"소프트센","event":"추가상장(CB전환)"}
    const [ScheduleItemEvent, setScheduleItemEvent] = useState([]);
    const [ABC1, setABC1] = useState([]);
    const [ABC2, setABC2] = useState([]);

    const [tableM1M2, setTableM1M2] = useState([]);
    const [filteredStockTable, setFilteredStockTable] = useState([]); // 필터링된 종목 Table
    const [filteredThemeTable, setFilteredThemeTable] = useState([]); // 필터링된 테마 Table
    // 필터된 종목들이 테마에 의한것인지 업종에 의한것인지 확인 
    const [filteredCheckName, setFilteredCheckName] = useState({});
    // 테마Top 10,12 에 속하는 종목 찾는 테이블 변수
    const [sectorsThemes, setSectorsThemes] = useState({}); // 업종 Top10
    const [topThemes, setTopThemes] = useState(); // 종목 Top10
    // ABC1, ABC2 => reduce

    // M1, M2, P# Table Filter
    const order = 'desc';
    const orderBy = '종목 등락률';
    const [volumeMin, setVolumeMin] = useState(0);
    const [volumeMax, setVolumeMax] = useState(0);
    const [volumeRange, setVolumeRange] = useState([0, 0]);
    const [volumeRangeChecked, setVolumeRangeChecked] = useState(true);
    const [ratioRange, setRatioRange] = useState([0, 30]);
    const [reserveRatio, setReserveRatio] = useState(200); // 유보율
    const [debtRatio, setDebtRatio] = useState(500); // 부채비율
    const [volumeAvg, setVolumeAvg] = useState(20000);
    const [marketCap, setMarketCap] = useState([500 * 100000000, 5000 * 100000000]);

    // SearchPage 
    const [searchItemEvent, setSearchItemEvent] = useState('');
    const [searchItemPage, setSearchItemPage] = useState('');

    // 우측 Chart에 속하는 State
    const [stockName, setStockName] = useState(null);
    const [stockItem, setStockItem] = useState('');
    const [stockItemData, setStockItemData] = useState([]);
    const [stockVolumeData, setStockVolumeData] = useState([]);
    const [SectorsName, setSectorsName] = useState('');
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    // const [top10Themes, setTop10Themes] = React.useState([]);

    // TogglePage
    const [togglePage, setTogglePage] = useState('TreeMap');

    // TreeMap
    const [SectorsRanksThemes, setSectorsRanksThemes] = useState([]);

    // Function
    // 테마를 눌렀을때 가운데 종목과 등락률/전일대비 가져오기
    const findThemeByItem = async (ThemeName) => {
        // setFilteredCheckName({ key: '테마', name: ThemeName })
        const res = await axios.get(`${API}/industryChartData/findThemeStocks?name=${ThemeName}`)
        setFilteredStockTable(res.data);

    }
    // 업종과 전일대비 Table에서 업종을 눌렀을때 가운데 종목과 등락률/전일대비 가져오기
    const findSectorsByItem = async (sectorName) => {
        // setFilteredCheckName({ key: '업종', name: sectorName })
        const res = await axios.get(`${API}/industryChartData/findIndustryStocks?name=${sectorName}`)
        setFilteredStockTable(res.data);
        sectorSelected({ 업종명: sectorName });
    }


    // // 2023.12.08 리팩토링
    const getPost = async () => {
        const postData = {
            volumeRange: volumeRange,
            reserveRatio: reserveRatio,
            ratioRange: ratioRange,
            volumeAvg: volumeAvg,
            marketCap: marketCap,
            debtRatio: debtRatio,
        }
        const res = await axios.post(`${API}/industryChartData/getStocks`, postData)
        setSectorsThemes(res.data.industryTop10);
        setTopThemes(res.data.tableM1M2Themes);
        setTableM1M2(res.data.tableM1M2);
        setVolumeMin(res.data.volumeMin);
        setVolumeMax(res.data.volumeMax);
        // setVolumeRange(res.data.volumeRange);
    }

    // M1, M2, P# Table Filter
    const handleChangeVolume = (event, newValue, activeThumb) => {
        const minDistance = 50; // 최소거리
        let newRange = [...volumeRange];

        if (!Array.isArray(newValue)) {
            return;
        }
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], volumeMax - minDistance);
                newRange = [clamped, clamped + minDistance];
            } else {
                const clamped = Math.max(newValue[1], volumeMin + minDistance);
                newRange = [clamped - minDistance, clamped];
            }
        } else {
            // 현재 슬라이더 값에 따라 원하는 스텝 크기를 계산
            const stepSize = newValue[activeThumb] <= (volumeMax - volumeMin) / 2 ? 5 : 100;
            // 원하는 스텝을 적용한 새로운 슬라이더 값을 계산
            newRange[activeThumb] = Math.round(newValue[activeThumb] / stepSize) * stepSize;
        }

        // 상태 업데이트
        setVolumeRange(newRange);
    }; //전일대비거래량 Slider Step
    const handleChangeVolumeCheck = (event) => {
        if (volumeRangeChecked) {
            setVolumeRange([volumeMin, 1000])

            setVolumeRangeChecked(event.target.checked);
        } else {
            setVolumeRange([volumeMin, volumeMax])
            setVolumeRangeChecked(event.target.checked);
        }
    }; //전일대비거래량 BTN
    const handleChangeRatioRange = (event, newValue, activeThumb) => {
        const minDistance = 3; // 최소거리
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - minDistance);
                setRatioRange([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setRatioRange([clamped - minDistance, clamped]);
            }
        } else {
            setRatioRange(newValue);
        }


    }; // 등락률 Slider Step Fun
    const handleFocusReserveRatio = (newValue) => {
        var result = parseInt(reserveRatio) + newValue;
        if (result < 0) {
            setReserveRatio(0);
        } else {
            setReserveRatio(result)
        }
    }; // 유보율 Step Button
    const handleFocusVolumeAvg = (newValue) => {
        var result = volumeAvg + newValue;
        if (result < 20000) {
            setVolumeAvg(20000);
        } else {
            setVolumeAvg(result);
        }
    }; // 5일평균거래량 Step Button
    const handleFocusMarketCap = (MinMax, newValue) => {
        if (MinMax === 'Min') {
            var minValue = marketCap[0] + (newValue * 100000000);
            if (minValue < 0) {
                setMarketCap([0, marketCap[1]]);
            } else {
                setMarketCap([minValue, marketCap[1]]);
            }
        } else {
            var maxValue = marketCap[1] + (newValue * 100000000);
            if (marketCap[0] > maxValue) {
                setMarketCap([marketCap[0], marketCap[0]]);
            } else {
                setMarketCap([marketCap[0], maxValue]);
            }
        }
    }; // 시가총액
    const handleDebtRatio = (newValue) => {
        var result = parseInt(debtRatio) + newValue
        if (result < 0) {
            setDebtRatio(0);
        } else { setDebtRatio(result); }
    }; // 부채비율

    // 주식 차트 전송 Function
    const getSectorNameAndCode = async (itemName) => { // AxBxC 1,2 에서 종목을 클릭하면 업종명과 종목코드, 종목명 찾아 stockItemSelected로 전달
        const res = await axios.get(`${API}/info/Search/IndustryStocks?stockName=${itemName}`)
        stockItemSelected({ 종목코드: res.data[0].종목코드, 종목명: res.data[0].종목명, 업종명: res.data[0].업종명 });
    };
    const stockItemSelected = async (selectedStockItem) => { // 종목 클릭시
        setStockItem(selectedStockItem.종목명);
        const res = await axios.get(`${STOCK}/${selectedStockItem.종목코드}`);
        setStockItemData(res.data.stock);
        setStockVolumeData(res.data.volume);
        sectorSelected(selectedStockItem)
    };
    const sectorSelected = async (sector) => { // 업종 클릭시 
        const name = SectorsName15(sector.업종명)
        setSectorsName(sector.업종명);
        // if (name !== '없음') { setSectorsChartDataSelected(SectorsChartData[name]); }
        const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        if (!excludedNames.includes(name)) {
            const res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
            setSectorsChartDataSelected(res.data);
        }
    }


    const handleGetComponentEvent = (item) => { // 검색바 에서 업종/테마 일경우
        setSearchItemPage(false);
        if (item.separator == '업종') {
            findSectorsByItem(item.value);
            setFilteredCheckName({ key: '업종', name: item.value })
        } else if (item.separator == '테마') {
            findThemeByItem(item.value);
            setFilteredCheckName({ key: '테마', name: item.value })
        }
    }


    // togglePage BTN
    const handleTogglePage = (event, newAlignment) => {
        if (newAlignment !== null) { setTogglePage(newAlignment); }
    }
    // Treemap에서 테마 클릭시 테마에 속한 종목들을 상위컴포넌트로 전달해주는 펑션
    const onThemeClick = (themeInStockData) => {
        const res = themeInStockData.map((item, index) => ({
            // ...item,
            종목명: item.item,
            등락률: item.changeRate,
            전일대비거래량: item.volume,
            종목코드: item.종목코드,
            업종명: item.업종명,
            id: index,
        }));

        const result = res.sort((a, b) => b.changeRate - a.changeRate);
        setFilteredCheckName({ key: '트리맵', name: result });
        setFilteredStockTable(result);
        // setHighchartRef(result);
    }

    const onSelectedStockName = async (stockName) => {
        setSearchItemPage(true);
        getSectorNameAndCode(stockName);

        const itemData = ScheduleItemEvent.find(data => data.item === stockName);
        if (!itemData) {
            console.log('ScheduleItemEvent : no Data');
        } else {
            setSearchItemEvent(itemData ? { stockName: stockName, data: [itemData] } : []);
        }
    };

    const postReq = async () => {
        const postData = {
            checkboxStatusUp: { rank1: true, rank2: true, rank3: true, rank4: true },
            checkboxStatusTup: { rank1: false, rank2: false, rank3: false, rank4: false },
            checkboxStatusDown: { rank1: true, rank2: true, rank3: true, rank4: true },
            rankRange: { rank1: [1, 14], rank2: [15, 25], rank3: [26, 54], rank4: [55, 80] }
        }
        const res = await axios.post(`${API}/industryChartData/getThemes`, postData)
        setSectorsRanksThemes(res.data.topThemes)
    }

    const fetchData = async () => {
        const res = await axios.get(`${API}/industry/stockSectors`);
        setStockSectors(res.data);
        const response = await axios.get(`${API}/formula/stockSearchInfo`);
        setSearchInfo(response.data);

        const ScheduleItemEvent = await axios.get(`${API}/schedule/StockEvent`);
        setScheduleItemEvent(ScheduleItemEvent.data);

        const ABC = await axios.get(`${API}/abc/themeBySecByItem`);
        setABC1(ABC.data[0].data);
        setABC2(ABC.data[1].data);
        // return { data1: response.data[0], data2: response.data[1] };
        postReq();
        getPost();
    }
    useEffect(() => { fetchData() }, [])

    useEffect(() => {

        if (filteredStockTable && filteredStockTable.length > 0) {
            if (filteredCheckName.key === '업종') {
                findSectorsByItem(filteredCheckName.name);
            } else if (filteredCheckName.key === '테마') {
                findThemeByItem(filteredCheckName.name);
            } else if (filteredCheckName.key === '트리맵') {
                setFilteredStockTable(filteredCheckName.name);
            }
        }

        if (Array.isArray(ABC1) && Array.isArray(ABC2) && Array.isArray(topThemes) && Array.isArray(sectorsThemes)) {
            // 각각에 대해 중복 키워드 검색
            let keywordCounts = {};
            // 각 배열에 대해 순회를 시작
            [ABC1, ABC2, topThemes, sectorsThemes].forEach(arr => {
                arr.forEach(item => {
                    // 'theme' 또는 '테마' 키워드를 사용
                    let keyword = item.theme || item.테마명;
                    // 키워드가 keywordCounts에 이미 존재하면 값을 증가시키고, 그렇지 않으면 1로 설정
                    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
                });
            });
            // console.log(keywordCounts) => {2차전지: 1}, {2019 하반기 상장: 2}, {2020 상반기 상장: 1}, {GTX: 3}, {건설 중소형: 4}

            // 2번 이상 등장한 키워드만 선택.
            let repeatedKeywords = Object.keys(keywordCounts).filter(keyword => keywordCounts[keyword] >= 2);
            setRepeatedKeyword(repeatedKeywords)
        }

    }, [ABC1, ABC2, topThemes, sectorsThemes]);

    // Table Colums
    const sectorsTableColumns = [ // 왼쪽 업종명/전일대비
        { field: '업종명', headerName: '업종명', width: 72 },
        {
            field: "전일대비",
            headerName: "전일대비",
            width: 60,
            renderCell: (params) => {
                const progress = renderProgress({ value: params.value, valueON: true, color: '#e89191', val2: 8 })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                            {params.value.toFixed(2)} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
    ];
    const filteredStockTableCol = [ // 가운데 종목/등락률/전일대비
        { field: '종목명', headerName: '종목명', width: 73 },
        {
            field: '등락률', headerName: '등락률', width: 30,
            renderCell: (params) => {
                const row = params.row;
                const progress = renderProgress({ value: row.changeRate, valueON: true, val2: 5, color: '#e89191' })
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
        },
        {
            field: '전일대비거래량', headerName: '전일대비', width: 55, renderCell: (params) => {
                const row = params.row;
                const progress = renderProgress({ value: row.volume, valueON: true, val2: 5, color: '#91bde8' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {parseInt(params.value * 100).toLocaleString('kr')} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
    ]
    const stockColumns = [ // M1, M2, P#, 업종명, 종목명, 등락률, 전일대비
        { field: 'M1', headerName: 'M1', width: 35, minWidth: 5 },
        { field: 'M2', headerName: 'M2', width: 35, minWidth: 5 },
        { field: '인기', headerName: 'P#', width: 40, minWidth: 5 },
        { field: '업종명', headerName: '업종명', width: 95 },
        {
            field: '종목명', headerName: '종목명', width: 95,
            renderCell: (params) => {
                const row = params.row;
                const progress = renderProgress({ value: row.전일대비거래량, valueON: true, color: 'rgba(146, 189, 232, 0.32)' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {params.value}
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>

                )
            },
        },
        {
            field: "종목 등락률", headerName: "등락률", width: 55, valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${params.value.toFixed(1)} %`;
            },
            renderCell: (params) => {
                const progress = renderProgress({ value: params.value, valueON: true, color: '#e89191', val2: 5 })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                            {params.value.toFixed(1)} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 80, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: "전일대비거래량", headerName: "전일대비%", width: 60,
            renderCell: (params) => {
                const progress = renderProgress({ value: params.value, valueON: true })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1, marginLeft: 0.5 }}>
                            {(parseInt(params.value)).toLocaleString('kr')} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 60, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        }
    ];
    const themeTableCol = [ // 테마리스트 테마명/등락률/순위
        { field: '테마명', headerName: '테마명', width: 190, minWidth: 5 },
        {
            field: '등락률', headerName: '등락률', width: 80, minWidth: 5, valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${params.value.toFixed(2)} %`;
            }
        },
        { field: '순위', headerName: '순위', width: 90, minWidth: 5 },
        // { field: '전일순위', headerName: '전일순위', width: 100, minWidth: 5 },
    ]

    return (
        <Grid container spacing={1} sx={{ backgroundColor: '#fff' }}>
            {/* 업종/전일대비 Table */}
            <Grid item xs={1}>
                <div style={{ height: "74svh", width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={StockSectors.slice(0, StockSectors.length - 12)} hideFooter rowHeight={16} columns={sectorsTableColumns}
                            onCellClick={(params, event) => {
                                if (params.field === '업종명') {
                                    findSectorsByItem(params.value);
                                    setFilteredCheckName({ key: '업종', name: params.value })
                                    axios.get(`${API}/info/Search/IndustryThemes?industryName=${params.value}`).then(res => {
                                        setFilteredThemeTable(res.data);
                                    });
                                }
                            }}
                            getCellClassName={(params) => {
                                if (params.id === 0) return '';
                                if ((params.id + 1) % 60 === 0) return 'bottom-line-60';
                                if ((params.id + 1) % 50 === 0) return 'bottom-line-50';
                                if ((params.id + 1) % 40 === 0) return 'bottom-line-40';
                                if ((params.id + 1) % 30 === 0) return 'bottom-line-30';
                                if ((params.id + 1) % 20 === 0) return 'bottom-line-20';
                                if ((params.id + 1) % 10 === 0) return 'bottom-line-10';
                                return '';
                                // return params.id % 10 === 0 ? 'bottom-line' : '';
                            }}
                            sx={{
                                ...DataTableStyleDefault,
                                '.bottom-line-10': { borderBottom: '2px solid red' },
                                '.bottom-line-20': { borderBottom: '2px solid orange' },
                                '.bottom-line-30': { borderBottom: '2px solid gold' },
                                '.bottom-line-40': { borderBottom: '2px solid green' },
                                '.bottom-line-50': { borderBottom: '2px solid dodgerblue' },
                                '.bottom-line-60': { borderBottom: '2px solid purple' },
                            }} />
                    </ThemeProvider>
                </div>
                <div style={{ height: "24svh", width: "100%", marginTop: '10px' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={StockSectors.slice(StockSectors.length - 12)} columns={sectorsTableColumns} hideFooter rowHeight={16}
                            onCellClick={(params, event) => {
                                if (params.field === '업종명') {
                                    findSectorsByItem(params.value);
                                    setFilteredCheckName({ key: '업종', name: params.value })
                                    axios.get(`${API}/info/Search/IndustryThemes?industryName=${params.value}`).then(res => {
                                        setFilteredThemeTable(res.data);
                                    });
                                }
                            }}
                            sx={DataTableStyleDefault} />
                    </ThemeProvider>
                </div>

            </Grid>

            {/* Theme Top10/12 Tables */}
            <Grid item xs={3} >
                <Grid item>
                    <SortItem sx={{ marginTop: '7px' }}>
                        <SortItemTitle>업종 Top 10</SortItemTitle>
                        <table style={{ width: '100%', color: 'black' }}>
                            <tbody>
                                {Array.isArray(sectorsThemes)
                                    ? sectorsThemes.map((item, index) => {
                                        const firstItem = item.items && item.items[0] ? item.items[0] : null;
                                        const secondItem = item.items && item.items[1] ? item.items[1] : null;
                                        return (
                                            <tr key={index}>
                                                <td style={tableStyles.themeCount}>{item.count}</td>
                                                <td style={{ backgroundColor: repeatedKeyword.includes(item.theme) ? 'rgba(146, 189, 232, 0.32)' : null, ...tableStyles.themeName }}
                                                    onClick={() => { findThemeByItem(item.theme); setFilteredCheckName({ key: '테마', name: item.theme }) }}
                                                >{item.theme.slice(0, 6)}</td>
                                                {firstItem && (
                                                    <>
                                                        <td style={tableStyles.itemName}
                                                            onClick={() => { stockItemSelected({ 종목코드: firstItem.종목코드, 종목명: firstItem.item, 업종명: firstItem.업종명 }); }}
                                                        >{firstItem.종목명.slice(0, 6)}</td>
                                                        <td style={tableStyles.itemChangeRate} >{firstItem.등락률.toFixed(2)}</td>
                                                        <td style={tableStyles.itemVolume} >{parseInt(firstItem.전일대비거래량 * 100).toLocaleString('kr')}</td>
                                                    </>
                                                )}
                                                {secondItem && (
                                                    <>
                                                        <td style={tableStyles.itemName}
                                                            onClick={() => { stockItemSelected({ 종목코드: secondItem.종목코드, 종목명: secondItem.item, 업종명: secondItem.업종명 }); }}
                                                        >{secondItem.종목명.slice(0, 6)}</td>
                                                        <td style={tableStyles.itemChangeRate} >{secondItem.등락률.toFixed(2)}</td>
                                                        <td style={tableStyles.itemVolume} >{parseInt(secondItem.전일대비거래량 * 100).toLocaleString('kr')}</td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })
                                    : <tr><td>Loading...</td></tr>
                                }
                            </tbody>
                        </table>
                    </SortItem>
                </Grid>

                <Grid item>
                    <SortItem>
                        <SortItemTitle>종목 Top 10</SortItemTitle>
                        <table style={{ width: '100%', color: 'black' }}>
                            <tbody>
                                {Array.isArray(topThemes)
                                    ? topThemes.map((item, index) => (
                                        <tr key={index}>
                                            <td style={tableStyles.themeCount}>{item.count}</td>
                                            <td style={{ backgroundColor: repeatedKeyword.includes(item.theme) ? 'rgba(146, 189, 232, 0.32)' : null, ...tableStyles.themeName }}
                                                onClick={() => { findThemeByItem(item.theme); setFilteredCheckName({ key: '테마', name: item.theme }) }}
                                            >{item.theme.slice(0, 6)}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { stockItemSelected({ 종목코드: item.items[0].종목코드, 종목명: item.items[0].종목명, 업종명: item.items[0].업종명 }); }}
                                            >{item.items[0].종목명.slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item.items[0].등락률.toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item.items[0].전일대비거래량 * 100).toLocaleString('kr')}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { stockItemSelected({ 종목코드: item.items[1].종목코드, 종목명: item.items[1].종목명, 업종명: item.items[1].업종명 }); }}
                                            >{item.items[1].종목명.slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item.items[1].등락률.toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item.items[1].전일대비거래량 * 100).toLocaleString('kr')}</td>
                                        </tr>
                                    )) : <tr><td>Loading...</td></tr>
                                }
                            </tbody>
                        </table>
                    </SortItem>
                </Grid>

                <Grid item>
                    <SortItem>
                        <SortItemTitle>ABC1 Top 12</SortItemTitle>
                        <table style={{ width: '100%', color: 'black' }}>
                            <tbody>
                                {ABC1
                                    ? ABC1.slice(0, 12).map((item, index) => (
                                        <tr key={index}>
                                            <td style={tableStyles.themeCount}>{item.index}</td>
                                            <td style={{ backgroundColor: repeatedKeyword.includes(item.테마명) ? 'rgba(146, 189, 232, 0.32)' : null, ...tableStyles.themeName }}
                                                onClick={() => { findThemeByItem(item.테마명); setFilteredCheckName({ key: '테마', name: item.테마명 }) }}
                                            >{item.테마명.slice(0, 6)}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { getSectorNameAndCode(item['주도주 1순위']) }}
                                            >{item['주도주 1순위'].slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item['등략률1'].toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item['거래량%1']).toLocaleString('kr')}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { getSectorNameAndCode(item['주도주 2순위']) }}
                                            >{item['주도주 2순위'].slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item['등락률2'].toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item['거래량%2']).toLocaleString('kr')}</td>
                                        </tr>
                                    )) : <tr><td>Loading...</td></tr>
                                }
                            </tbody>
                        </table>
                    </SortItem>
                    <SortItem>
                        <SortItemTitle>ABC2 Top 12</SortItemTitle>
                        <table style={{ width: '100%', color: 'black' }}>
                            <tbody>
                                {ABC2
                                    ? ABC2.slice(0, 12).map((item, index) => (
                                        <tr key={index}>
                                            <td style={tableStyles.themeCount}>{item.index}</td>
                                            <td style={{ backgroundColor: repeatedKeyword.includes(item.테마명) ? 'rgba(146, 189, 232, 0.32)' : null, ...tableStyles.themeName }}
                                                onClick={() => { findThemeByItem(item.테마명); setFilteredCheckName({ key: '테마', name: item.테마명 }) }}
                                            >{item.테마명.slice(0, 6)}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { getSectorNameAndCode(item['주도주 1순위']) }}
                                            >{item['주도주 1순위'].slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item['등략률1'].toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item['거래량%1']).toLocaleString('kr')}</td>
                                            <td style={tableStyles.itemName}
                                                onClick={() => { getSectorNameAndCode(item['주도주 2순위']) }}
                                            >{item['주도주 2순위'].slice(0, 6)}</td>
                                            <td style={tableStyles.itemChangeRate} >{item['등락률2'].toFixed(2)}</td>
                                            <td style={tableStyles.itemVolume} >{parseInt(item['거래량%2']).toLocaleString('kr')}</td>
                                        </tr>
                                    )) : <tr><td>Loading...</td></tr>
                                }
                            </tbody>
                        </table>
                    </SortItem>
                </Grid>
            </Grid>

            {/* filteredStockTable + M1, M2, P# Table */}
            <Grid item xs={4.8} >
                <Grid container spacing={1} >
                    {/* filteredStockTable 종목명/등락률/전일대비 */}
                    <Grid item xs={3.5} >
                        <div style={{ height: "49vh", width: "100%" }}
                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                        >
                            <ThemeProvider theme={customTheme}>
                                <DataGrid rows={filteredStockTable} columns={filteredStockTableCol} hideFooter rowHeight={16}
                                    onCellClick={(params, event) => {
                                        let item = params.row.item;
                                        let itemStr = "" + item;
                                        stockItemSelected({ 종목코드: params.row.종목코드, 종목명: itemStr, 업종명: params.row.업종명 });
                                    }}
                                    sx={DataTableStyleDefault} />
                            </ThemeProvider>
                        </div>
                    </Grid>

                    {/* M1, M2, P# Table */}
                    <Grid item xs={8.5} >
                        <Grid container sx={{ width: "100%" }}>
                            <Grid item xs={10} sx={{ height: "49vh", width: "100%" }}
                                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                            >
                                <ThemeProvider theme={customTheme}>
                                    <DataGrid rows={tableM1M2} columns={stockColumns} hideFooter rowHeight={16}
                                        // <DataGrid rows={sortedRows} columns={stockColumns} hideFooter rowHeight={28}
                                        onCellClick={(params, event) => {
                                            if (params.field === '종목명') {
                                                stockItemSelected({ 종목코드: params.row.종목코드, 종목명: params.value, 업종명: params.row.업종명 });
                                                setStockName(params.value)
                                                axios.get(`${API}/info/Search/StockThemes?stockName=${params.value}`).then(res => {
                                                    setFilteredThemeTable(res.data);
                                                });

                                            }
                                            if (params.field === '업종명') {
                                                findSectorsByItem(params.value);
                                                setFilteredCheckName({ key: '업종', name: params.value })
                                                axios.get(`${API}/info/Search/IndustryThemes?industryName=${params.value}`).then(res => {
                                                    setFilteredThemeTable(res.data);
                                                });

                                            }
                                        }}
                                        sx={DataTableStyleDefault} />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={1} sx={{ height: "49vh", width: "100%" }}>
                                <Slider
                                    value={ratioRange}
                                    orientation="vertical"
                                    onChange={handleChangeRatioRange}
                                    valueLabelDisplay="auto"
                                    disableSwap
                                    step={1}
                                    min={0}
                                    max={30}
                                    marks={marks}
                                    sx={{ height: '90%', marginTop: 4, marginLeft: 2, color: '#c4463a' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Selected Toggle BTN */}
                    <Grid item xs={3.5}>
                        <ToggleButtonGroup
                            size="small"
                            color='info'
                            // orientation="vertical"
                            value={togglePage}
                            exclusive
                            onChange={(event, newAlignment) => handleTogglePage(event, newAlignment)}
                            aria-label="Platform"
                        >
                            <StyledToggleButton2 value="TreeMap">Tree Map</StyledToggleButton2>
                            <StyledToggleButton2 value="Bar">Bar</StyledToggleButton2>
                            <StyledToggleButton2 value="Search">Search</StyledToggleButton2>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={8.5} sx={{ fontSize: '11px' }}>
                        <Virtualize SearchInfo={SearchInfo} stockName={stockName}
                            onGetComponentEvent={handleGetComponentEvent}
                            onSelectedStockName={onSelectedStockName}
                            setFilteredThemeTable={setFilteredThemeTable}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ fontSize: '11px', height: "44vh" }}>

                        {
                            togglePage === 'Search' ?
                                <>
                                    <Grid container sx={{ height: '42vh' }}>
                                        <Grid item xs={6}>
                                            <div style={{ height: "42vh", width: "100%" }}
                                                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                            >
                                                <ThemeProvider theme={customTheme}>
                                                    <DataGrid rows={filteredThemeTable} columns={themeTableCol} hideFooter rowHeight={17}
                                                        sortModel={[{ field: '등락률', sort: 'desc', },]} sortingOrder={['desc', 'asc']}
                                                        onCellClick={(params, event) => {
                                                            if (params.field === '테마명') {
                                                                findThemeByItem(params.value);
                                                                setFilteredCheckName({ key: '테마', name: params.value })
                                                            }
                                                        }}
                                                        sx={DataTableStyleDefault} />
                                                </ThemeProvider>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            {searchItemPage ?
                                                searchItemEvent ?
                                                    searchItemEvent.data.map((item, index) => (
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12} sx={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '5px' }}>
                                                                {searchItemEvent.stockName} 향후 일정
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Grid container spacing={1} key={index}>
                                                                    <Grid item xs={6} >
                                                                        <div>{item.date}</div>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <div>{item.event}</div>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )) : <div>선택된 종목의 일정이 없습니다.</div>
                                                : <div></div>
                                            }
                                            <ThemeProvider theme={AccordionTheme}>
                                                <Accordion >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                        sx={{ height: 20 }}
                                                    >
                                                        <Typography
                                                            display="block"
                                                            variant="caption"
                                                            sx={{ lineHeight: 20 }}
                                                        >
                                                            Filter
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid item xs={11}>
                                                            <Slider
                                                                value={volumeRange}
                                                                onChange={handleChangeVolume}
                                                                step={5}
                                                                valueLabelDisplay="auto"
                                                                disableSwap
                                                                min={0}
                                                                max={1000}
                                                                sx={{ color: 'dodgerblue' }}
                                                            />
                                                        </Grid>

                                                        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />} useFlexGap flexWrap="wrap">
                                                            <FilterItem>
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={7}>
                                                                        <FilterComponet primary="전일대비거래량" />
                                                                        <li>
                                                                            <Typography
                                                                                sx={{ mt: 0.5, ml: 2 }}
                                                                                display="block"
                                                                                variant="caption"
                                                                            >
                                                                                {parseInt(volumeRange[0])}% ~ {parseInt(volumeRange[1])}%
                                                                            </Typography>
                                                                        </li>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <FormControl component="fieldset">
                                                                            <FormControlLabel
                                                                                control={<Switch checked={volumeRangeChecked} onChange={handleChangeVolumeCheck} />}
                                                                                label="Max"
                                                                                sx={{ fontSize: '11px', color: 'dodgerblue' }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </FilterItem>
                                                            <FilterItem>
                                                                <FilterComponet primary="5일 평균거래량" />
                                                                <IconButton size='small'
                                                                    onClick={() => handleFocusVolumeAvg(-5000)}>
                                                                    <KeyboardArrowDown />
                                                                </IconButton>
                                                                {volumeAvg.toLocaleString('ko-KR')}
                                                                <IconButton size='small' onClick={() => handleFocusVolumeAvg(+5000)}>
                                                                    <KeyboardArrowUp />
                                                                </IconButton>
                                                                주 이상
                                                            </FilterItem>
                                                            <FilterItem>
                                                                <FilterComponet primary="유보율" />
                                                                <IconButton size='small'
                                                                    onClick={() => handleFocusReserveRatio(-50)}>
                                                                    <KeyboardArrowDown />
                                                                </IconButton>
                                                                {reserveRatio}
                                                                <IconButton size='small' onClick={() => handleFocusReserveRatio(+50)}>
                                                                    <KeyboardArrowUp />
                                                                </IconButton>
                                                                % 이상
                                                            </FilterItem>
                                                            <FilterItem>
                                                                <FilterComponet primary="부채비율" />
                                                                <IconButton size='small'
                                                                    onClick={() => handleDebtRatio(-50)}
                                                                >
                                                                    <KeyboardArrowDown />
                                                                </IconButton>
                                                                {debtRatio} % 이하
                                                                <IconButton size='small'
                                                                    onClick={() => handleDebtRatio(+50)}
                                                                >
                                                                    <KeyboardArrowUp />
                                                                </IconButton>

                                                            </FilterItem>
                                                            <FilterItem>
                                                                <FilterComponet primary="시가총액" />
                                                                <IconButton size='small'
                                                                    onClick={() => handleFocusMarketCap('Min', -50)}>
                                                                    <KeyboardArrowDown />
                                                                </IconButton>
                                                                {marketCap[0] / 100000000}억
                                                                <IconButton size='small' onClick={() => handleFocusMarketCap('Min', +50)}>
                                                                    <KeyboardArrowUp />
                                                                </IconButton>
                                                                ~
                                                                <IconButton size='small'
                                                                    onClick={() => handleFocusMarketCap('Max', -500)}>
                                                                    <KeyboardArrowDown />
                                                                </IconButton>
                                                                {marketCap[1] / 100000000}억
                                                                <IconButton size='small' onClick={() => handleFocusMarketCap('Max', +500)}>
                                                                    <KeyboardArrowUp />
                                                                </IconButton>
                                                            </FilterItem>
                                                        </Stack>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </ThemeProvider>
                                        </Grid>
                                    </Grid>
                                </> : togglePage === 'Bar' ?
                                    <>
                                        {SectorsRanksThemes.rank1 ? <ColumnChart sectorsRanksThemes={SectorsRanksThemes} height={400}
                                            backgroundColor={'white'} sliderColor={'#c4463a'} fontColor={'black'} onThemeClick={onThemeClick}
                                        /> : <div>Loading...</div>}
                                    </> : togglePage === 'TreeMap' ?
                                        <>
                                            {SectorsRanksThemes.rank1 ? <TreeMap sectorsRanksThemes={SectorsRanksThemes}
                                                backgroundColor={'white'} sliderColor={'#c4463a'} fontColor={'black'} onThemeClick={onThemeClick}
                                            /> : <div>Loading...</div>}
                                        </> : <div>Loading...</div>
                        }
                    </Grid>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid item xs={3.2} >
                <StockItemTitle>{stockItem}</StockItemTitle>

                <StockChart stockItemData={stockItemData.slice(-300)} volumeData={stockVolumeData.slice(-300)} timeSeries={stockItem} />
                <StockChart stockItemData={stockItemData} volumeData={stockVolumeData} timeSeries={stockItem} rangeSelect={4} />

                <StockItemTitle>{SectorsName} : {stockItem}</StockItemTitle>
                <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} />
            </Grid>
        </Grid>

    );
}
// CSS
const StyledToggleButton2 = styled(ToggleButton)(({ theme }) => ({
    fontSize: '10px',
    backgroundColor: 'white', // 비활성화 상태에서의 배경색
    color: '#000', // 비활성화 상태에서의 글자색
    '&.Mui-selected': { // 활성화 상태에서의 스타일
        backgroundColor: '#91bde8', // 활성화 상태에서의 배경색
        color: '#000', // 활성화 상태에서의 글자색
        '&:hover': { // 마우스 오버 상태에서의 스타일
            backgroundColor: '#6ca6e0', // 마우스 오버 상태에서의 배경색
        },
    },
    '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
        backgroundColor: '#bcd6f1', // 비활성화 상태에서의 마우스 오버 배경색
    },
}));

// DataTable Style Default
const DataTableStyleDefault = {
    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '.MuiDataGrid-columnHeaders': {
        minHeight: '30px !important',  // 원하는 높이 값으로 설정
        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
        backgroundColor: 'rgba(230, 230, 230, 0.3)'
    },
}

const StockItemTitle = styled('div')(({ theme }) => ({
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: 'bold',
}));

const FilterItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingLeft: 7,
    textAlign: 'left',
    // color: theme.palette.text.secondary,
    flexGrow: 1,
}));

const SortItem = styled('div')(({ theme }) => ({
    // marginTop: 3,
    marginLeft: 10,
    // paddingTop: theme.spacing(0.1),
    paddingRight: theme.spacing(0.5),
    // paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    textAlign: 'left',
    fontSize: '10.5px',
}));

const SortItemTitle = styled('div')(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: theme.spacing(0.3),
    textAlign: 'left',
    fontSize: '12px',
    borderBottom: '1px solid #000000',
    color: 'black'
}));

const tableStyles = {
    themeCount: { fontSize: '9px', width: 30, textAlign: 'center', borderBottom: '0.6px solid #ccc' },
    themeName: { fontSize: '9px', width: 80, borderBottom: '0.6px solid #ccc' },
    itemName: { fontSize: '9px', width: 94, paddingLeft: 5, borderLeft: '0.6px solid #ccc', borderBottom: '0.6px solid #ccc' },
    itemChangeRate: { fontSize: '9px', textAlign: 'right', borderBottom: '0.6px solid #ccc', backgroundColor: 'rgba(0, 0, 0, 0.015)' },
    itemVolume: { fontSize: '9px', width: 45, paddingRight: 5, textAlign: 'right', borderBottom: '0.6px solid #ccc' },
}

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '9px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '9px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                },
            },
            defaultProps: {
                headerHeight: 15,
            },
        },
    },
});

const ProgressBar = styled('div')(({ theme, value, val2, color }) => {
    const valueInPercent = value * (val2 || 50);

    return {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: '2px',
        height: 26,
        borderRadius: 2,
        '& .value': {
            position: 'absolute',
            lineHeight: '24px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },
        '& .bar': {
            height: '100%',
            backgroundColor: (() => {
                if (valueInPercent < 0) {
                    return 'dodgerblue';
                }
                if (valueInPercent >= 50) {
                    return color || '#088208a3';
                }
                return color || '#088208a3';
            })(),
            maxWidth: `${Math.abs(valueInPercent)}%`,
        },
    };
});

const CustomProgressBar = React.memo(function CustomProgressBar(props) {
    const { value, valueON = false, color = '#91bde8', val2 } = props;
    return (
        valueON === true ?
            <ProgressBar value={value} val2={val2 || 0.1} color={color} >
                <div className="bar" />
            </ProgressBar>
            : <ProgressBar value={value} val2={3} color={color} >
                <div className="value">{`${value.toLocaleString('ko-kr')} %`}</div>
                <div className="bar" />
            </ProgressBar>
    );
});

export function renderProgress(params) {
    const { valueON, color, val2 } = params;
    return <CustomProgressBar value={Number(params.value)} valueON={valueON} color={color} val2={val2} />;
}


// 필터 컴포넌트
const FilterComponet = ({ primary }) => (
    <>
        <ListItem>
            <ListItemText primary={primary} primaryTypographyProps={{ fontSize: '11px', fontWeight: '600', lineHeight: '0px', textAlign: 'left' }} />
        </ListItem>
        <Divider component="li" style={{ backgroundColor: 'lightgrey', height: 1 }} />
    </>
)


const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});


export function Virtualize({ SearchInfo, stockName, onGetComponentEvent, onSelectedStockName, setFilteredThemeTable }) {
    const [value, setValue] = useState(null);
    const [selectedStockName, setSelectedStockName] = useState(stockName);

    useEffect(() => {
        if (selectedStockName) {
            axios.get(`${API}/info/Search/StockThemes?stockName=${selectedStockName}`).then(res => {
                setFilteredThemeTable(res.data);
            });
        }
    }, [selectedStockName])

    useEffect(() => {
        setSelectedStockName(stockName);
    }, [stockName])

    const handleGetComponentEvent = (event) => {
        onGetComponentEvent(event)
    }
    // 중복된 항목 수를 세는 helper 함수
    const countOccurrences = (arr) => {
        return arr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
    };
    // 중복된 search 항목 수를 계산
    const occurrences = countOccurrences(SearchInfo.map(item => item.search));
    const SelectedStockItemStyle = styled('div')(({ theme }) => ({
        padding: theme.spacing(1),
        // paddingLeft: 7,
        textAlign: 'center',
        // color: theme.palette.text.secondary,
        flexGrow: 1,
        fontSize: '14px',
        fontWeight: 600,
        border: 0
    }));
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3.5}>
                    <SelectedStockItemStyle>
                        {selectedStockName}
                    </SelectedStockItemStyle>
                </Grid>
                <Grid item xs={8.5} sx={{ zIndex: 5 }}>
                    <Autocomplete
                        size="small"
                        id="virtualize-demo"
                        disableListWrap
                        // clearOnEscape
                        // ListboxComponent={ListboxComponent}
                        PopperComponent={StyledPopper}
                        options={SearchInfo}
                        renderInput={(params) => <TextField {...params} variant="standard" sx={{
                            '& .MuiInputBase-root': { // 이 부분에서 Input 요소의 높이를 조절합니다.
                                height: 30,
                                fontSize: '11px',
                            },
                            '& .MuiFormLabel-root.MuiInputLabel-shrink': { // 이 부분에서 Label 요소의 높이를 조절합니다.
                                transform: 'translate(0, 1.5px) scale(0.75)',
                            },
                            // fontSize: '10px',
                        }} label="종목명 / 업종명 / 테마명" />}
                        getOptionLabel={(option) => occurrences[option?.search] > 1 ? `${option?.search} - ${option?.separator}` : option?.search}
                        value={value}
                        isOptionEqualToValue={(option, value) => option.search === value.search && option.separator === value.separator}
                        onChange={async (event, newValue) => {
                            // setValue(newValue)
                            if (newValue.separator === '종목') {
                                setSelectedStockName(newValue.search);// 여기서 종목이 선택되면 stockName 상태를 업데이트
                                onSelectedStockName(newValue.search)
                                // setStockName(newValue.search); 

                            } else if (newValue.separator === '업종') {
                                handleGetComponentEvent({ separator: '업종', value: newValue.search })
                                // findSectorsByItem(newValue.search);
                            } else if (newValue.separator === '테마') {
                                handleGetComponentEvent({ separator: '테마', value: newValue.search })
                                // findThemeByItem(newValue.search);
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

// 등락률 Marks
const marks = [
    { value: 5, label: '5', },
    { value: 10, label: '10', },
    { value: 15, label: '15', },
    { value: 20, label: '20', },
    { value: 25, label: '25', },
    { value: 30, label: '30', },
];

const AccordionTheme = createTheme({
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: '30px', // 원하는 높이로 조절하세요.
                    '&$expanded': {
                        minHeight: '30px',
                    },
                },
                content: {
                    margin: '0px', // 원하는 마진으로 조절하세요.
                    '&$expanded': {
                        margin: '0px',
                    },
                },
            },
        },
    },
});












































































// const LISTBOX_PADDING = 8; // px

// function renderRow(props) {
//     const { data, index, style } = props;
//     const dataSet = data[index];
//     const inlineStyle = {
//         ...style,
//         top: style.top + LISTBOX_PADDING,
//     };

//     if (dataSet.hasOwnProperty('group')) {
//         return (
//             <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
//                 {dataSet.group}
//             </ListSubheader>
//         );
//     }

//     return (
//         <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
//             {`#${dataSet[2] + 1} - ${dataSet[1]}`}
//         </Typography>
//     );
// }

// const OuterElementContext = React.createContext({});

// const OuterElementType = React.forwardRef((props, ref) => {
//     const outerProps = React.useContext(OuterElementContext);
//     return <div ref={ref} {...props} {...outerProps} />;
// });

// function useResetCache(data) {
//     const ref = React.useRef(null);
//     React.useEffect(() => {
//         if (ref.current != null) {
//             ref.current.resetAfterIndex(0, true);
//         }
//     }, [data]);
//     return ref;
// }

// Adapter for react-window
// const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
//     const { children, ...other } = props;
//     const itemData = [];
//     children.forEach((item) => {
//         itemData.push(item);
//         itemData.push(...(item.children || []));
//     });

//     const theme = useTheme();
//     const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
//         noSsr: true,
//     });
//     const itemCount = itemData.length;
//     const itemSize = smUp ? 36 : 48;

//     const getChildSize = (child) => {
//         if (child.hasOwnProperty('group')) {
//             return 48;
//         }

//         return itemSize;
//     };

//     const getHeight = () => {
//         if (itemCount > 8) {
//             return 8 * itemSize;
//         }
//         return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
//     };

//     const gridRef = useResetCache(itemCount);

//     return (
//         <div ref={ref}>
//             <OuterElementContext.Provider value={other}>
//                 <VariableSizeList
//                     itemData={itemData}
//                     height={getHeight() + 2 * LISTBOX_PADDING}
//                     width="100%"
//                     ref={gridRef}
//                     outerElementType={OuterElementType}
//                     innerElementType="ul"
//                     // itemSize={(index) => getChildSize(itemData[index])}
//                     itemSize={(index) => {
//                         const size = getChildSize(itemData[index]);
//                         if (typeof size !== 'number' || isNaN(size)) {
//                             // Replace 'unknown' with an appropriate default size
//                             return 'unknown';
//                         }
//                         return size;
//                     }}
//                     overscanCount={5}
//                     itemCount={itemCount}
//                 >
//                     {renderRow}
//                 </VariableSizeList>
//             </OuterElementContext.Provider>
//         </div>
//     );
// });

// ListboxComponent.propTypes = {
//     children: PropTypes.node,
// };