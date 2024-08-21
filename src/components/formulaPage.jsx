import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography } from '@mui/material';
import RatioVolumeTrendScatterChartLive from './Formula/ratioVolumeTrendScatterChartLive.jsx'
import StockInfoPage from './Motions/StockInfoPage.jsx';
import { API, API_WS, STOCK } from './util/config.jsx';
import Legend from './Motions/legend.jsx';
import WilliamsLegend from './Motions/williamsLegend.jsx';


export default function FormulaPage({ swiperRef }) {

    // config
    const chartHeight = 910

    // state
    const [datasetCount, setDatasetCount] = useState(null);
    const [dataset, setDataset] = useState({ time: [], data: [] });
    const [classification, setClassification] = useState(null);
    const [timeLine, setTimeLine] = useState(null);



    const [stock, setStock] = useState({ 종목명: null }); // 종목 정보
    const [stockChart, setStockChart] = useState({ price: [], volume: [] }); // 종목 차트

    const handleFavorite = async () => {
        setStock({ ...stock, Favorite: !stock.Favorite })
        await axios.get(`${API}/info/Favorite/${stock.종목코드}`);
    }

    const getInfo = async (item) => {
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
            setStockChart({
                price: res.data.price,
                volume: res.data.volume,
                treasury: res.data.treasury,
                treasuryPrice: res.data.treasuryPrice,
                willR: res.data.willR,
                net: res.data.net,
                MA: res.data.MA,
                volumeRatio: res.data.volumeRatio,
                DMI: res.data.DMI
            })

        } else {
            setStock({ 종목명: null });
            setStockChart({ price: [], volume: [] });
        }

    }


    // useEffect(() => { fetchData(); setReplaySwitch('live') }, []);

    useEffect(() => {
        const ws = new WebSocket(`${API_WS}/Formula`);
        // const ws = new WebSocket(`ws://localhost:2440/ws/Formula`);
        ws.onopen = () => {
            console.log('Formula Page WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            setDataset(res.series);
            setDatasetCount(res.count);
            setTimeLine(res.savetime);
            setClassification(res.classification);
        };

        ws.onerror = (error) => {
            console.error(`Formula Page WebSocket Error: `, error);
        };

        ws.onclose = () => {
            console.log(`Formula Page WebSocket Disconnected`);
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행되도록 함



    return (
        <Grid container spacing={1}>

            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(350px, 15px)`, zIndex: 10 }}>
                <Legend />
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(1010px, 330px)`, zIndex: 10 }}>
                <WilliamsLegend />
            </Box>
            {/* <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(10px, 505px)`, zIndex: 10 }}> */}
            {/* <Typography sx={{ fontSize: 12 }}> Set A 조건 / W : -100 ~ - 80, DMI-7 : 0 ~ 15, DMI-17 : 0 ~ 20, 전일대비거래량 500% 이하, 이평구간 </Typography> */}
            {/* <Typography sx={{ fontSize: 12 }}> 조건 / DMI 3,4 : 10 이하, DMI 7,17 : 36 이하, W9, 14 : -50 이하, W33 : -90 ~ -40, Sig 2일 연속 완만 상승 </Typography> */}
            {/* </Box> */}
            {
                dataset[0] && dataset[0].data.length == 0 ?
                    <Box
                        display="flex"
                        alignItems="center"
                        p={2}
                        sx={{ width: 200, height: 100, backgroundColor: 'rgba(0, 0, 0, 0.60)', position: 'absolute', transform: `translate(500px, 330px)`, zIndex: 10 }}>
                        <Typography>조건에 해당하는 종목 없음</Typography>
                    </Box> : <></>
            }

            {/* Chart & Table */}
            <Grid item xs={7}>
                {/* Chart Component */}
                <RatioVolumeTrendScatterChartLive
                    dataset={dataset} timeLine={timeLine} height={chartHeight} swiperRef={swiperRef}
                    datasetCount={datasetCount} classification={classification} tableSortColumn={'w33'}
                    getInfo={getInfo}
                />
            </Grid>


            {/* Stock Information */}
            <Grid item xs={5}>
                <StockInfoPage stock={stock} stockChart={stockChart} handleFavorite={handleFavorite} swiperRef={swiperRef} />

            </Grid>

        </Grid>

    )
}
