import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box } from '@mui/material';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import { API, API_WS } from './util/config.jsx';
import { StyledToggleButton } from './util/util';
import { formatDateString } from './util/formatDate.jsx'


export default function MotionPage2({ swiperRef }) {

    // config
    const chartHeight = 900

    // state
    const ws = useRef(null); // WebSocket 참조 하는 상태 생성
    const [replaySwitch, setReplaySwitch] = useState(null);
    const [dataset1Count, setDataset1Count] = useState(null);
    const [dataset1, setDataset1] = useState({ time: [], data: [] });
    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    // const [timeLineIndustry, setTimeLineIndustry] = useState(null);
    // const [loadingPower, setLoadingPower] = useState(false);
    const [loadingRatio1, setLoadingRatio1] = useState(false);
    // const [loadingRatio2, setLoadingRatio2] = useState(false);
    // const [loadingRatio3, setLoadingRatio3] = useState(false);


    const getDataRatio = async (num, date, setLoading, setDataset, setDatasetCount) => {
        setLoading(true);
        try {
            // const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);
            const res = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);

            setDataset(res.data.Data);
            setTimeLine(res.data.시간);
            const count = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterCount/${num}/${date}`);
            setDatasetCount(count.data.Data);
            // if (num === 3) {

            // }
        } catch (error) {
            console.log("Error fetching data : ", error);
        } finally {
            setLoading(false)
        }
    }

    const handleEventChange = (event) => { if (event !== null) { setDate(event.target.value); } }
    const handleSwitchChange = async (event, value) => {
        if (value !== null) {
            setReplaySwitch(value);
        }
    };



    const fetchData = async () => {
        const res = await axios.get(`${API}/stockMotion/getBusinessDay`);
        setDateList(res.data);
        // console.log(dayjs(res.data[0]))
    };

    useEffect(() => { fetchData(); setReplaySwitch('live') }, []);

    useEffect(() => {
        if (replaySwitch === 'live') {
            // ws.current = new WebSocket(`ws://localhost:2440/ws/Motions2`);
            ws.current = new WebSocket(`${API_WS}/Motions2`);
            ws.current.onopen = () => {
                console.log('Motions Page2 WebSocket Connected');
            };

            ws.current.onmessage = (event) => {
                const res = JSON.parse(event.data);
                setDataset1(res.data1.series);
                setDataset1Count(res.data1.count);
                setTimeLine(res.data1.시간);
            };

            ws.current.onerror = (error) => {
                console.error('Motions Page2 WebSocket Error: ', error);
            };

            ws.current.onclose = () => {
                console.log('Motions Page2 WebSocket Disconnected');
            };

        } else if (replaySwitch === 'replay') {
            if (ws.current) {
                ws.current.close();
            }
            setDate(datelist[0]);
        }
        // 컴포넌트가 언마운트되거나 replaySwitch가 변경될 때 WebSocket 연결 해제
        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };

    }, [replaySwitch]);

    useEffect(() => {
        if (date !== null) {
            getDataRatio(1, date, setLoadingRatio1, setDataset1, setDataset1Count);
        }
    }, [date])

    return (
        <Grid container spacing={1}>
            <Grid item container xs={12}>
                <Grid item xs={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left' }}>
                        <ToggleButtonGroup
                            // orientation="vertical"
                            color='info'
                            exclusive
                            size="small"
                            value={replaySwitch}
                            onChange={handleSwitchChange}
                        >
                            <StyledToggleButton value="live">LIVE</StyledToggleButton>
                            <StyledToggleButton value="replay">REPLAY</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Grid>
                {replaySwitch === 'replay' ?
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <FormControl variant="standard" sx={{ minWidth: 100 }}>
                            <Select
                                onChange={handleEventChange}
                                value={date} sx={{ color: '#efe9e9ed', fontSize: '12px' }}>
                                {datelist && datelist.length > 0 ?
                                    datelist.map(item => (
                                        <MenuItem value={item}>{formatDateString(item)}</MenuItem>
                                    )) : <></>
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    : <></>}

            </Grid>
            <Grid item xs={6}>
                {replaySwitch === 'live' && <RatioVolumeTrendScatterChartLive
                    dataset={dataset1} timeLine={timeLine} height={chartHeight} title={'중복 1개'} swiperRef={swiperRef}
                    datasetCount={dataset1Count}
                />}


                {
                    replaySwitch === 'replay' && !loadingRatio1 ?
                        <RatioVolumeTrendScatterChart
                            dataset={dataset1} timeLine={timeLine} height={chartHeight} title={'중복 1개'} swiperRef={swiperRef}
                            datasetCount={dataset1Count}
                        />
                        : <Skeleton animation="wave" height={chartHeight} />
                }
                {/* {
                    loadingRatio1 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart
                            dataset={dataset1} timeLine={timeLine} height={chartHeight} title={'중복 1개'} swiperRef={swiperRef}
                            datasetCount={dataset1Count}
                        />
                } */}



                {/* {
                    loadingRatio3 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset3} timeLine={timeLine} height={chartHeight} title={'중복 3개 이상'} />
                } */}


            </Grid>
            <Grid item xs={6}>
                {/* {
                    loadingRatio2 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset2} timeLine={timeLine} height={chartHeight} title={'중복 2개'} />
                } */}
            </Grid>

        </Grid>

    )
}
