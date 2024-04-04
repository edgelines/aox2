import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';

export default function Kospi200CurrentValue({ valueFont, valueTitle, MarketDetail }) {
    const indexes = [
        { name: 'Kospi 200', index: 0 },
        { name: 'Kospi', index: 1 },
        { name: 'Kosdaq', index: 2 },
    ]

    return (
        <>
            {indexes.map(({ name, index }) => (
                <Box sx={{ textAlign: 'left' }}>
                    <span style={{ color: '#efe9e9ed', fontSize: valueTitle ? valueTitle : '24px', fontWeight: 600 }}> {name} : </span>
                    {
                        MarketDetail && MarketDetail.length > index ?
                            <>
                                {
                                    MarketDetail[index].전일대비 > 0 ?
                                        <span style={{ color: 'tomato', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}>
                                            {`${MarketDetail[index].지수.toFixed(2)} ( ${MarketDetail[index].전일대비} % )`}
                                        </span>
                                        :
                                        <span style={{ color: 'deepskyblue', fontSize: valueFont ? valueFont : '24px', fontWeight: 'bolder' }}>
                                            {`${MarketDetail[index].지수.toFixed(2)} ( ${MarketDetail[index].전일대비} % )`}
                                        </span>

                                }
                            </>
                            : <Skeleton variant="rectangular" animation="wave" />
                    }

                </Box>
            ))}
        </>
    )

}