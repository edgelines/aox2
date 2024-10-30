import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box } from '@mui/material';
// import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box } from '@mui/material';
// import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import StockInfoPage from './Motions/StockInfoPage.jsx';
import { API, API_WS, STOCK } from './util/config.jsx';
// import { StyledToggleButton } from './util/util.jsx';
// import { formatDateString } from './util/formatDate.jsx';
import Legend from './Motions/legend.jsx';
import WilliamsLegend from './Motions/williamsLegend.jsx';


export default function MotionPage({ swiperRef, num, baseStockName }) {

    // config
    const chartHeight = 900

    // state
    const ws = useRef(null); // WebSocket 참조 하는 상태 생성
    const [replaySwitch, setReplaySwitch] = useState(null);
    const [datasetCount, setDatasetCount] = useState(null);
    const [dataset, setDataset] = useState({ time: [], data: [] });
    const [classification, setClassification] = useState(null);
    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    // const [loadingRatio, setLoadingRatio] = useState(false);

    const [stock, setStock] = useState({ 종목명: null }); // 종목 정보
    const [stockChart, setStockChart] = useState({ price: [], volume: [] }); // 종목 차트
    const [selectedChartType, setSelectedChartType] = useState('A') // Chart Type

    const handleFavorite = async () => {
        setStock(prevStock => ({
            ...prevStock,
            Favorite: !prevStock.Favorite
        }));
        try {
            await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }

    const handleInvest = async () => {
        setStock(prevStock => ({
            ...prevStock,
            InvestCount: prevStock.InvestCount + 1
        }));
        try {
            await axios.get(`${API}/stockInvest/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }
    const handleInvestCancel = async () => {
        setStock(prevStock => ({
            ...prevStock,
            Invest: !prevStock.Invest,
            InvestCount: 0
        }));
        try {
            await axios.get(`${API}/del/${stock.종목코드}`);
        } catch (err) {
            console.error('API 호출 실패 : ', err)
        }
    }
    const handleSelectedChartType = async (event, value) => {
        if (value !== null) { setSelectedChartType(value) }
    }

    const getInfo = async (item) => {
        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            if (res.status === 200) {
                setStock({
                    종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
                    시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                    Invest: res.data.Invest, InvestCount: res.data.InvestCount,
                    PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                    N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                    이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요,
                    분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                    주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                    테마명: res.data.테마명
                })
            }

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            } else {
                setStockChart({
                    series: [],
                    info: {
                        net: 0,
                        volumeRatio: 0,
                        willR: {
                            w9: 0,
                            w14: 0,
                            w33: 0
                        },
                        DMI: {
                            dmi_7: 0,
                            dmi_17: 0,
                            dmi_22: 0
                        }
                    }
                });

            }
        } else {
            setStock({ 종목명: null });
            setStockChart({
                series: [],
                info: {
                    net: 0,
                    volumeRatio: 0,
                    willR: {
                        w9: 0,
                        w14: 0,
                        w33: 0
                    },
                    DMI: {
                        dmi_7: 0,
                        dmi_17: 0,
                        dmi_22: 0
                    }
                }
            });
        }

    }

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

    // const handleEventChange = (event) => { if (event !== null) { setDate(event.target.value); } }
    // const handleSwitchChange = async (event, value) => {
    //     if (value !== null) {
    //         setReplaySwitch(value);
    //     }
    // };



    const fetchData = async () => {
        const res = await axios.get(`${API}/stockMotion/getBusinessDay`);
        setDateList(res.data);
        // console.log(dayjs(res.data[0]))
    };

    useEffect(() => { fetchData(); setReplaySwitch('live') }, []);

    useEffect(() => {
        if (replaySwitch === 'live') {
            // ws.current = new WebSocket(`ws://localhost:2440/ws/Motions2`);
            ws.current = new WebSocket(`${API_WS}/Motions${num}`);
            ws.current.onopen = () => {
                console.log('Motions Page2 WebSocket Connected');
            };

            ws.current.onmessage = (event) => {
                const res = JSON.parse(event.data);
                setDataset(res.series);
                setDatasetCount(res.count);
                setTimeLine(res.savetime);
                setClassification(res.classification)
            };

            ws.current.onerror = (error) => {
                console.error(`Motions Page${num} WebSocket Error: `, error);
            };

            ws.current.onclose = () => {
                console.log(`Motions Page${num} WebSocket Disconnected`);
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
            getDataRatio(num, date, setDataset, setDatasetCount);
        }
    }, [date])

    const getSelectedChartType = async () => {
        if (typeof stock.종목코드 !== "undefined") {
            var res = await axios.get(`${STOCK}/get/${stock.종목코드}/${selectedChartType}`);
            if (res.status === 200) {
                setStockChart({
                    series: res.data.series,
                    info: res.data.info
                })
            }
        }
    }
    useEffect(() => {
        getSelectedChartType()
    }, [selectedChartType])

    return (
        <Grid container spacing={1}>
            <Box sx={{ position: 'absolute', transform: 'translate(20px, 10px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '16px', textAlign: 'right' }}>
                Double 2 +
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(350px, 15px)`, zIndex: 10 }}>
                <Legend />
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(1010px, 330px)`, zIndex: 10 }}>
                <WilliamsLegend />
            </Box>


            {/* Chart & Table */}
            <Grid item xs={7}>
                <Grid item container sx={{ mt: 3 }}>
                    {/* Chart Component */}

                    <RatioVolumeTrendScatterChartLive
                        dataset={dataset} timeLine={timeLine} height={chartHeight} swiperRef={swiperRef}
                        datasetCount={datasetCount} classification={classification}
                        getInfo={getInfo}
                    />


                </Grid>

            </Grid>


            {/* Stock Information */}
            <Grid item xs={5}>
                <StockInfoPage stock={stock} stockChart={stockChart} swiperRef={swiperRef}
                    handleFavorite={handleFavorite} handleInvest={handleInvest} handleInvestCancel={handleInvestCancel}
                    selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                    baseStockName={baseStockName} getInfo={getInfo}
                />

            </Grid>

        </Grid>

    )
}
