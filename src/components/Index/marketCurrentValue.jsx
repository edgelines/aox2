import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function Kospi200CurrentValue({ valueFont, valueTitle, MarketDetail }) {
    return (
        <>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi 200 : </span>
                {
                    MarketDetail.status === 'succeeded' ?
                        <>
                            {MarketDetail.data[0].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[0].지수.toFixed(2)} ( ${MarketDetail.data[0].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[0].지수.toFixed(2)} ( ${MarketDetail.data[0].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi : </span>
                {
                    MarketDetail.status === 'succeeded' ?
                        <>
                            {MarketDetail.data[1].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[1].지수.toFixed(2)} ( ${MarketDetail.data[1].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[1].지수.toFixed(2)} ( ${MarketDetail.data[1].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kosdaq : </span>
                {
                    MarketDetail.status === 'succeeded' ?
                        <>
                            {MarketDetail.data[2].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[2].지수.toFixed(2)} ( ${MarketDetail.data[2].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${MarketDetail.data[2].지수.toFixed(2)} ( ${MarketDetail.data[2].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
        </>
    )
}