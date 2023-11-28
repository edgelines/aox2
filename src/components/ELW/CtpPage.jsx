import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box } from '@mui/material';
import ELW_BarChart from './BarChart.jsx';
import { API } from '../util/config.jsx';


export default function CtpPage({ swiperRef, ElwBarData, ElwWeightedAvg }) {

    const [ELW_data1, setELW_data1] = useState([])
    const [ELW_data2, setELW_data2] = useState([])
    const [ELW_data3, setELW_data3] = useState([])
    const [ELW_data4, setELW_data4] = useState([])
    const [ELW_data5, setELW_data5] = useState([])
    const [ELW_data6, setELW_data6] = useState([])
    const [elwWeightedAvg, setElwWeightedAvg] = useState([])
    const ELW_data = [ELW_data1, ELW_data2, ELW_data3, ELW_data4, ELW_data5, ELW_data6]

    const fetchData = async () => {
        await axios.get(API + "/elwWeightedAvg").then((res) => { setElwWeightedAvg(res.data); })
        await axios.get(`${API}/elwBarData`).then((res) => {
            var data1 = res.data.filter(item => item.월구분 === '1')
            var data2 = res.data.filter(item => item.월구분 === '2')
            var data3 = res.data.filter(item => item.월구분 === '3')
            var data4 = res.data.filter(item => item.월구분 === '4')
            var data5 = res.data.filter(item => item.월구분 === '5')
            var data6 = res.data.filter(item => item.월구분 === '6')
            const dataFilter = (data) => {
                var tmp1 = [], tmp2 = [], tmp3 = [], tmp4 = [], tmp5 = [], tmp6 = [], tmp7 = []
                data.forEach((value) => {
                    tmp1.push(parseFloat(value.콜_5일평균거래대금));
                    tmp2.push(parseFloat(value.콜_거래대금));
                    tmp3.push(parseFloat(value.풋_5일평균거래대금));
                    tmp4.push(parseFloat(value.풋_거래대금));
                    tmp5.push(parseFloat(value.행사가));
                    tmp6.push(parseFloat(Math.abs(value.콜_거래대금)));
                    tmp7.push(parseFloat(Math.abs(value.풋_거래대금)));
                })
                var title = data[0].잔존만기;
                var sum1 = tmp6.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
                var sum2 = tmp7.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
                var 비율 = ' [ C : <span style="color:greenyellow;">' + (sum1 / (sum1 + sum2)).toFixed(2) + '</span>, P : <span style="color:greenyellow;">' + (sum2 / (sum1 + sum2)).toFixed(2) + '</span> ]';
                var 콜범주 = 'Call ( ' + "<span style='color:greenyellow;'>" + parseInt(sum1 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
                var 풋범주 = 'Put ( ' + "<span style='color:greenyellow;'>" + parseInt(sum2 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
                return { title: title, 콜5일: tmp1, 콜: tmp2, 풋5일: tmp3, 풋: tmp4, 행사가: tmp5, 비율: 비율, 콜범주: 콜범주, 풋범주: 풋범주, 콜비율: (sum1 / (sum1 + sum2)).toFixed(2), 풋비율: (sum2 / (sum1 + sum2)).toFixed(2) }
            }
            setELW_data1(dataFilter(data1));
            setELW_data2(dataFilter(data2));
            setELW_data3(dataFilter(data3));
            setELW_data4(dataFilter(data4));
            setELW_data5(dataFilter(data5));
            setELW_data6(dataFilter(data6));
            // console.log(dataFilter(data1));
        })
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 1)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
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
    }, [])

    useEffect(() => {
        // if (ElwBarData.data && ElwBarData.data.length > 0) {
        //     setELW_data1(ElwBarData.data[0]);
        //     setELW_data2(ElwBarData.data[1]);
        //     setELW_data3(ElwBarData.data[2]);
        //     setELW_data4(ElwBarData.data[3]);
        //     setELW_data5(ElwBarData.data[4]);
        //     setELW_data6(ElwBarData.data[5]);
        // }
        if (ElwWeightedAvg.data && ElwWeightedAvg.data.length > 0) {
            setElwWeightedAvg(ElwWeightedAvg.data)
        }
    }, [ElwWeightedAvg])

    return (
        <Grid container spacing={1}>
            {ELW_data.map((data, index) => (
                <React.Fragment key={index}>
                    <Grid item xs={4}>
                        <ELW_BarChart data={data} height={465} />
                        <Box sx={{ fontSize: '1.2rem', fontWeight: 600, position: 'absolute', transform: 'translate(2.8vw, -200px)', textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1 }}>
                            {
                                elwWeightedAvg && elwWeightedAvg.length > index ?
                                    <>
                                        <Box>C: {data.콜비율} / P: {data.풋비율}</Box>
                                        <Box sx={{ color: '#FCAB2F' }}>C (가중): {elwWeightedAvg[index].콜.toFixed(2)}</Box>
                                        <Box sx={{ color: 'greenyellow' }}>X (가중) : {elwWeightedAvg[index].전체.toFixed(2)}</Box>
                                        <Box sx={{ color: 'tomato' }}>1/2 (단순) : {((elwWeightedAvg[index].콜 + elwWeightedAvg[index].풋) / 2).toFixed(2)}</Box>
                                        <Box sx={{ color: '#00F3FF' }}>P (가중): {elwWeightedAvg[index].풋.toFixed(2)}</Box>
                                    </>
                                    : ''
                            }
                        </Box>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    )
}
