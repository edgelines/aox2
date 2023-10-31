import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import axios from 'axios';
import { API } from '../util/config.jsx';

export default function Kospi200CurrentValue({ valueFont, valueTitle, MarketDetail }) {
    const [kospi200, setKospi200] = useState({ net: null, value: null });
    const [kospi, setKospi] = useState({ net: null, value: null });
    const [kosdaq, setKosdaq] = useState({ net: null, value: null });

    // const fetchData = async () => {

    //     // const response = await axios.get(`${API}/MarketDetail`);
    //     if (MarketDetail && MarketDetail.length > 0) {
    //         setKospi200({ net: MarketDetail[0].전일대비, value: `${MarketDetail[0].지수.toFixed(2)} ( ${MarketDetail[0].전일대비} % )` })
    //         setKospi({ net: MarketDetail[1].전일대비, value: `${MarketDetail[1].지수.toFixed(2)} ( ${MarketDetail[1].전일대비} % )` })
    //         setKosdaq({ net: MarketDetail[2].전일대비, value: `${MarketDetail[2].지수.toFixed(2)} ( ${MarketDetail[2].전일대비} % )` })
    //     }
    //     // setKospi200({ net: response.data[0].전일대비, value: `${response.data[0].지수.toFixed(2)} ( ${response.data[0].전일대비} % )` })
    //     // setKospi({ net: response.data[1].전일대비, value: `${response.data[1].지수.toFixed(2)} ( ${response.data[1].전일대비} % )` })
    //     // setKosdaq({ net: response.data[2].전일대비, value: `${response.data[2].지수.toFixed(2)} ( ${response.data[2].전일대비} % )` })
    // }
    // useEffect(() => {
    //     fetchData();
    // }, [])

    // // 2분 주기 업데이트
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         const now = new Date();
    //         const hour = now.getHours();
    //         const dayOfWeek = now.getDay();

    //         if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 8 && hour < 16) {
    //             fetchData()
    //         }

    //     }, 1000 * 60 * 2);
    //     return () => clearInterval(intervalId);
    // }, [])

    return (
        <>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi 200 : </span>
                {
                    MarketDetail && MarketDetail.length > 0 ?
                        <>
                            {MarketDetail[0].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[0].지수.toFixed(2)} ( ${MarketDetail[0].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[0].지수.toFixed(2)} ( ${MarketDetail[0].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi : </span>
                {
                    MarketDetail && MarketDetail.length > 0 ?
                        <>
                            {kospi.net > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[1].지수.toFixed(2)} ( ${MarketDetail[1].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[1].지수.toFixed(2)} ( ${MarketDetail[1].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kosdaq : </span>
                {
                    MarketDetail && MarketDetail.length > 0 ?
                        <>
                            {kosdaq.net > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[2].지수.toFixed(2)} ( ${MarketDetail[2].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail[2].지수.toFixed(2)} ( ${MarketDetail[2].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
        </>
    )
    // return (
    //     <>
    //         <Box sx={{ textAlign: 'left' }}>
    //             <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi 200 : </span>
    //             {
    //                 kospi200.net !== null ?
    //                     <>
    //                         {kospi200.net > 0 ?
    //                             <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kospi200.value} </span>
    //                             : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kospi200.value} </span>}
    //                     </>
    //                     : <Skeleton variant="rectangular" animation="wave" />
    //             }
    //         </Box>
    //         <Box sx={{ textAlign: 'left' }}>
    //             <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi : </span>
    //             {
    //                 kospi.net !== null ?
    //                     <>
    //                         {kospi.net > 0 ?
    //                             <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kospi.value} </span>
    //                             : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kospi.value} </span>}
    //                     </>
    //                     : <Skeleton variant="rectangular" animation="wave" />
    //             }
    //         </Box>
    //         <Box sx={{ textAlign: 'left' }}>
    //             <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kosdaq : </span>
    //             {
    //                 kosdaq.net !== null ?
    //                     <>
    //                         {kosdaq.net > 0 ?
    //                             <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kosdaq.value} </span>
    //                             : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {kosdaq.value} </span>}
    //                     </>
    //                     : <Skeleton variant="rectangular" animation="wave" />
    //             }
    //         </Box>
    //     </>
    // )
}