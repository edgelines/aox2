import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Skeleton } from '@mui/material';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTable from './weightAvgTable'
import CoreChart from '../util/CoreChart';
import WeightAvgCheck from './weightAvgCheck';
import { API } from '../util/config';

export default function WeightAvgPage2({ swiperRef, ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck, MarketDetail }) {
    // const updateA = 'Start - 9:2, Update - 지수분봉'
    // const updateB = 'Updates-5m'
    // const updateC = 'Updates-2m'
    const updateD = 'Start - 9:20, Update - 5m'
    // const updateE = 'Update - 1Day'
    // const [month1Data, setMonth1Data] = useState({});
    const [month1X, setMonth1X] = useState({});
    const [month2X, setMonth2X] = useState({});
    const [month3X, setMonth3X] = useState({});
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);
    const month = ELW_monthTable && ELW_monthTable[0] ? [parseInt(ELW_monthTable[0].최종거래일.split('/')[1]), parseInt(ELW_monthTable[1].최종거래일.split('/')[1]), parseInt(ELW_monthTable[2].최종거래일.split('/')[1])] : ['', '', '']
    const monthTitle = { fontSize: '16px' }
    const categories = ['B6', 'B5', 'B4', 'B3', 'B2', 'B1', '09:20'];
    var HH = 9, MM = 20
    for (var i = 0; i < 75; i++) {
        MM = MM + 5
        if (MM >= 60) {
            HH += 1
            MM = 0
        }
        categories.push(String(HH).padStart(2, '0') + ':' + String(MM).padStart(2, '0'))
    }

    const fetchData = async () => {
        await axios.get(`${API}/elwData/Month4`).then((res) => {
            var call = [], put = [], kospi200 = [], CallMean = [], PutMean = [], Mean1 = [], Mean2 = [], CTP1 = [], CTP15 = [], CTP2 = [], Min = [], Date = [];
            res.data.slice(-11).forEach((value, index, array) => {
                call.push([value.콜_최소, value.콜_최대])
                put.push([value.풋_최소, value.풋_최대])
                kospi200.push(value.종가)
                CallMean.push(parseFloat(value.콜_가중평균.toFixed(1)))
                PutMean.push(parseFloat(value.풋_가중평균.toFixed(1)))
                Mean1.push(parseFloat(((value.콜_가중평균 + value.풋_가중평균) / 2).toFixed(1)))
                Mean2.push(parseFloat(value.콜풋_가중평균.toFixed(1)))
                CTP1.push(parseFloat(value['1일'].toFixed(1)))
                CTP15.push(parseFloat(value['1_5일'].toFixed(1)))
                CTP2.push(parseFloat(value['2일'].toFixed(1)))
                if (value.콜_최소 > 1) {
                    Min.push(value.콜_최소)
                }
                if (value.풋_최소 > 1) {
                    Min.push(value.풋_최소)
                }
                Date.push(value.최종거래일.substr(2, 2) + '.' + value.최종거래일.substr(5, 2) + '.' + value.최종거래일.substr(8, 2) + '.')
            })
            let Min1 = Math.min(...Min)
            const month = {
                series: [
                    { name: "Call", type: "errorbar", color: "#FCAB2F", lineWidth: 2, data: call },
                    { name: "Put", type: "errorbar", color: "#00F3FF", lineWidth: 2, data: put },
                    { name: "Kospi200", type: "spline", color: "#efe9e9ed", data: kospi200, marker: { radius: 5 }, lineWidth: 1.5, zIndex: 5, },
                    { name: "Call_mean", type: "spline", color: "#FCAB2F", data: CallMean, lineWidth: 1, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "Put_mean", type: "spline", color: "#00F3FF", data: PutMean, lineWidth: 0, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "1/2 (단순)", type: "line", color: "tomato", data: Mean1, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "가중", type: "line", color: "greenyellow", data: Mean2, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "1일", type: "spline", color: "pink", data: CTP1, lineWidth: 1, marker: { symbol: "circle", radius: 3 }, },
                    { name: "1.5일", type: "spline", color: "gold", data: CTP15, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                    { name: "2일", type: "spline", color: "magenta", data: CTP2, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                ],
                min: Min1,
                categories: Date
            }
            setMonth2Data(month);
            setMonth1Value(CTP1);
        })
        await axios.get(API + "/elwData/ELWx").then((res) => {
            var Month1_1일 = [], Month1_2일 = [], Month1_3일 = [], Month1_5일 = [], Month1_1_5일 = [], Month1 = [],
                Month2_1일 = [], Month2_2일 = [], Month2_3일 = [], Month2_5일 = [], Month2_1_5일 = [], Month2 = [],
                Month3_1일 = [], Month3_2일 = [], Month3_3일 = [], Month3_5일 = [], Month3_1_5일 = [], Month3 = [];
            res.data.map((value, index, array) => {
                Month1_1일.push(value['Month1_1일'])
                Month1_1_5일.push(value['Month1_1_5일'])
                Month1_2일.push(value['Month1_2일'])
                Month1_3일.push(value['Month1_3일'])
                Month1_5일.push(value['Month1_5일'])
                Month2_1일.push(value['Month2_1일'])
                Month2_2일.push(value['Month2_2일'])
                Month2_3일.push(value['Month2_3일'])
                Month2_5일.push(value['Month2_5일'])
                Month2_1_5일.push(value['Month2_1_5일'])
                Month3_1일.push(value['Month3_1일'])
                Month3_2일.push(value['Month3_2일'])
                Month3_3일.push(value['Month3_3일'])
                Month3_5일.push(value['Month3_5일'])
                Month3_1_5일.push(value['Month3_1_5일'])
            })
            Month1 = Month1.concat(Month1_1일, Month1_2일, Month1_3일, Month1_5일)
            Month2 = Month2.concat(Month2_1일, Month2_2일, Month2_3일, Month2_5일)
            Month3 = Month2.concat(Month3_1일, Month3_2일, Month3_3일, Month3_5일)
            let Month1Min = Math.min(...Month1)
            let Month2Min = Math.min(...Month2)
            let Month3Min = Math.min(...Month3)
            const M1 = {
                series: [
                    {
                        zIndex: 3, name: "1일", color: "tomato", data: Month1_1일,
                    }, {
                        name: "1.5일", color: "greenyellow", data: Month1_1_5일,
                    }, {
                        name: "2일", color: "dodgerblue", data: Month1_2일,
                    }, {
                        name: "3일", color: "violet", data: Month1_3일,
                    }, {
                        name: "5일", color: "#efe9e9ed", data: Month1_5일,
                    }
                ], min: Month1Min
            }
            const M2 = {
                series: [
                    {
                        zIndex: 3, name: "1일", color: "tomato", data: Month2_1일,
                    }, {
                        name: "1.5일", color: "greenyellow", data: Month2_1_5일,
                    }, {
                        name: "2일", color: "dodgerblue", data: Month2_2일,
                    }, {
                        name: "3일", color: "violet", data: Month2_3일,
                    }, {
                        name: "5일", color: "#efe9e9ed", data: Month2_5일,
                    }
                ], min: Month2Min
            }
            const M3 = {
                series: [
                    {
                        zIndex: 3, name: "1일", color: "tomato", data: Month3_1일,
                    }, {
                        name: "1.5일", color: "gold", data: Month3_1_5일,
                    }, {
                        name: "2일", color: "dodgerblue", data: Month3_2일,
                    }, {
                        name: "3일", color: "violet", data: Month3_3일,
                    }, {
                        name: "5일", color: "#efe9e9ed", data: Month3_5일,
                    }
                ], min: Month3Min
            }
            setMonth1X(M1)
            setMonth2X(M2)
            setMonth3X(M3)
        })
    };

    useEffect(() => {
        fetchData();

    }, [])

    // 30초 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 1분 이전이라면, 9시 1분까지 남은 시간 계산
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        const startUpdates = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData();
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId); // 컴포넌트가 unmount될 때 타이머 제거
        // const intervalId = setInterval(() => {
        //     const now = new Date();
        //     const hour = now.getHours();
        //     const dayOfWeek = now.getDay();

        //     if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
        //         fetchData();
        //     }

        // }, 1000 * 60 * 5);
        // return () => clearInterval(intervalId);
    }, [])


    return (
        <Grid container spacing={1} >
            <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >2</Box>
            <Grid item xs={6}>
                <Box sx={{ mt: 1 }}>
                    <span style={monthTitle}> {month[0]}월 만기</span>
                    <Box sx={{ mt: -3 }}>
                        <CoreChart data={month1X.series} height={318} name={'xValue'} categories={categories} min={month1X.min} lengendX={20} />
                    </Box>
                    <span style={monthTitle}> {month[1]}월 만기</span>
                    <Box sx={{ mt: -4 }}>
                        <CoreChart data={month2X.series} height={318} name={'xValue'} categories={categories} min={month2X.min} lengendX={20} />
                    </Box>
                    <span style={monthTitle}> {month[2]}월 만기</span>
                    <Box sx={{ mt: -5 }}>
                        <CoreChart data={month3X.series} height={318} name={'xValue'} categories={categories} min={month3X.min} lengendX={20} />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA3</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 3</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 7</span> [거래대금]
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>
                <MonthChart data={month2Data.series} height={840} categories={month2Data.categories} min={month2Data.min} credit={updateD} />
                <Box sx={{ position: 'absolute', transform: 'translate(2.6vw, -280px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}><MonthTable ELW_monthTable={ELW_monthTable} ELW_CallPutRatio_Maturity={ELW_CallPutRatio_Maturity} /></Box>
                <Grid container justifyContent="flex-end" alignItems="center">
                    {month1Value && month1Value.length > 0 ?
                        month1Value.map((value, index) => {
                            return <>
                                <Grid item xs={1.04} key={index} sx={{ color: 'pink', fontWeight: 'bold', fontSize: '1rem' }}>
                                    {value}
                                </Grid>
                            </>
                        }) : <Skeleton variant="rectangular" animation="wave" />
                    }
                </Grid>
                {/* <Grid container justifyContent="flex-end" alignItems="center" onMouseLeave={handlePopoverCloseAll}>
                    {month2Data.categories && month2Row && month2Row.length > 0 ?
                        month2Data.categories.map((value, index) => {
                            return <>
                                <Grid item xs={1.15} key={index}>
                                    <Typography
                                        aria-owns={openPopover2[index] ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={(event) => handlePopoverOpen2(event, index)}
                                        onMouseLeave={() => handlePopoverClose2(index)}
                                        sx={{ fontSize: '10px', color: '#efe9e9ed', cursor: 'pointer' }}
                                    >{value.slice(3, 5)}</Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        open={openPopover2[index]}
                                        anchorEl={anchorEl2[index]}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        onClose={() => handlePopoverClose2(index)}
                                        disableRestoreFocus
                                    >
                                        <Typography>
                                            <Table size="small" sx={{ fontSize: '10px' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>권리유형</TableCell>
                                                        <TableCell>행사가</TableCell>
                                                        <TableCell>종목명</TableCell>
                                                        <TableCell>최종거래일</TableCell>
                                                        <TableCell>3일평균거래대금</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        month2Row.map((rowvalue) => {
                                                            if (rowvalue.월구분 === index + 1) {
                                                                const color = rowvalue.권리유형 === '콜' ? '#fee0b4' : '#b3fbff'
                                                                const 거래대금 = rowvalue['3일평균거래대금'] >= 100000000 ? `${numberWithCommas(parseInt(rowvalue['3일평균거래대금'] / 100000000))} 억원` : `${numberWithCommas(rowvalue['3일평균거래대금'])} 원`
                                                                return (
                                                                    <TableRow key={rowvalue.종목코드} sx={{ backgroundColor: color }}>
                                                                        <TableCell>{rowvalue.권리유형}</TableCell>
                                                                        <TableCell>{rowvalue.행사가}</TableCell>
                                                                        <TableCell>{rowvalue.종목명}</TableCell>
                                                                        <TableCell>{rowvalue.최종거래일}</TableCell>
                                                                        <TableCell>{거래대금}</TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                            return null; // 월구분이 일치하지 않는 경우 null 반환
                                                        }
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Typography>
                                    </Popover>
                                </Grid>
                            </>
                        })
                        : <Skeleton variant="rounded" animation="wave" />
                    }
                </Grid> */}
            </Grid>
        </Grid>
    )
}




{/* <Box sx={{ fontSize: '2rem' }}>
                    - 작업중
                </Box>
                <Box sx={{ fontSize: '1.5rem', textAlign: 'left', mt: '10vh' }}>
                    <ul>1. 데이터는 8월 4일 종가 기준</ul>
                    <ul>2. 2일평균거래대금의 top10 들의 call, put 가중평균</ul>
                    <ul>3. 단순X :  (Call_mean + Put_mean) / 2 </ul>
                    <ul> 가중X : Call과 Put의 가중평균 </ul>
                    <ul>4. 1일 : CTP 전체 데이터 가중평균 </ul>
                    <ul>5. 1.5일 : (1일 + 2일 ) /2 </ul>
                    <ul>6. 2일 : CTP데이터에서 2일평균거래대금으로 Call과 Put 전체데이터 가중평균 </ul>
                    <ul>7. 페이지 하단 08, 09, ... 06까지 마우스올려두면 리얼데이터가 나타남 </ul>
                </Box> */}