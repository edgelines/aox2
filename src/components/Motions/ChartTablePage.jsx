import React, { useState, useEffect, useRef } from 'react';
import { Grid, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault } from '../LeadSectors/tableColumns.jsx';
import { customTheme, columns } from './MotionsColumns.jsx';
import { CountTable } from './CountTable.jsx'
import { legend } from './legend.jsx';
import { blue } from '@mui/material/colors';
import DmiLegend from '../Formula/DmiLegend.jsx';
import WilliamsLegend from './williamsLegend.jsx';
import Charts from '../Formula/Charts.jsx';


const MotionsChart = ({ dataset, dataset2, tableData, timeLine, height, swiperRef, datasetCount, getInfo, classification }) => {
    const chartComponent = useRef(null);
    // const [tableData, setTableData] = useState([]);
    const tableHeight = 370
    // const [selectedIndustry, setSelectedIndustry] = useState([]);
    // const [selectedThemes, setSelectedThemes] = useState([]);
    // const [filterA, setFilterA] = useState({ trueCount: '', totalCount: '' });

    // useEffect(() => {
    //     let chart
    //     if (chartComponent.current && dataset.length > 0) {
    //         chart = chartComponent.current.chart;
    //         // setChartOptions({
    //         //     series: dataset,
    //         // })

    //         setChartOptions({
    //             series: getData(dataset, selectedIndustry, selectedThemes),
    //         })

    //         const table = handleTableData(dataset)
    //         setTableData(table);

    //         const stat = handleFormula(dataset);
    //         setFilterA({
    //             trueCount: stat.trueCount, totalCount: stat.totalCount
    //         })
    //     }

    //     chart = chartComponent.current.chart;
    //     if (chart && chart.series && chart.series[0]) {
    //         const newData = getData(dataset, selectedIndustry, selectedThemes);
    //         chart.series[0].update(newData);
    //     }

    // }, [dataset, selectedIndustry, selectedThemes])

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

    // const handleTableData = (dataset) => {
    //     const tmp = dataset[0].data.map((item, index) => ({
    //         ...item, id: index
    //     }));
    //     return tmp
    // }

    // const getData = (dataset, selectedIndustry, selectedThemes) => {
    //     // 업종이나 테마를 선택했을때 데이터 필터

    //     const filteredData = selectedIndustry.length > 0 || selectedThemes.length > 0
    //         ? dataset[0].data.filter(item => {
    //             if (selectedIndustry.includes(item.업종명)) { return true; }

    //             const itemThemes = item.테마명.split(', ').map(theme => theme.trim())
    //             return itemThemes.some(theme => selectedThemes.includes(theme))
    //             // selectedIndustry.includes(item.업종명) || 
    //         })
    //         : dataset[0].data
    //     const result = {
    //         data: filteredData
    //     }

    //     return result;

    // }

    // const handleClick = (name, category) => {
    //     if (name === '업종') {
    //         setSelectedIndustry(prevSelected => {
    //             if (prevSelected.includes(category)) {
    //                 return prevSelected.filter(item => item !== category);
    //             } else {
    //                 return [...prevSelected, category];
    //             }
    //         })
    //     } else {
    //         setSelectedThemes(prevSelected => {
    //             if (prevSelected.includes(category)) {
    //                 return prevSelected.filter(item => item !== category);
    //             } else {
    //                 return [...prevSelected, category];
    //             }
    //         })
    //     }
    // };
    // const handleReset = (name) => {
    //     if (name === '업종') {
    //         setSelectedIndustry([])
    //     } else {
    //         setSelectedThemes([])
    //     }
    // }

    // const handleFormula = (dataset) => {
    //     const trueCount = dataset[0].data.filter(item => item.filter_A).length;
    //     const totalCount = dataset[0].data.length;
    //     return { trueCount: trueCount, totalCount: totalCount }
    // }


    return (
        <>
            {/* <Box sx={{ position: 'absolute', transform: 'translate(990px, 65px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                {classification ?
                    Object.keys(classification).map(item => (

                        <tr style={{ fontSize: '12.5px' }} key={item}>
                            <td style={{ color: legend[item] }}>
                                {item}
                            </td>
                            <td style={{ textAlign: 'right', width: 17 }}>{classification[item]}</td>
                        </tr>

                        // <Typography sx={{ fontSize: '12.5px', color: legend[item] }} key={item} >{item} : {classification[item]}</Typography>
                    ))
                    : <></>}
            </Box>

            <Box sx={{ position: 'absolute', transform: 'translate(962px, 45px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                {filterA.trueCount ?

                    <Typography sx={{ fontSize: '12.5px' }} >A : {filterA.trueCount}  /  {filterA.totalCount} ( {parseInt(filterA.trueCount / filterA.totalCount * 100)} % )</Typography>

                    : <></>}
            </Box> */}


            {/* <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartComponent}
            /> */}

            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={5}>
                    {/* Chart */}
                    <Charts
                        dataset={dataset}
                        // timeLine={timeLine}
                        getInfo={getInfo}
                        height={height}
                        xAxisText={'Williams R 26'}
                        yAxisText={'DMI 9, 17 Avg'}
                    />
                </Grid>
                <Grid item xs={5}>
                    {/* Chart */}
                    <Charts
                        dataset={dataset2}
                        timeLine={timeLine}
                        getInfo={getInfo}
                        height={height}
                        xAxisText={'DMI 8 가중 - DMI 8 단순'}
                        yAxisText={'DMI 9 가중 - DMI 9 단순'}
                        xAxisPlotLines={true}
                    />
                </Grid>

                <Grid item container xs={2}>

                    {
                        datasetCount ?
                            <>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <CountTable name='업종' data={datasetCount.업종} swiperRef={swiperRef} height={height / 4}
                                    // handleClick={handleClick} handleReset={handleReset}
                                    // selectedIndustry={selectedIndustry} selectedThemes={selectedThemes}
                                    />

                                </Grid>
                                <Grid item xs={12} >
                                    <CountTable name='테마' data={datasetCount.테마} swiperRef={swiperRef} height={height / 4}
                                    // handleClick={handleClick} handleReset={handleReset}
                                    // selectedIndustry={selectedIndustry} selectedThemes={selectedThemes}
                                    />
                                </Grid>
                                <Grid item xs={12} container>
                                    <Grid item xs={4}>
                                        {classification ?
                                            <>
                                                {Object.keys(classification).map(item => (
                                                    <tr style={{ fontSize: '11.5px' }} key={item}>
                                                        <td style={{ color: legend[item] }}>
                                                            {item}
                                                        </td>
                                                        <td style={{ textAlign: 'right', width: 17 }}>{classification[item]}</td>
                                                    </tr>
                                                ))}
                                                {/* Classification Sum */}
                                                <tr style={{ fontSize: '11.5px' }} >
                                                    <td style={{ color: '#efe9e9ed' }}>
                                                        전체
                                                    </td>
                                                    <td style={{ textAlign: 'right', width: 17 }}>
                                                        {
                                                            Object.values(classification).reduce((sum, value) => sum + value, 0)
                                                        }
                                                    </td>
                                                </tr>
                                            </>
                                            : <></>}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <DmiLegend />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <WilliamsLegend />
                                    </Grid>
                                </Grid>
                            </>
                            : <>Loading</>
                    }


                </Grid>

            </Grid>



            <Grid container>

                <TableContainer sx={{ height: tableHeight }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={columns}
                            hideFooter rowHeight={20}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'y', sort: 'desc' }],
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
                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>





            </Grid>

        </>
    );
};

export default MotionsChart;

