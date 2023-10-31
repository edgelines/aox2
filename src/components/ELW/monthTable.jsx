import React, { useEffect, useState } from 'react';
import { Grid, Box, Table } from '@mui/material';
import Kospi200CurrentValue from '../Index/kospi200CurrentValue';
import axios from 'axios';

export default function MonthTable({ ELW_monthTable, valueFont, valueTitle, ELW_CallPutRatio_Maturity }) {
    const month = ELW_monthTable.month ? ELW_monthTable.month : ['', '', '']
    const tr1 = ELW_monthTable.meanData1;
    const tr2 = ELW_monthTable.meanData2;
    const tr3 = ELW_monthTable.meanData3;
    const Maturity1 = dataFilter(ELW_CallPutRatio_Maturity.filter(item => item.월구분 === '1'))
    const Maturity2 = dataFilter(ELW_CallPutRatio_Maturity.filter(item => item.월구분 === '2'))
    const Maturity3 = dataFilter(ELW_CallPutRatio_Maturity.filter(item => item.월구분 === '3'))
    const dataFilter = (data) => {
        var tmp6 = [], tmp7 = []
        data.forEach((value) => {
            tmp6.push(parseFloat(Math.abs(value.콜_거래대금)));
            tmp7.push(parseFloat(Math.abs(value.풋_거래대금)));
        })
        var title = data[0].잔존만기;
        var sum1 = tmp6.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
        var sum2 = tmp7.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
        return { title: title, 콜비율: (sum1 / (sum1 + sum2)).toFixed(2), 풋비율: (sum2 / (sum1 + sum2)).toFixed(2) }
    }
    // const [net, setNet] = useState(null);
    // const [marketValue, setMarketValue] = useState(null);
    // const 전일대비 = MarketDetail[0].전일대비
    // const 지수 = MarketDetail[0].지수.toFixed(2) + ' ( ' + MarketDetail[0].전일대비 + '% )'

    // const fetchData = async () => {
    //     await axios.get(`${API}elwBarData`).then((res) => {
    //         var data1 = res.data.filter(item => item.월구분 === '1')
    //         var data2 = res.data.filter(item => item.월구분 === '2')
    //         var data3 = res.data.filter(item => item.월구분 === '3')
    //         const dataFilter = (data) => {
    //             var tmp1 = [], tmp2 = [], tmp3 = [], tmp4 = [], tmp5 = [], tmp6 = [], tmp7 = []
    //             data.forEach((value) => {
    //                 tmp1.push(parseFloat(value.콜_5일평균거래대금));
    //                 tmp2.push(parseFloat(value.콜_거래대금));
    //                 tmp3.push(parseFloat(value.풋_5일평균거래대금));
    //                 tmp4.push(parseFloat(value.풋_거래대금));
    //                 tmp5.push(parseFloat(value.행사가));
    //                 tmp6.push(parseFloat(Math.abs(value.콜_거래대금)));
    //                 tmp7.push(parseFloat(Math.abs(value.풋_거래대금)));
    //             })
    //             var title = data[0].잔존만기;
    //             var sum1 = tmp6.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
    //             var sum2 = tmp7.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
    //             var 비율 = ' [ C : <span style="color:greenyellow;">' + (sum1 / (sum1 + sum2)).toFixed(2) + '</span>, P : <span style="color:greenyellow;">' + (sum2 / (sum1 + sum2)).toFixed(2) + '</span> ]';
    //             var 콜범주 = 'Call ( ' + "<span style='color:greenyellow;'>" + parseInt(sum1 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
    //             var 풋범주 = 'Put ( ' + "<span style='color:greenyellow;'>" + parseInt(sum2 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
    //             return { title: title, 콜비율: (sum1 / (sum1 + sum2)).toFixed(2), 풋비율: (sum2 / (sum1 + sum2)).toFixed(2) }
    //         }
    //         setELW_data1(dataFilter(data1));
    //         setELW_data2(dataFilter(data2));
    //         setELW_data3(dataFilter(data3));
    //         // console.log(dataFilter(data1));
    //     })
    // }

    // useEffect(() => {
    //     fetchData();
    // }, [])

    // // 2분 주기 업데이트
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         const now = new Date();
    //         const hour = now.getHours();
    //         const dayOfWeek = now.getDay();
    //         if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
    //             fetchData()
    //         }

    //     }, 1000 * 60 * 2);
    //     return () => clearInterval(intervalId);
    // }, [])

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} >
                {
                    tr1 && tr1.length > 0 ?
                        <>
                            <Table sx={{ mt: 1, mb: 1 }}>
                                <thead>
                                    <tr>

                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>{month[0]}월 만기</td>
                                        <td>{month[1]}월 만기</td>
                                        <td>{month[2]}월 만기</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        {tr1.slice(0, 3).map((item, index) => (
                                            <td key={index}>{item}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        {tr2.slice(0, 3).map((item, index) => (
                                            <td key={index}>{item}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        {tr3.slice(0, 3).map((item, index) => (
                                            <td key={index}>{item}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td style={{ color: 'greenyellow' }}>Avg.</td>
                                        <td style={{ color: 'greenyellow' }}>{ELW_monthTable.meanData1[3]}</td>
                                        <td style={{ color: 'greenyellow' }}>{ELW_monthTable.meanData2[3]}</td>
                                        <td style={{ color: 'greenyellow' }}>{ELW_monthTable.meanData3[3]}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Kospi200CurrentValue valueFont={valueFont} valueTitle={valueTitle} />
                        </>
                        : ''
                }
            </Grid>
        </Grid>

    )
}