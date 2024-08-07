import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { IconButton, Slider, Grid, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const MotionsChart = ({ dataset, timeLine, height }) => {
    const chartComponent = useRef(null);
    const startIndex = 0;
    // const endIndex = 388;
    const [endIndex, setEndIndex] = useState(190);
    const [playing, setPlaying] = useState(false);
    const [dataIndex, setDataIndex] = useState(startIndex);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height : 400, backgroundColor: 'rgba(255, 255, 255, 0)', animation: false,
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'left', style: { color: '#efe9e9ed', fontSize: '18px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 70, y: 30 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '체결강도', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            tickLength: 0,
            plotLines: [{ value: 100, width: 2, color: '#fff', zIndex: 2 }],
            max: 600,
            min: 50
        },
        yAxis: {
            title: { text: '전일대비 거래량 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} %</span>`
                }
            },
            plotLines: [{ value: 0, width: 2, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: 5,
            max: 800
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
                    등락률 : ${this.point.등락률} %<br/>
                    전일대비거래량 : ${this.point.y.toLocaleString('kr')} %<br/>
                    체결강도 : ${this.point.x.toLocaleString('kr')} <br/>
                    ${formatLabel(foreignNetBuy, '당일외국인순매수', '당일외국인순매도')} : <span style="color : ${formatColor(foreignNetBuy)}"> ${formatAmount(foreignNetBuy)} 백만원</span><br/>
                    ${formatLabel(institutionNetBuy, '당일기관순매수', '당일기관순매도')} : <span style="color : ${formatColor(institutionNetBuy)}"> ${formatAmount(institutionNetBuy)} 백만원</span><br/>
                `;
                // return `${this.point.name}<br/>
                // 등락률 : ${this.point.등락률} %<br/>
                // 전일대비거래량 : ${this.point.y.toLocaleString('kr')} %<br/>
                // 체결강도 : ${this.point.x.toLocaleString('kr')} <br/>
                // ${this.point.당일외국인순매수금액 > 0 ? '당일외국인순매수' : '당일외국인순매도'} : <span style="color : ${this.point.당일외국인순매수금액 > 0 ? 'red' : 'blue'}"> ${this.point.당일외국인순매수금액} 백만원</span><br/>
                // ${this.point.당일기관순매수금액 > 0 ? '당일기관순매수' : '당일기관순매수'} : <span style="color : ${this.point.당일기관순매수금액 > 0 ? 'red' : 'blue'}"> ${this.point.당일기관순매수금액} 백만원</span><br/>`
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
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.point.name; // this.point.name을 출력
                    },
                    style: {
                        color: '#efe9e9ed', // 글자 색상
                        textOutline: 'none', // 글꼴 테두리 제거
                        fontSize: '12px' // 필요 시 글꼴 크기 설정
                    }
                },
            },
            series: {
                animation: {
                    duration: 1000
                }
            }
        },
    })

    const timer = useRef(null);
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
        }

        if (chart && dataIndex) {
            const newData = getData(dataIndex, dataset);
            chart.series[0].update(newData);
            chart.update({
                subtitle: {
                    text: `${timeLine[dataIndex].split('.')[0]}시 ${timeLine[dataIndex].split('.')[1]}분`
                }
            });
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
    return (
        <div>
            {/* <Box sx={{ position: 'absolute', transform: 'translate(40px, 50px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: '18px', textAlign: 'left' }}>
                {timeLine && timeLine.length > 0 ? `${timeLine[dataIndex].split('.')[0]}시 ${timeLine[dataIndex].split('.')[1]}분` : ''}
            </Box> */}
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
                    <Slider
                        type="range"
                        min={startIndex}
                        max={endIndex}
                        value={dataIndex}
                        valueLabelDisplay="auto"

                        onChange={handleRangeChange}
                    />
                </Grid>
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
