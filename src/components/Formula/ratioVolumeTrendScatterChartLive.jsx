import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { Grid, Box, TableContainer, IconButton, ToggleButtonGroup, Typography, Stack } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault } from '../LeadSectors/tableColumns';
import { customTheme, now_columns } from './MotionsColumns';
import { CountTable } from '../Motions/CountTable'
import { legend } from '../Motions/legend';
import { blue } from '@mui/material/colors';
// import { API } from '../util/config.jsx';

const MotionsChart = ({ dataset, timeLine, height, swiperRef, datasetCount, getInfo, classification }) => {
    const tableHeight = 410;
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height - 400 : 400, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy', width: 1070
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '12.5px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 30 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '전일대비거래량', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0.2,
            tickLength: 0,
            tickAmount: 21,
            plotLines: [
                { value: 40, width: 1, color: 'gold', dashStyle: 'dash', zIndex: 2 }, {
                    value: 90, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
                }, {
                    value: 150, width: 1, color: 'tomato', dashStyle: 'dash', zIndex: 2
                }],
            max: 1000,
            min: 0
            // min: 50
        },
        yAxis: {
            title: { text: '등락률 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} %</span>`
                }
            },
            // plotLines: [{ value: 0, width: 1, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: 12,
            max: 30,
            min: -3
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                return `
                    ${this.point.종목명}<br/>
                    등락률 : ${this.point.y} %<br/>
                    전일대비거래량 : ${this.point.전일대비거래량.toLocaleString('kr')} %<br/>
                    `;
            },
        },
        plotOptions: {
            scatter: {
                showInLegend: false,
                animation: false,
                marker: {
                    radius: 3,
                    symbol: 'circle'
                },
                jitter: { x: 0.3 },
            },
            series: {
                animation: {
                    duration: 2000
                },
                point: {
                    events: {
                        click: function () {
                            getInfo(this.options);
                        }
                    }
                }
            }
        },
    })

    const [tableData, setTableData] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);

    // const [selectedDate, setSelectedDate] = useState('now')
    const [marketGap, setMarketGap] = useState(500);
    const [reserve, setReserve] = useState(300);

    // const fetchData = async () => {
    //     const res = await axios.get(`${API}/formula/GetIndicatorScope`);
    //     // const res = await axios.get(`http://localhost:2440/api/formula/GetIndicatorScope`);
    //     setMarketGap(res.data.marketGap);
    //     setReserve(res.data.reserve);
    // }

    // useEffect(() => { fetchData(); }, [])

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            setChartOptions({
                series: getData(dataset, selectedIndustry, selectedThemes, marketGap, reserve),
            })
        }

        // chart = chartComponent.current.chart;
        // if (chart && chart.series && chart.series[0]) {
        //     const newData = getData(dataset, selectedIndustry, selectedThemes, marketGap, reserve);
        //     chart.series[0].update(newData);
        // }

    }, [dataset, selectedIndustry, selectedThemes, marketGap, reserve])

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            if (timeLine) {
                chart.update({
                    subtitle: {
                        text: timeLine
                    }
                });
            }
        }
    }, [timeLine])

    if (!dataset) return <div>Loading...</div>;

    // handler

    const handleTableData = (dataset) => {
        const tmp = dataset.map((item, index) => ({
            ...item, id: index
        }));
        return tmp
    }

    const getData = (dataset, selectedIndustry, selectedThemes, marketGap, reserve) => {
        // 업종이나 테마를 선택했을때 데이터 필터

        const baseData = dataset[0].data;
        // const baseData = dataset[0].data.filter(item => item.시가총액 >= marketGap && item.유보율 >= reserve);

        const filteredData = selectedIndustry.length > 0 || selectedThemes.length > 0
            ? baseData.filter(item => {
                // ? dataset[0].data.filter(item => {
                if (selectedIndustry.includes(item.업종명)) { return true; }

                // 테마 필터링 - item.테마명이 배열일 경우에만 처리
                if (Array.isArray(item.테마명) && item.테마명.length > 0) {
                    const itemThemes = item.테마명.map(theme => theme.trim());
                    return itemThemes.some(theme => selectedThemes.includes(theme));
                }

                return false;
            })
            : baseData

        const table = handleTableData(baseData)
        setTableData(table);

        const result = { data: filteredData }
        return result;
    }

    const handleClick = (name, category) => {
        if (name === '업종') {
            setSelectedIndustry(prevSelected => {
                if (prevSelected.includes(category)) {
                    return prevSelected.filter(item => item !== category);
                } else {
                    return [...prevSelected, category];
                }
            })
        } else {
            setSelectedThemes(prevSelected => {
                if (prevSelected.includes(category)) {
                    return prevSelected.filter(item => item !== category);
                } else {
                    return [...prevSelected, category];
                }
            })
        }
    };
    const handleReset = (name) => {
        if (name === '업종') {
            setSelectedIndustry([])
        } else {
            setSelectedThemes([])
        }
    }

    // const handleBTN = async (name, operation) => {
    //     let newMarketGap = marketGap;
    //     let newReserve = reserve;

    //     if (name === 'marketGap') {
    //         if (operation === 'increase') {
    //             // setMarketGap(prev => prev + 50);
    //             newMarketGap = marketGap + 50;
    //             setMarketGap(newMarketGap);
    //         } else if (operation === 'decrease' && marketGap > 0) {
    //             // setMarketGap(prev => prev - 50);
    //             newMarketGap = marketGap - 50;
    //             setMarketGap(newMarketGap);
    //         }
    //     } else if (name === 'reserve') {
    //         if (operation === 'increase') {
    //             // setReserve(prev => prev + 50);
    //             newReserve = reserve + 50;
    //             setReserve(newReserve);
    //         } else if (operation === 'decrease' && reserve > 0) {
    //             // setReserve(prev => prev - 50);
    //             newReserve = reserve - 50;
    //             setReserve(newReserve);
    //         }
    //     }

    //     try {
    //         await axios.post(`${API}/formula/IndicatorScope`, { marketGap: newMarketGap, reserve: newReserve });
    //         // await axios.post('http://localhost:2440/api/formula/IndicatorScope', { marketGap: newMarketGap, reserve: newReserve });
    //         // console.log({ marketGap: newMarketGap, reserve: newReserve })
    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //     }
    // }
    // const handleSelectedDate = (event, value) => {
    //     if (value !== null) { setSelectedDate(value); }
    // }
    return (
        <div>
            {/* Classification */}
            <Box sx={{ position: 'absolute', transform: 'translate(990px, 65px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                {classification ?
                    <>
                        {Object.keys(classification).map(item => (
                            <tr style={{ fontSize: '12.5px' }} key={item}>
                                <td style={{ color: legend[item] }}>
                                    {item}
                                </td>
                                <td style={{ textAlign: 'right', width: 17 }}>{classification[item]}</td>
                            </tr>
                        ))}
                        {/* Classification Sum */}
                        <tr style={{ fontSize: '12.5px' }} >
                            <td style={{ color: '#efe9e9ed' }}>
                                합계
                            </td>
                            <td style={{ textAlign: 'right', width: 17 }}>
                                {
                                    Object.values(classification).reduce((sum, value) => sum + value, 0)
                                }
                            </td>
                        </tr>
                    </>

                    : <></>}
            </Box>

            {/* Chart */}
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartComponent}
            />

            {/* Bottom Table */}
            <Grid container>

                <Grid item xs={12}>
                    <Stack direction='row' alignItems="center" justifyContent="center">
                        {/* <ToggleButtonGroup
                            // orientation="vertical"
                            color='info'
                            exclusive
                            size="small"
                            value={selectedDate}
                            onChange={handleSelectedDate}
                        >
                            <StyledToggleButton fontSize={10} value="b2">B-2</StyledToggleButton>
                            <StyledToggleButton fontSize={10} value="b1">B-1</StyledToggleButton>
                            <StyledToggleButton fontSize={10} value="now">NOW</StyledToggleButton>
                        </ToggleButtonGroup> */}

                        {/* 시총 */}
                        {/* <IconButton onClick={() => handleBTN('marketGap', 'increase')}>
                            <KeyboardArrowUpIcon />
                        </IconButton>
                        <Typography sx={{ fontSize: 11 }}>
                            시총 : {marketGap} 이상
                        </Typography>
                        <IconButton onClick={() => handleBTN('marketGap', 'decrease')}>
                            <KeyboardArrowDownIcon />
                        </IconButton> */}

                        {/* 유보율 */}
                        {/* <IconButton onClick={() => handleBTN('reserve', 'increase')}>
                            <KeyboardArrowUpIcon />
                        </IconButton>
                        <Typography sx={{ fontSize: 11 }}>
                            유보 : {reserve} 이상
                        </Typography>
                        <IconButton onClick={() => handleBTN('reserve', 'decrease')}>
                            <KeyboardArrowDownIcon />
                        </IconButton> */}

                    </Stack>
                </Grid>

                <Grid item xs={10}>
                    <TableContainer sx={{ height: tableHeight }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        <ThemeProvider theme={customTheme}>
                            <DataGrid
                                rows={tableData}
                                columns={now_columns}
                                rowHeight={20}
                                initialState={{
                                    sorting: {
                                        sortModel: [{ field: 'w33', sort: 'desc' }],
                                    },
                                }}
                                onCellClick={(params, event) => {
                                    getInfo(params.row);
                                }}
                                sx={{
                                    color: 'white', border: 'none',
                                    ...DataTableStyleDefault,
                                    [`& .${gridClasses.cell}`]: { py: 1, },
                                    '[data-field="테마명"]': { fontSize: '9px' },
                                    '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                    '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                    '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                    '& .MuiDataGrid-row.Mui-selected': {
                                        backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                    },
                                }}
                            />
                        </ThemeProvider>
                    </TableContainer>
                </Grid>


                <Grid item container xs={2}>

                    {
                        datasetCount ?
                            <>
                                <Grid item xs={12}>

                                    <CountTable name='업종' data={datasetCount.업종} swiperRef={swiperRef} height={tableHeight / 2.2}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes} />

                                </Grid>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <CountTable name='테마' data={datasetCount.테마} swiperRef={swiperRef} height={tableHeight / 2.2}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes} />
                                </Grid>
                            </>
                            : <>Loading</>
                    }


                </Grid>



            </Grid>

        </div>
    );
};

export default MotionsChart;

