// import React, { useState, useEffect, useRef } from 'react';
// import { Grid } from '@mui/material';
// import Highcharts from 'highcharts/highstock'
// import HighchartsReact from 'highcharts-react-official'
// import HighchartsMore from 'highcharts/highcharts-more'
// HighchartsMore(Highcharts)

// const startYear = 1960;
// const endYear = 2018;
// const nbr = 20;


// const formatDataForBarRace = (data) => {
//     const formattedData = {};
//     data.forEach(item => {
//       const timeKey = item.x; // 'x'가 시간을 나타낸다고 가정
//       if (!formattedData[timeKey]) {
//         formattedData[timeKey] = [];
//       }
//       formattedData[timeKey].push({
//         name: item.name,
//         y: item.y, // 'y'가 값을 나타낸다고 가정
//         color: item.color,
//       });
//     });
//     return formattedData;
//   };


// const getData = (dataset, year) => {
//     const output = Object.entries(dataset)
//         .map(([countryName, countryData]) => [countryName, Number(countryData[year])])
//         .sort((a, b) => b[1] - a[1]);
//     return [output[0], output.slice(1, nbr)];
// };

// const PopulationChart = ({ dataset }) => {

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
//         subtitle: {
//             useHTML: true,
//             // text: getSubtitle(),
//             floating: true,
//             align: 'right',
//             verticalAlign: 'middle',
//             y: -80,
//             x: -100
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

//     const [year, setYear] = useState(startYear);
//     const chartComponentRef = useRef(null);
//     const [isPlaying, setIsPlaying] = useState(false);


//     useEffect(() => {
//         if (isPlaying) {
//             const timer = setInterval(() => {
//                 setYear(prevYear => {
//                     if (prevYear >= endYear) {
//                         setIsPlaying(false);
//                         return prevYear;
//                     }
//                     return prevYear + 1;
//                 });
//             }, 500);
//             return () => clearInterval(timer);
//         }
//     }, [isPlaying]);

//     const getSubtitle = () => {
//         const population = (getData(dataset, year)[0][1] / 1000000000).toFixed(2);
//         return `<span style="font-size: 80px">${year}</span>
//             <br>
//             <span style="font-size: 22px">
//                 Total: <b>${population}</b> billion
//             </span>`;
//     };

//     const handlePlayPause = () => {
//         setIsPlaying(!isPlaying);
//     };

//     const handleRangeChange = (event) => {
//         setYear(Number(event.target.value));
//     };

//     if (!dataset) {
//         return <div>Loading...</div>;
//     }

//     useEffect(() => {
//         setChartOptions({
//             series: [
//                 {
//                     type: 'bar',
//                     name: String(year),
//                     data: getData(dataset, year)[1]
//                 }
//             ],
//             subtitle: {
//                 text: getSubtitle(),
//             }
//         })
//     }, [dataset]);

//     return (
//         <div>
//             <HighchartsReact
//                 highcharts={Highcharts}
//                 options={chartOptions}
//                 ref={chartComponentRef}
//             />
//             <div>
//                 <button onClick={handlePlayPause}>
//                     {isPlaying ? 'Pause' : 'Play'}
//                 </button>
//                 <input
//                     type="range"
//                     min={startYear}
//                     max={endYear}
//                     value={year}
//                     onChange={handleRangeChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PopulationChart;

import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarRaceDemo = ({ dataset }) => {
    const startYear = 1960;
    const endYear = 2018;
    const [year, setYear] = useState(startYear);
    const [playing, setPlaying] = useState(false);
    const chartComponent = useRef(null);
    const timer = useRef(null);

    useEffect(() => {
        if (playing) {
            timer.current = setInterval(() => {
                setYear(prevYear => {
                    if (prevYear >= endYear) {
                        clearInterval(timer.current);
                        setPlaying(false);
                        return prevYear;
                    }
                    return prevYear + 1;
                });
            }, 500);
        } else {
            clearInterval(timer.current);
        }
        return () => clearInterval(timer.current);
    }, [playing]);

    useEffect(() => {
        if (dataset) {
            const chart = chartComponent.current.chart;
            const newSubtitle = getSubtitle(year, dataset);
            chart.update({
                subtitle: {
                    text: newSubtitle
                }
            });

            const newData = getData(year, dataset);
            chart.series[0].update({
                name: year,
                data: newData[1]
            });
        }
    }, [year, dataset]);

    const getData = (year, dataset) => {
        const output = Object.entries(dataset)
            .map(([countryName, countryData]) => [countryName, Number(countryData[year])])
            .sort((a, b) => b[1] - a[1]);
        return [output[0], output.slice(1, 20)];
    };

    const getSubtitle = (year, dataset) => {
        const population = (getData(year, dataset)[0][1] / 1000000000).toFixed(2);
        return `<span style="font-size: 80px">${year}</span><br><span style="font-size: 22px">Total: <b>: ${population}</b> billion</span>`;
    };

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleRangeChange = (event) => {
        setYear(Number(event.target.value));
    };

    if (!dataset) return <div>Loading...</div>;

    const chartOptions = {
        chart: {
            animation: { duration: 500 },
            marginRight: 50
        },
        title: { text: 'World population by country', align: 'left' },
        subtitle: {
            useHTML: true,
            text: getSubtitle(year, dataset),
            floating: true,
            align: 'right',
            verticalAlign: 'middle',
            y: -80,
            x: -100
        },
        legend: { enabled: false },
        xAxis: { type: 'category' },
        yAxis: {
            opposite: true,
            tickPixelInterval: 150,
            title: { text: null }
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: true,
                dataSorting: { enabled: true, matchByName: true },
                type: 'bar',
                dataLabels: { enabled: true }
            }
        },
        series: [{
            type: 'bar',
            name: year,
            data: getData(year, dataset)[1]
        }],
        responsive: {
            rules: [{
                condition: { maxWidth: 550 },
                chartOptions: {
                    xAxis: { visible: false },
                    subtitle: { x: 0 },
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
                options={chartOptions}
                ref={chartComponent}
            />
            <div>
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
            </div>
        </div>
    );
};

export default BarRaceDemo;
