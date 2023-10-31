import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IndexChart from './util/IndexChart';
import IndexChart2 from './util/IndexChart2';
import CoreChart from './util/CoreChart';
import MonthTable from './ELW/monthTable';
import MonthChart from './ELW/monthChart';
import GpoChart from './ELW/GpoChart';
import { numberWithCommas, StyledToggleButton, StyledButton } from './util/util';
import Kospi200CurrentValue from './Index/kospi200CurrentValue';
import ELW_BarChart from './ELW/BarChart';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
import { customRsi, williamsR } from 'indicatorts';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { MarketKospi200 } from '../store/indexData';
import { API, JSON } from './util/config';

HighchartsMore(Highcharts)
SolidGauge(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function TestPage({ swiperRef }) {

    const [treasuryStock, setTreasuryStock] = useState([]);
    // const [stockPriceDailyList, setStockPriceDailyList] = useState([]);
    const getCurrentPrice = async (code) => {
        const res = await axios.get(`${API}StockData/${code}`)
        //  종목 현재가만 정리되어있는 json파일 불러오기.
    };
    // Fetch Data
    const fetchData = async () => {

        const stock = await axios.get(`${API}StockPriceDailyList`);
        const stockData = stock.data;
        // setStockPriceDailyList(stock.data);
        const res = await axios.get(`${API}TreasuryStock`);

        const data = res.data.map((item, index) => {
            const matchedStock = stockData.find(data => data.종목코드 === item.종목코드);
            const 현재가 = matchedStock ? matchedStock.현재가 : null;

            return {
                ...item,
                현재가,
                id: index,
            }
        })
        setTreasuryStock(data);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const treasuryStockColumns = [
        {
            field: '종목명', headerName: '종목명', width: 100,
            renderCell: (params) => {
                const 종목명 = params.value
                const 현재가 = parseInt(params.row.현재가);
                const 평균단가 = parseInt(params.row.평균단가);

                let color, fontWeight;
                if (현재가 < 평균단가) {
                    color = 'tomato';
                    fontWeight = 'bold';
                } else {
                    color = 'white';
                }

                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {종목명}
                    </span>
                );
            }
        },
        {
            field: '최대값', headerName: '최대값', width: 72, valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (params.value).toLocaleString('kr');
            }
        },
        {
            field: '최소값', headerName: '최소값', width: 72, valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (params.value).toLocaleString('kr');
            }
        },
        {
            field: '평균단가', headerName: '평균가', width: 72, valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        },
        {
            field: '현재가', headerName: '현재가', width: 72,
            renderCell: (params) => {
                const 현재가 = parseInt(params.value);
                const 평균단가 = parseInt(params.row.평균단가);

                let color, fontWeight;
                if (현재가 < 평균단가) {
                    color = 'tomato';
                    fontWeight = 'bold';
                } else {
                    color = 'white';
                }

                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {현재가.toLocaleString('kr')}
                    </span>
                );
            }
        },
        {
            field: '총액', headerName: '총액', width: 100, valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        },
        { field: '거래일', headerName: '거래일', width: 100, },
        {
            field: '취득처분', headerName: '취득/처분', width: 100,
            renderCell: (params) => {
                if (params.value === '취득') { return (<span style={{ color: 'tomato', fontWeight: 'bold' }}>{params.value}</span>); }
                return (<span style={{ color: 'dodgerblue' }}>{params.value}</span>);
            },
        },
    ]
    return (
        <Grid container spacing={1} >
            <Grid item xs={5}>
                <div style={{ height: "90vh", width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={treasuryStock} hideFooter rowHeight={25} columns={treasuryStockColumns} sx={{
                            color: 'white', border: 'none',
                            '.MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },
                            '.MuiDataGrid-columnHeaders': {
                                minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                backgroundColor: 'rgba(230, 230, 230, 0.1)'
                            },
                        }}
                        />
                    </ThemeProvider>
                </div>

            </Grid>
        </Grid>
    )
}


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