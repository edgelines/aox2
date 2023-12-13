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
                zIndex: key === categoryName ? 5 : undefined
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

        // const res = await axios.get(`${API}/fundamental/CPI?name=topline`);
        // setChartData([
        //     {
        //         data: res.data.CPI.data,
        //         yAxis: 0, name: res.data.CPI.name, zIndex: 5,
        //         type: 'spline', color: colorMap[res.data.CPI.name], lineWidth: 2,
        //     }, {
        //         data: res.data.Food.data,
        //         yAxis: 0, name: res.data.Food.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[res.data.Food.name]
        //     }, {
        //         data: res.data.Energy.data,
        //         yAxis: 0, name: res.data.Energy.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[res.data.Energy.name]
        //     }, {
        //         data: res.data.Commodities.data,
        //         yAxis: 0, name: res.data.Commodities.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[res.data.Commodities.name]
        //     }, {
        //         data: res.data.Services.data,
        //         yAxis: 0, name: res.data.Services.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[res.data.Services.name]
        //     }])

        // const field1 = await axios.get(`${API}/fundamental/CPI?name=foods`);
        // setChartField1([
        //     {
        //         data: field1.data.Food.data,
        //         yAxis: 0, name: field1.data.Food.name, zIndex: 5,
        //         type: 'spline', color: 'white', lineWidth: 2,
        //     }, {
        //         data: field1.data.Cereals.data,
        //         yAxis: 0, name: field1.data.Cereals.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Cereals.name]
        //     }, {
        //         data: field1.data.Meats.data,
        //         yAxis: 0, name: field1.data.Meats.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Meats.name]
        //     }, {
        //         data: field1.data.Dairy.data,
        //         yAxis: 0, name: field1.data.Dairy.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Dairy.name]
        //     }, {
        //         data: field1.data.Fruits.data,
        //         yAxis: 0, name: field1.data.Fruits.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Fruits.name]
        //     }, {
        //         data: field1.data.Nonalcoholic.data,
        //         yAxis: 0, name: field1.data.Nonalcoholic.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Nonalcoholic.name]
        //     }, {
        //         data: field1.data.Other.data,
        //         yAxis: 0, name: field1.data.Other.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.Other.name]
        //     }, {
        //         data: field1.data.FoodAway.data,
        //         yAxis: 0, name: field1.data.FoodAway.name,
        //         type: 'column',
        //         stack: 'cpi',
        //         stacking: 'normal', color: colorMap[field1.data.FoodAway.name]
        //     }])

        // const field2 = await axios.get(`${API}/fundamental/CPI?name=energy`);
        // setChartField2([
        //     {
        //         data: field2.data.Energy.data, type: 'spline',
        //         name: field2.data.Energy.name, zIndex: 5, yAxis: 0,
        //         color: 'white', lineWidth: 2,
        //     }, {
        //         data: field2.data.Fuel.data, yAxis: 0,
        //         name: field2.data.Fuel.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field2.data.Fuel.name]
        //     }, {
        //         data: field2.data.Gasoline.data, yAxis: 0,
        //         name: field2.data.Gasoline.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field2.data.Gasoline.name]
        //     }, {
        //         data: field2.data.Electricity.data, yAxis: 0,
        //         name: field2.data.Electricity.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field2.data.Electricity.name]
        //     }, {
        //         data: field2.data.NaturalGas.data, yAxis: 0,
        //         name: field2.data.NaturalGas.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field2.data.NaturalGas.name]
        //     }])
        // const field3 = await axios.get(`${API}/fundamental/CPI?name=commodities`);
        // setChartField3([
        //     {
        //         data: field3.data.Commodities.data, type: 'spline',
        //         name: field3.data.Commodities.name, zIndex: 5, yAxis: 0,
        //         color: 'white', lineWidth: 2,
        //     }, {
        //         data: field3.data.Apparel.data, yAxis: 0,
        //         name: field3.data.Apparel.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.Apparel.name]
        //     }, {
        //         data: field3.data.NewVehicles.data, yAxis: 0,
        //         name: field3.data.NewVehicles.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.NewVehicles.name]
        //     }, {
        //         data: field3.data.UsedCar.data, yAxis: 0,
        //         name: field3.data.UsedCar.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.UsedCar.name]
        //     }, {
        //         data: field3.data.MedicalCare.data, yAxis: 0,
        //         name: field3.data.MedicalCare.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.MedicalCare.name]
        //     }, {
        //         data: field3.data.Alcoholic.data, yAxis: 0,
        //         name: field3.data.Alcoholic.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.Alcoholic.name]
        //     }, {
        //         data: field3.data.Tobacco.data, yAxis: 0,
        //         name: field3.data.Tobacco.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field3.data.Tobacco.name]
        //     }])
        // const field4 = await axios.get(`${API}/fundamental/CPI?name=services`);
        // setChartField4([
        //     {
        //         data: field4.data.Services.data, type: 'spline',
        //         name: field4.data.Services.name, zIndex: 5, yAxis: 0,
        //         color: 'white', lineWidth: 2,
        //     }, {
        //         data: field4.data.Shelter.data, yAxis: 0,
        //         name: field4.data.Shelter.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field4.data.Shelter.name]
        //     }, {
        //         data: field4.data.MedicalCareService.data, yAxis: 0,
        //         name: field4.data.MedicalCareService.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field4.data.MedicalCareService.name]
        //     }, {
        //         data: field4.data.Maintenance.data, yAxis: 0,
        //         name: field4.data.Maintenance.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field4.data.Maintenance.name]
        //     }, {
        //         data: field4.data.Insurance.data, yAxis: 0,
        //         name: field4.data.Insurance.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field4.data.Insurance.name]
        //     }, {
        //         data: field4.data.AirlineFare.data, yAxis: 0,
        //         name: field4.data.AirlineFare.name, type: 'column', stack: 'cpi', stacking: 'normal',
        //         color: colorMap[field4.data.AirlineFare.name]
        //     }])
    }

    useEffect(() => { fetchData(); }, [])


    return (
        <Grid container spacing={1} >
            <Grid item xs={6}>
                <FundarmentalChart data={chartData} height={600} name={'CPI'} rangeSelector={5} creditsPositionX={1} />
            </Grid>

            <Grid item container xs={6}>
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

