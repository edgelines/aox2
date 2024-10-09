import React, { useEffect, } from 'react';
import { Stack } from '@mui/material';
import { dmiColor } from './RenderCell.jsx'

export const legend = {
    '70 ~': dmiColor(70),
    '~ 60': dmiColor(60),
    '~ 50': dmiColor(50),
    '~ 40': dmiColor(40),
    '~ 30': dmiColor(30),
    '~ 20': dmiColor(20),
    '~ 10': dmiColor(10),
    '~ 3': dmiColor(3),
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
