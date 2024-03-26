import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, Skeleton, Modal, Backdrop, ToggleButtonGroup } from '@mui/material';
import CoreChart from './util/CoreChart';
import GroupDataChart_Min from './Main/GroupDataChart_Min';
import { numberWithCommas, StyledToggleButton, update_5M } from './util/util';
import Kospi200CurrentValue from './Index/kospi200CurrentValue';
import NewKospi200Group, { BubbleChartLegend } from './util/BubbleChart'
import WeightAvgCheck from './ELW/weightAvgCheck';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from "highcharts/modules/solid-gauge";
import { parseInt } from 'lodash';
import { API, TEST } from './util/config';
// import useInterval from './util/useInterval';
HighchartsMore(Highcharts)
SolidGauge(Highcharts)

// export default function MainPage({ Vix, Kospi200BubbleCategoryGruop, Kospi200BubbleCategory, ElwWeightedAvgCheck, Exchange }) {
export default function MainPage({ Vix, MarketDetail, ElwWeightedAvgCheck, Exchange }) {
    // let ws = null;
    // const [MarketDetail, setMarketDetail] = useState({ data: [], status: 'loading' });
    const [bubbleData, setBubbleData] = useState({});
    const [groupData, setGroupData] = useState({})
    const [groupDataMin, setGroupDataMin] = useState({})

    const [gisuDayImg, setGisuDayImg] = useState(null);
    const [kospi200Img, setKospi200Img] = useState(null);

    const [market, setMarket] = useState({});
    const [marketAct, setMarketAct] = useState({});
    const [table2, setTable2] = useState([]);

    const [bubbleDataPage, setBubbleDataPage] = useState('groupData');
    const [trendData, setTrendData] = useState({});
    const [foreigner, setForeigner] = useState({});
    const [institutional, setInstitutional] = useState({});
    const [individual, setIndividual] = useState({});

    const [Kospi200Bubble, setKospi200Bubble] = useState([]);

    const [today, setToday] = useState(null);
    const [time, setTime] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const handleBubbleDataPage = async (event, value) => {
        if (value !== null) {
            setBubbleDataPage(value);
        }
        if (value === 'BubbleCategory') {
            const res = await axios.get(`${API}/aox/BubbleDataCategoryGroup`);
            setKospi200Bubble(res.data);
        } else if (value === 'BubbleCapital') {
            const res = await axios.get(`${API}/aox/BubbleDataCategory`);
            setKospi200Bubble(res.data);
        } else if (value === 'groupDataMin') {
            const res = await axios.get(`${API}/aox/groupData?dbName=GroupDataMin`);
            setGroupDataMin({ series1: res.data.series1, series2: res.data.series2, categories: res.data.categories })
            // } else if (value === 'groupData') {
            //     const res = await axios.get(`${API}/aox/groupData?dbName=GroupDataLine`);
            //     setGroupData({ series1: res.data.series1, series2: res.data.series2, categories: res.data.categories })
        }
    };
    const getData = async (name) => {
        const res = await axios.get(`${API}/aox/${name}`)
        return res.data
    }

    const MainRef = useRef(null);

    // Streaming Test
    // useEffect(() => {
    //     MainRef.current = new EventSource(`${API}/aox/main`);
    //     MainRef.current.onopen = () => { };
    //     MainRef.current.onmessage = (event) => {
    //         const res = JSON.parse(event.data);
    //         console.log(res);
    //         setForeigner(res.TrendData.foreigner);
    //         setInstitutional(res.TrendData.institutional);
    //         setIndividual(res.TrendData.individual);
    //         setTable2(res.TrendData.table2);
    //         setTrendData({
    //             series: res.TrendData.series,
    //             categories: res.TrendData.categories,
    //             yAxis0Abs: res.TrendData.yAxis0Abs,
    //             yAxis1Abs: res.TrendData.yAxis1Abs,
    //             yAxis2Abs: res.TrendData.yAxis2Abs,
    //         });

    //         setBubbleData(res.BubbleData);
    //         setMarket(res.MarketDaily);

    //         setGroupData(res.GroupData);

    //     };
    //     return () => {
    //         // 컴포넌트 언마운트 시 연결 종료
    //         MainRef.current.close();
    //     };
    // }, [])

    const fetchData = async () => {
        const uniq = "?" + new Date().getTime();
        setGisuDayImg(`/img/gisu_kospi200.jpg${uniq}`);
        setKospi200Img(`https://t1.daumcdn.net/finance/chart/kr/daumstock/d/mini/K2G01P.png${uniq}`);


        const APIname = ['bubbleData', 'groupData?dbName=GroupDataLine', 'marketDaily', 'trendData'];

        const chartDataPromises = APIname.map(name => getData(name));

        const [bubbleData, groupData, marketDaily, trendData] = await Promise.all(chartDataPromises);

        setBubbleData({
            series: [{
                name: bubbleData.name,
                data: bubbleData.data,
                animation: false,
            }],
            categories: bubbleData.categories
        });

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
    // 60초 주기 업데이트
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
            }, 1000 * 60 * 2);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            // fetchData();
            startUpdates();
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [])

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
                    {update_5M}
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
                        <StyledToggleButton value="BubbleCategory">Bubble 카테고리</StyledToggleButton>
                        <StyledToggleButton value="BubbleCapital">Bubble 시가총액</StyledToggleButton>
                        <StyledToggleButton value="groupDataMin">Line 분봉</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <ContentsComponent page={bubbleDataPage} Kospi200Bubble={Kospi200Bubble} groupData={groupData} groupDataMin={groupDataMin} />

            </Grid>

            <Grid item xs={4.6} >
                <div className="row">
                    <img src={gisuDayImg} onClick={handleOpen} />
                </div>

                <Box sx={{ position: 'absolute', transform: 'translate(27vw, 1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {update_5M}
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(31.5vw, 5vh)', zIndex: 5, justifyItems: 'right', p: 1 }}>
                    <WeightAvgCheck ElwWeightedAvgCheck={ElwWeightedAvgCheck} />
                </Box>

                <CoreChart data={market.series} height={350} name={'market'} categories={market.categories} lengendX={1} LengendY={0} />

                <Box sx={{ position: 'absolute', transform: 'translate(11vw, 290px)', }}  >
                    <Kospi200CurrentValue hiddenTitle={true} valueFont={'2.7rem'} />
                </Box>

                <Box sx={{ position: 'absolute', transform: 'translate(32vw, 1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {update_5M}
                </Box>

                <CoreChart data={trendData.series} height={410} name={'trendData'} categories={trendData.categories} type={'column'} credit={update_5M} yAxis0Abs={trendData.yAxis0Abs} yAxis1Abs={trendData.yAxis1Abs} yAxis2Abs={trendData.yAxis2Abs} />
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
                        {update_5M}
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

// Selected Components
const ContentsComponent = ({ page, Kospi200Bubble, groupData, groupDataMin }) => {
    switch (page) {
        case 'BubbleCapital':
            return <>
                <Box sx={{ mt: 1 }}>
                    <NewKospi200Group data={Kospi200Bubble} height={470} />
                    <BubbleChartLegend guideNum={1.4} girdNum={1.9} />
                </Box>
            </>
        case 'BubbleCategory':
            return <>
                <Box sx={{ mt: 1 }}>
                    <NewKospi200Group data={Kospi200Bubble} height={470} name={'Group'} />

                    <BubbleChartLegend guideNum={1.2} girdNum={2.1} />
                </Box>
            </>
        case 'groupDataMin':
            return <>
                <GroupDataChart_Min data={groupDataMin.series1} height={280} categories={groupDataMin.categories} lengendX={43} />
                <Box sx={{ position: 'absolute', transform: 'translate(21vw, -1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {update_5M}
                </Box>
                <GroupDataChart_Min data={groupDataMin.series2} height={280} categories={groupDataMin.categories} lengendX={43} />
            </>

        default:
            return <>
                <CoreChart data={groupData.series1} height={280} name={'groupData'} categories={groupData.categories} lengendX={43} />
                <Box sx={{ position: 'absolute', transform: 'translate(20vw, -1.5vh)', zIndex: 5, justifyItems: 'right', p: 1, color: '#999999', fontSize: '0.85rem' }}>
                    {update_5M}
                </Box>
                <CoreChart data={groupData.series2} height={280} name={'groupData'} categories={groupData.categories} lengendX={43} />
            </>
    }

}


// Highchart Components
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
        chart: { type: 'bar', height: height, animation: false, backgroundColor: 'rgba(255, 255, 255, 0)' },
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
