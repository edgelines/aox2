import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import { Grid, Slider } from '@mui/material';
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/heatmap')(Highcharts)
require('highcharts/modules/treemap')(Highcharts)

const Treemap = ({ sectorsRanksThemes, backgroundColor, sliderColor, fontColor, onThemeClick, height }) => {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : null, backgroundColor: backgroundColor || '#404040' },
        title: { text: null, },
        credits: { enabled: false },
        plotOptions: {
            series: {
                animation: false,
                events: {
                    click: function (e) {
                        onThemeClick(e.point.stocks);
                    }
                }
            },
        },
        colorAxis: {
            minColor: '#3b8bc4',
            maxColor: '#c4463a',
            min: -3,
            max: 3,
            labels: { style: { color: fontColor || '#efe9e9ed', fontSize: '10px' }, },
            stops: [
                [0, 'blue'], // 최대값
                [0.25, '#7cb5ec'], // 0 근처 3b8bc4
                [0.5, '#eece2f'], // 중간값
                [0.75, '#f7a35c'], // 0 근처
                [1, '#c4463a'] // 최소값
            ]
        },
    })
    // 테마 배열을 트리맵 데이터로 변환하는 함수
    const transformDataForTreemap = (rankData) => {
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
        const treemapData = Array.from(themeMap.values()).map((themeObj, index) => ({
            name: `${themeObj.theme} ( ${themeObj.count} ) <br/> ${themeObj.fluctuation.toFixed(2)}`,
            value: themeObj.count,
            colorValue: themeObj.fluctuation, // colorValue를 fluctuation으로 설정
            stocks: themeObj.stocks,
        }));
        return treemapData;
    };

    const [treemapData, setTreemapData] = useState([]);
    const [barMax, setBarMax] = useState();
    const [barValue, setBarValue] = useState(barMax);

    useEffect(() => {
        const data = transformDataForTreemap(sectorsRanksThemes);
        setTreemapData(data);
        setBarMax(data.length);
        setBarValue(data.length); // 초기 barValue도 설정.
    }, [sectorsRanksThemes]); // 의존성 배열이 빈 배열이므로, 이 useEffect는 컴포넌트가 처음 마운트될 때만 실행.

    useEffect(() => {
        const resultData = [...treemapData].slice(0, barValue);
        setChartOptions({
            series: [
                {
                    type: "treemap",
                    // clip: false,
                    layoutAlgorithm: "squarified",
                    // layoutStartingDirection: "horizontal",
                    alternateStartingDirection: true,
                    colorByPoint: false,
                    data: resultData
                },
            ],
        })
    }, [sectorsRanksThemes, barValue]);

    return (
        <Grid container>
            <Grid item xs={11}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
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

export default Treemap;



