import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import { Grid, Slider } from '@mui/material';
require('highcharts/modules/accessibility')(Highcharts)

const ColumnChart = ({ sectorsRanksThemes, backgroundColor, sliderColor, fontColor, onThemeClick, height, categoryColor }) => {
    // 테마 배열을 트리맵 데이터로 변환하는 함수
    const transformData = (rankData) => {
        // 각 랭크의 테마 배열을 하나의 배열로 합침
        const allThemes = [...rankData.rank1, ...rankData.rank2, ...rankData.rank3, ...rankData.rank4];

        // 테마 이름을 key로 가지는 Map을 생성하여 중복 제거
        const themeMap = new Map();
        allThemes.forEach(themeObj => {
            if (themeMap.has(themeObj.theme)) {
                const existingObj = themeMap.get(themeObj.theme);
                existingObj.count += themeObj.count; // 기존 count에 추가
                existingObj.fluctuation = (existingObj.fluctuation + themeObj.fluctuation) / 2; // fluctuation을 평균으로 계산
            } else {
                themeMap.set(themeObj.theme, themeObj); // 새로운 엔트리 생성
            }
        });

        // Map의 value들을 트리맵 데이터 형태로 변환
        const columnChartData = Array.from(themeMap.values()).map((themeObj, index) => {
            return {
                name: themeObj.theme,
                y: themeObj.fluctuation,
                stocks: themeObj.stocks,
            }
        });
        columnChartData.sort((a, b) => b.y - a.y);  // Y값 내림차순
        return columnChartData;
    };

    const chartRef = useRef(null);
    const [columnChartData, setColumnChartData] = useState([]);
    const [barMax, setBarMax] = useState();
    const [barValue, setBarValue] = useState(barMax);

    useEffect(() => {
        const data = transformData(sectorsRanksThemes);
        setColumnChartData(data);
        setBarMax(data.length);
        setBarValue(data.length); // 초기 barValue도 설정.
    }, [sectorsRanksThemes]); // 의존성 배열이 빈 배열이므로, 이 useEffect는 컴포넌트가 처음 마운트될 때만 실행.

    useEffect(() => {
        if (chartRef.current) {
            const resultData = [...columnChartData].slice(0, barValue);

            Highcharts.chart(chartRef.current, {
                chart: { animation: false, type: 'bar', backgroundColor: backgroundColor || '#404040', height: height || null },
                title: { text: null, },
                legend: { enabled: false },
                credits: { enabled: false },
                plotOptions: {
                    series: {
                        animation: false,
                        dataLabels: {
                            enabled: true,
                            inside: true,
                            align: 'left',
                            color: fontColor || '#efe9e9ed',
                            style: { fontSize: '9px' },
                            formatter: function () {
                                let stocksList = this.point.stocks.slice(0, 2).map(stock => stock.item);
                                let formattedString = stocksList.join(', ');
                                return `${formattedString} / <span style="color:${categoryColor || 'red'}">${this.point.category}</span>`;
                            }
                            // formatter: function () {
                            //     console.log(this.point);
                            //     return this.point.category;
                            // }
                        },
                        events: {
                            click: function (e) {
                                onThemeClick(e.point.stocks);
                            }
                        },
                    },
                },
                xAxis: {
                    categories: resultData.map(item => item.name),
                    labels: { style: { fontSize: '0px' } }
                },
                yAxis: {
                    title: { text: null }, plotLines: [{ color: "darkorange", value: 0, width: 2, zIndex: 1 }],
                    labels: { style: { color: fontColor || '#efe9e9ed' } }
                },
                tooltip: {
                    enabled: false,
                    crosshairs: true,
                    // useHTML: true,
                    // formatter: function () {
                    //     return this.point.category + '<br/><b>' + this.point.y.toFixed(1) + ' %</b>';
                    // }
                },
                series: [{
                    name: 'Themes',
                    data: resultData,
                    // colorByPoint: true
                }],
            });
        }
    }, [sectorsRanksThemes, barValue]);

    return (
        <Grid container>
            <Grid item xs={11}>
                <div ref={chartRef} />
            </Grid>
            <Grid item xs={1}>
                {barValue && (
                    <Slider
                        orientation="vertical"
                        value={barMax - barValue + 1}
                        sx={{ height: '85%', color: sliderColor || '#efe9e9ed' }}
                        min={1}
                        max={barMax}
                        scale={(x) => barMax - x + 1}
                        onChange={(event, newValue) => { setBarValue(barMax - newValue + 1); }}
                    />
                )}

            </Grid>
        </Grid>
    );
};

export default ColumnChart;



