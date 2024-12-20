import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterStockChart from './LeadSectors/chart';
import SectorChart from './SectorsPage/sectorChart';
import { customTheme, themesTableColumns, stockTableColumns, DataTableStyleDefault, industryTableColumns } from './LeadSectors/tableColumns';
import { SectorsName15 } from './util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';
import StockChart_MA from './util/stockChart_MA';
import { StockInfoSimple } from './SearchFinancial/info';
import { API, API_WS, STOCK } from './util/config';



export default function LeadSectorsPage({ swiperRef, baseStockName }) {
    // const [message, setMessage] = useState('');
    // const [field, setField] = useState(''); // 상태 추가
    // const [ws, setWs] = useState(null); // 웹소켓 인스턴스를 상태로 관리
    const [today, setToday] = useState(null);
    const [time, setTime] = useState(null);
    const [SectorsName, setSectorsName] = useState(null);
    const [stock, setStock] = useState({});
    const [savetime, setSavetime] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [themesCounterIndustry, setThemesCounterIndustry] = useState([]);
    const [industryInfo, setIndustryInfo] = useState([]);
    const [chartData, setChartData] = useState({ data: [], yAxis: { categories: null } });
    const [themesTableData, setThemesTableData] = useState([]);
    const [themesToStockData, setThemesToStockData] = useState([]);
    const [stockTableData, setStockTableData] = useState([]);
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });
    const [tableInfo, setTableInfo] = useState({ industry: null, kospi: null, kosdaq: null })
    // const [checkStats, setCheckStats] = useState({ b1_kospi200: [] });
    const [selectedChartType, setSelectedChartType] = useState('A') // Chart Type

    // hanlder
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

    const handleSelectedChartType = async (event, value) => {
        if (value !== null) { setSelectedChartType(value) }
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
                    // PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                    // N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                    // 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    // 최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 
                    분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                    // 주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    // 테마명: res.data.테마명
                })
            }

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            } else {
                setStockChart({
                    series: [],
                    info: {
                        net: 0,
                        volumeRatio: 0,
                        willR: {
                            w9: 0,
                            w14: 0,
                            w33: 0
                        },
                        DMI: {
                            dmi_7: 0,
                            dmi_17: 0,
                            dmi_22: 0
                        }
                    }
                });
            }
        } else {
            setStock({ 종목명: null });
            setStockChart({
                series: [],
                info: {
                    net: 0,
                    volumeRatio: 0,
                    willR: {
                        w9: 0,
                        w14: 0,
                        w33: 0
                    },
                    DMI: {
                        dmi_7: 0,
                        dmi_17: 0,
                        dmi_22: 0
                    }
                }
            });
        }

    }
    const getInfoTheme = async (item) => {
        const postData = { theme: item.테마명 }
        var res = await axios.post(`${API}/themes/SelectedThemes`, postData);
        setThemesToStockData(res.data);
        setSelectedTitle(`테마 : ${item.테마명} `)
    }
    const setDate = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
        var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        var amPM = 'AM'
        if (hour >= 12) { amPM = 'PM' }
        var date = year + '-' + month + '-' + day;
        var time = `${hour}:${min}:${sec} ${amPM}`;
        setToday(date);
        setTime(time);
    }

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/LeadSectors`);
        ws.onopen = () => {
            console.log('Lead Sectors WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            // console.log(res);
            setChartData(res.chart);
            setThemesTableData(res.themes);
            setIndustryInfo(res.industryInfo);
            setTableInfo(res.tableInfo);
            setThemesCounterIndustry(res.themesToIndustry)
            // setCheckStats(res.check);
            setSavetime(res.savetime);
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
    // 시계 1초마다
    useEffect(() => {
        const timer = setInterval(() => {
            setDate();
        }, 1000);
        return () => clearInterval(timer);
    }, [])
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
        if (stock.종목코드) {
            getSelectedChartType()
        }
    }, [selectedChartType])


    return (
        <Grid container >
            {/* Clock Box */}
            <Box sx={{ position: 'absolute', transform: 'translate(980px, 400px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <Grid container >{today}</Grid>
                <Grid container >{time}</Grid>
                <Grid container sx={{ mb: 2 }}></Grid>
                <Typography sx={{ fontSize: '12px', color: 'mediumorchid' }} >50% 미만</Typography>
                <Typography sx={{ fontSize: '12px', color: 'dodgerblue' }} >50%~75%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'skyblue' }} >75%~100%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'Lawngreen' }} >100%~200%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'gold' }} >200%~300%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'orange' }} >300%~400%</Typography>
                <Typography sx={{ fontSize: '12px', color: 'tomato' }} >400% 이상</Typography>
                <Grid container sx={{ mb: 2 }}></Grid>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량</Typography>
                <Typography sx={{ fontSize: '12px', color: 'dodgerblue' }} >X : 어제기준</Typography>
                <Typography sx={{ fontSize: '12px', color: 'tomato' }} >X : 오늘기준</Typography>
                <Grid container sx={{ mb: 2 }}></Grid>
                <Typography sx={{ fontSize: '12px' }} >코스피 : {tableInfo.kospi} 종목</Typography>
                <Typography sx={{ fontSize: '12px' }} >코스닥 : {tableInfo.kosdaq} 종목</Typography>
            </Box>

            <Box sx={{ position: 'absolute', transform: 'translate(820px, 40px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '14px', textAlign: 'left' }}>
                <TableContainer >
                    <Table size='small'>
                        <TableHead>
                            <tr style={{ fontSize: '11px' }}>
                                <td style={{}} >업종명(테마창 추출)</td>
                                <td style={{ textAlign: 'center' }} >갯수</td>
                                <td style={{ textAlign: 'center' }} >%</td>
                                <td style={{ textAlign: 'center' }} >V%</td>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {
                                Array.isArray(themesCounterIndustry) && themesCounterIndustry.length > 0 ?
                                    themesCounterIndustry.map(item => (
                                        <tr style={{ fontSize: '11px' }}>
                                            <td style={{ width: '120px' }}>{item.업종명}</td>
                                            <td style={{ width: '40px', textAlign: 'right' }}>{item.전체종목수} 개</td>
                                            <td style={{ width: '45px', textAlign: 'right' }}>{item.등락률} %</td>
                                            <td style={{ width: '45px', textAlign: 'right' }}>{item.전일대비거래량} %</td>
                                        </tr>
                                    ))
                                    : ''

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Title / update time */}
            <Box sx={{ position: 'absolute', transform: 'translate(170px, 5px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                <Typography sx={{ fontSize: '15px' }} >업종 : {tableInfo.industry}개, 종목수 : {tableInfo.stock}개</Typography>
                <Grid container>
                    {savetime}
                </Grid>
            </Box>

            {/* 업종 */}
            <Grid item xs={1}>
                <Grid item container sx={{ height: "74svh", width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={industryInfo.slice(0, industryInfo.length - 12)} hideFooter rowHeight={16} columns={industryTableColumns}
                            onCellClick={(params, event) => {
                                getInfo(params.row);
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
                </Grid>
                <Grid item container sx={{ height: "24svh", width: "100%", marginTop: '10px' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={industryInfo.slice(industryInfo.length - 12)} columns={industryTableColumns} hideFooter rowHeight={16}
                            onCellClick={(params, event) => {
                                getInfo(params.row);
                            }}
                            sx={DataTableStyleDefault} />
                    </ThemeProvider>
                </Grid>
            </Grid>

            {/* Main Chart */}
            <Grid item xs={5.9}>
                <FilterStockChart data={chartData.series} height={930} yAxis={chartData.yAxis} getInfo={getInfo} />
            </Grid>

            {/* 가운데 Table */}
            <Grid item xs={1.6} sx={{ pl: 1 }}>

                <Grid item container
                    sx={{ height: '330px' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={themesTableData}
                            columns={themesTableColumns}
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
                <Grid item container sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '13px' }}> {selectedTitle !== null ? selectedTitle : ''} </Typography>
                </Grid>
                <Grid item container
                    sx={{ height: '250px', mt: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={themesToStockData}
                            columns={stockTableColumns}
                            hideFooter rowHeight={20}
                            onCellClick={(params, event) => { getInfo(params.row); }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                            }}
                        />
                    </ThemeProvider>
                </Grid>
                <Grid item container sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: '13px' }}> {SectorsName !== null ? `업종 : ${SectorsName}` : ''} </Typography>
                </Grid>
                <Grid item container
                    sx={{ height: '280px', mt: 1 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
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

            </Grid>

            {/* Stock Info */}
            <Grid item xs={3.5} sx={{ pl: 1 }}>

                <SectorChart data={SectorsChartDataSelected} sectorName={SectorsName} height={190} />

                <Grid item container >
                    <StockChart_MA height={460} boxTransform={`translate(10px, 53px)`}
                        stockName={stock.종목명} price={stock.현재가}
                        info={stockChart.info} series={stockChart.series}
                        selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                        baseStockName={baseStockName} getInfo={getInfo}
                    />
                </Grid>

                <Grid item container sx={{ mt: 1 }}>
                    {stock.종목명 ?
                        <>
                            {/* <Grid item xs={8}> */}
                            <StockInfoSimple data={stock} handleFavorite={handleFavorite} />
                            {
                                Array.isArray(stock.연간실적) ?
                                    <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                                    : <></>
                            }
                        </>

                        : <></>
                    }
                </Grid>

            </Grid>


        </Grid >
    )
}
