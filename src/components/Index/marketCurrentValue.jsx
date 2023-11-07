import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';

export default function Kospi200CurrentValue({ valueFont, valueTitle, MarketDetail }) {
    const [table, setTable] = useState([]);
    useEffect(() => {
        if (MarketDetail.status === 'succeeded') {
            setTable(MarketDetail.data);
        }
    }, [MarketDetail])

    return (
        <>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi 200 : </span>
                {
                    table && table.length > 0 ?
                        <>
                            {table[0].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[0].지수.toFixed(2)} ( ${table[0].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[0].지수.toFixed(2)} ( ${table[0].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kospi : </span>
                {
                    table && table.length > 0 ?
                        <>
                            {table[1].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[1].지수.toFixed(2)} ( ${table[1].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[1].지수.toFixed(2)} ( ${table[1].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
            <Box sx={{ textAlign: 'left' }}>
                <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> Kosdaq : </span>
                {
                    table && table.length > 0 ?
                        <>
                            {table[2].전일대비 > 0 ?
                                <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[2].지수.toFixed(2)} ( ${table[2].전일대비} % )`} </span>
                                : <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}> {`${table[2].지수.toFixed(2)} ( ${table[2].전일대비} % )`} </span>}
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Box>
        </>
    )

}