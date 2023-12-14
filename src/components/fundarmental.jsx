import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography } from '@mui/material';

import FundarmentalChart from './util/FundarmentalChart';


import { API } from './util/config';


export default function FundarmentalPage({ swiperRef }) {

    const [chartData, setChartData] = useState([]);
    const [chartField1, setChartField1] = useState([]);
    const [chartField2, setChartField2] = useState([]);
    const [chartField3, setChartField3] = useState([]);
    const [chartField4, setChartField4] = useState([]);

    const colorMap = {
        CPI: 'white',
        Foods: 'orange',
        Energy: '#00FF99',
        Commodities: 'tomato',
        Services: 'dodgerblue',

        // 'Cereals' : '',
        // 'Meats' : '',
        // 'Dairy' : '',
        // 'Fruits' : '',
        // 'Non Alcoholic' : '',
        // 'Other' : '',
        // 'Food Away' : '',
        Fuel: '#5c787a',
        'Gasoline': 'gold',
        'Electricity': 'aqua',
        'Natural Gas': 'Lawngreen',
        'Apparel': '#fffc33',
        'New Vehicles': 'orange',
        'Used Car': '#00B0F0',
        'Medical Care': '#70AD47',
        'Alcoholic': '#FF66FF',
        'Tobacco': '#7030A0',

        'Shelter': 'royalblue',
        'Motor Maintenance': '#996633',
        'Motor Insurance': 'gold',
        'Airline Fare': '#7030A0',

    };

    const prepareChartData = async (categoryName, colorMap) => {
        const response = await axios.get(`${API}/fundamental/CPI?name=${categoryName}`);
        return Object.keys(response.data).map(key => {
            const categoryData = response.data[key];
            return {
                data: categoryData.data,
                yAxis: 0,
                name: categoryData.name,
                type: key === categoryName ? 'spline' : 'column',
                stack: 'cpi',
                stacking: 'normal',
                color: key === categoryName ? 'white' : colorMap[categoryData.name],
                lineWidth: key === categoryName ? 2 : undefined,
                zIndex: key === categoryName ? 5 : undefined,
                borderRadius: 1
            };
        });

    }

    // Fetch Data
    const fetchData = async () => {

        const categories = ['CPI', 'Foods', 'Energy', 'Commodities', 'Services'];

        const chartDataPromises = categories.map(category =>
            prepareChartData(category, colorMap)
        );

        const [chartDataTopline, chartDataFoods, chartDataEnergy, chartDataCommodities, chartDataServices] = await Promise.all(chartDataPromises);

        setChartData(chartDataTopline);
        setChartField1(chartDataFoods);
        setChartField2(chartDataEnergy);
        setChartField3(chartDataCommodities);
        setChartField4(chartDataServices);

    }

    useEffect(() => { fetchData(); }, [])
    const boxSize = { fontSize: '19px' }
    const boxFontStyle = { margin: 0, paddingTop: '4px', paddingLeft: '4px' }
    const boxStyle = { position: 'absolute', transform: `translate(10px, 105px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }
    const boxStyleEnergy = { position: 'absolute', transform: `translate(10px, 90px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }
    return (
        <Grid container spacing={1} >
            <Grid item container xs={5}>
                <div style={{ width: '100%' }}>
                    <FundarmentalChart data={chartData} height={500} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </div>
            </Grid>

            <Grid item container xs={7} spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, border: `3px solid ${colorMap['Foods']}`, borderRadius: 1.5 }}>
                        <Grid item container>
                            <Typography sx={{ ...boxSize, color: colorMap['Foods'] }}>■</Typography>
                            <Typography sx={boxFontStyle} >Foods</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField1} height={460} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyleEnergy, border: `3px solid ${colorMap['Energy']}`, borderRadius: 1.5 }}>
                        <Grid item container>
                            <Typography sx={{ ...boxSize, color: colorMap['Energy'] }}>■</Typography>
                            <Typography sx={boxFontStyle}>Energy</Typography>

                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField2} height={460} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, border: `3px solid ${colorMap['Commodities']}`, borderRadius: 1.5 }}>
                        <Grid item container>
                            <Typography sx={{ ...boxSize, color: colorMap['Commodities'] }}>■</Typography>
                            <Typography sx={boxFontStyle}>Commodities</Typography>

                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField3} height={460} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, border: `3px solid ${colorMap['Services']}`, borderRadius: 1.5 }}>
                        <Grid item container>
                            <Typography sx={{ ...boxSize, color: colorMap['Services'] }}>■</Typography>
                            <Typography sx={boxFontStyle}>Services</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField4} height={460} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
            </Grid>
        </Grid>
    )
}