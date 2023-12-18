import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, Skeleton, Modal, Backdrop, ToggleButtonGroup } from '@mui/material';
import CoreChart from './util/CoreChart';
import { numberWithCommas, StyledToggleButton } from './util/util';
import Kospi200CurrentValue from './Index/kospi200CurrentValue';
import NewKospi200Group, { BubbleChartLegend } from './util/BubbleChart'
import WeightAvgCheck from './ELW/weightAvgCheck';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
import { parseInt } from 'lodash';
import { API, myJSON } from './util/config';
import useInterval from './util/useInterval';
HighchartsMore(Highcharts)
SolidGauge(Highcharts)

// export default function MainPage({ Vix, Kospi200BubbleCategoryGruop, Kospi200BubbleCategory, ElwWeightedAvgCheck, Exchange }) {
export default function MainPage({ Vix, Kospi200BubbleCategoryGruop, Kospi200BubbleCategory, MarketDetail, ElwWeightedAvgCheck, Exchange }) {
    // const updateA = 'Updates-10m'
    // const updateB = 'Updates-5m'
    let ws = null;
    const updateC = 'Update - 2m'
    const updateF = 'Start - 9:2, Update - 지수분봉'
    // const [MarketDetail, setMarketDetail] = useState({ data: [], status: 'loading' });
    const [bubbleData, setBubbleData] = useState({});
    const [groupDataMin, setGroupDataMin] = useState({})
    const [groupData, setGroupData] = useState({})

    const [gisuDayImg, setGisuDayImg] = useState(null);
    const [kospi200Img, setKospi200Img] = useState(null);
    // const [exchange, setExchange] = useState({});
    const [market, setMarket] = useState({});
    const [marketAct, setMarketAct] = useState({});
    const [table2, setTable2] = useState([]);

    const [bubbleDataPage, setBubbleDataPage] = useState('groupData');
    const [trendData, setTrendData] = useState({});
    const [foreigner, setForeigner] = useState({});
    const [institutional, setInstitutional] = useState({});
    const [individual, setIndividual] = useState({});
    //trendDataBar
    // const [trendDataBar, setTrendDataBar] = useState({ kospi200: [], kospi: [], kosdaq: [], futures: [], call: [], put: [] })

    const [today, setToday] = useState(null);
    const [time, setTime] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const handleBubbleDataPage = (event, value) => {
        if (value !== null) {
            setBubbleDataPage(value);
        }
    }
    const getData = async (name) => {
        const res = await axios.get(`${API}/aox/${name}`)
        return res.data
    }
    const fetchData = async () => {
        const uniq = "?" + new Date().getTime();
        setGisuDayImg(`/img/gisu_kospi200.jpg${uniq}`);
        setKospi200Img(`https://t1.daumcdn.net/finance/chart/kr/daumstock/d/mini/K2G01P.png${uniq}`);

        // const APIname = ['bubbleData', 'marketDaily', 'trendData'];
        const APIname = ['bubbleData', 'groupData?dbName=GroupDataLine', 'marketDaily', 'trendData', 'groupData?dbName=GroupDataMin'];

        const chartDataPromises = APIname.map(name => getData(name));

        // const [bubbleData, marketDaily, trendData] = await Promise.all(chartDataPromises);
        const [bubbleData, groupData, marketDaily, trendData, GroupDataMin] = await Promise.all(chartDataPromises);

        setBubbleData({
            series: [{
                name: bubbleData.name,
                data: bubbleData.data,
                animation: false,
            }],
            categories: bubbleData.categories
        });
        // handleBubbleDataPage(bubbleDataPage);
        setGroupData({ series1: groupData.series1, series2: groupData.series2, categories: groupData.categories })
        setMarket({ series: marketDaily.series, categories: marketDaily.categories });

        setForeigner(trendData.foreigner);
        setInstitutional(trendData.institutional);
        setIndividual(trendData.individual);
        setTable2(trendData.table2);
        setTrendData({
            series: trendData.series,
            categories: trendData.categories,
            yAxis0Abs: trendData.yAxis0Abs,
            yAxis1Abs: trendData.yAxis1Abs,
            yAxis2Abs: trendData.yAxis2Abs,
        });

        setGroupDataMin({ series1: GroupDataMin.series1, series2: GroupDataMin.series2, categories: GroupDataMin.categories });

        // await axios.get(`${myJSON}/kospi200GroupDayData`).then((res) => {
        //     var Kospi200 = [], Kospi = [], Kosdaq = [], 그룹1 = [], 그룹2 = [], 그룹3 = [], 그룹4 = [], 그룹5 = [];
        //     res.data.forEach((value, index, array) => {
        //         Kospi200.push(value.코스피200 * 100)
        //         Kospi.push(value.코스피 * 100)
        //         Kosdaq.push(value.코스닥 * 100)
        //         그룹1.push(value.그룹1)
        //         그룹2.push(value.그룹2)
        //         그룹3.push(value.그룹3)
        //         그룹4.push(value.그룹4)
        //         그룹5.push(value.그룹5)
        //     })
        //     const series1 = [{
        //         data: 그룹1, name: '<span style="color : tomato;">삼성전자</span>', color: 'tomato', zIndex: 5, lineWidth: 1, marker: { radius: 1.2 }, yAxis: 0,
        //     }, {
        //         data: 그룹2, name: '<span style="color : #FCAB2F;">2위 ~ 15위</span>', color: '#FCAB2F', zIndex: 4, lineWidth: 1, marker: { radius: 1.2 }, yAxis: 0,
        //     }, {
        //         data: Kospi, name: '코스피', color: 'magenta', type: 'line', zIndex: 1, lineWidth: 1, marker: { radius: 1.2 }, dashStyle: 'ShortDash', yAxis: 1,
        //     }, {
        //         data: Kosdaq, name: '코스닥', color: 'greenyellow', type: 'line', zIndex: 1, lineWidth: 1, marker: { radius: 1.2 }, dashStyle: 'ShortDash', yAxis: 1,
        //     }]
        //     const series2 = [
        //         {
        //             data: 그룹3, name: '<span style="color : greenyellow;">16위 ~ 50위</span>', color: 'greenyellow', zIndex: 3, lineWidth: 1, marker: { radius: 1.2 },
        //         }, {
        //             data: 그룹4, name: '<span style="color : dodgerblue;">51위 ~ 100위</span>', color: 'dodgerblue', zIndex: 2, lineWidth: 1, marker: { radius: 1.2 },
        //         }, {
        //             data: 그룹5, name: '<span style="color : #62FFF6;">101위 ~ 200위', color: '#62FFF6', zIndex: 1, lineWidth: 1, marker: { radius: 1.2 },
        //         }, {
        //             data: Kospi, name: '코스피', color: 'magenta', type: 'line', zIndex: 1, lineWidth: 1, marker: { radius: 1.2 }, dashStyle: 'ShortDash', yAxis: 1, visible: false
        //         }, {
        //             data: Kospi200, name: '코스피200', color: '#efe9e9ed', type: 'line', zIndex: 1, lineWidth: 1, marker: { radius: 1.2 }, dashStyle: 'ShortDash', yAxis: 1
        //         }]
        //     const categories = ['B-5', 'B-4', 'B-3', 'B-2', 'B-1', '09:02', '09:05', '09:07', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45', '09:50', '09:55', '10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55', '12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55', '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55', '15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30'];

        // })


    };

    const setDate = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
        var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        var amPM = 'AM'
        if (hour >= 12) { amPM = 'PM' }
        var date = year + '-' + month + '-' + day;
        var time = `${hour}:${min}:${sec} ${amPM}`;
        setToday(date);
        setTime(time);
    }
    useEffect(() => {
        fetchData();
        setDate();
        // connectWebsocket();
        // return () => { if (ws) ws.close(); };
    }, [])

    useEffect(() => {
        if (MarketDetail.status == 'succeeded') {
            setMarketAct({
                kospi200: MarketDetail.data[0]['상승%'] * 100,
                kospi: MarketDetail.data[1]['상승%'] * 100,
                kosdaq: MarketDetail.data[2]['상승%'] * 100,
                name: ['200', 'Kospi', 'Kosdaq']
            });
        }
    }, [MarketDetail])
    // // 60초 주기 업데이트
    // useEffect(() => {
    //     const now = new Date();
    //     const hour = now.getHours();
    //     const minutes = now.getMinutes();
    //     const seconds = now.getSeconds();
    //     // 현재 시간이 9시 이전이라면, 9시까지 남은 시간 계산
    //     let delay;
    //     if (hour < 9) {
    //         delay = ((9 - hour - 1) * 60 + (60 - minutes)) * 60 + (60 - seconds);
    //     } else if (hour === 9 && minutes === 0 && seconds > 0) {
    //         // 9시 정각에 이미 초가 지나가 있을 경우, 다음 분까지 대기
    //         delay = 60 - seconds;
    //     } else {
    //         // 이미 9시 정각 이후라면, 다음 분 시작까지 대기
    //         delay = 60 - seconds;
    //     }

    //     const startUpdates = () => {
    //         const intervalId = setInterval(() => {
    //             const now = new Date();
    //             const hour = now.getHours();
    //             const dayOfWeek = now.getDay();
    //             if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
    //                 fetchData();
    //             } else if (hour >= 16) {
    //                 // 3시 30분 이후라면 인터벌 종료
    //                 clearInterval(intervalId);
    //             }
    //         }, 1000 * 60 * 2);
    //         return intervalId;
    //     };
    //     // 첫 업데이트 시작
    //     const timeoutId = setTimeout(() => {
    //         // fetchData();
    //         startUpdates();
    //     }, delay * 1000);

    //     return () => clearTimeout(timeoutId);
    // }, [])

    // 5분 주기 업데이트
    useInterval(fetchData, 1000 * 60 * 2, {
        startHour: 9,
        endHour: 16,
        daysOff: [0, 6], // 일요일(0)과 토요일(6)은 제외
    });

    // 시계 1초마다
    useEffect(() => {
        const timer = setInterval(() => {
            setDate();
        }, 1000);
        return () => clearInterval(timer);
    }, [])

    // const connectWebsocket = () => {
    //     if (ws) {
    //         ws.close();
    //         ws = null;
    //     }

    //     // ws = new WebSocket(`${API_WS}/MarketDetail`);
    //     ws.onopen = () => {
    //         // 연결이 열리면 필요한 경우 서버에 데이터를 보낼 수 있습니다.
    //     };
    //     ws.onmessage = (event) => {
    //         try {
    //             const response = JSON.parse(event.data);

    //             console.log(response);
    //             setMarketDetail({ data: response, status: 'succeeded' });

    //         } catch (err) {
    //             console.error(event.data)
    //             console.log(err)
    //         }
    //     };
    //     ws.onerror = (error) => {
    //         console.log(error);
    //         ws.close();
    //     };
    //     ws.onclose = () => {
    //         ws.close();
    //         // 연결 종료 처리
    //     };
    // }


    return (
        <Grid container spacing={1} >

            <Modal open={openModal} onClose={handleClose} closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}>
                <Box sx={{ position: 'absolute', transform: 'translate(0, 10vh)' }}  >
                    <img src={gisuDayImg} onClick={handleClose} style={{ width: '100%' }} />
                </Box>
            </Modal>

            <Grid item xs={3.9} >
                <Box sx={{ position: 'absolute', transform: 'translate(21vw, 2.15vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {updateF}
                </Box>
                <CoreChart data={bubbleData.series} height={330} name={'Kospi200GroupBubble'} categories={bubbleData.categories} type={'bubble'} lengendX={40} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left' }}>
                    <ToggleButtonGroup
                        // orientation="vertical"
                        color='info'
                        exclusive
                        size="small"
                        value={bubbleDataPage}
                        onChange={handleBubbleDataPage}
                    >
                        <StyledToggleButton value="groupData">Line 일봉</StyledToggleButton>
                        <StyledToggleButton value="C">Bubble 카테고리</StyledToggleButton>
                        <StyledToggleButton value="A">Bubble 시가총액</StyledToggleButton>
                        <StyledToggleButton value="groupDataLine">Line 분봉</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {bubbleDataPage === 'A' ?
                    <>
                        <Box sx={{ mt: 1 }}>
                            <NewKospi200Group data={Kospi200BubbleCategory} height={470} />
                            <BubbleChartLegend guideNum={1.4} girdNum={1.9} />
                        </Box>
                    </>
                    : bubbleDataPage === 'groupData' ?
                        <>
                            <CoreChart data={groupData.series1} height={280} name={'groupData'} categories={groupData.categories} lengendX={43} />
                            <Box sx={{ position: 'absolute', transform: 'translate(20vw, -1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                                {updateF}
                            </Box>
                            <CoreChart data={groupData.series2} height={280} name={'groupData'} categories={groupData.categories} lengendX={43} />
                        </>
                        : bubbleDataPage === 'C' ?
                            <>
                                <Box sx={{ mt: 1 }}>
                                    <NewKospi200Group data={Kospi200BubbleCategoryGruop} height={470} name={'Group'} />
                                    <BubbleChartLegend guideNum={1.2} girdNum={2.1} />
                                </Box>
                            </> :
                            <>
                                <CoreChart data={groupDataMin.series1} height={280} name={'groupDataMin'} categories={groupDataMin.categories} lengendX={43} />
                                <Box sx={{ position: 'absolute', transform: 'translate(21vw, -1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                                    {updateF}
                                </Box>
                                <CoreChart data={groupDataMin.series2} height={280} name={'groupDataMin'} categories={groupDataMin.categories} lengendX={43} />
                            </>
                }

            </Grid>

            <Grid item xs={4.6} >
                <div className="row">
                    <img src={gisuDayImg} onClick={handleOpen} />
                </div>

                <Box sx={{ position: 'absolute', transform: 'translate(27vw, 1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {updateF}
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(31.5vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>

                <CoreChart data={market.series} height={350} name={'market'} categories={market.categories} lengendX={1} LengendY={0} />

                <Box sx={{ position: 'absolute', transform: 'translate(11vw, 290px)', }}  >
                    <Kospi200CurrentValue hiddenTitle={true} valueFont={'2.7rem'} />
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(32vw, 1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {updateC}
                </Box>

                <CoreChart data={trendData.series} height={410} name={'trendData'} categories={trendData.categories} type={'column'} credit={updateC} yAxis0Abs={trendData.yAxis0Abs} yAxis1Abs={trendData.yAxis1Abs} yAxis2Abs={trendData.yAxis2Abs} />
            </Grid>

            <Grid item xs={3.5} >
                <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={7} sx={{ alignSelf: 'end' }}>
                        <Box sx={{ fontSize: '0.9rem', textAlign: 'start', paddingLeft: '2vh' }}>
                            <Grid item xs={12} >{today}</Grid>
                            <Grid item xs={12} >{time}</Grid>
                            <Grid item xs={12} sx={{ fontSize: '0.7rem' }}>KRX/USD : </Grid>
                            <Grid item xs={12} sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {Exchange.value ?
                                    <>
                                        {Exchange.comparison === '상승' ?
                                            <span style={{ color: 'tomato' }}> {Exchange.value} 원 ( + {Exchange.net} )</span> : Exchange.comparison === '하락' ?
                                                <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( - {Exchange.net} )</span> : <span style={{ color: 'deepskyblue' }}> {Exchange.value} 원 ( {Exchange.net} )</span>}
                                    </>
                                    : <Skeleton variant="rounded" height={20} animation="wave" />}
                            </Grid>
                            <Grid item xs={12} sx={{ fontSize: '0.7rem' }}>VIX :</Grid>
                            <Grid item xs={12} sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {Vix.value ?
                                    <>
                                        {Vix.net > 0 ?
                                            <span style={{ color: 'tomato' }}> {Vix.value} ( + {Vix.net} )</span> : <span style={{ color: 'deepskyblue' }}> {Vix.value} ( {Vix.net} )</span>}
                                    </>
                                    : <Skeleton variant="rounded" height={20} animation="wave" />}
                            </Grid>
                        </Box>
                    </Grid>
                    {
                        MarketDetail.data && MarketDetail.data.length > 0 ?
                            <Grid item xs={5} sx={{ border: MarketDetail.data[0].전일대비 > 0 ? '2px solid tomato' : '2px solid deepskyblue', borderRadius: '10px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                                    <img src={kospi200Img} style={{ width: '100%' }} />
                                </Box>
                            </Grid>
                            : <Box>Loading...</Box>
                    }
                </Grid>

                <Grid container spacing={1} sx={{ mt: -5, height: '11.5vh' }}>
                    <Grid item xs={4}>
                        {marketAct.kospi200 ?
                            <MarketActChart data={marketAct.kospi200} height={130} name={marketAct.name[0]} />
                            : <Skeleton variant="rounded" height={130} animation="wave" />
                        }
                    </Grid>
                    <Grid item xs={4}>
                        {marketAct.kospi ?
                            <MarketActChart data={marketAct.kospi} height={130} name={marketAct.name[1]} />
                            : <Skeleton variant="rounded" height={130} animation="wave" />
                        }
                    </Grid>
                    <Grid item xs={4} >
                        {marketAct.kosdaq ?
                            <MarketActChart data={marketAct.kosdaq} height={130} name={marketAct.name[2]} />
                            : <Skeleton variant="rounded" height={130} animation="wave" />
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    {MarketDetail.data && MarketDetail.data.length > 0 ?
                        <Table sx={{ fontSize: '0.7rem', borderBottom: '1px solid #efe9e9ed', mt: 1 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #efe9e9ed' }}>
                                    <th>거래소</th>
                                    <th>지수</th>
                                    <th>전일대비</th>
                                    <th>상승%</th>
                                    <th>상승종목</th>
                                    <th>PER</th>
                                    <th>PBR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MarketDetail.data.map((value, index) => (
                                    <tr key={index}>
                                        {value.업종명 === 'Kospi200' ?
                                            <td style={{ color: 'greenyellow' }}>코스피200</td> : value.업종명 === 'Kospi' ?
                                                <td>코스피</td> : <td>코스닥</td>
                                        }
                                        <td>{numberWithCommas(value.지수)}</td>
                                        {value.전일대비 > 0 ?
                                            <td style={{ color: '#FCAB2F' }}>{value.전일대비}%</td>
                                            : <td style={{ color: '#00F3FF' }}>{value.전일대비}%</td>
                                        }
                                        <td style={{ color: 'greenyellow' }}>{parseInt(value['상승%'] * 100)}%</td>
                                        <td>{value.상승전체}</td>
                                        <td>{value.PER}</td>
                                        <td>{value.PBR}</td>
                                    </tr>
                                )
                                )}
                            </tbody>
                        </Table>
                        : <Skeleton variant="rounded" height={100} animation="wave" />
                    }
                </Grid>

                <Grid container sx={{ mt: '1vh' }}>
                    <Grid item xs={12}>
                        {table2 && table2.length > 0 ?
                            <Table sx={{ fontSize: '0.7rem', borderBottom: '1px solid #efe9e9ed', }}>
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
                                            {/* {value.프로그램 > 0 ?
                                                <td style={{ color: '#FCAB2F' }}>{value.프로그램.toLocaleString('ko-KR')}</td>
                                                : <td style={{ color: '#00F3FF' }}>{value.프로그램.toLocaleString('ko-KR')}</td>
                                            } */}
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </Table>
                            : <Skeleton variant="rounded" height={300} animation="wave" />
                        }
                        <Box sx={{ textAlign: 'right' }}>단위 : 콜/풋옵션 백만원, 그외 억원</Box>
                    </Grid>
                    <Box sx={{ position: 'absolute', transform: 'translate(23.6vw, 17.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                        {updateC}
                    </Box>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: -2 }}>
                                <BarChart data={foreigner} height={165} name={'외국인'} />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: -2 }}>
                                <BarChart data={institutional} height={165} name={'기관'} />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: -2 }}>
                                <BarChart data={individual} height={165} name={'개인'} />
                            </Grid>

                        </Grid>
                    </Grid>


                </Grid>

            </Grid>
        </Grid >

    )
}

const MarketActChart = ({ data, height, name }) => {
    // const chartRef = useRef(null)
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'solidgauge', backgroundColor: 'rgba(255, 255, 255, 0)' },
        title: null,
        pane: {
            center: ['50%', '25%'],
            size: '75%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        credits: { enabled: false },
        exporting: { enabled: false },
        tooltip: { enabled: false },
        yAxis: {
            stops: [
                [0.20, 'dodgerblue'],
                [0.40, 'skyblue'],
                [0.55, 'gold'],
                [0.75, 'coral'],
                [0.85, 'orangered'],
                [1.00, 'orangered']
            ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            min: 0, max: 100, visible: false

        },
        plotOptions: {
            solidgauge: {
                dataLabels: { y: 11, borderWidth: 0, useHTML: true },
                animation: false,
            },
        },
    })
    useEffect(() => {
        setChartOptions({
            series: [{
                name: name,
                data: [{ y: data }],
                dataLabels: {
                    format:
                        '<div style="text-align:center; margin-top : -50px">' +
                        '<span style="color:#efe9e9ed;font-size:13px">{series.name}</span><br/>' +
                        '<span style="color:#efe9e9ed;font-size:18px">{y:.1f}</span>' + // 소수점
                        '<span style="color:#efe9e9ed;font-size:12px;"> %</span>' +
                        '</div>'
                },
            }]
        })
    }, [data]);
    return (
        // <>
        //     {data ?
        //         <div ref={chartRef} />
        //         : <Skeleton variant="rounded" height={height} animation="wave" />
        //     }
        // </>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    );
};

const BarChart = ({ data, height, name, credit }) => {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'bar', height: height, backgroundColor: 'rgba(255, 255, 255, 0)' },
        credits: credit ? { enabled: true, text: credit } : { enabled: false },
        title: { text: null, },
        legend: { align: 'left', verticalAlign: 'top', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 0, },
        navigation: { buttonOptions: { enabled: false }, },
        xAxis: [
            {
                categories: ['200', '코스피', '코스닥', '선물', '콜', '풋'],
                labels: { step: 1, style: { color: '#00F3FF', fontSize: '12px' } },
            }, {
                categories: ['200', '코스피', '코스닥', '선물', '콜', '풋'],
                labels: { step: 1, style: { color: '#FCAB2F', fontSize: '12px' } },
                opposite: true,
                linkedTo: 0,
            },
        ],
        yAxis: {
            title: { text: null },
            labels: {
                style: { fontSize: '12px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('ko-KR')} 억원</span>`
                },
            },
            plotLines: [{ color: 'paleturquoise', width: 2, value: 0, zIndex: 5, }],
            tickAmount: 5  // 축 갯수
        },
        plotOptions: { series: { animation: false, } },
        tooltip: {
            crosshairs: true,
            formatter: function () {
                if (this.point.category === '콜' || this.point.category === '풋') {
                    return `<b>${this.series.name}<br/><span style="color:greenyellow;">${this.point.category}</b></span><br/>${Math.abs(parseInt(this.point.y / 100)).toLocaleString('ko-KR')} 억원`;
                } else {
                    return `<b>${this.series.name}<br/><span style="color:greenyellow;">${this.point.category}</b></span><br/>${Math.abs(this.point.y).toLocaleString('ko-KR')} 억원`;
                }
            },
            backgroundColor: '#404040', style: { color: '#e8e3e3' }
        },
    })
    useEffect(() => {
        setChartOptions({
            series: [{
                name: `${name} 당일`,
                data: data.당일,
                color: '#FCAB2F',
                pointWidth: 2.5, //bar 너비 지정.
                grouping: false,
                zIndex: 5
            }, {
                name: `${name} 누적`,
                data: data.누적,
                color: 'forestgreen',
                pointWidth: 8, //bar 너비 지정.
                grouping: false
            },
            ],
        })
    }, [data]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    );
};


const 매매동향당일누적스타일 = { borderRight: '1px solid #757575' }
