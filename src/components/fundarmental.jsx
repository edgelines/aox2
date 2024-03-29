import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledToggleButton, DataTableStyleDefault } from './util/util';
import FundarmentalChart from './util/FundarmentalChart';
import FundarmentalChartBar from './util/FundarmentalChartBar';
import { API } from './util/config';


export default function FundarmentalPage({ swiperRef }) {
    const [page, setPage] = useState('CPI');
    const [CPInextReleaseDate, setCPI_NextReleaseDate] = useState();
    const [PPInextReleaseDate, setPPI_NextReleaseDate] = useState();
    const handlePage = (event, value) => {
        if (value !== null) {
            setPage(value);
        }
    }

    const formattedDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Seoul' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate
    }

    const fetchData = async () => {
        const res = await axios.get(`${API}/fundamental/nextReleaseDate`)
        const date = new Date(res.data)
        // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Seoul' };
        // const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        setCPI_NextReleaseDate(formattedDate(date))
        const PPIdate = date.setDate(date.getDate() + 1)

        setPPI_NextReleaseDate(formattedDate(PPIdate))
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Grid container>
            <Grid item sx={{ pt: 1, pb: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="CPI">CPI Page</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="PPI">PPI Page</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Box sx={{ position: 'absolute', transform: 'translate(10px, 135px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'start' }}>
                <Typography>Next Release Date</Typography>
                <Typography>CPI : {CPInextReleaseDate}</Typography>
                <Typography>PPI : {PPInextReleaseDate}</Typography>
            </Box>
            <ContentsComponent swiperRef={swiperRef} page={page} />
        </Grid>
    )
}

const DataTable = ({ data, categoriseColorMap, swiperRef, onCategory }) => {

    const columns = [
        {
            field: 'category', headerName: 'Category', width: 70,
            align: 'left', headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <span style={{ textAlign: 'left', lineHeight: 'normal', whiteSpace: 'normal', color: categoriseColorMap[params.value] }}>
                        {params.value}
                    </span>
                );
            }
        },
        ...data[0][Object.keys(data[0])[0]].map((d) => ({
            field: `${d.year}-${d.month}`,
            headerName: `${d.year} / ${d.month}`,
            width: 100, align: 'right', headerAlign: 'center',
            renderCell: (params) => {
                // 현재 셀에 해당하는 전월대비 값
                const prevMonthField = `${params.field}전월대비`;
                const prevMonthValue = params.row[prevMonthField];

                let color;
                if (prevMonthValue < 0) {
                    color = 'aqua';  // 값이 감소했다면 파란색
                } else if (prevMonthValue > 0) {
                    color = 'tomato';  // 값이 증가했다면 빨간색
                } else {
                    color = 'black';  // 값이 같다면 기본색(검정)
                }

                return (
                    <div>
                        <span>
                            {`${params.value} , `}
                        </span>
                        <span style={{ color: color }}>
                            {` ${prevMonthValue.toFixed(2)} `}
                        </span>
                    </div>
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
                            fontSize: '10px',
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
        <Grid container sx={{ height: 430, width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <ThemeProvider theme={customTheme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    hideFooter
                    getRowHeight={() => 'auto'}
                    onCellClick={(params, event) => {
                        if (params.field === 'category') {
                            onCategory(params.value);
                        }

                    }}
                    sx={{
                        ...DataTableStyleDefault,
                        [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },

                    }}
                />
            </ThemeProvider>
        </Grid>
    );
};

const ContentsComponent = ({ swiperRef, page }) => {

    // API
    const prepareChartData = async (categoryName, colorMap) => {
        const response = await axios.get(`${API}/fundamental/blsGov?name=${categoryName}`);
        return Object.keys(response.data).map(key => {
            const categoryData = response.data[key];
            return {
                data: categoryData.data,
                yAxis: 0,
                name: categoryData.name,
                type: categoryData.type,
                // type: key === categoryName || key === 'PPI' ? 'line' : 'column',
                stack: 'cpi',
                stacking: 'normal',
                color: key === categoryName ? 'white' : colorMap[categoryData.name],
                lineWidth: key === categoryName || key === 'PPI' || categoryData.name == 'CPI' ? 2 : undefined,
                zIndex: key === categoryName || key === 'PPI' || categoryData.name == 'CPI' ? 5 : undefined,
                borderRadius: 1
            };
        });
    }

    const prepareChartDataDetail = async (categoryName, colorMap) => {
        const response = await axios.get(`${API}/fundamental/CPI?name=${categoryName}`);
        return Object.keys(response.data).map(key => {
            const categoryData = response.data[key];
            return {
                data: categoryData.data,
                yAxis: 0,
                name: categoryData.name,
                type: key === categoryName ? 'column' : 'spline',
                stack: 'cpi',
                stacking: 'normal',
                color: key === categoryName ? colorMap[categoryData.name] : 'white',
                lineWidth: key === categoryName ? undefined : 2,
                zIndex: key === categoryName ? undefined : 5,
                borderRadius: 1
            };
        });
    }

    switch (page) {
        case 'PPI':
            return <PPI prepareChartData={prepareChartData} />;

        default:
            return <CPI prepareChartData={prepareChartData} prepareChartDataDetail={prepareChartDataDetail} swiperRef={swiperRef} />
    }
}

const CPI = ({ swiperRef, prepareChartData, prepareChartDataDetail }) => {

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
        'Cereals': 'orange',
        'Meats': 'tomato',
        'Dairy': '#00FF99',
        'Fruits': 'mediumseagreen',
        'Non Alcoholic': 'dodgerblue',
        'Other': 'silver',
        'Food Away': '#FF66FF',

        Fuel: 'silver',
        'Gasoline': 'orange',
        'Electricity': '#00FF99',
        'Natural Gas': 'tomato',

        'Apparel': 'orange',
        'New Vehicles': '#00FF99',
        'Used Car': 'tomato',
        'Medical Care': 'forestgreen',
        'Alcoholic': 'deepskyblue',
        'Tobacco': '#FF66FF',

        'Shelter': 'orange',
        'Medical Care Services': 'forestgreen',
        'Motor Maintenance': 'tomato',
        'Motor Insurance': 'silver',
        'Airline Fare': 'cornflowerblue',

        PPI: 'red',
        // PPI: 'forestgreen',

    };



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


    const handleTgBtn = async (event, value) => {
        if (value !== null) {
            setCategory(value);
            lastValueData(value);
            let res;
            switch (value) {
                case 'ALL':
                    // console.log(categories.slice(1,))
                    const chartDataPromises = categories.slice(1,).map(category =>
                        prepareChartData(category, colorMap)
                    );
                    const [chartDataFoods, chartDataEnergy, chartDataCommodities, chartDataServices] = await Promise.all(chartDataPromises);
                    setChartField1(chartDataFoods);
                    setChartField2(chartDataEnergy);
                    setChartField3(chartDataCommodities);
                    setChartField4(chartDataServices);
                    break;
                case 'Foods':
                    res = await prepareChartData(value, colorMap)
                    setChartField1(res);
                    break;
                case 'Energy':
                    res = await prepareChartData(value, colorMap)
                    setChartField2(res);
                    break;
                case 'Commodities':
                    res = await prepareChartData(value, colorMap)
                    setChartField3(res);
                    break;
                case 'Services':
                    res = await prepareChartData(value, colorMap)
                    setChartField4(res);
                    break;
            }
        }
    }

    // Category Last Value Table => Category Props
    const onCategory = async (value) => {
        const res = await prepareChartDataDetail(value, colorMap);
        if (value === 'Cereals' ||
            value === 'Meats' ||
            value === 'Dairy' ||
            value === 'Fruits' ||
            value === 'Non Alcoholic' ||
            value === 'Other' ||
            value === 'Food Away') {
            setChartField1(res);
        }
        else if (value === 'Fuel' ||
            value === 'Gasoline' ||
            value === 'Electricity' ||
            value === 'Natural Gas') {
            setChartField2(res);
        }
        else if (value === 'Cereals' ||
            value === 'Apparel' ||
            value === 'New Vehicles' ||
            value === 'Used Car' ||
            value === 'Medical Care' ||
            value === 'Alcoholic' ||
            value === 'Tobacco') {
            setChartField3(res);
        }
        else if (
            value === 'Shelter' ||
            value === 'Medical Care Services' ||
            value === 'Motor Maintenance' ||
            value === 'Motor Insurance' ||
            value === 'Airline Fare') {
            setChartField4(res);
        }

    }

    useEffect(() => { fetchData(); }, [])
    useEffect(() => { }, [])
    const boxFontStyle = { paddingLeft: '4px', paddingRight: '4px', paddingBottom: '2px' }
    const boxStyle = { position: 'absolute', transform: `translate(10px, 105px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }
    const boxStyleEnergy = { position: 'absolute', transform: `translate(10px, 90px)`, zIndex: 5, justifyItems: 'right', p: 0.4 }
    const lastValueStyle = { mt: 0.35, fontSize: '10px' }

    return (
        <Grid container spacing={1} >
            <Grid item container xs={5.5}>
                <div style={{ width: '100%' }}>
                    <FundarmentalChart data={chartData} height={430} name={'CPI'} rangeSelector={6} creditsPositionX={1} />
                </div>
                <Grid item container>
                    <Grid item xs={2.3}>
                        <Grid item container>
                            <Grid item xs={7}>
                                <ToggleButtonGroup
                                    color='info'
                                    orientation="vertical"
                                    exclusive
                                    size="small"
                                    value={category}
                                    onChange={handleTgBtn}
                                >
                                    <StyledToggleButton fontSize={'10px'} value="ALL">ALL</StyledToggleButton>
                                    <StyledToggleButton fontSize={'10px'} value="Foods">Foods</StyledToggleButton>
                                    <StyledToggleButton fontSize={'10px'} value="Energy">Energy</StyledToggleButton>
                                    <StyledToggleButton fontSize={'10px'} value="Commodities">Commodities</StyledToggleButton>
                                    <StyledToggleButton fontSize={'10px'} value="Services">Services</StyledToggleButton>
                                </ToggleButtonGroup>


                            </Grid>
                            <Grid item xs={5}>
                                <ToggleButtonGroup
                                    color='info'
                                    orientation="vertical"
                                    exclusive
                                    size="small"
                                    disabled
                                >
                                    <StyledToggleButton value="">
                                        <Typography sx={{ ...lastValueStyle, color: parseFloat(lastValue.CPI) > 0 ? 'tomato' : 'aqua' }} > {lastValue.CPI} % </Typography>
                                    </StyledToggleButton>
                                    <StyledToggleButton value="">
                                        <Typography sx={{ ...lastValueStyle, color: parseFloat(lastValue.Foods) > 0 ? 'tomato' : 'aqua' }} > {lastValue.Foods} % </Typography>
                                    </StyledToggleButton>
                                    <StyledToggleButton value="">
                                        <Typography sx={{ ...lastValueStyle, color: parseFloat(lastValue.Energy) > 0 ? 'tomato' : 'aqua' }}> {lastValue.Energy} % </Typography>
                                    </StyledToggleButton>
                                    <StyledToggleButton value="">
                                        <Typography sx={{ ...lastValueStyle, color: parseFloat(lastValue.Commodities) > 0 ? 'tomato' : 'aqua' }}> {lastValue.Commodities} % </Typography>
                                    </StyledToggleButton>
                                    <StyledToggleButton value="">
                                        <Typography sx={{ ...lastValueStyle, color: parseFloat(lastValue.Services) > 0 ? 'tomato' : 'aqua' }} > {lastValue.Services} % </Typography>
                                    </StyledToggleButton>

                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={9.3}>
                        {
                            Array.isArray(lastValueTable) && lastValueTable.length > 0 ?
                                <DataTable data={lastValueTable} categoriseColorMap={categoriseColorMap} categories={categories} swiperRef={swiperRef} onCategory={onCategory} />
                                : <Skeleton />
                        }
                    </Grid>
                </Grid>

            </Grid>

            <Grid item container xs={6.5} spacing={2}>

                {/* // CPI Detail Charts */}
                <Grid item container>
                    <Grid item xs={6}>
                        <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Foods']}` }}>
                            <Grid item container>
                                <Typography sx={{ ...boxFontStyle, color: '#404040' }} >Foods</Typography>
                            </Grid>
                        </Box>
                        <FundarmentalChart data={chartField1} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ ...boxStyleEnergy, backgroundColor: `${colorMap['Energy']}` }}>
                            <Grid item container>
                                <Typography sx={{ ...boxFontStyle, color: '#404040' }}>Energy</Typography>
                            </Grid>
                        </Box>
                        <FundarmentalChart data={chartField2} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Commodities']}` }}>
                            <Grid item container>
                                <Typography sx={boxFontStyle}>Commodities</Typography>
                            </Grid>
                        </Box>
                        <FundarmentalChart data={chartField3} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ ...boxStyle, backgroundColor: `${colorMap['Services']}` }}>
                            <Grid item container>
                                <Typography sx={boxFontStyle}>Services</Typography>
                            </Grid>
                        </Box>
                        <FundarmentalChart data={chartField4} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    )
}

const PPI = ({ prepareChartData }) => {
    const [chartData1, setChartData1] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [chartData3, setChartData3] = useState([]);
    const [chartData4, setChartData4] = useState([]);

    const categories = ['PPI', 'TFP1', 'TFP2'];
    const colorMap = {
        CPI: 'red',
        // PPI: 'red',
        'Mining': 'orange',
        'Utilities': 'tomato',
        'Construction': '#00FF99',
        'Manufacturing': 'mediumseagreen',
        'Durable Manufacturing': 'dodgerblue',
        'Nondurable Manufacturing': 'silver',
        //  '#FF66FF' 
        'Agriculture': 'orange',
        'Trade': 'tomato',
        'Transportation and warehousing': '#00FF99',
        'Information': 'mediumseagreen',
        'Finance, insurance, and real estate': 'silver',
        'Services': 'dodgerblue',
    }

    const getTFP = async () => {
        const mappingTitle = {
            TFP: { name: 'Total Factor Productivity', color: 'orange' },
            CombinedInputs: { name: 'Combined Inputs', color: 'lightblue' },
            Output: { name: 'Output', color: 'tomato' }
        }
        const res = await axios.get(`${API}/fundamental/TFP`);
        return Object.keys(res.data).map(key => {
            const categoryData = res.data[key];
            let marker;
            if (key === 'Output') {
                marker = {
                    enabled: true,
                    radius: 4,
                    symbol: 'circle',
                }
            }
            return {
                data: categoryData.data,
                type: categoryData.type,
                name: mappingTitle[key]['name'],
                color: mappingTitle[key]['color'],
                yAxis: 0,
                stack: 'cpi',
                stacking: 'normal',
                marker: marker ? marker : undefined,
                lineWidth: 0,
                borderRadius: 1,
                borderWidth: 0
            }
        })
    }

    const fetchData = async () => {
        const chartDataPromises = categories.map(category =>
            prepareChartData(category, colorMap)
        );

        const [data1, data2, data3] = await Promise.all(chartDataPromises);
        setChartData1(data1);
        setChartData2(data2);
        setChartData3(data3);

        const barData = [];
        barData.push(getTFP())
        const res = await Promise.all(barData);

        setChartData4(res[0]);
    }
    useEffect(() => { fetchData() }, [])

    return (
        <Grid container>
            <Grid item container xs={5.5}>
                <div style={{ width: '100%' }}>
                    <FundarmentalChart data={chartData1} height={430} name={'CPI'} rangeSelector={6} creditsPositionX={1} />
                </div>
            </Grid>

            <Grid item container xs={6.5}>
                <Grid item xs={6}>
                    <FundarmentalChartBar data={chartData4} height={600} />
                </Grid>
                <Grid item xs={6}>
                    <FundarmentalChart data={chartData2} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                    <FundarmentalChart data={chartData3} height={430} name={'CPI'} rangeSelector={4} creditsPositionX={1} />
                </Grid>
                <Grid item xs={12} container direction="column" alignItems="right" sx={{ height: '60%' }}>
                    <Typography sx={{ textAlign: 'end', fontSize: '12px', color: '#efe9e9ed' }}>Period : Annual</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}