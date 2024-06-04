import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Switch, FormControlLabel } from '@mui/material';
import CoreChart from '../util/CoreChart.jsx';
import GpoChart from './GpoChart.jsx';
import ELW_BarChart from './BarChart.jsx';
import MarketCurrentValue from '../Index/marketCurrentValue.jsx';
import { API, API_WS, API_FILE, TEST } from '../util/config.jsx';

export default function DetailPage({ swiperRef }) {
    // const vixData = [{ name: 'Vix', color: 'tomato', pointWidth: 8, data: [parseFloat(Vix.value)], animation: false }];

    const [CTP1, setCTP1] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [CTP2, setCTP2] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [CTP3, setCTP3] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [WeightedAvg, setWeightedAvg] = useState([])
    const ELW_data = [CTP1, CTP2, CTP3]

    const [vixData, setVixData] = useState([]);
    const [MarketDetail, setMarketDetail] = useState([]);
    const [kospi200, setKospi200] = useState(null);
    const [kospi200MinValue, setKospi200MinValue] = useState(0);
    const [exNow_KR, setExNow_KR] = useState({});
    const [exNow_US, setExNow_US] = useState({});
    const [dataUS, setDataUS] = useState({});
    const [selectedUS, setSeletedUS] = useState({});
    const [OnUS, setOnUS] = useState(false);

    const handleOnUS = (event) => { setOnUS(event.target.checked); }
    const fetchData1st = async () => {
        await axios.get(`${API_FILE}/indexData/exNow_US`).then((res) => {
            setExNow_US(res.data.commitData);
            setDataUS(res.data.DataUS)
        });

        await axios.get(`${API_FILE}/indexData/exNow_KR`).then((res) => {
            setExNow_KR(res.data);
        });
    }

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/detailPage`);

        ws.onopen = () => {
            console.log('detailPage WebSocket Connected');
            fetchData1st();
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setVixData(res.Vix);
            setMarketDetail(res.MarketDetail);
            setKospi200(res.Kospi200.data);
            setKospi200MinValue(res.Kospi200.min);
            setCTP1(res.CTP[0]);
            setCTP2(res.CTP[1]);
            setCTP3(res.CTP[2]);
            setWeightedAvg(res.WeightedAvg);

        };

        ws.onerror = (error) => {
            console.error('detailPage WebSocket Error: ', error);
        };

        ws.onclose = () => {
            console.log('detailPage WebSocket Disconnected');
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함



    useEffect(() => {
        if (OnUS) {
            setSeletedUS(dataUS)
        } else {
            let dataArray = Array.from({ length: 13 }, () => []); // 12개의 빈 배열을 생성
            let emptyArr = { ...dataArray.reduce((obj, item, index) => ({ ...obj, [`data${index}`]: item }), {}) }
            setSeletedUS(emptyArr);
        }
    }, [OnUS])



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
                                        WeightedAvg && WeightedAvg.length > index ?
                                            <>
                                                <Box>C: {data.콜비율} / P: {data.풋비율}</Box>
                                                <Box sx={{ color: '#FCAB2F' }}>C (가중): {WeightedAvg[index].콜.toFixed(2)}</Box>
                                                <Box sx={{ color: 'greenyellow' }}>X (가중) : {WeightedAvg[index].전체.toFixed(2)}</Box>
                                                <Box sx={{ color: 'tomato' }}>1/2 (단순) : {((WeightedAvg[index].콜 + WeightedAvg[index].풋) / 2).toFixed(2)}</Box>
                                                <Box sx={{ color: '#00F3FF' }}>P (가중): {WeightedAvg[index].풋.toFixed(2)}</Box>
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

                <Box sx={{ position: 'absolute', transform: 'translate(77vw, 17vh)', zIndex: 5, justifyItems: 'right', backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 1 }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>

                <GpoChart data1={exNow_KR} data2={exNow_US} data3={selectedUS} kospi200={kospi200} height={450} yMinValue={kospi200MinValue} />

            </Grid>
        </Grid>

    )
}
