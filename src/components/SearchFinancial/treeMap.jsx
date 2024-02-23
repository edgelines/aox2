import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import { Grid, Slider } from '@mui/material';
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/heatmap')(Highcharts)
require('highcharts/modules/treemap')(Highcharts)

const Treemap = ({ data, backgroundColor, fontColor, onIndustryClick, height }) => {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : null, backgroundColor: backgroundColor || '#404040' },
        title: { text: null, },
        credits: { enabled: false },
        plotOptions: {
            series: {
                animation: false,
                events: {
                    click: function (e) {
                        onIndustryClick(e.point.업종명);
                    }
                }
            },
        },
        colorAxis: {
            minColor: '#3b8bc4',
            maxColor: '#c4463a',
            // min: 0,
            // max: 100,
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


    // const [treemapData, setTreemapData] = useState([]);
    // const [barMax, setBarMax] = useState();
    // const [barValue, setBarValue] = useState(barMax);

    useEffect(() => {
        const mapData = data.map((val, index) => ({
            ...val,
            name: `${val.업종명}<br/>${val.흑자기업} / ${val.전체종목수}`,
            value: val.전체종목수,
            colorValue: val.흑자기업,
        }))
        setChartOptions({
            series: [
                {
                    type: "treemap",
                    layoutAlgorithm: "squarified",
                    alternateStartingDirection: true,
                    colorByPoint: false,
                    data: mapData
                },
            ],
        });
    }, [data])
    // useEffect(() => {
    //     const data = transformDataForTreemap(sectorsRanksThemes);
    //     setTreemapData(data);
    //     setBarMax(data.length);
    //     setBarValue(data.length); // 초기 barValue도 설정.
    // }, [sectorsRanksThemes]); // 의존성 배열이 빈 배열이므로, 이 useEffect는 컴포넌트가 처음 마운트될 때만 실행.

    // useEffect(() => {
    //     const resultData = [...treemapData].slice(0, barValue);
    //     setChartOptions({
    //         series: [
    //             {
    //                 type: "treemap",
    //                 // clip: false,
    //                 layoutAlgorithm: "squarified",
    //                 // layoutStartingDirection: "horizontal",
    //                 alternateStartingDirection: true,
    //                 colorByPoint: false,
    //                 data: resultData
    //             },
    //         ],
    //     })
    // }, [sectorsRanksThemes, barValue]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </Grid>

        </Grid>
    );
};

export default Treemap;



