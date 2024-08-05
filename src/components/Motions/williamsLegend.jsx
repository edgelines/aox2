import React, { useEffect, } from 'react';
import { Stack } from '@mui/material';
import { williamsColor } from './MotionsColumns.jsx'

export const legend = {
    '~ -20': williamsColor(-20),
    '~ -35': williamsColor(-35),
    '~ -50': williamsColor(-50),
    '~ -65': williamsColor(-65),
    '~ -80': williamsColor(-80),
    '-80 ~': williamsColor(-100)
};

export default function Legend() {

    return (
        <Stack direction='column' sx={{ pl: 1, pr: 1 }} useFlexGap flexWrap="wrap">
            W Color
            {Object.keys(legend).map((item) => (
                <tr style={{ fontSize: '12.5px' }} key={item}>
                    <td style={{ color: legend[item] }}>
                        {item}
                    </td>
                </tr>


            ))}

        </Stack>

    )
}
