import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Modal, Backdrop, Switch, FormControlLabel, Popover, Typography, Slider } from '@mui/material';

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


    return (
        <Grid container spacing={2} >
            <Grid item container xs={4.5}>
                <FundarmentalChart data={chartData} height={500} name={'CPI'} rangeSelector={5} creditsPositionX={1} />

            </Grid>

            <Grid item container xs={7.5}>
                <Grid item xs={6}>
                    <FundarmentalChart data={chartField1} height={460} name={'CPI'} rangeSelector={5} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <FundarmentalChart data={chartField2} height={460} name={'CPI'} rangeSelector={5} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <FundarmentalChart data={chartField3} height={460} name={'CPI'} rangeSelector={5} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <FundarmentalChart data={chartField4} height={460} name={'CPI'} rangeSelector={5} creditsPositionX={1} />
                </Grid>
            </Grid>
        </Grid>
    )
}

