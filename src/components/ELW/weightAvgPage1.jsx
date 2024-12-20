import React, { useEffect, useState } from 'react';
import { Grid, Box, Table, Skeleton } from '@mui/material';
import MonthChart from './monthChart';
import MarketCurrentValue from '../Index/marketCurrentValue'
import MonthTableComponent from './weightAvgTable'
import { numberWithCommas } from '../util/util';
import WeightAvgCheck from './weightAvgCheck';
import { API_WS, useIsMobile } from '../util/config';

export default function WeightAvgPage1({ swiperRef }) {
    const isMobile = useIsMobile();
    const 매매동향당일누적스타일 = { borderRight: '1px solid #757575' }

    const [month1Data, setMonth1Data] = useState({});
    const [month2Data, setMonth2Data] = useState({});
    const [month1Value, setMonth1Value] = useState([]);
    const [table2, setTable2] = useState([]);
    const [MonthTable, setMonthTable] = useState([]);
    const [CallPutRatio_Maturity, setCallPutRatio_Maturity] = useState([]);
    const [WeightedAvgCheck, setWeightedAvgCheck] = useState([]);
    const [MarketDetail, setMarketDetail] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/weightAvgPage1`);

        ws.onopen = () => {
            console.log('weightAvgPage1 WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data)
            setMonth1Data({ series: res.WA1.series, min: res.WA1.min, categories: res.WA1.categories });
            setMonth2Data({ series: res.WA2.series, min: res.WA2.min, categories: res.WA2.categories });
            setMonth1Value(res.WA1.CTP);
            setTable2(res.TrendData);

            setMonthTable(res.MonthTable);
            setCallPutRatio_Maturity(res.CallPutRatio_Maturity);
            setWeightedAvgCheck(res.WeightedAvgCheck);
            setMarketDetail(res.MarketDetail);
        };

        ws.onerror = (error) => {
            console.error('weightAvgPage1 WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('weightAvgPage1 WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함

    // const WeightAvgRef = useRef(null);

    // // Streaming Test
    // useEffect(() => {
    //     WeightAvgRef.current = new EventSource(`${API}/elwData/weightAvgPage1`);
    //     WeightAvgRef.current.onopen = () => { };
    //     WeightAvgRef.current.onmessage = (event) => {
    //         const res = JSON.parse(event.data);
    //         setMonth1Data({ series: res.WA1.series, min: res.WA1.min, categories: res.WA1.categories });
    //         setMonth2Data({ series: res.WA2.series, min: res.WA2.min, categories: res.WA2.categories });
    //         setMonth1Value(res.WA1.CTP);
    //         setTable2(res.TrendData);
    //     };
    //     return () => {
    //         // 컴포넌트 언마운트 시 연결 종료
    //         WeightAvgRef.current.close();
    //     };
    // }, [])

    return (
        <Grid container spacing={1} >
            {
                isMobile ? <></> :
                    <Box sx={{ fontSize: '3rem', position: 'absolute', transform: 'translate(97vw, 1vh)' }} >1</Box>
            }
            <Grid item xs={isMobile ? 12 : 6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA1</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 2</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 10</span> [거래대금]
                </Box>
                {
                    isMobile ? <></> :
                        <>
                            <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                                <WeightAvgCheck ElwWeightedAvgCheck={WeightedAvgCheck} />
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
                        </>
                }

                <MonthChart data={month1Data.series} height={isMobile ? 500 : 840} categories={month1Data.categories} min={month1Data.min} />

                {
                    isMobile ? <></> :
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
                }

            </Grid>
            <Grid item xs={isMobile ? 12 : 6}>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }} >
                    <span style={{ color: 'greenyellow' }}> WA2</span>
                </Box>
                <Box sx={{ fontSize: '1rem' }} >
                    <span style={{ color: 'greenyellow' }}> 5</span>일 가중평균 - Top
                    <span style={{ color: 'greenyellow' }}> 7</span> [거래대금]
                </Box>
                {
                    isMobile ? <></> :
                        <>
                            <Box sx={{ position: 'absolute', transform: 'translate(27.6vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                                <WeightAvgCheck ElwWeightedAvgCheck={WeightedAvgCheck} />
                            </Box>
                            <Box sx={{ position: 'absolute', transform: 'translate(3vw, 60px)', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <MarketCurrentValue MarketDetail={MarketDetail} />
                            </Box>

                        </>
                }
                <MonthChart data={month2Data.series} height={isMobile ? 500 : 840} categories={month2Data.categories} min={month2Data.min} />


                {
                    isMobile ? <></> :
                        <>
                            <Box sx={{ position: 'absolute', transform: 'translate(2.6vw, -240px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <MonthTableComponent ELW_monthTable={MonthTable} ELW_CallPutRatio_Maturity={CallPutRatio_Maturity} />
                            </Box>
                            <Grid container justifyContent="flex-end" alignItems="center">
                                {month1Value && month1Value.length > 0 ?
                                    month1Value.map((value, index) => {
                                        return <>
                                            <Grid item xs={1.04} key={value} sx={{ color: 'pink', fontWeight: 'bold', fontSize: '1rem' }}>
                                                {value}
                                            </Grid>
                                        </>
                                    }) : <Skeleton variant="rectangular" animation="wave" />
                                }
                            </Grid>
                        </>
                }

            </Grid>
        </Grid>
    )
}


