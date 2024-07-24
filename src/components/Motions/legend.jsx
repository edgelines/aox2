import React, { useEffect, } from 'react';
import { Grid, Typography } from '@mui/material';


export default function Legend({ }) {
    const legend = {
        에너지: '#00FF99',
        반도체: 'red',
        건설: '#c9c9c9',
        금융: '#00B0F0',
        필수소재: '#fffc33',
        사치재: 'orange',
        '게임&미디어': 'white',
        바이오: '#70AD47',
        기타: '#996633'
    };

    return (
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            {Object.keys(legend).map((sector) => (
                <Sector key={sector} legend={legend} name={sector} />
            ))}



        </Grid>

    )
}


const Sector = ({ legend, name }) => {
    const color = legend[name];

    return (
        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body5" sx={{ color }}>
                &#x25CF;
            </Typography>
            <Typography variant="body2">
                {name}
            </Typography>
        </Grid>
    )
}