import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { IconButton, Slider, Grid, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { customTheme, DataTableStyleDefault } from '../LeadSectors/tableColumns';

const columns = [
    {
        field: '종목명', headerName: '종목명', width: 160,
        align: 'left', headerAlign: 'left',
    }, {
        field: 'y', headerName: '%', width: 50,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 0 ? '#FCAB2F' : '#00F3FF'
            return (
                <span style={{ color: color }}> {params.value}</span>
            )
        }
    }, {
        field: '전일대비거래량', headerName: 'V%', width: 80,
        align: 'right', headerAlign: 'center',
        valueFormatter: (params) => {
            return `${params.value.toLocaleString('kr')} %`;
        }
    }, {
        field: '당일기관순매수금액', headerName: '기관', width: 70,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 0 ? '#FCAB2F' : '#00F3FF'
            return (
                <span style={{ color: color }}> {params.value.toLocaleString('kr')}</span>
            )
        }
    }, {
        field: '당일외국인순매수금액', headerName: '외인', width: 70,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => {
            const color = params.value > 0 ? '#FCAB2F' : '#00F3FF'
            return (
                <span style={{ color: color }}> {params.value.toLocaleString('kr')}</span>
            )
        }
    }
]

const MotionsChart = ({ dataset, timeLine, height, title, swiperRef }) => {
    const chartComponent = useRef(null);
    const startIndex = 0;
    // const endIndex = 388;
    const [endIndex, setEndIndex] = useState(190);
    const [playing, setPlaying] = useState(false);
    const [dataIndex, setDataIndex] = useState(startIndex);
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
                const formatAmount = (amount) => amount !== undefined ? amount.toLocaleString('kr') : '0';
                const formatLabel = (amount, positiveLabel, negativeLabel) => amount > 0 ? positiveLabel : negativeLabel;
                const formatColor = (amount) => amount > 0 ? 'red' : 'blue';
                const foreignNetBuy = this.point.당일외국인순매수금액;
                const institutionNetBuy = this.point.당일기관순매수금액;
                return `
                    ${this.point.name}<br/>
                    등락률 : ${this.point.y} %<br/>
                    전일대비거래량 : ${this.point.전일대비거래량.toLocaleString('kr')} %<br/>
                    ${formatLabel(foreignNetBuy, '당일외국인순매수', '당일외국인순매도')} : <span style="color : ${formatColor(foreignNetBuy)}"> ${formatAmount(foreignNetBuy)} 백만원</span><br/>
                    ${formatLabel(institutionNetBuy, '당일기관순매수', '당일기관순매도')} : <span style="color : ${formatColor(institutionNetBuy)}"> ${formatAmount(institutionNetBuy)} 백만원</span><br/>
                `;
            },
        },
        plotOptions: {
            scatter: {
                showInLegend: false,
                animation: false,
                marker: {
                    radius: 2,
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
                }
            }
        },
    })
    const [tableData, setTableData] = useState([]);
    const timer = useRef(null);


    const marks = [
        {
            value: 58,
            label: '9:30',
        },
        {
            value: 118,
            label: '10:00',
        },
        {
            value: 178,
            label: '10:30',
        },
        // {
        //     value: 238,
        //     label: '11:00',
        // },
        {
            value: 236,
            label: '11:00',
        },
        {
            value: 295,
            label: '11:30',
        },
        {
            value: 355,
            label: '12:00',
        },
        {
            value: 415,
            label: '12:30',
        },
        {
            value: 475,
            label: '13:00',
        },
        {
            value: 534,
            label: '13:30',
        },
        {
            value: 594,
            label: '14:00',
        },
        {
            value: 653,
            label: '14:30',
        },
        {
            value: 713,
            label: '15:00',
        },
    ];


    useEffect(() => {
        if (playing) {
            timer.current = setInterval(() => {
                setDataIndex(prevIndex => {
                    if (prevIndex >= endIndex) {
                        clearInterval(timer.current);
                        setPlaying(false);
                        return prevIndex;
                    }
                    return prevIndex + 1;
                });
            }, 1000);
        } else {
            clearInterval(timer.current);
        }
        return () => clearInterval(timer.current);
    }, [playing]);

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            setChartOptions({
                series: dataset[0],
            })
            setEndIndex(dataset.length - 1);
            const table = handleTableData(dataIndex, dataset)
            setTableData(table);
        }

        if (chart && dataIndex) {
            const newData = getData(dataIndex, dataset);
            chart.series[0].update(newData);
            chart.update({
                subtitle: {
                    text: `${timeLine[dataIndex].split('.')[0]} : ${timeLine[dataIndex].split('.')[1]} : ${timeLine[dataIndex].split('.')[2]}`
                }
            });
            const table = handleTableData(dataIndex, dataset)
            setTableData(table);
        }



    }, [dataset, dataIndex])

    if (!dataset) return <div>Loading...</div>;

    // handler
    const handlePlayPause = () => {
        setPlaying(!playing);
    }

    const getData = (dataIndex, dataset) => {
        return dataset[dataIndex];
    };
    const handleRangeChange = (event) => {
        setDataIndex(Number(event.target.value));
    };
    const handleTableData = (dataIndex, dataset) => {
        const tmp = dataset[dataIndex].data.map((item, index) => ({
            ...item, id: index
        }));
        return tmp
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
            <Grid container spacing={2} alignItems="center">

                <Grid item>
                    <IconButton onClick={handlePlayPause} size="large" >
                        {playing ? <StopIcon sx={{ color: '#efe9e9ed' }} /> : <PlayArrowIcon sx={{ color: '#efe9e9ed' }} />}
                    </IconButton>
                </Grid>
                <Grid item xs>
                    {
                        timeLine && timeLine.length ?
                            <Slider
                                type="range"
                                min={startIndex}
                                max={endIndex}
                                value={dataIndex}
                                marks={marks}
                                valueLabelDisplay="auto"
                                onChange={handleRangeChange}
                                valueLabelFormat={(dataIndex) => `${timeLine[dataIndex].split('.')[0]} : ${timeLine[dataIndex].split('.')[1]} : ${timeLine[dataIndex].split('.')[2]}초`}
                                sx={{
                                    color: '#efe9e9ed',
                                    '.MuiSlider-markLabel': {
                                        color: '#efe9e9ed'
                                    },

                                }}
                            />
                            : <></>
                    }

                </Grid>

            </Grid>
            <Grid container
                onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                sx={{ height: 330 }}>
                <ThemeProvider theme={customTheme}>
                    <DataGrid
                        rows={tableData}
                        columns={columns}
                        hideFooter rowHeight={20}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: '전일대비거래량', sort: 'desc' }],
                            },
                        }}
                        // onCellClick={(params, event) => {
                        //     let item = params.row.item;
                        //     let itemStr = "" + item;
                        //     stockItemSelected({ 종목코드: params.row.종목코드, 종목명: itemStr, 업종명: params.row.업종명 });
                        // }}
                        sx={{
                            color: 'white', border: 'none',
                            ...DataTableStyleDefault,
                            [`& .${gridClasses.cell}`]: { py: 1, },
                            // '.MuiTablePagination-root': { color: '#efe9e9ed' },
                            // '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },

                        }}
                    />
                </ThemeProvider>


            </Grid>
            {/* <div>
                <button onClick={handlePlayPause}>
                    {playing ? 'Pause' : 'Play'}
                </button>
                <input
                    type="range"
                    min={startYear}
                    max={endYear}
                    value={year}
                    onChange={handleRangeChange}
                />
            </div> */}
        </div>
    );
};

export default MotionsChart;
