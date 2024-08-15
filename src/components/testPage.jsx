import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box } from '@mui/material';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import RatioVolumeTrendScatterChartLive from './Motions/ratioVolumeTrendScatterChartLive.jsx'
import StockInfoPage from './Motions/StockInfoPage.jsx';
import { API, API_WS, STOCK } from './util/config.jsx';
import { StyledToggleButton } from './util/util.jsx';
import { formatDateString } from './util/formatDate.jsx';
import Legend from './Motions/legend.jsx'

import TestChart from './Test/TestChart.jsx'


export default function MotionPage({ swiperRef, num }) {

    // config
    const chartHeight = 900

    // state
    // const [post, setPost] = useState({ name: 'TestUp', xAxis: 'WillR14', yAxis: 'CCI_11' })
    const [post, setPost] = useState({ name: 'TestUp', xAxis: 'WillR33', yAxis: 'CCI_4_Sig' })
    const [dataset, setDataset] = useState({});
    const [datasetDown, setDatasetDown] = useState({});




    const fetchData = async () => {
        const postData = {
            name: post.name,
            xAxis: post.xAxis,
            yAxis: post.yAxis
        }
        const res = await axios.post('http://localhost:2440/api/test/all_stocks_stats', postData);
        setDataset(res.data);

        const postData2 = {
            name: 'TestDown',
            xAxis: post.xAxis,
            yAxis: post.yAxis
        }

        const res2 = await axios.post('http://localhost:2440/api/test/all_stocks_stats', postData2);
        setDatasetDown(res2.data);
    }

    useEffect(() => { fetchData(); }, [])

    return (
        <Grid container spacing={1}>

            <TestChart dataset={dataset} datasetDown={datasetDown} post={post} />

        </Grid>

    )
}
