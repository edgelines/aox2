import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Switch, FormControlLabel, Modal, Backdrop, Button } from '@mui/material';
import CoreChart from '../util/CoreChart.jsx';
import GpoChart from './GpoChart.jsx';
import ELW_BarChart from './BarChart.jsx';
import MarketCurrentValue from '../Index/marketCurrentValue.jsx';
import { API, JSON } from '../util/config.jsx';

export default function DetailPage({ swiperRef, Vix, MarketDetail, ElwBarData, ElwWeightedAvg }) {
    // const updateA = 'Start - 9:2, Update - 지수분봉'
    // const updateB = 'Updates-5m'
    // const updateC = 'Updates-2m'
    const updateD = 'Start - 9:20, Update - 5m'
    // const updateF = 'Start - 9:20, Update - 지수분봉'
    // const updateE = 'Updates-1Day'
    const vixData = [{ name: 'Vix', color: 'tomato', pointWidth: 8, data: [parseFloat(Vix.value)], animation: false }];

    const [ELW_data1, setELW_data1] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [ELW_data2, setELW_data2] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [ELW_data3, setELW_data3] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [elwWeightedAvg, setElwWeightedAvg] = useState([])
    const ELW_data = [ELW_data1, ELW_data2, ELW_data3]
    const [kospi200, setKospi200] = useState(null);
    const [exNow_KR, setExNow_KR] = useState({});
    const [exNow_US, setExNow_US] = useState({});
    const [dataUS, setDataUS] = useState({});
    const [selectedUS, setSeletedUS] = useState({});
    const [OnUS, setOnUS] = useState(false);

    const fetchData = async () => {
        await axios.get(JSON + "/Kospi200_GPOchart").then((response) => { setKospi200(response.data.data); });

        await axios.get(JSON + "/exNow_KR").then((response) => {
            let data = response.data;
            let dataArray = Array.from({ length: 12 }, () => []); // 12개의 빈 배열을 생성
            let 지난달_47 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_43 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_41 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_39 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_21 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_10 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_6 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_만기 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성
            let 지난달_만기월 = Array.from({ length: 12 }, () => null); // 17개의 null을 생성

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < 12; j++) {
                    dataArray[j].push([data[i].ts, data[i][`지난달${j}_Ref`]]);
                }

                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 47) { 지난달_47[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 43) { 지난달_43[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 41) { 지난달_41[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 39) { 지난달_39[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 21) { 지난달_21[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 10) { 지난달_10[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 6) { 지난달_6[j] = data[i].ts; } }
                for (let j = 0; j < 12; j++) { if (data[i][`지난달${j}`] == 1) { 지난달_만기[j] = data[i].ts; 지난달_만기월[j] = (new Date(data[i].ts).getMonth() + 1 < 10 ? "0" : "") + (new Date(data[i].ts).getMonth() + 1); } }
            }

            let commitData = {
                ...dataArray.reduce((obj, item, index) => ({ ...obj, [`data${index}`]: item }), {}),
                ...지난달_47.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_47`]: item }), {}),
                ...지난달_43.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_43`]: item }), {}),
                ...지난달_41.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_41`]: item }), {}),
                ...지난달_39.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_39`]: item }), {}),
                ...지난달_21.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_21`]: item }), {}),
                ...지난달_10.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_10`]: item }), {}),
                ...지난달_6.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_6`]: item }), {}),
                ...지난달_만기.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_만기`]: item }), {}),
                ...지난달_만기월.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_만기월`]: item }), {}),
            };
            setExNow_KR(commitData);
        });
        await axios.get(JSON + "/exNow_US").then((response) => {
            let data = response.data;
            let dataArray = Array.from({ length: 13 }, () => []); // 12개의 빈 배열을 생성
            let 지난달_47 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_43 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_41 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_39 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_21 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_10 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_5 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_만기 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성
            let 지난달_만기월 = Array.from({ length: 13 }, () => null); // 17개의 null을 생성

            for (let i = 0; i < data.length; i++) {

                for (let j = 0; j < 13; j++) { dataArray[j].push([data[i].ts, data[i][`지난달${j}_Ref`]]); }

                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 47) { 지난달_47[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 43) { 지난달_43[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 41) { 지난달_41[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 39) { 지난달_39[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 16) { 지난달_21[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 10) { 지난달_10[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 5) { 지난달_5[j] = data[i].ts; } }
                for (let j = 0; j < 13; j++) { if (data[i][`지난달${j}`] == 1) { 지난달_만기[j] = data[i].ts; 지난달_만기월[j] = (new Date(data[i].ts).getMonth() + 1 < 10 ? "0" : "") + (new Date(data[i].ts).getMonth() + 1); } }
            }

            let commitData = {
                ...지난달_47.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_47`]: item }), {}),
                ...지난달_43.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_43`]: item }), {}),
                ...지난달_41.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_41`]: item }), {}),
                ...지난달_39.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_39`]: item }), {}),
                ...지난달_21.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_21`]: item }), {}),
                ...지난달_10.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_10`]: item }), {}),
                ...지난달_5.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_5`]: item }), {}),
                ...지난달_만기.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_만기`]: item }), {}),
                ...지난달_만기월.reduce((obj, item, index) => ({ ...obj, [`지난달${index}_만기월`]: item }), {}),
            };
            setExNow_US(commitData);
            setDataUS({ ...dataArray.reduce((obj, item, index) => ({ ...obj, [`data${index}`]: item }), {}) })
        })
    };

    useEffect(() => { fetchData(); }, [])
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

    }, [])
    useEffect(() => {
        if (ElwBarData.status === 'succeeded') {
            var data1 = ElwBarData.data.filter(item => item.월구분 === '1')
            var data2 = ElwBarData.data.filter(item => item.월구분 === '2')
            var data3 = ElwBarData.data.filter(item => item.월구분 === '3')
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
        }
        if (ElwWeightedAvg.status === 'succeeded') {
            setElwWeightedAvg(ElwWeightedAvg.data);
        }
    }, [ElwBarData, ElwWeightedAvg])
    useEffect(() => {
        if (OnUS) {
            setSeletedUS(dataUS)
        } else {
            let dataArray = Array.from({ length: 13 }, () => []); // 12개의 빈 배열을 생성
            let emptyArr = { ...dataArray.reduce((obj, item, index) => ({ ...obj, [`data${index}`]: item }), {}) }
            setSeletedUS(emptyArr);
        }
    }, [OnUS])
    const handleOnUS = (event) => { setOnUS(event.target.checked); }

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} >
                <Grid container spacing={1} >
                    <Grid item xs={0.6} >
                        <CoreChart data={vixData} height={480} name={'VixColumn'} categories={['']} type={'column'} hidenLegend={true} />
                    </Grid>
                    {ELW_data.map((data, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={3.8}>
                                <ELW_BarChart data={data} height={480} />
                                <Box sx={{ fontSize: '1.05rem', fontWeight: 600, position: 'absolute', transform: 'translate(2.8vw, -18.5vh)', textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1 }}>
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
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ position: 'absolute', transform: 'translate(9vw, 0vh)', zIndex: 5 }}>
                    <FormControlLabel
                        control={<Switch checked={OnUS} onChange={handleOnUS} />}
                        label="US On"
                    />
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(86.2vw, -2vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {updateD}
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(77vw, 17vh)', zIndex: 5, justifyItems: 'right', backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 1 }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>

                <GpoChart data1={exNow_KR} data2={exNow_US} data3={selectedUS} kospi200={kospi200} height={450} />

            </Grid>
        </Grid>

    )
}
