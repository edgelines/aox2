import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { IconButton, Slider, Grid, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { customTheme, DataTableStyleDefault } from '../LeadSectors/tableColumns';
import { columns } from './MotionsColumns';
import { CountTable } from './CountTable'


const MotionsChart = ({ dataset, timeLine, height, title, swiperRef, datasetCount, getInfo }) => {
    const chartComponent = useRef(null);
    // const startIndex = 0;
    // const endIndex = 388;
    // const [endIndex, setEndIndex] = useState(190);
    // const [playing, setPlaying] = useState(false);
    // const [dataIndex, setDataIndex] = useState(startIndex);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height - 400 : 400, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy',
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '18px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 30 },
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
            tickAmount: 13,
            max: 30,
            min: 0
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                // const formatAmount = (amount) => amount !== undefined ? amount.toLocaleString('kr') : '0';
                // const formatLabel = (amount, positiveLabel, negativeLabel) => amount > 0 ? positiveLabel : negativeLabel;
                // const formatColor = (amount) => amount > 0 ? 'red' : 'blue';
                // const foreignNetBuy = this.point.당일외국인순매수금액;
                // const institutionNetBuy = this.point.당일기관순매수금액;
                return `
                    ${this.point.종목명}<br/>
                    등락률 : ${this.point.y} %<br/>
                    전일대비거래량 : ${this.point.전일대비거래량.toLocaleString('kr')} %<br/>
                    `;
                // ${formatLabel(foreignNetBuy, '당일외국인순매수', '당일외국인순매도')} : <span style="color : ${formatColor(foreignNetBuy)}"> ${formatAmount(foreignNetBuy)} 백만원</span><br/>
                // ${formatLabel(institutionNetBuy, '당일기관순매수', '당일기관순매도')} : <span style="color : ${formatColor(institutionNetBuy)}"> ${formatAmount(institutionNetBuy)} 백만원</span><br/>
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
                // dataLabels: {
                //     enabled: true,
                //     formatter: function () {
                //         return this.point.name; // this.point.name을 출력
                //     },
                //     style: {
                //         color: '#efe9e9ed', // 글자 색상
                //         textOutline: 'none', // 글꼴 테두리 제거
                //         fontSize: '12px' // 필요 시 글꼴 크기 설정
                //     }
                // },
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
    const tableHeight = 350
    const [selectedIndustry, setSelectedIndustry] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            // setChartOptions({
            //     series: dataset,
            // })
            setChartOptions({
                series: getData(dataset, selectedIndustry, selectedThemes),
            })

            // setEndIndex(dataset.length - 1);
            const table = handleTableData(dataset)
            setTableData(table);


        }
    }, [dataset, selectedIndustry, selectedThemes])

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
        const tmp = dataset[0].data.map((item, index) => ({
            ...item, id: index
        }));
        return tmp
    }

    const getData = (dataset, selectedIndustry, selectedThemes) => {
        // 업종이나 테마를 선택했을때 데이터 필터

        const filteredData = selectedIndustry.length > 0 || selectedThemes.length > 0
            ? dataset[0].data.filter(item => selectedIndustry.includes(item.업종명) || selectedThemes.includes(item.테마명))
            : dataset[0].data
        const result = {
            data: filteredData
        }
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

    return (
        <div>
            <Box sx={{ position: 'absolute', transform: 'translate(450px, 5px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '18px', textAlign: 'right' }}>
                {title}
            </Box>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartComponent}
            />

            <Grid container
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
            >

                <Grid item xs={8}>
                    <TableContainer sx={{ height: tableHeight }}>
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
                                }}
                            />
                        </ThemeProvider>
                    </TableContainer>
                </Grid>

                <Grid item xs={0.1}></Grid>

                <Grid item container xs={3.9}>

                    {
                        datasetCount ?
                            <>
                                <Grid item xs={6}>

                                    <CountTable name='업종' data={datasetCount.업종} swiperRef={swiperRef} height={tableHeight}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes} />

                                </Grid>
                                <Grid item xs={6}>
                                    <CountTable name='테마' data={datasetCount.테마} swiperRef={swiperRef} height={tableHeight}
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

