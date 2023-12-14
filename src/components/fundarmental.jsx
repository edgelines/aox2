import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, TableContainer } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledToggleButton, DataTableStyleDefault } from './util/util';
import FundarmentalChart from './util/FundarmentalChart';
import { API } from './util/config';

export default function FundarmentalPage({ swiperRef }) {

    const [chartData, setChartData] = useState([]);
    const [chartField1, setChartField1] = useState([]);
    const [chartField2, setChartField2] = useState([]);
    const [chartField3, setChartField3] = useState([]);
    const [chartField4, setChartField4] = useState([]);
    const [category, setCategory] = useState('ALL');
    const [lastValue, setLastValue] = useState([]);
    const [lastValueTable, setLastValueTable] = useState([]);
    const categories = ['CPI', 'Foods', 'Energy', 'Commodities', 'Services'];
    const categoriseColorMap = {
        CPI: 'white',
        Foods: 'orange',
        Energy: '#00FF99',
        Commodities: 'tomato',
        Services: 'dodgerblue',
    }
    const colorMap = {
        ...categoriseColorMap,
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

    const lastValueData = async (categoryName) => {
        const res = await axios.get(`${API}/fundamental/CPIvalue?name=${categoryName}`);
        setLastValueTable(res.data);
    }
    // Fetch Data
    const fetchData = async () => {
        // const categories = ['CPI', 'Foods', 'Energy', 'Commodities', 'Services'];

        const chartDataPromises = categories.map(category =>
            prepareChartData(category, colorMap)
        );

        const [chartDataCPI, chartDataFoods, chartDataEnergy, chartDataCommodities, chartDataServices] = await Promise.all(chartDataPromises);

        setChartData(chartDataCPI);
        setChartField1(chartDataFoods);
        setChartField2(chartDataEnergy);
        setChartField3(chartDataCommodities);
        setChartField4(chartDataServices);

        setLastValue({
            CPI: chartDataCPI[0].data[chartDataCPI[0].data.length - 1][1],
            Foods: chartDataCPI[1].data[chartDataCPI[1].data.length - 1][1],
            Energy: chartDataCPI[2].data[chartDataCPI[2].data.length - 1][1],
            Commodities: chartDataCPI[3].data[chartDataCPI[3].data.length - 1][1],
            Services: chartDataCPI[4].data[chartDataCPI[4].data.length - 1][1],
        })
        lastValueData('ALL')
    }

    const handleTgBtn = (event, value) => { setCategory(value); lastValueData(value); }
    useEffect(() => { fetchData(); }, [])
    useEffect(() => { }, [])
    const boxFontStyle = { paddingLeft: '4px', paddingRight: '4px', paddingBottom: '2px' }
    const boxStyle = { position: 'absolute', transform: `translate(10px, 105px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }
    const boxStyleEnergy = { position: 'absolute', transform: `translate(10px, 90px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }

    return (
        <Grid container spacing={1} >
            <Grid item container xs={5}>
                <div style={{ width: '100%' }}>
                    <FundarmentalChart data={chartData} height={450} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </div>
                <Grid item container>
                    <Grid item xs={1.5}>
                        <ToggleButtonGroup
                            color='info'
                            orientation="vertical"
                            exclusive
                            size="small"
                            value={category}
                            onChange={handleTgBtn}
                        >
                            <StyledToggleButton fontSize={'12px'} value="ALL">ALL</StyledToggleButton>
                            <StyledToggleButton fontSize={'12px'} value="Foods">Foods</StyledToggleButton>
                            <StyledToggleButton fontSize={'12px'} value="Energy">Energy</StyledToggleButton>
                            <StyledToggleButton fontSize={'12px'} value="Commodities">Commodities</StyledToggleButton>
                            <StyledToggleButton fontSize={'12px'} value="Services">Services</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={1}>
                        <ToggleButtonGroup
                            color='info'
                            orientation="vertical"
                            exclusive
                            size="small"
                            disabled
                        >
                            <StyledToggleButton value="">
                                <Typography sx={{ mt: 0.35, fontSize: '12px', color: parseFloat(lastValue.CPI) > 0 ? 'tomato' : 'dodgerblue' }} > {lastValue.CPI} % </Typography>
                            </StyledToggleButton>
                            <StyledToggleButton value="">
                                <Typography sx={{ mt: 0.35, fontSize: '12px', color: parseFloat(lastValue.Foods) > 0 ? 'tomato' : 'dodgerblue' }} > {lastValue.Foods} % </Typography>
                            </StyledToggleButton>
                            <StyledToggleButton value="">
                                <Typography sx={{ mt: 0.35, fontSize: '12px', color: parseFloat(lastValue.Energy) > 0 ? 'tomato' : 'dodgerblue' }}> {lastValue.Energy} % </Typography>
                            </StyledToggleButton>
                            <StyledToggleButton value="">
                                <Typography sx={{ mt: 0.35, fontSize: '12px', color: parseFloat(lastValue.Commodities) > 0 ? 'tomato' : 'dodgerblue' }}> {lastValue.Commodities} % </Typography>
                            </StyledToggleButton>
                            <StyledToggleButton value="">
                                <Typography sx={{ mt: 0.35, fontSize: '12px', color: parseFloat(lastValue.Services) > 0 ? 'tomato' : 'dodgerblue' }} > {lastValue.Services} % </Typography>
                            </StyledToggleButton>

                        </ToggleButtonGroup>
                    </Grid>

                    <Grid item xs={9}>
                        {
                            Array.isArray(lastValueTable) && lastValueTable.length > 0 ?
                                <DataTable data={lastValueTable} categoriseColorMap={categoriseColorMap} categories={categories} />
                                : <Skeleton />
                        }
                    </Grid>
                </Grid>

            </Grid>

            <Grid item container xs={7} spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Foods']}` }}>
                        <Grid item container>
                            <Typography sx={{ ...boxFontStyle, color: '#404040' }} >Foods</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField1} height={450} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyleEnergy, backgroundColor: `${colorMap['Energy']}` }}>
                        <Grid item container>
                            <Typography sx={{ ...boxFontStyle, color: '#404040' }}>Energy</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField2} height={450} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Commodities']}` }}>
                        <Grid item container>
                            <Typography sx={boxFontStyle}>Commodities</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField3} height={450} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Services']}` }}>
                        <Grid item container>
                            <Typography sx={boxFontStyle}>Services</Typography>
                        </Grid>
                    </Box>
                    <FundarmentalChart data={chartField4} height={450} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
            </Grid>
        </Grid>
    )
}

const DataTable = ({ data, categoriseColorMap }) => {

    const columns = [
        {
            field: 'category', headerName: 'Category', width: 150,
            renderCell: (params) => {
                return (
                    <span style={{ color: categoriseColorMap[params.value] }}>
                        {params.value}
                    </span>
                );
            }
        },
        ...data[0][Object.keys(data[0])[0]].map((d) => ({
            field: `${d.year}-${d.month}`,
            headerName: `${d.year} / ${d.month}`,
            width: 80,
            renderCell: (params) => {
                // 현재 셀에 해당하는 전월대비 값
                const prevMonthField = `${params.field}전월대비`;
                const prevMonthValue = params.row[prevMonthField];

                let color;
                if (prevMonthValue < 0) {
                    color = 'dodgerblue';  // 값이 감소했다면 파란색
                } else if (prevMonthValue > 0) {
                    color = 'tomato';  // 값이 증가했다면 빨간색
                } else {
                    color = 'black';  // 값이 같다면 기본색(검정)
                }

                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            }
        })),
    ];

    const rows = data.flatMap((categoryData) => {
        return Object.entries(categoryData).map(([categoryName, values]) => {
            let row = { id: categoryName, category: categoryName };

            values.forEach((value, index) => {
                const field = `${value.year}-${value.month}`;
                row[field] = value.YoY.toFixed(2) + '%';
                row[`${field}전월대비`] = value.전월대비;
            });

            return row;
        });
    });

    const customTheme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        '& .MuiDataGrid-row': {
                            fontSize: '11px',
                            color: '#efe9e9ed'
                        },
                    },
                    columnHeaderWrapper: {
                        minHeight: '9px',
                        // lineHeight: '20px',
                    },
                    columnHeader: {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                defaultProps: {
                    headerHeight: 15,
                },
            },
        },
    });

    return (
        <TableContainer sx={{ height: 430, zIndex: 100 }}>
            <ThemeProvider theme={customTheme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    hideFooter rowHeight={20}
                    sx={DataTableStyleDefault}
                />
            </ThemeProvider>
        </TableContainer>
    );
};

