import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box } from '@mui/material';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import StockInfoPage from './Motions/StockInfoPage.jsx';
import { API, API_WS, STOCK } from './util/config.jsx';
import { StyledToggleButton } from './util/util.jsx';
import { formatDateString } from './util/formatDate.jsx';
import Legend from './Motions/legend.jsx'


export default function MotionPage({ swiperRef, num }) {

    // config
    const chartHeight = 900

    // state
    const ws = useRef(null); // WebSocket 참조 하는 상태 생성
    const [replaySwitch, setReplaySwitch] = useState(null);
    const [datasetCount, setDatasetCount] = useState(null);
    const [dataset, setDataset] = useState({ time: [], data: [] });
    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    const [loadingRatio, setLoadingRatio] = useState(false);

    const [industryName, setIndustryName] = useState(null)
    const [stock, setStock] = useState({ 종목명: null }); // 종목 정보
    const [stockChart, setStockChart] = useState({ price: [], volume: [] }); // 종목 차트

    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }

    const getInfo = async (item) => {

        // var res = await axios.get(`${API}/industry/LeadSectorsTable/${item.업종명}`);
        // setStockTableData(res.data);

        // 업종 차트
        // const name = SectorsName15(item.업종명)
        setIndustryName(item.업종명);

        // const excludedNames = ['없음', '카드', '손해보험', '복합유틸리티', '복합기업', '전기유틸리티', '생명보험', '다각화된소비자서비스', '사무용전자제품', '담배', '기타금융', '문구류', '판매업체', '전문소매', '출판']
        // if (!excludedNames.includes(name)) {
        //     var res = await axios.get(`${API}/industryChartData/getChart?name=${name}`);
        //     setSectorsChartDataSelected(res.data);
        // }

        if (typeof item.종목코드 !== "undefined") {
            // 종목정보
            var res = await axios.get(`${API}/info/stockEtcInfo/${item.종목코드}`);
            setStock({
                종목명: item.종목명, 종목코드: item.종목코드, 업종명: item.업종명, 현재가: res.data.현재가,
                시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, Favorite: res.data.Favorite,
                PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
                N_PER: res.data.N_PER, N_PBR: res.data.N_PBR, 동일업종PER: res.data.동일업종PER,
                이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요,
                분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
                주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주, 이벤트: res.data.이벤트, 보호예수: res.data.보호예수,
                테마명: res.data.테마명
            })

            // 종목차트
            var res = await axios.get(`${STOCK}/get/${item.종목코드}`);

            // console.log(res.data);
            setStockChart({ price: res.data.price, volume: res.data.volume, treasury: res.data.treasury, treasuryPrice: res.data.treasuryPrice, willR: res.data.willR, net: res.data.net, MA: res.data.MA })
            //     console.log(res.data); ${item.종목코드}

            // const postData = { stockCode: item.종목코드 };
            // var res = await axios.post(`${API}/themes/getStockThemes`, postData);
            // setThemesTableData(res.data);

        } else {
            setStock({ 종목명: null });
            setStockChart({ price: [], volume: [] });
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
            ws.current = new WebSocket(`${API_WS}/Motions${num}`);
            ws.current.onopen = () => {
                console.log('Motions Page2 WebSocket Connected');
            };

            ws.current.onmessage = (event) => {
                const res = JSON.parse(event.data);
                setDataset(res.series);
                setDatasetCount(res.count);
                setTimeLine(res.savetime);
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
            getDataRatio(1, date, setLoadingRatio, setDataset, setDatasetCount);
        }
    }, [date])

    return (
        <Grid container spacing={1}>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(350px, 15px)`, zIndex: 10 }}>
                <Legend />
            </Box>


            {/* Chart & Table */}
            <Grid item xs={6}>
                <Grid item container>

                    {/* Select */}
                    <Grid item container xs={12}>
                        <Grid item xs={2}>
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


                    {/* Chart Component */}
                    <Grid item>
                        {replaySwitch === 'live' && <RatioVolumeTrendScatterChartLive
                            dataset={dataset} timeLine={timeLine} height={chartHeight} title={`중복 ${num}개`} swiperRef={swiperRef}
                            datasetCount={datasetCount}
                            getInfo={getInfo}
                        />}


                        {
                            replaySwitch === 'replay' && !loadingRatio ?
                                <RatioVolumeTrendScatterChart
                                    dataset={dataset} timeLine={timeLine} height={chartHeight} title={`중복 ${num}개`} swiperRef={swiperRef}
                                    datasetCount={datasetCount}
                                    getInfo={getInfo}
                                />
                                : <Skeleton animation="wave" height={chartHeight} />
                        }

                    </Grid>

                </Grid>

            </Grid>


            {/* Stock Information */}
            <Grid item xs={6}>
                <StockInfoPage industryName={industryName} stock={stock} stockChart={stockChart} handleFavorite={handleFavorite} />

            </Grid>

        </Grid>

    )
}
