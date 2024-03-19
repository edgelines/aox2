import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './util/config';
import { Box, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { debounce } from 'lodash';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'bootstrap/dist/css/bootstrap.min.css';
// import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import SectorChart from './SectorsPage/sectorChart';
import TreeMap from './SectorsPage/treeMap'
// import ColumnChart from './SectorsPage/columnChart';
import BpCheckbox from './util/checkBtn';
import NewKospi200Group, { BubbleChartLegend } from './util/BubbleChart'
import { TitleComponet } from './util/util';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import axios from 'axios';

export default function SectorsChartPage({
    // Kospi200BubbleCategoryGruop,
    // onCheckboxStatusUp, onCheckboxStatusDown, onCheckboxStatusTup, onCheckboxAll,
    // filteredChartData,  checkboxStatusUp, checkboxStatusDown, checkboxStatusTup, checkboxAll
}) {
    const [togglePage, setTogglePage] = useState('Bubble');
    const [filteredStockTable, setFilteredStockTable] = useState([]); // 필터링된 종목 Table
    const [preset, setPreset] = useState('C')
    const [Kospi200BubbleCategoryGruop, setKospi200BubbleCategoryGruop] = useState([]);
    // togglePage BTN
    const handleTogglePage = async (event, newAlignment) => {
        if (newAlignment !== null) { setTogglePage(newAlignment); }
        if (newAlignment === 'Bubble') {
            const res = await axios.get(`${API}/BubbleDataCategoryGroup`);
            setKospi200BubbleCategoryGruop(res.data);
        }
    }

    // sectorsChartPage State
    // const handleCheckboxStatusUp = (data) => { setCheckboxStatusUp(data) }
    // const handleCheckboxStatusDown = (data) => { setCheckboxStatusDown(data) }
    // const handleCheckboxStatusTup = (data) => { setCheckboxStatusTup(data) }
    // const handleCheckboxStatusAll = (data) => { setCheckboxAll(data) }
    // const [SectorsChartData, setSectorsChartData] = useState([]);
    const [checkboxStatusUp, setCheckboxStatusUp] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // 전일대비 순위가 상승한 업종
    const [checkboxStatusTup, setCheckboxStatusTup] = useState({ rank1: false, rank2: false, rank3: false, rank4: false }); // TOM 대비 순위가 상승한 업종
    const [checkboxStatusDown, setCheckboxStatusDown] = useState({ rank1: true, rank2: true, rank3: true, rank4: true }); // 전일대비 순위가 하락한 업종

    const [checkboxAll, setCheckboxAll] = useState({ up: false, down: false, tomUp: false, tomDown: false });
    const rankRange = { rank1: [1, 14], rank2: [15, 25], rank3: [26, 54], rank4: [55, 80] };
    const [filteredChartData, setFilteredChartData] = useState({
        반도체1: [], 반도체2: [], IT1: [], IT2: [], 조선: [], 건설1: [], 건설2: [], 금융: [], B2C: [], BIO1: [], BIO2: [], 식품: [], 아웃도어1: [], 아웃도어2: []
    });
    // 각 구간별 CheckBox BTN을 통해 필터된 업종들
    const [sectorsRanksThemes, setSectorsRanksThemes] = useState([]);

    // Check Box Function
    const handleCheckboxChange = (rank, check) => {
        if (check === 'up') {
            setCheckboxStatusUp((prevStatus) => ({
                ...prevStatus,
                [rank]: !prevStatus[rank]
            }));
        } else if (check === 'down') {
            setCheckboxStatusDown((prevStatus) => ({
                ...prevStatus,
                [rank]: !prevStatus[rank]
            }));
        } else if (check === 'tomUp') {
            setCheckboxStatusTup((prevStatus) => ({
                ...prevStatus,
                [rank]: !prevStatus[rank]
            }));
        }
    };
    const handleCheckAllChange = (event, check) => {
        const newCheckedValue = event.target.checked;

        setCheckboxAll(prevState => ({ ...prevState, [check]: newCheckedValue }));

        if (check === 'up') {
            setCheckboxStatusUp({
                rank1: newCheckedValue,
                rank2: newCheckedValue,
                rank3: newCheckedValue,
                rank4: newCheckedValue
            });
        } else if (check === 'down') {
            setCheckboxStatusDown({
                rank1: newCheckedValue,
                rank2: newCheckedValue,
                rank3: newCheckedValue,
                rank4: newCheckedValue
            });
        } else if (check === 'tomUp') {
            setCheckboxStatusTup({
                rank1: newCheckedValue,
                rank2: newCheckedValue,
                rank3: newCheckedValue,
                rank4: newCheckedValue
            });
        }
    }
    const handlePreset = (event, value) => {
        if (value === 'A') {
            setCheckboxStatusUp({ rank1: true, rank2: true, rank3: true, rank4: true });
            setCheckboxStatusTup({ rank1: true, rank2: true, rank3: true, rank4: true });
            setCheckboxStatusDown({ rank1: false, rank2: false, rank3: false, rank4: false });
            setPreset(value);
        }
        else if (value === 'B') {
            setCheckboxStatusUp({ rank1: false, rank2: false, rank3: false, rank4: true });
            setCheckboxStatusTup({ rank1: false, rank2: false, rank3: false, rank4: true });
            setCheckboxStatusDown({ rank1: true, rank2: true, rank3: true, rank4: true });
            setPreset(value);
        }
        else if (value === 'C') {
            setCheckboxStatusUp({ rank1: true, rank2: true, rank3: true, rank4: true });
            setCheckboxStatusTup({ rank1: false, rank2: false, rank3: false, rank4: false });
            setCheckboxStatusDown({ rank1: true, rank2: true, rank3: true, rank4: true });
            setPreset(value);
        }

    }
    // Treemap에서 테마 클릭시 테마에 속한 종목들을 상위컴포넌트로 전달해주는 펑션
    const onThemeClick = (themeInStockData) => {
        const result = themeInStockData.map((item, index) => ({
            ...item,
            id: index,
        }));
        setFilteredStockTable(result);
    }
    const getBubbleData = async () => {
        const res = await axios.get(`${API}/BubbleDataCategory`);
        setKospi200BubbleCategoryGruop(res.data);
    }
    const postReq = async () => {
        const postData = {
            checkboxStatusUp: checkboxStatusUp,
            checkboxStatusTup: checkboxStatusTup,
            checkboxStatusDown: checkboxStatusDown,
            rankRange: rankRange
        }
        const res = await axios.post(`${API}/industryChartData/getThemes`, postData)
        // setSectorsChartData(res.data.origin);
        setFilteredChartData(res.data.industryGr);
        setSectorsRanksThemes(res.data.topThemes)
    }
    useEffect(() => { getBubbleData() }, [])
    // sectorsChartPage Render
    useEffect(() => {
        postReq();
    }, [checkboxStatusUp, checkboxStatusDown, checkboxStatusTup, checkboxAll])

    //Table Cols
    const filteredStockTableCol = [ // 가운데 종목/등락률/전일대비
        { field: 'item', headerName: '종목명', width: 120 },
        {
            field: 'changeRate', headerName: '등락률', width: 35,
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
            field: 'volume', headerName: '전일대비', width: 60, renderCell: (params) => {
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

    return (
        <Grid container spacing={0} sx={{ backgroundColor: '#404040' }}>
            {/* Sectors */}
            <Grid item xs={2.8}>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(255, 0, 0)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(255, 0, 0)')}>반도체</Box>
                        <SectorChart data={filteredChartData.반도체1} />
                        <SectorChart data={filteredChartData.반도체2} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid #efe9e9ed', borderRadius: '15px' }} >
                        <Box sx={label('#efe9e9ed')}>IT & Ent.</Box>
                        <SectorChart data={filteredChartData.IT1} />
                        <SectorChart data={filteredChartData.IT2} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(255, 132, 50)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(255, 132, 50)')}>B2C</Box>
                        <SectorChart data={filteredChartData.B2C} />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={2.8}>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(204, 204, 204)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(204, 204, 204)')}>건설</Box>
                        <SectorChart data={filteredChartData.건설1} />
                        <SectorChart data={filteredChartData.건설2} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(66, 221, 248)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(66, 221, 248)')}>조선</Box>
                        <SectorChart data={filteredChartData.조선} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(252, 120, 234)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(252, 120, 234)')}>Out Door</Box>
                        <SectorChart data={filteredChartData.아웃도어1} />
                        <SectorChart data={filteredChartData.아웃도어2} />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={2.8}>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(0, 179, 0)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(0, 179, 0)')}>BIO</Box>
                        <SectorChart data={filteredChartData.BIO1} />
                        <SectorChart data={filteredChartData.BIO2} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(238, 219, 48)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(238, 219, 48)')}>식품</Box>
                        <SectorChart data={filteredChartData.식품} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <Box sx={{ p: 1, border: '2px solid rgb(233, 180, 4)', borderRadius: '15px' }} >
                        <Box sx={label('rgb(233, 180, 4)')}>금융</Box>
                        <SectorChart data={filteredChartData.금융} />
                    </Box>
                </Box>
                <Box sx={{ p: 0.7 }} >
                    <BubbleChartLegend guideNum={0.1} girdNum={2.3} />
                </Box>
            </Grid>

            {/* Filter */}
            <Grid item xs={3.6}>

                {/* 1~14, 15~25, 26~54, 55~80 Selctor */}
                <Box sx={{ mt: '5px' }}>
                    <Grid container>
                        <Grid item xs={1.8}>
                            <TitleComponet primary={"업종순위"} fontSize={"12px"} textAlign={"left"} />
                            <Grid container>
                                <Grid item xs={6}>
                                    <ToggleButtonGroup
                                        orientation="vertical"
                                        color='info'
                                        exclusive
                                        // color="white"
                                        size="small"
                                        value={preset}
                                        onChange={handlePreset}
                                    >
                                        <StyledToggleButton value="A" >A</StyledToggleButton>
                                        <StyledToggleButton value="B" >B</StyledToggleButton>
                                        <StyledToggleButton value="C" >C</StyledToggleButton>
                                    </ToggleButtonGroup>
                                    {/* <BpCheckbox checked={preset.A} onChange={(e) => handleCheckAllChange(e, 'presetA')} />
                                    <BpCheckbox checked={preset.B} onChange={(e) => handleCheckAllChange(e, 'presetB')} /> */}
                                </Grid>
                                <Grid item xs={6}>
                                    <BpCheckbox checked={checkboxAll.up} onChange={(e) => handleCheckAllChange(e, 'up')} />
                                    <BpCheckbox checked={checkboxAll.tomUp} onChange={(e) => handleCheckAllChange(e, 'tomUp')} />
                                    <BpCheckbox checked={checkboxAll.down} onChange={(e) => handleCheckAllChange(e, 'down')} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2.5}>
                            <TitleComponet primary={"1 ~ 14"} fontSize={"12px"} textAlign={"center"} />
                            <Box>
                                <KeyboardDoubleArrowUpOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusUp.rank1} onChange={(e) => handleCheckboxChange('rank1', 'up')} />
                            </Box>
                            <Box>
                                <TrendingUpIcon />
                                <BpCheckbox checked={checkboxStatusTup.rank1} onChange={(e) => handleCheckboxChange('rank1', 'tomUp')} />
                            </Box>
                            <Box>
                                <KeyboardDoubleArrowDownOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusDown.rank1} onChange={(e) => handleCheckboxChange('rank1', 'down')} />
                            </Box>
                        </Grid>
                        <Grid item xs={2.5}>
                            <TitleComponet primary={"15 ~ 25"} fontSize={"12px"} textAlign={"center"} />
                            <Box>
                                <KeyboardDoubleArrowUpOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusUp.rank2} onChange={(e) => handleCheckboxChange('rank2', 'up')} />
                            </Box>
                            <Box>
                                <TrendingUpIcon />
                                <BpCheckbox checked={checkboxStatusTup.rank2} onChange={(e) => handleCheckboxChange('rank2', 'tomUp')} />
                            </Box>
                            <Box>
                                <KeyboardDoubleArrowDownOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusDown.rank2} onChange={(e) => handleCheckboxChange('rank2', 'down')} />
                            </Box>
                        </Grid>
                        <Grid item xs={2.5}>
                            <TitleComponet primary={"26 ~ 54"} fontSize={"12px"} textAlign={"center"} />
                            <Box>
                                <KeyboardDoubleArrowUpOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusUp.rank3} onChange={(e) => handleCheckboxChange('rank3', 'up')} />
                            </Box>
                            <Box>
                                <TrendingUpIcon />
                                <BpCheckbox checked={checkboxStatusTup.rank3} onChange={(e) => handleCheckboxChange('rank3', 'tomUp')} />
                            </Box>
                            <Box>
                                <KeyboardDoubleArrowDownOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusDown.rank3} onChange={(e) => handleCheckboxChange('rank3', 'down')} />
                            </Box>
                        </Grid>
                        <Grid item xs={2.5}>
                            <TitleComponet primary={"55 ~ 80"} fontSize={"12px"} textAlign={"center"} />
                            <Box>
                                <KeyboardDoubleArrowUpOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusUp.rank4} onChange={(e) => handleCheckboxChange('rank4', 'up')} />
                            </Box>
                            <Box>
                                <TrendingUpIcon />
                                <BpCheckbox checked={checkboxStatusTup.rank4} onChange={(e) => handleCheckboxChange('rank4', 'tomUp')} />
                            </Box>
                            <Box>
                                <KeyboardDoubleArrowDownOutlinedIcon />
                                <BpCheckbox checked={checkboxStatusDown.rank4} onChange={(e) => handleCheckboxChange('rank4', 'down')} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* 1~14, 15~25, 26~54, 55~80 Selctor Theme Top 10 */}
                <Box sx={{ mt: '3px' }}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'right', pl: 2, fontSize: '10px' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {Array.isArray(sectorsRanksThemes.rank1)
                                            ? sectorsRanksThemes.rank1.slice(0, 5).map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.theme.slice(0, 7)}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.fluctuation.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })
                                            : <tr><td>Loading...</td></tr>
                                        } </tbody></table>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'right', fontSize: '10px' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {Array.isArray(sectorsRanksThemes.rank2)
                                            ? sectorsRanksThemes.rank2.slice(0, 5).map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.theme.slice(0, 7)}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.fluctuation.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })
                                            : <tr><td>Loading...</td></tr>
                                        }
                                    </tbody></table>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'right', fontSize: '10px' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {Array.isArray(sectorsRanksThemes.rank3)
                                            ? sectorsRanksThemes.rank3.slice(0, 5).map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.theme.slice(0, 7)}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.fluctuation.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })
                                            : <tr><td>Loading...</td></tr>
                                        } </tbody></table>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'right', fontSize: '10px' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {Array.isArray(sectorsRanksThemes.rank4)
                                            ? sectorsRanksThemes.rank4.slice(0, 5).map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.theme.slice(0, 7)}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.fluctuation.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })
                                            : <tr><td>Loading...</td></tr>
                                        }</tbody></table>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* TreeMap */}
                <Box sx={{ mt: '3px' }}>
                    {sectorsRanksThemes.rank1 ? <TreeMap sectorsRanksThemes={sectorsRanksThemes} onThemeClick={onThemeClick} height={320} /> : <div>Loading...</div>}
                </Box>
                <Box sx={{ mt: '-30px', textAlign: 'left', marginLeft: '10px' }}>
                    <ToggleButtonGroup
                        size="small"
                        color='info'
                        // orientation="vertical"
                        value={togglePage}
                        exclusive
                        onChange={(event, newAlignment) => handleTogglePage(event, newAlignment)}
                        aria-label="Platform"
                    >
                        <StyledToggleButton value="Bubble">Bubble</StyledToggleButton>
                        <StyledToggleButton value="Search">Search</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* 3번짜 Bubble vs Search  */}
                <Box sx={{ mt: '-15px', height: '32vh' }}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            {
                                togglePage === 'Search' ?
                                    <>
                                        <ThemeProvider theme={customTheme}>
                                            <DataGrid rows={filteredStockTable} columns={filteredStockTableCol} hideFooter rowHeight={25}
                                                sx={{
                                                    height: '30vh',
                                                    color: 'white',
                                                    '.MuiDataGrid-columnSeparator': {
                                                        display: 'none',
                                                    },
                                                    '.MuiDataGrid-columnHeaders': {
                                                        minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                                        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                                        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                                        backgroundColor: 'rgba(230, 230, 230, 0.3)'
                                                    },
                                                }} />
                                        </ThemeProvider>
                                    </>
                                    : togglePage === 'Bubble' ?
                                        <Box sx={{ mt: 1 }}>
                                            <NewKospi200Group data={Kospi200BubbleCategoryGruop} height={375} name={'Group'} />
                                            {/* {sectorsRanksThemes.rank1 ? <ColumnChart sectorsRanksThemes={sectorsRanksThemes} height={'75%'} categoryColor={'greenyellow'} /> : <div>Loading...</div>} */}
                                        </Box>
                                        : <div>Loading...</div>
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>

    )
}

// ccs 
const label = (bgColor, FontColor) => {
    return { backgroundColor: bgColor, color: FontColor || '#404040', width: '50px', transform: 'translate(-10px, -10px)', fontWeight: 'bold', position: 'absolute', zIndex: '1' }
}

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    fontSize: '8px',
    color: '#efe9e9ed', // 비활성화 상태에서의 글자색
    '&.Mui-selected': { // 활성화 상태에서의 스타일
        backgroundColor: '#efe9e9ed', // 활성화 상태에서의 배경색
        color: '#404040', // 활성화 상태에서의 글자색
        '&:hover': { // 마우스 오버 상태에서의 스타일
            backgroundColor: '#d8d8d8', // 마우스 오버 상태에서의 배경색
        },
    },
    '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
        backgroundColor: '#505050', // 비활성화 상태에서의 마우스 오버 배경색
    },
}));

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10.5px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10.5px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                },
            },
            defaultProps: {
                headerHeight: 20,
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