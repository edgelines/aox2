import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Switch, FormControlLabel } from '@mui/material';
import CoreChart from '../util/CoreChart.jsx';
import GpoChart from './GpoChart.jsx';
import ELW_BarChart from './BarChart.jsx';
import MarketCurrentValue from '../Index/marketCurrentValue.jsx';
import { API, myJSON, API_FILE, TEST } from '../util/config.jsx';
import { update_5M } from '../util/util';

export default function DetailPage({ swiperRef, Vix, MarketDetail }) {

    const vixData = [{ name: 'Vix', color: 'tomato', pointWidth: 8, data: [parseFloat(Vix.value)], animation: false }];

    const [ELW_data1, setELW_data1] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [ELW_data2, setELW_data2] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [ELW_data3, setELW_data3] = useState({ title: null, 콜5일: null, 콜: null, 풋5일: null, 풋: null, 행사가: null, 비율: null, 콜범주: null, 풋범주: null });
    const [elwWeightedAvg, setElwWeightedAvg] = useState([])
    const ELW_data = [ELW_data1, ELW_data2, ELW_data3]
    const [kospi200, setKospi200] = useState(null);
    const [kospi200MinValue, setKospi200MinValue] = useState(0);
    const [exNow_KR, setExNow_KR] = useState({});
    const [exNow_US, setExNow_US] = useState({});
    const [dataUS, setDataUS] = useState({});
    const [selectedUS, setSeletedUS] = useState({});
    const [OnUS, setOnUS] = useState(false);
    // const [openModal, setOpenModal] = useState(false);
    // const handleOpen = () => setOpenModal(true);
    // const handleClose = () => setOpenModal(false);

    const fetchData1st = async () => {
        await axios.get(`${API_FILE}/indexData/exNow_US`).then((res) => {
            setExNow_US(res.data.commitData);
            setDataUS(res.data.DataUS)
        });

        await axios.get(`${API_FILE}/indexData/exNow_KR`).then((res) => {
            setExNow_KR(res.data);
        });
    }

    const fetchData = async () => {
        const res = await axios.get(`${API}/aox/gpo`);
        setKospi200(res.data.data);
        setKospi200MinValue(res.data.min);
    }

    const GpoKospi200Ref = useRef(null);
    const CtpRef = useRef(null);
    const WeightedAvgRef = useRef(null);

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 현재 시간이 9시 이전이라면, 9시까지 남은 시간 계산
        let delay;
        if (hour < 9) {
            delay = ((9 - hour - 1) * 60 + (60 - minutes)) * 60 + (60 - seconds);
        } else {
            delay = 60 - seconds;
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
            // fetchData();
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [])

    // Streaming Test
    useEffect(() => {
        fetchData();
        fetchData1st();
        // GpoKospi200Ref.current = new EventSource(`${API}/aox/gpo`);
        // GpoKospi200Ref.current.onopen = () => { };
        // GpoKospi200Ref.current.onmessage = (event) => {
        //     const res = JSON.parse(event.data);
        //     setKospi200(res.data);
        //     setKospi200MinValue(res.min);
        // };
        // CtpRef.current = new EventSource(`${API}/elwData/CTP`);
        // CtpRef.current.onopen = () => { };
        // CtpRef.current.onmessage = (event) => {
        //     const res = JSON.parse(event.data);
        //     setELW_data1(res[0]);
        //     setELW_data2(res[1]);
        //     setELW_data3(res[2]);
        // };
        // WeightedAvgRef.current = new EventSource(`${API}/elwData/WeightedAvg`);
        // WeightedAvgRef.current.onopen = () => { };
        // WeightedAvgRef.current.onmessage = (event) => {
        //     const res = JSON.parse(event.data);
        //     setElwWeightedAvg(res);
        // };

        // EventSource를 설정하고 이벤트 리스너를 추가하는 함수
        const setupEventSource = (ref, url, onMessage) => {
            ref.current = new EventSource(url);
            ref.current.onopen = () => console.log(`${url} connection opened.`);
            ref.current.onmessage = event => onMessage(event);
            ref.current.onerror = error => console.error(`Error with event source ${url}:`, error);
        };

        // 각 EventSource에 대한 onmessage 핸들러
        const handleGpoKospi200Message = event => {
            const res = JSON.parse(event.data);
            setKospi200(res.data);
            setKospi200MinValue(res.min);
        };

        const handleCtpMessage = event => {
            const res = JSON.parse(event.data);
            setELW_data1(res[0]);
            setELW_data2(res[1]);
            setELW_data3(res[2]);
        };

        const handleWeightedAvgMessage = event => {
            const res = JSON.parse(event.data);
            setElwWeightedAvg(res);
        };

        // 각 EventSource 설정
        // setupEventSource(GpoKospi200Ref, `${API}/aox/gpo`, handleGpoKospi200Message);
        setupEventSource(CtpRef, `${API}/elwData/CTP`, handleCtpMessage);
        setupEventSource(WeightedAvgRef, `${API}/elwData/WeightedAvg`, handleWeightedAvgMessage);


        return () => {
            // 컴포넌트 언마운트 시 연결 종료
            // GpoKospi200Ref.current.close();
            // CtpRef.current.close();
            // WeightedAvgRef.current.close();

            [GpoKospi200Ref, CtpRef, WeightedAvgRef].forEach(ref => {
                if (ref.current) {
                    ref.current.close();
                    // console.log(`Connection closed for ${ref.current.url}`);
                }
            });
        };
    }, [])

    useEffect(() => {
        if (OnUS) {
            setSeletedUS(dataUS)
        } else {
            let dataArray = Array.from({ length: 13 }, () => []); // 12개의 빈 배열을 생성
            let emptyArr = { ...dataArray.reduce((obj, item, index) => ({ ...obj, [`data${index}`]: item }), {}) }
            setSeletedUS(emptyArr);
        }
    }, [OnUS])
    const handleOnUS = (event) => {
        setOnUS(event.target.checked);
    }


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
                    {update_5M}
                </Box>
                <Box sx={{ position: 'absolute', transform: 'translate(77vw, 17vh)', zIndex: 5, justifyItems: 'right', backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 1 }}>
                    <MarketCurrentValue MarketDetail={MarketDetail} />
                </Box>

                <GpoChart data1={exNow_KR} data2={exNow_US} data3={selectedUS} kospi200={kospi200} height={450} yMinValue={kospi200MinValue} />

            </Grid>
        </Grid>

    )
}
