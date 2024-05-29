import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)

const startYear = 1960;
const endYear = 2018;
const nbr = 20;

const fetchData = async () => {
    const response = await fetch('https://demo-live-data.highcharts.com/population.json');
    const data = await response.json();
    return data;
};

const getData = (dataset, year) => {
    const output = Object.entries(dataset)
        .map(([countryName, countryData]) => [countryName, Number(countryData[year])])
        .sort((a, b) => b[1] - a[1]);
    return [output[0], output.slice(1, nbr)];
};

const PopulationChart = () => {
    const [dataset, setDataset] = useState(null);
    const [year, setYear] = useState(startYear);
    const chartComponentRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadDataset = async () => {
            const data = await fetchData();
            setDataset(data);
        };
        loadDataset();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setYear(prevYear => {
                    if (prevYear >= endYear) {
                        setIsPlaying(false);
                        return prevYear;
                    }
                    return prevYear + 1;
                });
            }, 500);
            return () => clearInterval(timer);
        }
    }, [isPlaying]);

    const getSubtitle = () => {
        const population = (getData(dataset, year)[0][1] / 1000000000).toFixed(2);
        return `<span style="font-size: 80px">${year}</span>
            <br>
            <span style="font-size: 22px">
                Total: <b>${population}</b> billion
            </span>`;
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleRangeChange = (event) => {
        setYear(Number(event.target.value));
    };

    if (!dataset) {
        return <div>Loading...</div>;
    }

    const options = {
        chart: {
            animation: {
                duration: 500
            },
            marginRight: 50
        },
        title: {
            text: 'World population by country',
            align: 'left'
        },
        subtitle: {
            useHTML: true,
            text: getSubtitle(),
            floating: true,
            align: 'right',
            verticalAlign: 'middle',
            y: -80,
            x: -100
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            opposite: true,
            tickPixelInterval: 150,
            title: {
                text: null
            }
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: true,
                dataSorting: {
                    enabled: true,
                    matchByName: true
                },
                type: 'bar',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                type: 'bar',
                name: String(year),
                data: getData(dataset, year)[1]
            }
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 550
                },
                chartOptions: {
                    xAxis: {
                        visible: false
                    },
                    subtitle: {
                        x: 0
                    },
                    plotOptions: {
                        series: {
                            dataLabels: [{
                                enabled: true,
                                y: 8
                            }, {
                                enabled: true,
                                format: '{point.name}',
                                y: -8,
                                style: {
                                    fontWeight: 'normal',
                                    opacity: 0.7
                                }
                            }]
                        }
                    }
                }
            }]
        }
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
            />
            <div>
                <button onClick={handlePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <input
                    type="range"
                    min={startYear}
                    max={endYear}
                    value={year}
                    onChange={handleRangeChange}
                />
            </div>
        </div>
    );
};

export default PopulationChart;

// const PopulationChart = () => {
//     const [dataset, setDataset] = useState({});
//     const [year, setYear] = useState(1960);
//     const chartRef = useRef(null);
//     const sequenceTimerRef = useRef(null);

//     const startYear = 1960,
//         endYear = 2018,
//         btn = document.getElementById('play-pause-button'),
//         input = document.getElementById('play-range'),
//         nbr = 20;
//     const [chartOptions, setChartOptions] = useState({
//         chart: {
//             animation: {
//                 duration: 500
//             },
//             marginRight: 50
//         },
//         title: {
//             text: 'World population by country',
//             align: 'left'
//         },

//         legend: {
//             enabled: false
//         },
//         xAxis: {
//             type: 'category'
//         },
//         yAxis: {
//             opposite: true,
//             tickPixelInterval: 150,
//             title: {
//                 text: null
//             }
//         },
//         plotOptions: {
//             series: {
//                 animation: false,
//                 groupPadding: 0,
//                 pointPadding: 0.1,
//                 borderWidth: 0,
//                 colorByPoint: true,
//                 dataSorting: {
//                     enabled: true,
//                     matchByName: true
//                 },
//                 type: 'bar',
//                 dataLabels: {
//                     enabled: true
//                 }
//             }
//         },
//         responsive: {
//             rules: [{
//                 condition: {
//                     maxWidth: 550
//                 },
//                 chartOptions: {
//                     xAxis: {
//                         visible: false
//                     },
//                     subtitle: {
//                         x: 0
//                     },
//                     plotOptions: {
//                         series: {
//                             dataLabels: [{
//                                 enabled: true,
//                                 y: 8
//                             }, {
//                                 enabled: true,
//                                 format: '{point.name}',
//                                 y: -8,
//                                 style: {
//                                     fontWeight: 'normal',
//                                     opacity: 0.7
//                                 }
//                             }]
//                         }
//                     }
//                 }
//             }]
//         }
//     })


//     useEffect(() => {
//         const fetchDataset = async () => {
//             const response = await fetch('https://demo-live-data.highcharts.com/population.json');
//             const data = await response.json();
//             setDataset(data);
//         };

//         fetchDataset();
//     }, []);

//     useEffect(() => {
//         if (Object.keys(dataset).length > 0) {
//             setChartOptions({
//                 series: [
//                     {
//                         type: 'bar',
//                         name: year,
//                         data: getData(year)[1]
//                     }
//                 ],
//                 // subtitle: {
//                 //     useHTML: true,
//                 //     text: getSubtitle(),
//                 //     floating: true,
//                 //     align: 'right',
//                 //     verticalAlign: 'middle',
//                 //     y: -80,
//                 //     x: -100
//                 // },
//             })
//         }
//     }, [dataset, year]);

//     const getSubtitle = () => {
//         const population = (getData(input.value)[0][1] / 1000000000).toFixed(2);
//         return `<span style="font-size: 80px">${input.value}</span>
//             <br>
//             <span style="font-size: 22px">
//                 Total: <b>: ${population}</b> billion
//             </span>`;
//     }

//     const getData = (year) => {
//         const output = Object.entries(dataset)
//             .map(country => {
//                 const [countryName, countryData] = country;
//                 return [countryName, Number(countryData[year])];
//             })
//             .sort((a, b) => b[1] - a[1]);
//         return [output[0], output.slice(1, nbr)];
//     };

//     const updateChart = (increment) => {
//         if (increment) {
//             const newYear = Math.min(year + increment, 2018);
//             setYear(newYear);
//         }
//         if (chartRef.current) {
//             // 차트 업데이트 로직
//         }
//     };

//     const play = () => {
//         sequenceTimerRef.current = setInterval(() => {
//             updateChart(1);
//         }, 500);
//     };

//     const pause = () => {
//         clearInterval(sequenceTimerRef.current);
//         sequenceTimerRef.current = null;
//     };

//     useEffect(() => {
//         // input 값이 변할 때마다 차트 업데이트
//         updateChart();
//     }, [year]);

//     return (
//         <Grid container>
//             <Grid item container>
//                 <button
//                     onClick={() => {
//                         if (sequenceTimerRef.current) {
//                             pause();
//                         } else {
//                             play();
//                         }
//                     }}
//                 >
//                     {/* 버튼 아이콘은 시퀀스 타이머의 상태에 따라 변경 */}
//                     {sequenceTimerRef.current ? 'Pause' : 'Play'}
//                 </button>
//                 <input
//                     type="range"
//                     min="1960"
//                     max="2018"
//                     value={year}
//                     onChange={(e) => setYear(parseInt(e.target.value, 1))}
//                 />
//             </Grid>
//             <Grid item container>
//                 <HighchartsReact
//                     highcharts={Highcharts}
//                     options={chartOptions}
//                 />
//             </Grid>
//         </Grid>
//     );
// };

// export default PopulationChart;
