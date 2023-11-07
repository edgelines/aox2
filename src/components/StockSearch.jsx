import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, RadioGroup, Radio, FormLabel, FormControlLabel, Box, Table, TableBody, TableRow, TableCell, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StockChart from './SectorsPage/stockChart'
import { STOCK } from './util/config';

export default function StockSearchPage({ swiperRef, StockSearch }) {
    const [originData, setOriginData] = useState([]);
    const [data, setData] = useState([]);

    // Filter State
    const [dmi3Range, setDmi3Range] = useState([0, 100]);
    const [dmi4Range, setDmi4Range] = useState([0, 100]);
    const [dmi5Range, setDmi5Range] = useState([0, 100]);

    // Chart Data
    const [stockName, setStockName] = useState(null);
    const [stockItemData, setStockItemData] = useState([]);
    const [stockVolumeData, setStockVolumeData] = useState([]);
    const [SectorsName, setSectorsName] = useState('');

    // Fetch Data

    useEffect(() => { if (StockSearch.status === 'succeeded') { setOriginData(StockSearch.data); setData(StockSearch.data) } }, [StockSearch])
    useEffect(() => { }, [])

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
    const sectorSelected = (sector) => { // 업종 클릭시 
        setSectorsName(sector.업종명);
    }

    // handler
    const handleSliderChange = (event, newValue, sliderName) => {
        switch (sliderName) {
            case 'DMI3':
                setDmi3Range(newValue);
                break;
            case 'DMI4':
                setDmi4Range(newValue);
                break;
            case 'DMI5':
                setDmi5Range(newValue);
                break;
        }

        // 공통 필터링 로직을 사용할 수 있습니다.
        const newFilteredData = originData.filter((item) => {
            const dmi3Value = parseFloat(item.DMI_3);
            const dmi4Value = parseFloat(item.DMI_4);
            const dmi5Value = parseFloat(item.DMI_5);
            return (
                dmi3Value >= dmi3Range[0] && dmi3Value <= dmi3Range[1] &&
                dmi4Value >= dmi4Range[0] && dmi4Value <= dmi4Range[1] &&
                dmi5Value >= dmi5Range[0] && dmi5Value <= dmi5Range[1]
            );
        });
        setData(newFilteredData);
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
        { field: 'willR_5', headerName: 'willR_5', width: 60, align: 'right', },
        { field: 'willR_7', headerName: 'willR_7', width: 60, align: 'right', },
        { field: 'willR_14', headerName: 'willR_14', width: 60, align: 'right', },
        { field: 'willR_20', headerName: 'willR_20', width: 60, align: 'right', },
        { field: 'willR_33', headerName: 'willR_33', width: 60, align: 'right', },
        { field: 'DMI_3', headerName: 'DMI_3', width: 40, align: 'right', },
        { field: 'DMI_4', headerName: 'DMI_4', width: 40, align: 'right', },
        { field: 'DMI_5', headerName: 'DMI_5', width: 40, align: 'right', },
    ]
    const labelStyle = { fontSize: '14px', textAlign: 'start' }
    return (
        <Grid container>
            <Grid item xs={1.8} sx={{ paddingRight: '30px' }}>
                <Grid container >
                    <label style={labelStyle}>DMI3 범위: {dmi3Range[0]} - {dmi3Range[1]}</label>
                    <Slider
                        min={0}
                        max={100}
                        value={dmi3Range}
                        onChange={(event, newValue) => handleSliderChange(event, newValue, 'DMI3')}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                    <label style={labelStyle}>DMI4 범위: {dmi4Range[0]} - {dmi4Range[1]}</label>
                    <Slider
                        min={0}
                        max={100}
                        value={dmi4Range}
                        onChange={(event, newValue) => handleSliderChange(event, newValue, 'DMI4')}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                    <label style={labelStyle}>DMI5 범위: {dmi5Range[0]} - {dmi5Range[1]}</label>
                    <Slider
                        min={0}
                        max={100}
                        value={dmi5Range}
                        onChange={(event, newValue) => handleSliderChange(event, newValue, 'DMI5')}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                </Grid>

            </Grid>
            <Grid item xs={5}>
                <div style={{ height: "100svh" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={data} rowHeight={25} columns={StockColumns}
                            sx={{
                                color: 'white', border: 'none',
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