import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, ToggleButtonGroup } from '@mui/material';
import IndexChart from '../util/IndexChart.jsx';
import CoreChart from '../util/CoreChart.jsx';
import { StyledToggleButton, update_5M, update_1day } from '../util/util.jsx'
import MarketCurrentValue from '../Index/marketCurrentValue.jsx'
import { API } from '../util/config.jsx';
export default function ELW_PutCallPage({ swiperRef, Vix, VixMA, Kospi200, Kospi, Kosdaq, Invers, IndexMA, MarketDetail }) {
    // const [ElwPutCallRatioData, setElwPutCallRatioData] = useState(null);
    // const [dayGr, setDayGr] = useState({ series: null, categories: null });
    // const [ElwRatioData, setElwRatioData] = useState({ series: null, categories: null });
    const [mainData, setMainData] = useState('Kospi200');
    const [formats, setFormats] = useState(() => ['MA50']);
    const [chartData, setChartData] = useState([]);

    const handleFormat = (event, newFormats) => { if (newFormats !== null) { setFormats(newFormats); } };
    const handleMainData = (event, newAlignment) => { if (newAlignment !== null) { setMainData(newAlignment); } };


    useEffect(() => {
        let data;
        switch (mainData) {
            case 'Kospi200':
                data = Kospi200;
                break;
            case 'Kospi':
                data = Kospi;
                break;
            case 'Kosdaq':
                data = Kosdaq;
                break;
            case 'Invers':
                data = Invers;
                break;
            default:
                data = Kospi200;
        }

        // formats에 따른 데이터 변형 로직
        if (formats.includes('MA50')) {
            data = [...data, ...IndexMA.MA50]
        }

        if (formats.includes('MA112')) {
            data = [...data, ...IndexMA.MA112]
        }
        setChartData(data)

    }, [mainData, formats, Kospi200, Kospi, Kosdaq, Invers])



    return (
        <Grid container spacing={1} >
            <Grid item xs={5.6}>


            </Grid>
            <Grid item xs={0.4}>
                <Box>
                    <ToggleButtonGroup
                        value={mainData}
                        exclusive
                        onChange={handleMainData}
                        orientation="vertical"
                        aria-label="text alignment"
                    >
                        <StyledToggleButton aria-label="Kospi200" value="Kospi200">코스피200</StyledToggleButton>
                        <StyledToggleButton aria-label="Kospi" value="Kospi">코스피</StyledToggleButton>
                        <StyledToggleButton aria-label="Kosdaq" value="Kosdaq">코스닥</StyledToggleButton>
                        <StyledToggleButton aria-label="Invers" value="Invers">인버스</StyledToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box>
                    <ToggleButtonGroup
                        value={formats}
                        onChange={handleFormat}
                        orientation="vertical"
                        aria-label="text formatting"
                    >
                        <StyledToggleButton aria-label="MA50" value="MA50">MA50</StyledToggleButton>
                        <StyledToggleButton aria-label="MA112" value="MA112">MA112</StyledToggleButton>
                        {/* <StyledToggleButton aria-label="ADR" value="ADR">ADR</StyledToggleButton> */}
                    </ToggleButtonGroup>
                </Box>
            </Grid>
            <Grid item xs={6}>

                <IndexChart data={chartData} height={580} name={'IndexMA'} rangeSelector={2} xAxisType={'datetime'} credit={update_5M} creditsPositionX={1} />

            </Grid>
        </Grid>

    )
}
