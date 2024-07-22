import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box } from '@mui/material';
// import PowerVolumeChart from './Motions/powerVolumeChart';
// import IndustryChart from './Motions/IndustryChart';
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import { API, API_WS } from './util/config';
import { StyledToggleButton } from './util/util';
import { formatDateString } from './util/formatDate.jsx'

export default function MotionPage({ swiperRef }) {

    // config
    const chartHeight = 900

    // state
    const ws = useRef(null); // WebSocket 참조 하는 상태 생성
    const [replaySwitch, setReplaySwitch] = useState(null);
    // const [dataset1, setDataset1] = useState({ time: [], data: [] });
    // const [datasetIndustry, setDatasetIndustry] = useState({ time: [], data: [] });
    const [dataset2, setDataset2] = useState({ time: [], data: [] });
    const [dataset3, setDataset3] = useState({ time: [], data: [] });
    const [dataset2Count, setDataset2Count] = useState([]);
    const [dataset3Count, setDataset3Count] = useState([]);

    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    // const [timeLineIndustry, setTimeLineIndustry] = useState(null);
    // const [loadingPower, setLoadingPower] = useState(false);
    // const [loadingRatio1, setLoadingRatio1] = useState(false);
    const [loadingRatio2, setLoadingRatio2] = useState(false);
    const [loadingRatio3, setLoadingRatio3] = useState(false);

    // const getDataPower = async (date) => {
    //     setLoadingPower(true);
    //     try {
    //         const res = await axios.get(`${API}/stockMotion/getPowerVolumeChart/${date}`)
    //         const tmp = res.data.Data.map(item => ({
    //             name: item.time,
    //             data: item.data,
    //         }))
    //         setDataset(tmp);
    //         setTimeLine(res.data.시간);
    //     } catch (error) {
    //         console.error("Error fetching data : ", error);
    //     } finally {
    //         setLoadingPower(false);
    //     }
    // }
    // const getDataIndustry = async (date) => {
    //     setLoadingIndustry(true);
    //     try {
    //         const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
    //         const tmp = res.data.Data.map(item => ({
    //             name: item.time,
    //             data: item.data,
    //         }))
    //         setDatasetIndustry(tmp);
    //         console.log(tmp);
    //         console.log(res.data.시간);
    //         setTimeLineIndustry(res.data.시간);
    //     } catch (error) {
    //         console.error("Error fetching data : ", error);
    //     } finally {
    //         setLoadingIndustry(false);
    //     }
    // }

    const getDataRatio = async (num, date, setLoading, setDataset, setDatasetCount) => {
        setLoading(true);
        try {
            // const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);
            const res = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);

            setDataset(res.data.Data);
            const count = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterCount/${num}/${date}`);
            setDatasetCount(count.data.Data);

            if (num === 3) {
                setTimeLine(res.data.시간);
            }
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
        // setDate(res.data[0])
    };

    useEffect(() => { fetchData(); setReplaySwitch('live') }, []);

    useEffect(() => {
        if (replaySwitch === 'live') {
            // ws.current = new WebSocket(`ws://localhost:2440/ws/Motions1`);
            ws.current = new WebSocket(`${API_WS}/Motions1`);
            ws.current.onopen = () => {
                console.log('Motions Page2 WebSocket Connected');
            };

            ws.current.onmessage = (event) => {
                const res = JSON.parse(event.data);
                setDataset3(res.data3.series);
                setDataset3Count(res.data3.count);
                setDataset2(res.data2.series);
                setDataset2Count(res.data2.count);
                setTimeLine(res.data3.시간);
            };

            ws.current.onerror = (error) => {
                console.error('Motions Page1 WebSocket Error: ', error);
            };

            ws.current.onclose = () => {
                console.log('Motions Page1 WebSocket Disconnected');
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
            getDataRatio(3, date, setLoadingRatio3, setDataset3, setDataset3Count);
            getDataRatio(2, date, setLoadingRatio2, setDataset2, setDataset2Count);
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
                        {/* <Grid item container direction="row" justifyContent="flex-start" sx={{ height: 100, mt: 2 }}> */}
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
                        {/* </Grid> */}
                    </Box>
                    : <></>}

            </Grid>
            <Grid item xs={6}>
                {replaySwitch === 'live' && <RatioVolumeTrendScatterChartLive
                    dataset={dataset3} timeLine={timeLine} height={chartHeight} title={'중복 3개 이상'} swiperRef={swiperRef}
                    datasetCount={dataset3Count}
                />}
                {
                    replaySwitch === 'replay' && !loadingRatio3 ?
                        <RatioVolumeTrendScatterChart
                            dataset={dataset3} timeLine={timeLine} height={chartHeight} title={'중복 3개 이상'} swiperRef={swiperRef}
                            datasetCount={dataset3Count}
                        /> :
                        <Skeleton animation="wave" height={chartHeight} />
                }

            </Grid>
            <Grid item xs={6}>
                {replaySwitch === 'live' && <RatioVolumeTrendScatterChartLive
                    dataset={dataset2} timeLine={timeLine} height={chartHeight} title={'중복 2개'} swiperRef={swiperRef}
                    datasetCount={dataset2Count}
                />}
                {
                    replaySwitch === 'replay' && !loadingRatio2 ?
                        <RatioVolumeTrendScatterChart
                            dataset={dataset2} timeLine={timeLine} height={chartHeight} title={'중복 2개'} swiperRef={swiperRef}
                            datasetCount={dataset2Count}
                        /> :
                        <Skeleton animation="wave" height={chartHeight} />
                }
                {/* {
                    loadingRatio1 ?
                        <Skeleton animation="wave" height={415} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset1} timeLine={timeLine} height={415} title={'중복 1개'} />
                } */}
            </Grid>

        </Grid>

    )
}
