import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, RadioGroup, Radio, FormLabel, FormControlLabel, Box, Table, TableBody, TableRow, TableCell, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import StockChart from './SectorsPage/stockChart'
import { STOCK } from './util/config';

const CustomTextField = styled(TextField)({
    '& .MuiFormLabel-root': { color: '#efe9e9ed' },
    '& .MuiInputBase-input': { color: '#efe9e9ed' }
});

export default function StockSearchPage({ swiperRef, StockSearch, StockSearchTracking }) {
    const [data, setData] = useState([]);
    const [StockSearchTrackingData, setStockSearchTrackingData] = useState([]);

    // Filter State
    const [dmi3Range, setDmi3Range] = useState([0, 10]);
    const [dmi4Range, setDmi4Range] = useState([0, 10]);
    const [dmi5Range, setDmi5Range] = useState([0, 10]);
    const [dmi6Range, setDmi6Range] = useState([0, 10]);
    const [dmi7Range, setDmi7Range] = useState([0, 10]);
    const [willR5Range, setWillR5Range] = useState([-100, -90]);
    const [willR7Range, setWillR7Range] = useState([-100, -90]);
    const [willR14Range, setWillR14Range] = useState([-100, -90]);
    const [willR20Range, setWillR20Range] = useState([-100, -90]);
    const [willR33Range, setWillR33Range] = useState([-100, -90]);

    // Chart Data
    const [stockName, setStockName] = useState(null);
    const [stockItemData, setStockItemData] = useState([]);
    const [stockVolumeData, setStockVolumeData] = useState([]);
    const [SectorsName, setSectorsName] = useState('');

    // Fetch Data
    useEffect(() => {
        // if (StockSearch.status === 'succeeded') {
        //     setOriginData(StockSearch.data);
        // }
        // 공통 필터링 로직을 사용할 수 있습니다.
        const newFilteredData = StockSearch.data.filter((item) => {
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
                dmi3Value >= dmi3Range[0] && dmi3Value <= dmi3Range[1] &&
                dmi4Value >= dmi4Range[0] && dmi4Value <= dmi4Range[1] &&
                dmi5Value >= dmi5Range[0] && dmi5Value <= dmi5Range[1] &&
                dmi6Value >= dmi6Range[0] && dmi6Value <= dmi6Range[1] &&
                dmi7Value >= dmi7Range[0] && dmi7Value <= dmi7Range[1] &&

                willR5Value >= willR5Range[0] && willR5Value <= willR5Range[1] &&
                willR7Value >= willR7Range[0] && willR7Value <= willR7Range[1] &&
                willR14Value >= willR14Range[0] && willR14Value <= willR14Range[1] &&
                willR20Value >= willR20Range[0] && willR20Value <= willR20Range[1] &&
                willR33Value >= willR33Range[0] && willR33Value <= willR33Range[1]
            );
        });
        setData(newFilteredData);
    }, [StockSearch, dmi3Range, dmi4Range, dmi5Range, dmi6Range, dmi7Range, willR5Range, willR7Range, willR14Range, willR20Range, willR33Range])
    useEffect(() => { if (StockSearchTracking.status === 'succeeded') { setStockSearchTrackingData(StockSearchTracking.data); } }, [StockSearchTracking])
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
    const handleFilterChange = (event, newValue, sliderName) => {
        switch (sliderName) {
            case 'DMI-3-Min':
                setDmi3Range([newValue, dmi3Range[1]]);
                break;
            case 'DMI-3-Max':
                setDmi3Range([dmi3Range[0], newValue]);
                break;
            case 'DMI-4-Min':
                setDmi4Range([newValue, dmi4Range[1]]);
                break;
            case 'DMI-4-Max':
                setDmi4Range([dmi4Range[0], newValue]);
                break;
            case 'DMI-5-Min':
                setDmi5Range([newValue, dmi5Range[1]]);
                break;
            case 'DMI-5-Max':
                setDmi5Range([dmi5Range[0], newValue]);
                break;
            case 'DMI-6-Min':
                setDmi6Range([newValue, dmi6Range[1]]);
                break;
            case 'DMI-6-Max':
                setDmi6Range([dmi6Range[0], newValue]);
                break;
            case 'DMI-7-Min':
                setDmi7Range([newValue, dmi7Range[1]]);
                break;
            case 'DMI-7-Max':
                setDmi7Range([dmi7Range[0], newValue]);
                break;

            case 'W-5-Min':
                setWillR5Range([newValue, willR5Range[1]]);
                break;
            case 'W-5-Max':
                setWillR5Range([willR5Range[0], newValue]);
                break;
            case 'W-7-Min':
                setWillR7Range([newValue, willR7Range[1]]);
                break;
            case 'W-7-Max':
                setWillR7Range([willR7Range[0], newValue]);
                break;
            case 'W-14-Min':
                setWillR14Range([newValue, willR14Range[1]]);
                break;
            case 'W-14-Max':
                setWillR14Range([willR14Range[0], newValue]);
                break;
            case 'W-20-Min':
                setWillR20Range([newValue, willR20Range[1]]);
                break;
            case 'W-20-Max':
                setWillR20Range([willR20Range[0], newValue]);
                break;
            case 'W-33-Min':
                setWillR33Range([newValue, willR33Range[1]]);
                break;
            case 'W-33-Max':
                setWillR33Range([willR33Range[0], newValue]);
                break;

        }
    };

    // Etc.
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
        { field: 'willR_5', headerName: 'willR_5', width: 55, align: 'right', },
        { field: 'willR_7', headerName: 'willR_7', width: 55, align: 'right', },
        { field: 'willR_14', headerName: 'willR_14', width: 55, align: 'right', },
        { field: 'willR_20', headerName: 'willR_20', width: 55, align: 'right', },
        { field: 'willR_33', headerName: 'willR_33', width: 55, align: 'right', },
        { field: 'DMI_3', headerName: 'DMI_3', width: 55, align: 'right', },
        { field: 'DMI_4', headerName: 'DMI_4', width: 55, align: 'right', },
        { field: 'DMI_5', headerName: 'DMI_5', width: 55, align: 'right', },
        { field: 'DMI_6', headerName: 'DMI_6', width: 55, align: 'right', },
        { field: 'DMI_7', headerName: 'DMI_7', width: 55, align: 'right', },
    ]
    const TrackingColumns = [
        {
            field: '조건일', headerName: '검색일자', width: 100,
            renderCell: (params) => params.value.split('T')[0]
        },
        { field: '업종명', headerName: '업종명', width: 100, },
        { field: '종목명', headerName: '종목명', width: 100, },
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
            field: '등락률', headerName: '등락률(%)', width: 70, align: 'right',
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
    ]

    const labelStyle = { fontSize: '14px', textAlign: 'start' }
    const DmiTextFields = DmiFilter([dmi3Range, dmi4Range, dmi5Range, dmi6Range, dmi7Range], handleFilterChange);
    const WillrTextFields = WillrFilter([willR5Range, willR7Range, willR14Range, willR20Range, willR33Range], handleFilterChange);

    return (
        <Grid container>
            <Grid item xs={1.8} sx={{ paddingRight: '30px' }}>
                <Grid container >
                    <Typography sx={{ p: 1 }}>
                        DMI
                    </Typography>

                    {DmiTextFields}
                </Grid>
                <Grid container sx={{ mt: '20px' }}>
                    <Typography sx={{ p: 1 }}>
                        Willams
                    </Typography>

                    {WillrTextFields}
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
                            <Typography align='left' sx={{ color: 'black', fontSize: '18px' }}>
                                종목명 : {stockName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{ color: 'black', fontSize: '18px' }}>
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
                        onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Min`)}
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
                        onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Max`)}
                    />
                </Grid>
            </Grid>
        );
    });
}
const WillrFilter = (ranges, handleFilterChange) => {
    const williamsLabels = [5, 7, 14, 20, 33]; // 윌리엄스 %R 지표의 레이블 값을 나타내는 배열

    return ranges.map((range, index) => {
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
                        onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Min`)}
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
                        onChange={(event) => handleFilterChange(event, event.target.value, `${labelPrefix}-Max`)}
                    />
                </Grid>
            </Grid>
        );
    });
}

// const CutomTable = ({ data, title, 업종명을상위컴포넌트로전달 }) => {
//     const 업종선택 = (item) => { 업종명을상위컴포넌트로전달(item); }
//     return (
//         <Table size="small">
//             <TableBody>
//                 <TableRow>
//                     <TableCell align='center' colSpan={2} sx={{ color: '#efe9e9ed' }}>
//                         {title}
//                     </TableCell>
//                 </TableRow>
//                 {data.map(item => (
//                     <TableRow key={item.업종명} onClick={() => 업종선택(item)} className={CSS.listGroupitem} >
//                         <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }}>{(item.업종명).slice(0, 6)}</TableCell>
//                         <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px', width: '20px' }}>{item.갯수}</TableCell>
//                     </TableRow>
//                 ))}
//             </TableBody>
//         </Table>
//     )
// }

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