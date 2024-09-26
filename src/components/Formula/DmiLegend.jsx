import React, { useEffect, } from 'react';
import { Stack } from '@mui/material';
import { dmiColor } from './Columns.jsx'

export const legend = {
    '~ 3': dmiColor(3),
    '~ 10': dmiColor(10),
    '~ 20': dmiColor(20),
    '~ 30': dmiColor(30),
    '~ 40': dmiColor(40),
    '~ 50': dmiColor(50),
    '~ 60': dmiColor(60),
    '70 ~': dmiColor(70)
};

export default function Legend() {

    return (
        <Stack direction='column' sx={{ pl: 1, pr: 1 }} useFlexGap flexWrap="wrap">
            D Color
            {Object.keys(legend).map((item) => (
                <tr style={{ fontSize: '11px' }} key={item}>
                    <td style={{ color: legend[item] }}>
                        {item}
                    </td>
                </tr>


            ))}

        </Stack>

    )
}
