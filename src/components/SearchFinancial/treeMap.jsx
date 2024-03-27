import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import { Grid, Slider } from '@mui/material';
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/heatmap')(Highcharts)
require('highcharts/modules/treemap')(Highcharts)

const Treemap = ({ data, backgroundColor, fontColor, onIndustryClick, height, dataName }) => {
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
        legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'middle'
        },
        tooltip: { enabled: false },
        colorAxis: {
            minColor: '#3b8bc4',
            maxColor: '#c4463a',
            // min: 0,
            // max: 100,
            labels: { style: { color: fontColor || '#efe9e9ed', fontSize: '10px' }, },
            stops: [
                [0, '#404040'], // 최소값
                // [0.25, '#7cb5ec'], // 0 근처 3b8bc4
                // [0.5, '#eece2f'], // 중간값
                [0.5, '#f7a35c'], // 0 근처
                [1, '#c4463a'] // 최대값
            ]
        },
    })


    useEffect(() => {
        var mapData;
        if (!Array.isArray(data)) {
            return;
        }

        if (dataName === 'Industry') {
            mapData = data.map((val, index) => ({
                ...val,
                name: `${val.업종명}<br/>${val.종목수} / ${val.전체종목수}`,
                value: val.전체종목수,
                colorValue: val.종목수,
            }))

        } else if (dataName === 'Themes') {
            mapData = data.map((val, index) => ({
                ...val,
                name: `${val.테마명}<br/>${val.종목수} / ${val.전체종목수}`,
                value: val.전체종목수,
                colorValue: val.종목수,
            }))
        } else {
            mapData = data.map((val, index) => ({
                ...val,
                name: `${val.업종명}<br/>${val.흑자기업} / ${val.전체종목수}`,
                value: val.전체종목수,
                colorValue: val.흑자기업,
            }))
        }
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



