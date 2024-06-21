import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import { IconButton, Slider, Grid, Skeleton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
HighchartsMore(Highcharts)

require('highcharts/modules/accessibility')(Highcharts)

export default function IndustrykChart({ dataset, height, timeLine }) {
    const chartComponent = useRef(null);
    const startIndex = 0;
    const endIndex = 388;
    const [playing, setPlaying] = useState(false);
    const [dataIndex, setDataIndex] = useState(startIndex);
    const timer = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bubble',
            zoomType: 'xy',
            height: height ? height : null, backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        subtitle: { align: 'left', style: { color: '#efe9e9ed', fontSize: '18px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 70, y: 30 },
        navigation: { buttonOptions: { enabled: false } }, credits: { enabled: false },
        legend: { enabled: false }, title: { text: null },


        xAxis: [{
            gridLineWidth: 1,
            title: {
                text: null
            },
            labels: {
                y: 13,
                style: { color: '#efe9e9ed', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            gridLineWidth: 0.2,
            tickWidth: 0,
            plotLines: [{
                color: '#efe9e9ed',
                // dashStyle: 'dot',
                width: 0.7,
                value: 0,
                zIndex: 3
            }],
            max: 31,
            opposite: false,
        }, {
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value} %</span>`
                }
            },
            tickWidth: 0,
            opposite: true,
            linkedTo: 0
        }, {
            gridLineWidth: 0,
            lineWidth: 0,
            labels: {
                y: 10,
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    return `${(this.value * 100).toLocaleString('kr')} %`
                }
            },
            tickWidth: 0,
        }],

        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            title: {
                text: null
            },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
            },
            gridLineWidth: 0.2,
            maxPadding: 0.2,
            reversed: true,
            type: 'category'

        }],

        tooltip: {
            formatter: function () {
                const { series, 종목명, 업종명, 테마명, 전일대비거래량, x } = this.point;
                const formattedVolume = (x * 100).toLocaleString('kr') + ' %'
                const formattedDiff = parseInt(전일대비거래량 * 100).toLocaleString('kr') + ' %'

                if (series.options.isStock) {
                    return `<b>${종목명}</b><br/><p>등락률 : ${x}</p><br/><p>전일대비% : ${formattedDiff}</p>`;
                }

                const 기준 = series.options.isToday ? '오늘' : '어제';
                const 명칭 = 업종명 != undefined ? 업종명 : 테마명;

                return `<b>${기준}</b> 기준<br/><p>${명칭}</p><br/><p>전일대비평균거래량 : ${formattedVolume}</p><br/>`;

            },
        },

        plotOptions: {

            bubble: {
                minSize: 11,
                maxSize: 11,
                dataLabels: {
                    enabled: true,

                    formatter: function () {
                        if (this.point.dataLabelsName) {
                            return this.point.종목명; // this.point.name을 출력
                        }
                    },
                    style: {
                        color: '#efe9e9ed', // 글자 색상
                        textOutline: 'none', // 글꼴 테두리 제거
                        fontSize: '9px' // 필요 시 글꼴 크기 설정
                    },
                    x: 0,
                    y: -1,
                },

            },
            series: {
                animation: {
                    duration: 1000
                }

            },

        },

    })

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
        let chart;
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            setChartOptions({
                series: dataset[0]['data'][0]['chart']['series'],
                yAxis: dataset[0]['data'][0]['chart']['yAxis'],
            })
        }

        if (chart && dataIndex) {
            const newData = getData(dataIndex, dataset);

            chart.series[0].update(newData.series[0]);
            chart.series[1].update(newData.series[1]);
            chart.series[2].update(newData.series[2]);

            setChartOptions({
                yAxis: newData.yAxis,
            })
            chart.update({
                subtitle: {
                    text: `${timeLine[dataIndex].split('.')[0]}시 ${timeLine[dataIndex].split('.')[1]}분`
                },
            });
        }


    }, [dataset, dataIndex])

    if (!dataset) return <Skeleton animation="wave" height={930} />;

    // handler
    const handlePlayPause = () => {
        setPlaying(!playing);
    }

    const getData = (dataIndex, dataset) => {
        // console.log('dataset[dataIndex] : ', dataset[dataIndex]['data'][0]['chart'])
        return dataset[dataIndex]['data'][0]['chart']
    };
    const handleRangeChange = (event) => {
        setDataIndex(Number(event.target.value));
    };



    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartComponent}
            // constructorType={'stockChart'}
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
        </div>
    )
}

Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
    return ["M", x, y, "L", x + w, y + h, "M", x + w, y, "L", x, y + h, "z"];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}