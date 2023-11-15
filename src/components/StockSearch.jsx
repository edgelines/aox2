import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Grid, Typography, Box, TextField, InputLabel, MenuItem, FormControl, Select, Button, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import StockChart from './SectorsPage/stockChart'
import { STOCK, MAC, API } from './util/config';

export default function StockSearchPage({ swiperRef, StockSearch, StockSearchTracking }) {
    const [snackbar, setSnackbar] = useState(false);
    const [severity, setSeverity] = useState('success');

    const [data, setData] = useState([]);
    const [StockSearchTrackingData, setStockSearchTrackingData] = useState([]);
    const [presetName, setPresetName] = useState('Default');
    const [presetList, setPresetList] = useState([]);
    const [presetData, setPresetData] = useState([]);

    // Filter State
    const [filters, setFilters] = useState({
        dmi3Range: [0, 10],
        dmi4Range: [0, 10],
        dmi5Range: [0, 10],
        dmi6Range: [0, 10],
        dmi7Range: [0, 10],
        willR5Range: [-100, -90],
        willR7Range: [-100, -90],
        willR14Range: [-100, -90],
        willR20Range: [-100, -90],
        willR33Range: [-100, -90],
    });
    // Form
    const [form, setForm] = useState({ name: '', presets: '' });
    // Chart Data
    const [stockName, setStockName] = useState(null);
    const [stockItemData, setStockItemData] = useState([]);
    const [stockVolumeData, setStockVolumeData] = useState([]);
    const [SectorsName, setSectorsName] = useState('');
    const vertical = 'bottom';
    const horizontal = 'center';
    // Fetch Data
    const fetchData = async () => {
        const res = await axios.get(`${API}/indicator/preset`);
        const tmp = [];
        res.data.map(item => { tmp.push(item.name) });
        setPresetList(tmp);
        setPresetName(tmp[0]);
        setPresetData(res.data);
    };
    const setupIndicator = () => {
        if (presetData && presetData.length > 0) {
            const tmp = presetData.find(item => item.name === presetName);
            setFilters({
                dmi3Range: tmp.presets.dmi3Range,
                dmi4Range: tmp.presets.dmi4Range,
                dmi5Range: tmp.presets.dmi5Range,
                dmi6Range: tmp.presets.dmi6Range,
                dmi7Range: tmp.presets.dmi7Range,
                willR5Range: tmp.presets.willR5Range,
                willR7Range: tmp.presets.willR7Range,
                willR14Range: tmp.presets.willR14Range,
                willR20Range: tmp.presets.willR20Range,
                willR33Range: tmp.presets.willR33Range
            })
        }
    }
    const filterData = (data, filters) => {
        return data.filter((item) => {
            const dmi3Value = parseFloat(item.DMI_3);
            const dmi4Value = parseFloat(item.DMI_4);
            const dmi5Value = parseFloat(item.DMI_5);
            const dmi6Value = parseFloat(item.DMI_6);
            const dmi7Value = parseFloat(item.DMI_7);
            const willR5Value = parseFloat(item.willR_5);
            const willR7Value = parseFloat(item.willR_7);
            const willR14Value = parseFloat(item.willR_14);
            const willR20Value = parseFloat(item.willR_20);
            const willR33Value = parseFloat(item.willR_33);
            return (
                dmi3Value >= filters.dmi3Range[0] && dmi3Value <= filters.dmi3Range[1] &&
                dmi4Value >= filters.dmi4Range[0] && dmi4Value <= filters.dmi4Range[1] &&
                dmi5Value >= filters.dmi5Range[0] && dmi5Value <= filters.dmi5Range[1] &&
                dmi6Value >= filters.dmi6Range[0] && dmi6Value <= filters.dmi6Range[1] &&
                dmi7Value >= filters.dmi7Range[0] && dmi7Value <= filters.dmi7Range[1] &&

                willR5Value >= filters.willR5Range[0] && willR5Value <= filters.willR5Range[1] &&
                willR7Value >= filters.willR7Range[0] && willR7Value <= filters.willR7Range[1] &&
                willR14Value >= filters.willR14Range[0] && willR14Value <= filters.willR14Range[1] &&
                willR20Value >= filters.willR20Range[0] && willR20Value <= filters.willR20Range[1] &&
                willR33Value >= filters.willR33Range[0] && willR33Value <= filters.willR33Range[1]
            );
        });
    };
    const filteredData = useMemo(() => filterData(StockSearch.data, filters), [StockSearch, filters]);
    useEffect(() => {
        setData(filteredData); setForm(prevForm => ({
            ...prevForm,
            presets: filters
        }));
    }, [StockSearch, filters]);
    useEffect(() => { if (StockSearchTracking.status === 'succeeded') { setStockSearchTrackingData(StockSearchTracking.data); } }, [StockSearchTracking])
    useEffect(() => { fetchData(); }, [])
    useEffect(() => { setupIndicator() }, [presetName])
    // function
    // 종목 선택시
    const stockItemSelected = (selectedStockItem) => { // 종목 클릭시
        setStockName(selectedStockItem.종목명);
        axios.get(`${STOCK}/${selectedStockItem.종목코드}`)
            .then(response => {
                const stockData = [];
                const volumeData = [];
                response.data.forEach(item => {
                    const date = new Date(item.날짜);
                    const dateInMilliseconds = date.getTime();
                    // Candle data
                    const stockItem = [
                        dateInMilliseconds, // 날짜
                        item.시가, // 시가
                        item.고가, // 고가
                        item.저가,  // 저가
                        item.종가 // 종가
                    ];
                    stockData.push(stockItem);

                    // Volume data
                    const volumeItem = [
                        dateInMilliseconds, // 날짜
                        item.거래량 // 거래량
                    ];
                    volumeData.push(volumeItem);
                });
                setStockItemData(stockData);
                setStockVolumeData(volumeData);
            });
        sectorSelected(selectedStockItem)
    };
    // 업종 클릭시 
    const sectorSelected = (sector) => { setSectorsName(sector.업종명); }

    // handler
    const handleFilterChange = (newValue, rangeName, minOrMax) => {
        setFilters(prevRanges => ({
            ...prevRanges,
            [rangeName]: minOrMax === 'Min' ? [parseInt(newValue), prevRanges[rangeName][1]] : [prevRanges[rangeName][0], parseInt(newValue)]
        }));
    };

    const handleFormChange = (event, value, label) => {
        setForm(prevForm => ({
            ...prevForm,
            [label]: value
        }));
    }
    const handleTrackingData = async (event) => {
        const getDate = `${event.$y}-${event.$M + 1}-${event.$D}`
        const response = await axios.get(`${MAC}/StockSearch/Tracking?date=${getDate}`);
        let data = response.data.map((item, index) => ({
            ...item,
            id: index,
            등락률: ((item.현재가 - item.종가) / item.종가 * 100).toFixed(1),
            유보율: parseInt(item.유보율),
            부채비율: parseInt(item.부채비율),
        }))
        data = data.sort((a, b) => b.등락률 - a.등락률);
        setStockSearchTrackingData(data)
    }
    const handlePresetNameChange = (event) => { setPresetName(event.target.value); }
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setSnackbar(false); }; // 알림창 닫기
    const handleSave = async () => {
        if (form.name) {
            try {
                await axios.post(`${API}/indicator/postPreset`, form);
                setSnackbar(true);
                setSeverity('success');
                const res = await axios.get(`${API}/indicator/preset`);
                const tmp = [];
                res.data.map(item => { tmp.push(item.name) });
                setPresetList(tmp);
                setPresetName(form.name);
                setPresetData(res.data);
            } catch (error) {
                setSnackbar(true);
                setSeverity('error');
                console.error(error);
            }
        } else {
            setSnackbar(true);
            setSeverity('warning');
        }
    }

    // DataTable Columns.
    const StockColumns = [
        { field: '종목명', headerName: '종목명', width: 100, },
        {
            field: '종가', headerName: '현재가', width: 72, align: 'right',
            renderCell: (params) => {
                const 현재가 = parseInt(params.value);
                return (
                    <span>
                        {현재가.toLocaleString('kr')}
                    </span>
                );
            }
        },
        { field: 'willR_5', headerName: 'willR_5', width: 62, align: 'right', },
        { field: 'willR_7', headerName: 'willR_7', width: 62, align: 'right', },
        { field: 'willR_14', headerName: 'willR_14', width: 62, align: 'right', },
        { field: 'willR_20', headerName: 'willR_20', width: 62, align: 'right', },
        { field: 'willR_33', headerName: 'willR_33', width: 62, align: 'right', },
        {
            field: 'DMI_3', headerName: 'DMI_3', width: 55, align: 'right',
            renderCell: (params) => {
                let color;
                if (params.value < 0.1) {
                    color = 'greenyellow';
                } else { color = '#efe9e9ed'; }
                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        },
        {
            field: 'DMI_4', headerName: 'DMI_4', width: 55, align: 'right',
            renderCell: (params) => {
                let color;
                if (params.value < 0.1) {
                    color = 'greenyellow';
                } else { color = '#efe9e9ed'; }
                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        },
        {
            field: 'DMI_5', headerName: 'DMI_5', width: 55, align: 'right',
            renderCell: (params) => {
                let color;
                if (params.value < 0.1) {
                    color = 'greenyellow';
                } else { color = '#efe9e9ed'; }
                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        },
        {
            field: 'DMI_6', headerName: 'DMI_6', width: 55, align: 'right',
            renderCell: (params) => {
                let color;
                if (params.value < 0.1) {
                    color = 'greenyellow';
                } else { color = '#efe9e9ed'; }
                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        },
        {
            field: 'DMI_7', headerName: 'DMI_7', width: 55, align: 'right',
            renderCell: (params) => {
                let color;
                if (params.value < 0.1) {
                    color = 'greenyellow';
                } else { color = '#efe9e9ed'; }
                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        },
    ]
    const TrackingColumns = [
        {
            field: '조건일', headerName: '검색일자', width: 95,
            renderCell: (params) => params.value.split('T')[0]
        },
        { field: '업종명', headerName: '업종명', width: 100, },
        { field: '종목명', headerName: '종목명', width: 120, },
        {
            field: '종가', headerName: '검색종가', width: 70, align: 'right',
            renderCell: (params) => params.value.toLocaleString('kr')
        },
        {
            field: '현재가', headerName: '현재가', width: 70, align: 'right',
            renderCell: (params) => {
                const 현재가 = parseInt(params.value);
                const 종가 = parseInt(params.row.종가);
                let color, fontWeight;
                if (현재가 < 종가) {
                    color = 'dodgerblue';
                } else { color = 'tomato'; }
                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {현재가.toLocaleString('kr')}
                    </span>
                );
            }
        },
        {
            field: '등락률', headerName: '등락률(%)', width: 70, align: 'right', sort: 'desc',
            renderCell: (params) => {
                const 현재가 = parseInt(params.row.현재가);
                const 종가 = parseInt(params.row.종가);
                let color, fontWeight;
                if (현재가 < 종가) {
                    color = 'dodgerblue';
                } else { color = 'tomato'; }
                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {`${params.value} %`}
                    </span>
                );
            }
        },
        {
            field: '유보율', headerName: '유보율', width: 75, align: 'right',
            renderCell: (params) => params.value.toLocaleString('kr')
            // renderCell: (params) => {
            //     let color, fontWeight;
            //     if (params.value < 200) {
            //         color = 'dodgerblue';
            //     } else { color = 'tomato'; }
            //     return (
            //         <span style={{ color: color, fontWeight: fontWeight }}>
            //             {`${params.value} %`}
            //         </span>
            //     );
            // }
        },
        {
            field: '부채비율', headerName: '부채비율', width: 75, align: 'right',
            renderCell: (params) => params.value.toLocaleString('kr')
            // renderCell: (params) => {
            //     let color, fontWeight;
            //     if (params.value > 200) {
            //         color = 'dodgerblue';
            //     } else { color = 'tomato'; }
            //     return (
            //         <span style={{ color: color, fontWeight: fontWeight }}>
            //             {`${params.value} %`}
            //         </span>
            //     );
            // }
        },
    ]

    const DmiTextFields = DmiFilter([filters.dmi3Range, filters.dmi4Range, filters.dmi5Range, filters.dmi6Range, filters.dmi7Range], handleFilterChange);
    const WillrTextFields = WillrFilter([filters.willR5Range, filters.willR7Range, filters.willR14Range, filters.willR20Range, filters.willR33Range], handleFilterChange);

    return (
        <Grid container>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackbar}
                onClose={handleClose}
                autoHideDuration={2000}
            >
                <Alert severity={severity} elevation={6} onClose={handleClose}>
                    {severity === 'success' ? '변경 사항을 저장했어요.' : severity === 'error' ? '에러가 발생했어요. 잠시후 다시 시도해주세요.' : 'No Preset Name! Plz enter'}
                </Alert>
            </Snackbar>

            <Grid item xs={1.8} sx={{ paddingRight: '30px' }}>
                <Grid container >
                    <Typography sx={{ p: 1 }}>
                        DMI
                    </Typography>

                    {DmiTextFields}
                </Grid>
                <Grid container>
                    <Typography sx={{ p: 1 }}>
                        Willams
                    </Typography>

                    {WillrTextFields}
                </Grid>
                <FormControl fullWidth size="small" sx={{ mt: '10px' }}>
                    <InputLabel id="demo-simple-select-label" sx={{ color: '#efe9e9ed' }}>Preset</InputLabel>
                    <CustomSelect
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={presetName}
                        label="Preset"
                        onChange={handlePresetNameChange}
                    >
                        {presetList && presetList.length > 0 ?
                            presetList.map(item => (
                                <MenuItem key={item} value={item} sx={{ fontSize: '13px' }}>{item}</MenuItem>
                            ))
                            : <div>Loading...</div>
                        }

                    </CustomSelect>
                </FormControl>
                <Grid container>
                    <CustomTextField
                        variant="filled"
                        size="small"
                        value={form.name}
                        label={'Preset Name'}
                        onChange={(event) => handleFormChange(event, event.target.value, 'name')}
                    />
                    <Button onClick={handleSave}>Save</Button>
                </Grid>

                <Grid container sx={{ mt: '20px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDateCalendar
                            onChange={handleTrackingData}
                            shouldDisableDate={disablePastDatesAndWeekends}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <div style={{ height: "45svh" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography align='start'>
                        Monitoring
                    </Typography>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={data} rowHeight={25} columns={StockColumns}
                            sx={{
                                color: '#efe9e9ed', border: 'none',
                                '.MuiDataGrid-columnHeaders': {
                                    minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    backgroundColor: 'rgba(230, 230, 230, 0.1)'
                                },
                                '.MuiDataGrid-columnSeparator': { display: 'none', },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="종목명"]': { backgroundColor: '#6E6E6E' },
                            }}
                            onCellClick={(params, event) => {
                                stockItemSelected({
                                    종목코드: params.row.티커, 종목명: params.row.종목명, 업종명: params.row.업종명
                                });
                                setStockName(params.row.종목명)
                            }}
                        />
                    </ThemeProvider>
                </div>
                <div style={{ height: "50svh", mt: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography align='start'>
                        Tracking
                    </Typography>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={StockSearchTrackingData} rowHeight={25} columns={TrackingColumns}
                            sx={{
                                color: '#efe9e9ed', border: 'none',
                                '.MuiDataGrid-columnHeaders': {
                                    minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    backgroundColor: 'rgba(230, 230, 230, 0.1)'
                                },
                                '.MuiDataGrid-columnSeparator': { display: 'none', },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="종목명"]': { backgroundColor: '#6E6E6E' },
                            }}
                            onCellClick={(params, event) => {
                                stockItemSelected({
                                    종목코드: params.row.티커, 종목명: params.row.종목명, 업종명: params.row.업종명
                                });
                                setStockName(params.row.종목명)
                            }}
                        />
                    </ThemeProvider>
                </div>
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={5}>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: 'translate(18px, 30px)', zIndex: 100 }}>
                    <Grid container sx={{ width: '400px' }}>
                        <Grid item xs={6}>
                            <Typography align='start' sx={{ color: 'black', fontSize: '18px' }}>
                                종목명 : {stockName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='start' sx={{ color: 'black', fontSize: '18px' }}>
                                업종명 : {SectorsName}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <StockChart stockItemData={stockItemData} volumeData={stockVolumeData} timeSeries={stockName} height={460} indicators={true} />
                <StockChart stockItemData={stockItemData} volumeData={stockVolumeData} timeSeries={stockName} rangeSelect={4} height={460} indicators={true} />
            </Grid>

        </Grid>
    )
}


const DmiFilter = (ranges, handleFilterChange) => {
    return ranges.map((range, index) => {
        const label = `dmi${index + 3}Range`; // DMI-3, DMI-4, DMI-5 등의 라벨을 생성합니다.
        const labelPrefix = `DMI-${index + 3}`; // DMI-3, DMI-4, DMI-5 등의 라벨을 생성합니다.
        return (
            <Grid container>
                <Grid item xs={5.5}>
                    <CustomTextField
                        variant="filled"
                        size="small"
                        value={range[0]}
                        type="number"
                        label={`${labelPrefix} Min`}
                        // onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Min`)}
                        onChange={(event) => handleFilterChange(event.target.value, `${label}`, 'Min')}
                    />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5.5}>
                    <CustomTextField
                        variant="filled"
                        size="small"
                        value={range[1]}
                        type="number"
                        label={`${labelPrefix} Max`}
                        // onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Max`)}
                        onChange={(event) => handleFilterChange(event.target.value, `${label}`, 'Max')}
                    />
                </Grid>
            </Grid>
        );
    });
}
const WillrFilter = (ranges, handleFilterChange) => {
    const williamsLabels = [5, 7, 14, 20, 33]; // 윌리엄스 %R 지표의 레이블 값을 나타내는 배열
    return ranges.map((range, index) => {
        const label = `willR${williamsLabels[index]}Range`;
        const labelPrefix = `W-${williamsLabels[index]}`;
        return (
            <Grid container>
                <Grid item xs={5.5}>
                    <CustomTextField
                        variant="filled"
                        size="small"
                        type="number"
                        value={range[0]}
                        label={`${labelPrefix} Min`}
                        onChange={(event) => handleFilterChange(event.target.value, `${label}`, 'Min')}
                    />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5.5}>
                    <CustomTextField
                        variant="filled"
                        size="small"
                        type="number"
                        value={range[1]}
                        label={`${labelPrefix} Max`}
                        onChange={(event) => handleFilterChange(event.target.value, `${label}`, 'Max')}
                    />
                </Grid>
            </Grid>
        );
    });
}
const CustomTextField = styled(TextField)({
    '& .MuiFormLabel-root': { color: '#efe9e9ed', fontSize: '13px' },
    '& .MuiInputBase-root': { fontSize: '13px' },
    '& .MuiInputBase-input': { color: '#efe9e9ed' }
});

const CustomDateCalendar = styled(DateCalendar)({
    '& .MuiButtonBase-root': { color: '#efe9e9ed' },
    '& .MuiTypography-root': { color: '#efe9e9ed' },
});

const CustomSelect = styled(Select)({ '& .MuiSelect-select': { height: '20px', minHeight: '20px', fontSize: '12px', color: '#efe9e9ed' } })

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

function disablePastDatesAndWeekends(date) {
    // 오늘 날짜 구하기
    const today = dayjs().startOf('day'); // 'day'를 사용하여 시간을 00:00으로 설정

    // 2023년 11월 9일 이전의 날짜 및 오늘 이후의 날짜 비활성화
    const startDate = dayjs(new Date(2023, 10, 9));
    if (date < startDate || date > today) {
        return true;
    }


    // 토요일(6)과 일요일(0) 비활성화
    const day = date.day();
    if (day === 0 || day === 6) {
        return true;
    }

    return false;
}