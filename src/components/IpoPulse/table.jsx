import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { Grid, Stack, Typography, Input, InputAdornment, Checkbox, FormControlLabel, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault } from '../util/util';
import { StyledTypography_StockInfo, Financial } from '../util/htsUtil';
import StockChart_MA from '../util/stockChart_MA';
import { renderProgress, StyledInput } from '../util/ipoUtil';
import { API, STOCK } from '../util/config';

export default function IpoPulseTable({ swiperRef, filter, checkBox, selectedIndustries, handleCheckBox, handleRangeValue, onSelectedBtn, handleReset, handleSelectedIndustries, onTotalCount }) {

    // const [filter, setFilter] = useState({
    //     high: [-44, -80], start: [-30, -100], day: [50, 100], selected: null, finance: null, lockUp: [10, 30]
    // })
    // // checkBox
    // const [checkBox, setCheckBox] = useState({
    //     high: false, start: false, day: false, all: false, order: false, lockUp: false
    // })
    // const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [postData, setPostData] = useState({
        high: checkBox.high == true ? filter.high : null,
        start: checkBox.start == true ? filter.start : null,
        day: checkBox.day == true ? filter.day : null,
        selected: filter.selected,
        finance: filter.finance,
        order: checkBox.order == true ? 'ok' : null,
        lockUp: checkBox.lockUp == true ? filter.lockUp : null,
        industry: selectedIndustries
    })

    // state
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [industryTable, setIndustryTable] = useState([]);
    const [totalCount, setTotalCount] = useState('')
    const [stock, setStock] = useState({});
    const [stockChart, setStockChart] = useState({ price: [], volume: [] });

    // Handler
    // const handleCheckBox = (name) => {
    //     setCheckBox((prevStatus) => {
    //         if (name === 'All') {
    //             const newStatus = !prevStatus.all;
    //             return {
    //                 high: newStatus,
    //                 start: newStatus,
    //                 day: newStatus,
    //                 all: newStatus,
    //             }
    //         } else {
    //             const updatedStatus = {
    //                 ...prevStatus,
    //                 [name]: !prevStatus[name],
    //             };
    //             // 다른 체크박스들의 상태를 확인하여 'All' 체크박스 상태 결정
    //             const isAllChecked = updatedStatus.high && updatedStatus.start && updatedStatus.day;
    //             return {
    //                 ...updatedStatus,
    //                 all: !isAllChecked
    //             };
    //         }

    //     });
    // }
    // const handleRangeValue = (event, name, index) => {
    //     const value = event.target.value;
    //     setFilter((prevStatus) => {
    //         const newRange = [...prevStatus[name]];
    //         newRange[index] = value;
    //         return {
    //             ...prevStatus,
    //             [name]: newRange
    //         }
    //     });
    // }
    // const handleSelectedBtn = (name, value) => {
    //     handleSelectedIndustries(value)
    //     setFilter((prevStatus) => {
    //         return {
    //             ...prevStatus,
    //             [name]: value
    //         }
    //     });
    //     setSelectedIndustries([])
    // }
    // const handleReset = () => {
    //     setCheckBox({ high: false, start: false, day: false, all: false, order: false, lockUp: false })
    //     setFilter((prevStatus) => {
    //         return {
    //             ...prevStatus,
    //             selected: null,
    //             finance: null
    //         }
    //     });
    // }
    // // 키워드 클릭 시 호출되는 함수
    // const handleSelectedIndustries = (keyword) => {
    //     if (selectedIndustries.includes(keyword)) {
    //         // 이미 선택된 키워드를 다시 클릭한 경우, 배열에서 제거
    //         setSelectedIndustries(selectedIndustries.filter(k => k !== keyword));
    //     } else {
    //         // 선택되지 않은 키워드를 클릭한 경우, 배열에 추가
    //         setSelectedIndustries([...selectedIndustries, keyword]);
    //     }
    // };

    // Action
    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
        // console.log(res.data);
        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수
        })
    }

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume })
    }

    const fetchData = async (postData) => {
        const res = await axios.post(`${API}/ipoPulse/data`, postData);
        // console.table(postData);
        // console.table(res.data.table);
        setTableData(res.data.table);
        setIndustryTable(res.data.industry);
        onTotalCount(res.data.total);

    }
    useEffect(() => {
        setPostData({
            high: checkBox.high == true ? filter.high : null,
            start: checkBox.start == true ? filter.start : null,
            day: checkBox.day == true ? filter.day : null,
            selected: filter.selected,
            finance: filter.finance,
            order: checkBox.order == true ? 'ok' : null,
            lockUp: checkBox.lockUp == true ? filter.lockUp : null,
            industry: selectedIndustries
        })
    }, [checkBox, filter, selectedIndustries])

    useEffect(() => { fetchData(postData) }, [postData])

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let delay;
        if (hour < 9) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        console.log('delay : ', delay)
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        let intervalId
        const startUpdates = () => {
            intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(postData);
                    // fetchData(checkBox, filter);
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 10);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        // return () => clearTimeout(timeoutId);
        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [])

    // ChartData
    useEffect(() => {
        if (stock.종목코드 != null) { getStockChartData(stock.종목코드); }
    }, [stock])

    const table_columns = [
        {
            field: '종목명', headerName: '종목명', width: 110,
            align: 'left', headerAlign: 'center',
        }, {
            field: '업종명', headerName: '업종명', width: 100,
            align: 'left', headerAlign: 'center',
        }, {
            field: '상장예정일', headerName: '상장일', width: 75,
            align: 'right', headerAlign: 'center',
        }, {
            field: '경과일수', headerName: '경과일수', width: 57,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가', headerName: '최고가', width: 70,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최저가', headerName: '최저가', width: 65,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '최고가대비', headerName: '대비', width: 60,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '공모가', headerName: '공모가', width: 70,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return parseInt(params.value).toLocaleString('kr');
            }
        }, {
            field: '공모가대비', headerName: '대비', width: 60,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '현재가', headerName: '현재가', width: 75,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) { return ''; }
                return (parseInt(params.value)).toLocaleString('kr');
            }
        }, {
            field: '등락률', headerName: '등락률', width: 55,
            align: 'right', headerAlign: 'center',
        }, {
            field: 'PBR', headerName: 'PBR', width: 55,
            align: 'right', headerAlign: 'center',
        }, {
            field: '보호예수', headerName: '보호예수', width: 280,
            align: 'left', headerAlign: 'center',
        }
    ]

    return (
        <>
            {/* Table */}
            <Grid container sx={{ mt: 1 }} spacing={2}>
                <Grid item xs={7.5} sx={{ height: 700, width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={table_columns}
                            // getRowHeight={() => 'auto'}
                            rowHeight={25}
                            onCellClick={(params, event) => {
                                getStockCode(params.row);
                                getStockChartData(params.row.종목코드);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="경과일수"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="최고가대비"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="공모가대비"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="등락률"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="PBR"]': { borderRight: '1.5px solid #ccc' },
                                '[data-field="현재가"]': { backgroundColor: '#6E6E6E' },
                                // [`& .highlight`]: {
                                //     color: 'tomato',
                                // },
                            }}
                        />
                    </ThemeProvider>
                </Grid>

                <Grid item container xs={1}>
                    <TableContainer sx={{ height: 650 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {industryTable && industryTable.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {industryTable.map(item => (
                                        <TableRow key={item.업종명} onClick={() => onSelectedBtn('industry', item.업종명)}
                                            sx={{
                                                '&:hover': { backgroundColor: '#6E6E6E' }, // 마우스 오버 시 배경색 변경
                                                backgroundColor: selectedIndustries.includes(item.업종명) ? '#6E6E6E' : 'transparent', // 선택된 업종명에 대한 배경색
                                                '.MuiTableCell-root': {
                                                    color: selectedIndustries.includes(item.업종명) ? '#FCAB2F' : '#efe9e9ed', // 선택된 업종명에 대한 글꼴 색상
                                                    fontSize: '10px',
                                                    p: 0.2
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.업종명.slice(0, 10)}</TableCell>
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}>{item.갯수}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }
                    </TableContainer>

                </Grid>

                {/* 우측 기업 정보 */}
                <Grid item xs={3.5}>
                    <Grid item container sx={{ minHeight: 109 }}>
                        <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                            {
                                Array.isArray(stock.기업개요) ?
                                    stock.기업개요.map(item => (
                                        <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                    ))
                                    : <></>
                            }
                        </Stack>
                    </Grid>
                    <Grid item container sx={{ minHeight: 233 }}>
                        <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                    </Grid>
                    <Grid item container sx={{ mt: 1 }}>
                        {
                            Array.isArray(stockChart.price) ?
                                <Grid container>
                                    <StockChart_MA height={280} stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} boxTransform={'translate(10px, 140px)'} />
                                </Grid>
                                : <></>
                        }
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '9px',
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10px',
                    color: '#efe9e9ed'
                },
            },
            defaultProps: {
                headerHeight: 15,
            },
        },
    },
});