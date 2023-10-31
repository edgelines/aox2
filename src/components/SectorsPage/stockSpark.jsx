import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
// import { BoostOptions } from 'highcharts';
import boost from 'highcharts/modules/boost';
require('highcharts/modules/accessibility')(Highcharts)

boost(Highcharts); // Boost 모듈 로드

const SparklineChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            Highcharts.chart(chartRef.current, {
                chart: {
                    type: 'spline',
                    backgroundColor: null,
                    borderWidth: 0,
                    margin: [2, 0, 2, 0],
                    height: 20,
                    style: {
                        overflow: 'visible',
                    },
                    skipClone: true,
                    zoomType: 'x', // Boost 모듈 사용을 위해 x축 줌 기능 활성화
                },
                title: {
                    text: '',
                },
                credits: {
                    enabled: false,
                },
                xAxis: {
                    labels: {
                        enabled: false,
                    },
                    title: {
                        text: null,
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickPositions: [],
                },
                yAxis: {
                    endOnTick: false,
                    startOnTick: false,
                    labels: {
                        enabled: false,
                    },
                    title: {
                        text: null,
                    },
                    tickPositions: [0],
                },
                legend: {
                    enabled: false,
                },
                tooltip: {
                    enabled: false,
                },
                plotOptions: {
                    series: {
                        animation: false,
                        lineWidth: 1,
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1,
                            },
                        },
                        marker: {
                            radius: 1,
                            states: {
                                hover: {
                                    radius: 2,
                                },
                            },
                        },
                        fillOpacity: 0.25,
                        boostThreshold: 1, // Boost 모듈 사용을 위한 boostThreshold 옵션 활성화
                    },
                    column: {
                        negativeColor: '#910000',
                        borderColor: 'silver',
                    },
                },
                series: [
                    {
                        data,
                        boostThreshold: 1, // Boost 모듈 사용을 위한 boostThreshold 옵션 활성화
                    },
                ],
                boost: {
                    enabled: true, // Boost 모듈 사용 활성화
                    useGPUTranslations: true,
                    usePreallocated: true,
                },
            });
        }
    }, [data]);

    return (
        <div ref={chartRef} />
    );
};

export default SparklineChart;