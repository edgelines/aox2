import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterStockChart from './LeadSectors/chart';
import SectorChart from './SectorsPage/sectorChart';
import { customTheme, themesTableColumns, stockTableColumns, DataTableStyleDefault } from './LeadSectors/tableColumns';
import { SectorsName15 } from './util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';
import StockChart_MA from './util/stockChart_MA';
import { StockInfo } from './SearchFinancial/info';
import { API, API_WS, STOCK, TEST } from './util/config';



export default function TestPage({ swiperRef }) {
    // const [message, setMessage] = useState('');
    // const [field, setField] = useState(''); // 상태 추가
    // const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리
    const [SectorsName, setSectorsName] = useState(null);
    const [stock, setStock] = useState({});

    const [chartData, setChartData] = useState({ data: [], yAxis: { categories: null } });
    const [themesTableData, setThemesTableData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    // hanlder
    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }
    const getInfo = async (item) => {
        var res = await axios.get(`${API}/industry/LeadSectorsTable/${item.업종명}`);
        // var res = await axios.get(`${TEST}/LeadSectorsTable/${item.업종명}`);
        setStockTableData(res.data);

        // 업종 차트
        const name = SectorsName15(item.업종명)
        setSectorsName(item.업종명);
        const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        if (!excludedNames.includes(name)) {
            var res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
            setSectorsChartDataSelected(res.data);
        }

        // 종목정보
        var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
        setStock({
            종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
            PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
            이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
            테마명: res.data.테마명
        })

        // 종목차트
        var res = await axios.get(`${STOCK}/get/${item.종목코드}`);
        // console.log(res.data);
        setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, treasuryPrice: res.data.treasuryPrice, willR: res.data.willR, net: res.data.net, MA: res.data.MA })
        //     console.log(res.data); ${item.종목코드}

    }

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/LeadSectors`);

        ws.onopen = () => {
            console.log('Lead Sectors WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setChartData(res.chart);
            setThemesTableData(res.themes);
        };

        ws.onerror = (error) => {
            console.error('Lead Sectors WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('Lead Sectors WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함


    return (
        <Grid container spacing={1} >
            {/* Main Chart */}
            <Grid item xs={5}>
                <FilterStockChart data={chartData.series} height={930} yAxis={chartData.yAxis} getInfo={getInfo} />
            </Grid>

            {/* 가운데 Table */}
            <Grid item xs={2}>
                <div style={{ height: '430px', width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={themesTableData}
                            columns={themesTableColumns}
                            hideFooter rowHeight={20}

                            // onCellClick={(params, event) => {
                            //     let item = params.row.item;
                            //     let itemStr = "" + item;
                            //     stockItemSelected({ 종목코드: params.row.종목코드, 종목명: itemStr, 업종명: params.row.업종명 });
                            // }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                // '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                // '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                // '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="부채비율"]': { borderLeft: '1.5px solid #ccc' },
                                // '[data-field="테마명"]': { borderLeft: '1.5px solid #ccc' },
                                // '[data-field="TRIMA_41"]': { borderRight: '1.5px solid #ccc' },
                            }}
                        />
                    </ThemeProvider>
                </div>

                <div style={{ height: '430px', width: "100%", mt: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={stockTableData}
                            columns={stockTableColumns}
                            hideFooter rowHeight={20}

                            // onCellClick={(params, event) => {
                            //     let item = params.row.item;
                            //     let itemStr = "" + item;
                            //     stockItemSelected({ 종목코드: params.row.종목코드, 종목명: itemStr, 업종명: params.row.업종명 });
                            // }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                // '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                // '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                // '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                                // '[data-field="부채비율"]': { borderLeft: '1.5px solid #ccc' },
                                // '[data-field="테마명"]': { borderLeft: '1.5px solid #ccc' },
                                // '[data-field="TRIMA_41"]': { borderRight: '1.5px solid #ccc' },
                            }}
                        />
                    </ThemeProvider>
                </div>
            </Grid>

            {/* Stock Info */}
            <Grid item xs={5}>
                <Grid item container>
                    <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} />
                </Grid>

                <Grid item container>
                    <StockChart_MA height={470} boxTransform={`translate(10px, 53px)`}
                        stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} stockName={stock.종목명} price={stock.현재가} net={stockChart.net}
                        willR={stockChart.willR} treasuryPrice={stockChart.treasuryPrice} treasury={stockChart.treasury} MA={stockChart.MA} />
                </Grid>

                <Grid item container sx={{ mt: 1 }}>
                    <Grid item xs={6}>

                        {stock.종목명 ?
                            <StockInfo data={stock} handleFavorite={handleFavorite} />
                            : <></>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {
                            Array.isArray(stock.연간실적) ?
                                <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                                : <></>
                        }

                    </Grid>
                </Grid>

            </Grid>


        </Grid>
    )
}
