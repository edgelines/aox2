import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, RadioGroup, Radio, FormLabel, FormControlLabel, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StockChart from './SectorsPage/stockChart'
import SectorChart from './SectorsPage/sectorChart';
import { SectorsName15 } from './util/util';
import { API, JSON } from './util/config';

export default function TreasuryStockPage({ swiperRef, SectorsChartData }) {
    const [orignData, setOrignData] = useState([]);
    const [treasuryStock, setTreasuryStock] = useState([]);
    // 우측 Chart에 속하는 State
    const [stockName, setStockName] = useState(null);
    const [stockItemData, setStockItemData] = useState([]);
    const [stockVolumeData, setStockVolumeData] = useState([]);
    const [SectorsName, setSectorsName] = useState('');
    const [SectorsChartDataSelected, setSectorsChartDataSelected] = useState([]);
    const [취득처분선택, set취득처분선택] = useState('취득');
    const [거래일datetime, set거래일datetime] = useState(null);
    const [최대값, set최대값] = useState(null);
    const [최소값, set최소값] = useState(null);
    const [평균단가, set평균단가] = useState(null);
    const [시장선택, set시장선택] = useState('D');
    const [업종Top3, set업종Top3] = useState({});
    const [업종선택, set업종선택] = useState({});
    // Fetch Data
    const fetchData = async () => {
        const stock = await axios.get(`${API}/StockPriceDailyList`);
        const stockData = stock.data;
        const res = await axios.get(`${API}/TreasuryStock`);
        const stockInfo = (await axios.get(`${JSON}/StockYesterDayInfo`)).data;
        const data = res.data.map((item, index) => {
            const matchedStock = stockData.find(data => data.종목코드 === item.종목코드);
            const matchedStockInfo = stockInfo.find(data => data.티커 === item.종목코드);
            const 현재가 = matchedStock ? matchedStock.현재가 : null;
            const 업종명 = matchedStock ? matchedStock.업종명 : null;
            const 등락률 = matchedStock ? matchedStock.등락률 : null;
            const 수익률 = matchedStock && item.평균단가 > 0 ? (matchedStock.현재가 - item.평균단가) / item.평균단가 : null;
            const 시장 = matchedStockInfo ? matchedStockInfo.시장 : null;
            const 유보율 = matchedStockInfo ? matchedStockInfo.유보율 : null;
            const 부채비율 = matchedStockInfo ? matchedStockInfo.부채비율 : null;
            const PBR = matchedStockInfo ? matchedStockInfo.PBR : null;
            return {
                ...item,
                현재가,
                업종명,
                등락률,
                수익률: 수익률,
                시장: 시장,
                유보율: 유보율,
                부채비율: 부채비율,
                PBR: PBR,
                id: index,
            }
        })
        let origin = data.sort((a, b) => new Date(b.거래일) - new Date(a.거래일)).filter(item => (item.시장 === 'K' || item.시장 === 'D') && item.평균단가 > 0)
        setOrignData(origin);
        // let result = origin.filter(item => item.취득처분 === '취득' && item.시장 === 'D');
        // result = result.map((item, index) => { return { ...item, 순번: index } });
        // setTreasuryStock(result);
        set시장선택('D');
        set취득처분선택('취득');
    }
    const 취득처분핸들러 = (취득처분선택) => {
        set취득처분선택(취득처분선택)
        let filtered = [...orignData];
        if (취득처분선택 !== 'All') { filtered = filtered.filter(item => item.취득처분 === 취득처분선택); }
        if (시장선택 !== 'All') { filtered = filtered.filter(item => item.시장 === 시장선택); }
        filtered = filtered.map((item, index) => { return { ...item, 순번: index + 1 }; });
        return setTreasuryStock(filtered);
    }
    const 시장선택핸들러 = (시장선택) => {
        set시장선택(시장선택)
        let filtered = [...orignData];
        if (취득처분선택 !== 'All') { filtered = filtered.filter(item => item.취득처분 === 취득처분선택); }
        if (시장선택 !== 'All') { filtered = filtered.filter(item => item.시장 === 시장선택); }
        filtered = filtered.map((item, index) => { return { ...item, 순번: index + 1 }; });
        return setTreasuryStock(filtered);
    }
    const 업종명카운트 = (arr) => {
        return arr.reduce((acc, cur) => {
            if (acc[cur.업종명]) {
                acc[cur.업종명].갯수 += 1;
                acc[cur.업종명].총액 += cur.총액; // cur.총액은 현재 아이템의 총액을 의미함
            } else {
                acc[cur.업종명] = { 갯수: 1, 총액: cur.총액 };
            }
            return acc;
        }, {})
    }
    const convertToArray = (obj, keyword, 시장) => { return Object.entries(obj).map(([key, val]) => { return { 업종명: key, 갯수: val.갯수, 총액: val.총액, keyword: keyword, 시장: 시장 } }) };
    const 업종명전처리 = () => {
        if (orignData && orignData.length > 0) {
            const 코스피취득 = orignData.filter(item => item.취득처분 === '취득' && item.시장 === 'K');
            const 코스닥취득 = orignData.filter(item => item.취득처분 === '취득' && item.시장 === 'D');
            const 코스피처분 = orignData.filter(item => item.취득처분 === '처분' && item.시장 === 'K');
            const 코스닥처분 = orignData.filter(item => item.취득처분 === '처분' && item.시장 === 'D');
            const 코스피취득업종카운트 = convertToArray(업종명카운트(코스피취득), '취득', 'K');
            const 코스닥취득업종카운트 = convertToArray(업종명카운트(코스닥취득), '취득', 'D');
            const 코스피처분업종카운트 = convertToArray(업종명카운트(코스피처분), '처분', 'K');
            const 코스닥처분업종카운트 = convertToArray(업종명카운트(코스닥처분), '처분', 'D');
            set업종Top3({
                코스피취득: 코스피취득업종카운트.sort((a, b) => {
                    if (b.갯수 !== a.갯수) {
                        return b.갯수 - a.갯수;
                    }
                    return b.총액 - a.총액; // 갯수가 같을 경우 총액으로 정렬
                }),
                코스닥취득: 코스닥취득업종카운트.sort((a, b) => {
                    if (b.갯수 !== a.갯수) {
                        return b.갯수 - a.갯수;
                    }
                    return b.총액 - a.총액; // 갯수가 같을 경우 총액으로 정렬
                }),
                코스피처분: 코스피처분업종카운트.sort((a, b) => {
                    if (b.갯수 !== a.갯수) {
                        return b.갯수 - a.갯수;
                    }
                    return b.총액 - a.총액; // 갯수가 같을 경우 총액으로 정렬
                }),
                코스닥처분: 코스닥처분업종카운트.sort((a, b) => {
                    if (b.갯수 !== a.갯수) {
                        return b.갯수 - a.갯수;
                    }
                    return b.총액 - a.총액; // 갯수가 같을 경우 총액으로 정렬
                })
            })
            let result = orignData.filter(item => item.취득처분 === 취득처분선택 && item.시장 === 시장선택);
            result = result.map((item, index) => { return { ...item, 순번: index } });
            setTreasuryStock(result);
        }
    }
    const 업종선택했을때테이블변경 = () => {
        let filtered = [...orignData];
        if (취득처분선택 !== 'All') { filtered = filtered.filter(item => item.취득처분 === 업종선택.keyword); }
        filtered = filtered.filter(item => item.시장 === 업종선택.시장);
        filtered = filtered.filter(item => item.업종명 === 업종선택.업종명);
        filtered = filtered.map((item, index) => { return { ...item, 순번: index + 1 }; });
        setTreasuryStock(filtered);
        // let 
    }
    useEffect(() => { 업종선택했을때테이블변경(); }, [업종선택])
    useEffect(() => { fetchData(); }, []);
    useEffect(() => { 업종명전처리(); }, [orignData]);
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 1분 이전이라면, 9시 1분까지 남은 시간 계산
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else { delay = (5 - (minutes - 1) % 5) * 60 - seconds; }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    업종명전처리();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => { startUpdates(); }, delay * 1000);
        return () => clearTimeout(timeoutId);
    }, [orignData])

    // function
    // 종목 선택시
    const stockItemSelected = (selectedStockItem) => { // 종목 클릭시
        const 거래일dateTime = new Date(selectedStockItem.거래일).getTime();
        set거래일datetime(거래일dateTime);
        set최대값(selectedStockItem.최대값)
        set최소값(selectedStockItem.최소값)
        set평균단가(selectedStockItem.평균단가)
        setStockName(selectedStockItem.종목명);
        axios.get(`${API}/StockData/${selectedStockItem.종목코드}`)
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
        const name = SectorsName15(sector.업종명)
        setSectorsName(sector.업종명);
        if (name !== '없음') { setSectorsChartDataSelected(SectorsChartData[name]); }
    }
    // 업종 선택시
    const sectorNameSelected = (item) => { set업종선택(item) }

    // Etc.
    const treasuryStockColumns = [
        { field: '순번', headerName: '순번', width: 30, },
        {
            field: '취득처분', headerName: '취득/처분', width: 50,
            renderCell: (params) => {
                if (params.value === '취득') { return (<span style={{ color: 'tomato', fontWeight: 'bold' }}>{params.value}</span>); }
                return (<span style={{ color: 'dodgerblue' }}>{params.value}</span>);
            },
        },
        { field: '종목명', headerName: '종목명', width: 100, },
        {
            field: '현재가', headerName: '현재가', width: 72, align: 'right',
            renderCell: (params) => {
                const 현재가 = parseInt(params.value);
                const 평균단가 = parseInt(params.row.평균단가);

                let color, fontWeight;
                if (현재가 < 평균단가) {
                    color = 'dodgerblue';
                } else {
                    color = 'tomato';
                }

                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {현재가.toLocaleString('kr')}
                    </span>
                );
            }
        },
        {
            field: '수익률', headerName: '수익률', width: 72, align: 'right',
            renderCell: (params) => {
                const 수익률 = (params.value * 100).toFixed(2);
                let color, fontWeight;
                수익률 < 0 ? color = 'dodgerblue' : color = 'tomato';
                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {수익률} %
                    </span>
                );
            }
        },
        {
            field: '평균단가', headerName: '평균가', width: 65, align: 'right',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        },
        {
            field: '총액', headerName: '총액(백만원)', width: 80, align: 'right', valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value / 1000000)).toLocaleString('kr');
            }
        },
        {
            field: '거래일', headerName: '마지막거래일', width: 80, align: 'right',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return params.value.slice(2)
            }
        },
        {
            field: '유보율', headerName: '유보율', width: 65, align: 'right', valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return `${(parseInt(params.value)).toLocaleString('kr')} %`;
            }
        },
        {
            field: '부채비율', headerName: '부채비율', width: 65, align: 'right',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return `${(parseInt(params.value)).toLocaleString('kr')} %`;
            }
        },
        {
            field: 'PBR', headerName: 'PBR', width: 40, align: 'right',
        },
    ]
    const labelStyle = { fontSize: '14px', textAlign: 'start' }
    return (
        <Grid container>
            <Grid item xs={1.8}>
                <Grid container>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue="취득"
                        onChange={(event) => 취득처분핸들러(event.target.value)} // 페이지 변경 핸들러
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 660, color: '#efe9e9ed' }}>Filter by 취득/처분</FormLabel>
                        {['All', '취득', '처분'].map((item) => (
                            <FormControlLabel value={item} control={<Radio size='small' />} label={item} key={item} sx={{ '.MuiFormControlLabel-label': labelStyle }} />
                        ))}
                    </RadioGroup>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue="코스닥"
                        onChange={(event) => 시장선택핸들러(event.target.value === '코스닥' ? 'D' : event.target.value === '코스피' ? 'K' : 'All')} // 페이지 변경 핸들러
                    >
                        <FormLabel sx={{ textAlign: 'start', fontWeight: 660, color: '#efe9e9ed' }}>Filter by 코스피/코스닥</FormLabel>
                        {['All', '코스피', '코스닥'].map((item) => (
                            <FormControlLabel value={item} control={<Radio size='small' />} label={item} key={item} sx={{ '.MuiFormControlLabel-label': labelStyle }} />
                        ))}
                    </RadioGroup>
                </Grid>

                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={11.5}>
                        <Typography>취득 업종 Top5</Typography>
                        <Grid container>
                            <Grid item xs={5.9}>
                                {업종Top3.코스피취득 && 업종Top3.코스피취득.length > 0 ?
                                    <CutomTable data={업종Top3.코스피취득.slice(0, 5)} 업종명을상위컴포넌트로전달={sectorNameSelected} title={'코스피'} />
                                    :
                                    <div>Loading</div>
                                }
                            </Grid>
                            <Grid item xs={0.2}></Grid>
                            <Grid item xs={5.9}>
                                {업종Top3.코스닥취득 && 업종Top3.코스닥취득.length > 0 ?
                                    <CutomTable data={업종Top3.코스닥취득.slice(0, 5)} 업종명을상위컴포넌트로전달={sectorNameSelected} title={'코스닥'} />
                                    :
                                    <div>Loading</div>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={11.5} sx={{ mt: 2 }}>
                        <Typography>처분 업종 Top5</Typography>
                        <Grid container>
                            <Grid item xs={5.9}>
                                {업종Top3.코스피처분 && 업종Top3.코스피처분.length > 0 ?
                                    <CutomTable data={업종Top3.코스피처분.slice(0, 5)} 업종명을상위컴포넌트로전달={sectorNameSelected} title={'코스피'} />
                                    :
                                    <div>Loading</div>
                                }
                            </Grid>
                            <Grid item xs={0.2}></Grid>
                            <Grid item xs={5.9}>
                                {업종Top3.코스닥처분 && 업종Top3.코스닥처분.length > 0 ?
                                    <CutomTable data={업종Top3.코스닥처분.slice(0, 5)} 업종명을상위컴포넌트로전달={sectorNameSelected} title={'코스닥'} />
                                    :
                                    <div>Loading</div>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <div style={{ height: "100svh" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={treasuryStock} rowHeight={25} columns={treasuryStockColumns}
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
                                    종목코드: params.row.종목코드, 종목명: params.row.종목명, 업종명: params.row.업종명, 거래일: params.row.거래일,
                                    최대값: params.row.최대값, 최소값: params.row.최소값, 평균단가: params.row.평균단가,
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

                <StockChart stockItemData={stockItemData} volumeData={stockVolumeData} timeSeries={stockName} 거래일datetime={거래일datetime} 최대값={최대값} 최소값={최소값} 평균단가={평균단가} height={460} />
                <StockChart stockItemData={stockItemData} volumeData={stockVolumeData} timeSeries={stockName} rangeSelect={4} 거래일datetime={거래일datetime} 최대값={최대값} 최소값={최소값} 평균단가={평균단가} height={460} />


            </Grid>

        </Grid>
    )
}

const CutomTable = ({ data, title, 업종명을상위컴포넌트로전달 }) => {
    const 업종선택 = (item) => { 업종명을상위컴포넌트로전달(item); }
    return (
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell align='center' colSpan={2} sx={{ color: '#efe9e9ed' }}>
                        {title}
                    </TableCell>
                </TableRow>
                {data.map(item => (
                    <TableRow key={item.업종명} onClick={() => 업종선택(item)}>
                        <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }}>{item.업종명}</TableCell>
                        <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px', width: '20px' }}>{item.갯수}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
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