import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Popover, Typography } from '@mui/material';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTable from './weightAvgTable'
import { numberWithCommas, update_5M } from '../util/util';
import WeightAvgCheck from './weightAvgCheck';
import { API } from '../util/config';

export default function WeightAvgPage1({ swiperRef, ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck, MarketDetail }) {
    const 매매동향당일누적스타일 = { borderRight: '1px solid #757575' }

    const [month1Data, setMonth1Data] = useState({});
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);
    const [table2, setTable2] = useState([]);

    const fetchData = async () => {
        await axios.get(`${API}/elwData/Month1`).then((res) => {
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
            const month1 = {
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
            setMonth1Data(month1);
            setMonth1Value(CTP1);
        })
        await axios.get(`${API}/elwData/Month2`).then((res) => {
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
        })
        await axios.get(API + "/TrendData").then((res) => {
            const data = res.data
            setTable2(
                [{ 구분: '코스피200', 외국인: data[data.length - 1].외국인_코스피200, 외국인_누적: data[data.length - 1].외국인_코스피200_누적, 기관: data[data.length - 1].기관_코스피200, 기관_누적: data[data.length - 1].기관_코스피200_누적, 개인: data[data.length - 1].개인_코스피200, 개인_누적: data[data.length - 1].개인_코스피200_누적 },
                { 구분: '코스피', 외국인: data[data.length - 1].외국인_코스피, 외국인_누적: data[data.length - 1].외국인_코스피_누적, 기관: data[data.length - 1].기관_코스피, 기관_누적: data[data.length - 1].기관_코스피_누적, 개인: data[data.length - 1].개인_코스피, 개인_누적: data[data.length - 1].개인_코스피_누적 },
                { 구분: '코스닥', 외국인: data[data.length - 1].외국인_코스닥, 외국인_누적: data[data.length - 1].외국인_코스닥_누적, 기관: data[data.length - 1].기관_코스닥, 기관_누적: data[data.length - 1].기관_코스닥_누적, 개인: data[data.length - 1].개인_코스닥, 개인_누적: data[data.length - 1].개인_코스닥_누적 },
                { 구분: '선물', 외국인: data[data.length - 1].외국인_선물, 외국인_누적: data[data.length - 1].외국인_선물_누적, 기관: data[data.length - 1].기관_선물, 기관_누적: data[data.length - 1].기관_선물_누적, 개인: data[data.length - 1].개인_선물, 개인_누적: data[data.length - 1].개인_선물_누적 },
                { 구분: '콜옵션', 외국인: data[data.length - 1].외국인_콜옵션, 외국인_누적: data[data.length - 1].외국인_콜옵션_누적, 기관: data[data.length - 1].기관_콜옵션, 기관_누적: data[data.length - 1].기관_콜옵션_누적, 개인: data[data.length - 1].개인_콜옵션, 개인_누적: data[data.length - 1].개인_콜옵션_누적 },
                { 구분: '풋옵션', 외국인: data[data.length - 1].외국인_풋옵션, 외국인_누적: data[data.length - 1].외국인_풋옵션_누적, 기관: data[data.length - 1].기관_풋옵션, 기관_누적: data[data.length - 1].기관_풋옵션_누적, 개인: data[data.length - 1].개인_풋옵션, 개인_누적: data[data.length - 1].개인_풋옵션_누적 },]
            )
        });
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
            <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >1</Box>
            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA1</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 2</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 10</span> [거래대금]
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(45px, 605px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '25vw' }}>
                    {table2 && table2.length > 0 ?
                        <Table sx={{ fontSize: '0.8rem', borderBottom: '1px solid #efe9e9ed', }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th colSpan={2} style={매매동향당일누적스타일}>외국인</th>
                                    <th colSpan={2} style={매매동향당일누적스타일}>기관</th>
                                    <th colSpan={2} >개인</th>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #efe9e9ed' }}>
                                    <th style={매매동향당일누적스타일} >거래소</th>
                                    <th style={매매동향당일누적스타일} >당일</th>
                                    <th style={매매동향당일누적스타일} >누적</th>
                                    <th style={매매동향당일누적스타일} >당일</th>
                                    <th style={매매동향당일누적스타일} >누적</th>
                                    <th style={매매동향당일누적스타일} >당일</th>
                                    <th >누적</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table2.map((value, index) => (
                                    <tr key={index}>
                                        {value.구분 === '코스피200' ?
                                            <td style={{ color: 'greenyellow', ...매매동향당일누적스타일 }}>{value.구분}</td> : <td style={매매동향당일누적스타일}>{String(value.구분).replace('단위:', '')}</td>
                                        }
                                        {value.외국인 > 0 ?
                                            <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인)}</td>
                                            : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인)}</td>
                                        }
                                        {value.외국인_누적 > 0 ?
                                            <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인_누적)}</td>
                                            : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인_누적)}</td>
                                        }
                                        {value.기관 > 0 ?
                                            <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관)}</td>
                                            : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관)}</td>
                                        }
                                        {value.기관_누적 > 0 ?
                                            <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관_누적)}</td>
                                            : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관_누적)}</td>
                                        }
                                        {value.개인 > 0 ?
                                            <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.개인)}</td>
                                            : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.개인)}</td>
                                        }
                                        {value.개인_누적 > 0 ?
                                            <td style={{ color: '#FCAB2F' }}>{numberWithCommas(value.개인_누적)}</td>
                                            : <td style={{ color: '#00F3FF' }}>{numberWithCommas(value.개인_누적)}</td>
                                        }

                                    </tr>
                                )
                                )}
                            </tbody>
                        </Table>
                        : <Skeleton variant="rounded" height={300} animation="wave" />
                    }
                    <Box sx={{ textAlign: 'right' }}>단위 : 콜/풋옵션 백만원, 그외 억원</Box>

                </Box>
                <MonthChart data={month1Data.series} height={840} categories={month1Data.categories} min={month1Data.min} />
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

            </Grid>
            <Grid item xs={6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA2</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 5</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 7</span> [거래대금]
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>
                <MonthChart data={month2Data.series} height={840} categories={month2Data.categories} min={month2Data.min} credit={update_5M} />

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
            </Grid>
        </Grid>
    )
}


