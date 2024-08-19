import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box, Typography } from '@mui/material';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import StockInfoPage from './Motions/StockInfoPage.jsx';
import { API, API_WS, STOCK } from './util/config.jsx';
import { StyledToggleButton } from './util/util.jsx';
import { formatDateString } from './util/formatDate.jsx';
import TestChart from './Test/TestChart.jsx'


export default function MotionPage({ }) {
    const chartHeight = 400;

    // state
    const [dataset1, setDataset1] = useState({});
    const [dataset2, setDataset2] = useState({});
    const [dataset3, setDataset3] = useState({});
    const [dataset4, setDataset4] = useState({});
    const [dataset5, setDataset5] = useState({});
    const [dataset6, setDataset6] = useState({});
    const [dataset7, setDataset7] = useState({});
    const [dataset8, setDataset8] = useState({});
    const [dataset9, setDataset9] = useState({});

    const get_data = async (xAxis, yAxis, setDataset, setPost) => {
        const postData = {
            xAxis: xAxis,
            yAxis: yAxis
        }
        const res = await axios.post('http://localhost:2440/api/test/get_stocks_stats', postData);
        setDataset({ ...res.data, xAxis: xAxis, yAxis: yAxis });

    }

    const fetchData = async () => {

        get_data('CCI_4', 'WillR9', setDataset1);
        get_data('CCI_11', 'WillR9', setDataset2);
        get_data('CCI_4_Sig', 'CCI_4', setDataset3);

        // get_data('CCI_11', 'WillR9', setDataset4);
        // get_data('CCI_4', 'WillR9', setDataset5);
        get_data('CCI_4', 'WillR14', setDataset4);
        get_data('CCI_11', 'WillR14', setDataset5);
        get_data('CCI_4_Sig', 'WillR14', setDataset6);

        get_data('CCI_4', 'WillR33', setDataset7);
        get_data('CCI_11', 'WillR33', setDataset8);
        get_data('CCI_4_Sig', 'WillR33', setDataset9);

    }

    useEffect(() => { fetchData(); }, [])

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography> A set, 전일대비거래량 500% 이하, 이평구간, 3일 이내</Typography>
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset1} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset2} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset3} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset4} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset5} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset6} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset7} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset8} />
            </Grid>
            <Grid item xs={4}>
                <TestChart dataset={dataset9} />
            </Grid>
        </Grid>

    )
}
