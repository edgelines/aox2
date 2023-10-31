import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { range } from 'lodash';
// import { Skeleton } from '@mui/material';
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

export default function GpoChart({ data1, data2, data3, height, kospi200, credit, creditsPositionX, creditsPositionY }) {
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            selected: 1, inputDateFormat: "%Y-%m-%d", inputStyle: { color: "#efe9e9ed" }, labelStyle: { color: "#efe9e9ed" },
            buttons: [{ type: "month", count: 5, text: "5M", title: "View 5 months" }, { type: "month", count: 7, text: "7M", title: "View 7 months" },
            { type: "month", count: 8, text: "8M", title: "View 8 months" },],
        },
        chart: { animation: false, backgroundColor: "rgba(255, 255, 255, 0)", height: height },
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: creditsPositionX ? creditsPositionX : -12, y: creditsPositionY ? creditsPositionY : 40, align: 'right' } } : { enabled: false },
        title: { text: null, style: { color: "#efe9e9ed", fontSize: "15px" }, y: 30 },
        xAxis: {
            labels: { style: { color: "#efe9e9ed", fontSize: "11px" }, format: "{value:%y-%m-%d}", y: 40 },
            tickInterval: 7,
        },
        yAxis: [
            { title: { text: null }, visible: false },
            {
                title: { enabled: false },
                labels: {
                    align: "left",
                    x: 6,
                    style: { color: "#efe9e9ed", fontSize: "12px" },
                    formatter: function () {
                        return this.value.toLocaleString("ko-KR");
                    },
                },
                gridLineWidth: 0.2,
            },
        ],
        tooltip: {
            crosshairs: true,
            hideDelay: 2,
            formatter: function () {
                let s = "<b>" + Highcharts.dateFormat("%m-%d, %A", this.x) + "</b>";
                return s;
            },
            backgroundColor: "#404040",
            style: { color: "#e8e3e3" },
        },
        legend: { enabled: false },
        boost: { useGPUTranslations: true },
        navigator: {
            height: 15, margin: 10,
            series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
            xAxis: {
                events: {
                    afterSetExtremes: function (e) {
                        if (e.trigger === 'navigator') return;
                        const chart = this.chart;
                        const dataMax = chart.xAxis[0].dataMax;
                        const range = e.max - e.min;
                        chart.xAxis[0].setExtremes(dataMax - (range / 2), dataMax);
                    }
                }
            }
        },
        navigation: { buttonOptions: { enabled: false } },
    })

    const label41 = 29;
    const label39 = 41;
    const label21 = 55;
    const label6 = 73;
    const labelE = -7;
    const labelU48 = 330;
    const labelU42 = 270;
    const labelU39 = 305;
    const labelU16 = 230;
    const labelU6 = 200;
    const labelUE = 160;
    const fontstyle_미국 = { color: "#00f2ff", fontSize: "11px", fontWeight: "bold" };
    const fontstyle_한국 = { color: "#FCAB2F", fontSize: "11px", fontWeight: "bold" };
    const fontstyle_38 = { color: "rgba(253, 104, 208, 1)", fontSize: "11px", fontWeight: "bold" };
    const fontstyle_만기 = { color: "#efe9e9ed", fontSize: "13px", fontWeight: "bold" };
    const 만기컬러 = "rgba(255, 255, 255, 1)";
    const 한국컬러 = "rgba(252, 171, 49, 0.4)";
    const 미국컬러 = "rgba(0, 242, 255, 0.5)";
    const 미국컬러10 = "rgba(0, 242, 255, 0.75)";
    const 컬러38 = "rgba(253, 104, 208, 0.8)";

    useEffect(() => {

        let plotBands1 = [];
        // Kospi200
        for (let i = 11; i > 0; i--) {
            const days = ['47', '43', '41', '39', '21', '10', '6', '만기']
            days.forEach((item) => {
                const 만기월_key = `지난달${i}_만기월`;
                const value_key = `지난달${i}_${item}`;  // 47을 예로 들었지만, 다른 값들에 대해서도 확장할 수 있습니다

                let yValue;
                switch (item) {
                    case '41': yValue = label41; break;
                    case '39': yValue = label39; break;
                    case '21': yValue = label21; break;
                    case '10': yValue = label21; break;
                    case '6': yValue = label6; break;
                    case '만기': yValue = labelE; break;
                    default: yValue = 12;
                }

                let labelText;
                switch (item) {
                    case '21': labelText = `K${data1[만기월_key]} 变 ${item}`; break;
                    case '6': labelText = `K${data1[만기월_key]} ★ ${item} <br> Next Month`; break;
                    case '만기': labelText = `K${data1[만기월_key]}E`; break;
                    default: labelText = `K${data1[만기월_key]}◆${item}`;
                }

                let labelStyle;
                switch (item) {
                    case '만기': labelStyle = fontstyle_만기; break;
                    default: labelStyle = fontstyle_한국;
                }
                let labelColor;
                switch (item) {
                    case '만기': labelColor = 만기컬러; break;
                    default: labelColor = 한국컬러;
                }

                plotBands1.push({
                    label: {
                        text: labelText,
                        style: labelStyle,
                        x: item === '만기' ? 0 : -4.1,
                        y: yValue
                    },
                    borderWidth: 2,
                    color: labelColor,
                    from: data1[value_key],
                    to: data1[value_key],
                });
            })
        }
        // US
        for (let i = 13; i > 0; i--) {
            const days = ['47', '43', '41', '39', '21', '10', '5', '만기']
            days.forEach((item) => {
                const 만기월_key = `지난달${i}_만기월`;
                const value_key = `지난달${i}_${item}`;  // 47을 예로 들었지만, 다른 값들에 대해서도 확장할 수 있습니다

                let yValue;
                switch (item) {
                    case '47': yValue = labelU48; break;
                    case '43': yValue = labelU42; break;
                    case '41': yValue = labelU48; break;
                    case '39': yValue = labelU39; break;
                    case '21': yValue = labelU16; break;
                    case '10': yValue = labelU16; break;
                    case '5': yValue = labelU6; break;
                    case '만기': yValue = labelUE; break;
                    default: yValue = 9;
                }

                let labelText;
                switch (item) {
                    case '21': labelText = `U${data2[만기월_key]} 变 ${item}`; break;
                    case '5': labelText = `U${data2[만기월_key]} ★ ${item} <br> Next Month`; break;
                    case '만기': labelText = `U${data2[만기월_key]}E`; break;
                    default: labelText = `U${data2[만기월_key]}▲${item}`;
                }

                let labelStyle;
                switch (item) {
                    case '만기': labelStyle = fontstyle_만기; break;
                    case '21': labelStyle = fontstyle_미국; break;
                    case '10': labelStyle = fontstyle_미국; break;
                    case '5': labelStyle = fontstyle_미국; break;
                    default: labelStyle = fontstyle_38;
                }
                let labelColor;
                switch (item) {
                    case '만기': labelColor = 만기컬러; break;
                    case '21': labelColor = 미국컬러; break;
                    case '10': labelColor = 미국컬러10; break;
                    case '5': labelColor = 미국컬러10; break;
                    default: labelColor = 컬러38;
                }

                plotBands1.push({
                    label: {
                        text: labelText,
                        style: labelStyle,
                        x: item === '만기' ? 0 : -4.1,
                        y: yValue
                    },
                    borderWidth: 2,
                    color: labelColor,
                    from: data2[value_key],
                    to: data2[value_key],
                });
            })
        }

        setChartOptions({
            xAxis: {
                // plotBands: [
                //     { label: { text: "K" + data1.지난달11_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_47, to: data1.지난달11_47, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_47, to: data1.지난달10_47, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_47, to: data1.지난달9_47, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_47, to: data1.지난달8_47, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_47, to: data1.지난달7_47, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_47, to: data1.지난달6_47, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_47, to: data1.지난달5_47, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_47, to: data1.지난달4_47, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_47, to: data1.지난달3_47, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_47, to: data1.지난달2_47, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_47, to: data1.지난달1_47, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "◆47", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_47, to: data1.지난달0_47, },

                //     { label: { text: "K" + data1.지난달11_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_43, to: data1.지난달11_43, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_43, to: data1.지난달10_43, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_43, to: data1.지난달9_43, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_43, to: data1.지난달8_43, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_43, to: data1.지난달7_43, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_43, to: data1.지난달6_43, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_43, to: data1.지난달5_43, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_43, to: data1.지난달4_43, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_43, to: data1.지난달3_43, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_43, to: data1.지난달2_43, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_43, to: data1.지난달1_43, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "◆43", style: fontstyle_한국, x: -4.1 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_43, to: data1.지난달0_43, },

                //     { label: { text: "K" + data1.지난달11_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_41, to: data1.지난달11_41, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_41, to: data1.지난달10_41, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_41, to: data1.지난달9_41, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_41, to: data1.지난달8_41, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_41, to: data1.지난달7_41, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_41, to: data1.지난달6_41, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_41, to: data1.지난달5_41, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_41, to: data1.지난달4_41, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_41, to: data1.지난달3_41, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_41, to: data1.지난달2_41, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_41, to: data1.지난달1_41, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "◆41", style: fontstyle_한국, x: -4.1, y: label41 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_41, to: data1.지난달0_41, },

                //     { label: { text: "K" + data1.지난달11_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_39, to: data1.지난달11_39, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_39, to: data1.지난달10_39, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_39, to: data1.지난달9_39, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_39, to: data1.지난달8_39, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_39, to: data1.지난달7_39, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_39, to: data1.지난달6_39, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_39, to: data1.지난달5_39, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_39, to: data1.지난달4_39, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_39, to: data1.지난달3_39, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_39, to: data1.지난달2_39, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_39, to: data1.지난달1_39, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "◆39", style: fontstyle_한국, x: -4.1, y: label39 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_39, to: data1.지난달0_39, },

                //     { label: { text: "K" + data1.지난달11_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_21, to: data1.지난달11_21, },
                //     { label: { text: "K" + data1.지난달10_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_21, to: data1.지난달10_21, },
                //     { label: { text: "K" + data1.지난달9_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_21, to: data1.지난달9_21, },
                //     { label: { text: "K" + data1.지난달8_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_21, to: data1.지난달8_21, },
                //     { label: { text: "K" + data1.지난달7_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_21, to: data1.지난달7_21, },
                //     { label: { text: "K" + data1.지난달6_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_21, to: data1.지난달6_21, },
                //     { label: { text: "K" + data1.지난달5_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_21, to: data1.지난달5_21, },
                //     { label: { text: "K" + data1.지난달4_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_21, to: data1.지난달4_21, },
                //     { label: { text: "K" + data1.지난달3_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_21, to: data1.지난달3_21, },
                //     { label: { text: "K" + data1.지난달2_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_21, to: data1.지난달2_21, },
                //     { label: { text: "K" + data1.지난달1_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_21, to: data1.지난달1_21, },
                //     { label: { text: "K" + data1.지난달0_만기월 + " 变 21", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_21, to: data1.지난달0_21, },

                //     { label: { text: "K" + data1.지난달11_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_10, to: data1.지난달11_10, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_10, to: data1.지난달10_10, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_10, to: data1.지난달9_10, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_10, to: data1.지난달8_10, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_10, to: data1.지난달7_10, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_10, to: data1.지난달6_10, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_10, to: data1.지난달5_10, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_10, to: data1.지난달4_10, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_10, to: data1.지난달3_10, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_10, to: data1.지난달2_10, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_10, to: data1.지난달1_10, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "◆10", style: fontstyle_한국, x: -4.1, y: label21 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_10, to: data1.지난달0_10, },

                //     { label: { text: "K" + data1.지난달11_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달11_6, to: data1.지난달11_6, },
                //     { label: { text: "K" + data1.지난달10_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달10_6, to: data1.지난달10_6, },
                //     { label: { text: "K" + data1.지난달9_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달9_6, to: data1.지난달9_6, },
                //     { label: { text: "K" + data1.지난달8_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달8_6, to: data1.지난달8_6, },
                //     { label: { text: "K" + data1.지난달7_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달7_6, to: data1.지난달7_6, },
                //     { label: { text: "K" + data1.지난달6_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달6_6, to: data1.지난달6_6, },
                //     { label: { text: "K" + data1.지난달5_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달5_6, to: data1.지난달5_6, },
                //     { label: { text: "K" + data1.지난달4_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달4_6, to: data1.지난달4_6, },
                //     { label: { text: "K" + data1.지난달3_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달3_6, to: data1.지난달3_6, },
                //     { label: { text: "K" + data1.지난달2_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달2_6, to: data1.지난달2_6, },
                //     { label: { text: "K" + data1.지난달1_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달1_6, to: data1.지난달1_6, },
                //     { label: { text: "K" + data1.지난달0_만기월 + " ★ 6 <br> Next Month", style: fontstyle_한국, x: -4.1, y: label6 }, borderWidth: 2, color: 한국컬러, from: data1.지난달0_6, to: data1.지난달0_6, },

                //     { label: { text: "K" + data1.지난달11_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달11_만기, to: data1.지난달11_만기, },
                //     { label: { text: "K" + data1.지난달10_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달10_만기, to: data1.지난달10_만기, },
                //     { label: { text: "K" + data1.지난달9_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달9_만기, to: data1.지난달9_만기, },
                //     { label: { text: "K" + data1.지난달8_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달8_만기, to: data1.지난달8_만기, },
                //     { label: { text: "K" + data1.지난달7_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달7_만기, to: data1.지난달7_만기, },
                //     { label: { text: "K" + data1.지난달6_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달6_만기, to: data1.지난달6_만기, },
                //     { label: { text: "K" + data1.지난달5_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달5_만기, to: data1.지난달5_만기, },
                //     { label: { text: "K" + data1.지난달4_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달4_만기, to: data1.지난달4_만기, },
                //     { label: { text: "K" + data1.지난달3_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달3_만기, to: data1.지난달3_만기, },
                //     { label: { text: "K" + data1.지난달2_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달2_만기, to: data1.지난달2_만기, },
                //     { label: { text: "K" + data1.지난달1_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달1_만기, to: data1.지난달1_만기, },
                //     { label: { text: "K" + data1.지난달0_만기월 + "E", style: fontstyle_만기, y: labelE }, borderWidth: 2, color: 만기컬러, from: data1.지난달0_만기, to: data1.지난달0_만기, },

                //     // US
                //     { label: { text: "U" + data2.지난달12_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달12_47, to: data2.지난달12_47, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달11_47, to: data2.지난달11_47, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달10_47, to: data2.지난달10_47, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달9_47, to: data2.지난달9_47, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달8_47, to: data2.지난달8_47, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달7_47, to: data2.지난달7_47, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달6_47, to: data2.지난달6_47, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달5_47, to: data2.지난달5_47, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달4_47, to: data2.지난달4_47, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달3_47, to: data2.지난달3_47, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달2_47, to: data2.지난달2_47, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달1_47, to: data2.지난달1_47, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "▲47", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달0_47, to: data2.지난달0_47, },

                //     { label: { text: "U" + data2.지난달12_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달12_43, to: data2.지난달12_43, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달11_43, to: data2.지난달11_43, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달10_43, to: data2.지난달10_43, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달9_43, to: data2.지난달9_43, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달8_43, to: data2.지난달8_43, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달7_43, to: data2.지난달7_43, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달6_43, to: data2.지난달6_43, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달5_43, to: data2.지난달5_43, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달4_43, to: data2.지난달4_43, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달3_43, to: data2.지난달3_43, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달2_43, to: data2.지난달2_43, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달1_43, to: data2.지난달1_43, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "▲42", style: fontstyle_38, x: -4.1, y: labelU42 }, borderWidth: 2, color: 컬러38, from: data2.지난달0_43, to: data2.지난달0_43, },

                //     { label: { text: "U" + data2.지난달12_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달12_41, to: data2.지난달12_41, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달11_41, to: data2.지난달11_41, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달10_41, to: data2.지난달10_41, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달9_41, to: data2.지난달9_41, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달8_41, to: data2.지난달8_41, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달7_41, to: data2.지난달7_41, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달6_41, to: data2.지난달6_41, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달5_41, to: data2.지난달5_41, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달4_41, to: data2.지난달4_41, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달3_41, to: data2.지난달3_41, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달2_41, to: data2.지난달2_41, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달1_41, to: data2.지난달1_41, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "▲41", style: fontstyle_38, x: -4.1, y: labelU48 }, borderWidth: 2, color: 컬러38, from: data2.지난달0_41, to: data2.지난달0_41, },

                //     { label: { text: "U" + data2.지난달12_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달12_39, to: data2.지난달12_39, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달11_39, to: data2.지난달11_39, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달10_39, to: data2.지난달10_39, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달9_39, to: data2.지난달9_39, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달8_39, to: data2.지난달8_39, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달7_39, to: data2.지난달7_39, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달6_39, to: data2.지난달6_39, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달5_39, to: data2.지난달5_39, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달4_39, to: data2.지난달4_39, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달3_39, to: data2.지난달3_39, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달2_39, to: data2.지난달2_39, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달1_39, to: data2.지난달1_39, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "▲39", style: fontstyle_38, x: -4.1, y: labelU39 }, borderWidth: 2, color: 컬러38, from: data2.지난달0_39, to: data2.지난달0_39, },

                //     { label: { text: "U" + data2.지난달12_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달12_21, to: data2.지난달12_21, },
                //     { label: { text: "U" + data2.지난달11_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달11_21, to: data2.지난달11_21, },
                //     { label: { text: "U" + data2.지난달10_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달10_21, to: data2.지난달10_21, },
                //     { label: { text: "U" + data2.지난달9_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달9_21, to: data2.지난달9_21, },
                //     { label: { text: "U" + data2.지난달8_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달8_21, to: data2.지난달8_21, },
                //     { label: { text: "U" + data2.지난달7_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달7_21, to: data2.지난달7_21, },
                //     { label: { text: "U" + data2.지난달6_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달6_21, to: data2.지난달6_21, },
                //     { label: { text: "U" + data2.지난달5_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달5_21, to: data2.지난달5_21, },
                //     { label: { text: "U" + data2.지난달4_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달4_21, to: data2.지난달4_21, },
                //     { label: { text: "U" + data2.지난달3_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달3_21, to: data2.지난달3_21, },
                //     { label: { text: "U" + data2.지난달2_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달2_21, to: data2.지난달2_21, },
                //     { label: { text: "U" + data2.지난달1_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달1_21, to: data2.지난달1_21, },
                //     { label: { text: "U" + data2.지난달0_만기월 + " 变 16", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러, from: data2.지난달0_21, to: data2.지난달0_21, },

                //     { label: { text: "U" + data2.지난달12_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달12_10, to: data2.지난달12_10, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달11_10, to: data2.지난달11_10, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달10_10, to: data2.지난달10_10, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달9_10, to: data2.지난달9_10, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달8_10, to: data2.지난달8_10, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달7_10, to: data2.지난달7_10, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달6_10, to: data2.지난달6_10, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달5_10, to: data2.지난달5_10, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달4_10, to: data2.지난달4_10, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달3_10, to: data2.지난달3_10, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달2_10, to: data2.지난달2_10, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달1_10, to: data2.지난달1_10, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "▲10", style: fontstyle_미국, x: -4.1, y: labelU16 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달0_10, to: data2.지난달0_10, },

                //     { label: { text: "U" + data2.지난달12_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달12_6, to: data2.지난달12_6, },
                //     { label: { text: "U" + data2.지난달11_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달11_6, to: data2.지난달11_6, },
                //     { label: { text: "U" + data2.지난달10_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달10_6, to: data2.지난달10_6, },
                //     { label: { text: "U" + data2.지난달9_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달9_6, to: data2.지난달9_6, },
                //     { label: { text: "U" + data2.지난달8_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달8_6, to: data2.지난달8_6, },
                //     { label: { text: "U" + data2.지난달7_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달7_6, to: data2.지난달7_6, },
                //     { label: { text: "U" + data2.지난달6_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달6_6, to: data2.지난달6_6, },
                //     { label: { text: "U" + data2.지난달5_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달5_6, to: data2.지난달5_6, },
                //     { label: { text: "U" + data2.지난달4_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달4_6, to: data2.지난달4_6, },
                //     { label: { text: "U" + data2.지난달3_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달3_6, to: data2.지난달3_6, },
                //     { label: { text: "U" + data2.지난달2_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달2_6, to: data2.지난달2_6, },
                //     { label: { text: "U" + data2.지난달1_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달1_6, to: data2.지난달1_6, },
                //     { label: { text: "U" + data2.지난달0_만기월 + " ★ 5 <br> Next Month", style: fontstyle_미국, x: -4.1, y: labelU6 }, borderWidth: 2, color: 미국컬러10, from: data2.지난달0_6, to: data2.지난달0_6, },

                //     { label: { text: "U" + data2.지난달12_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달12_만기, to: data2.지난달12_만기, },
                //     { label: { text: "U" + data2.지난달11_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달11_만기, to: data2.지난달11_만기, },
                //     { label: { text: "U" + data2.지난달10_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달10_만기, to: data2.지난달10_만기, },
                //     { label: { text: "U" + data2.지난달9_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달9_만기, to: data2.지난달9_만기, },
                //     { label: { text: "U" + data2.지난달8_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달8_만기, to: data2.지난달8_만기, },
                //     { label: { text: "U" + data2.지난달7_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달7_만기, to: data2.지난달7_만기, },
                //     { label: { text: "U" + data2.지난달6_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달6_만기, to: data2.지난달6_만기, },
                //     { label: { text: "U" + data2.지난달5_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달5_만기, to: data2.지난달5_만기, },
                //     { label: { text: "U" + data2.지난달4_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달4_만기, to: data2.지난달4_만기, },
                //     { label: { text: "U" + data2.지난달3_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달3_만기, to: data2.지난달3_만기, },
                //     { label: { text: "U" + data2.지난달2_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달2_만기, to: data2.지난달2_만기, },
                //     { label: { text: "U" + data2.지난달1_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달1_만기, to: data2.지난달1_만기, },
                //     { label: { text: "U" + data2.지난달0_만기월 + "E", style: fontstyle_만기, y: labelUE }, borderWidth: 2, color: 만기컬러, from: data2.지난달0_만기, to: data2.지난달0_만기, },
                // ],
                plotBands: plotBands1
            },
            series: [
                { data: kospi200, lineColor: "dodgerblue", color: "dodgerblue", upLineColor: "tomato", upColor: "tomato", yAxis: 1, type: "candlestick", animation: false, zIndex: 4 },
                { data: data1.data0, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data1, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data2, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data3, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data4, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data5, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data6, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data7, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data8, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data9, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data10, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data1.data11, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data1.data12, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data1.data13, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data1.data14, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data1.data15, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data1.data16, color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },

                { data: data3.data0, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data1, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data2, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data3, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data4, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data5, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data6, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data7, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data8, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data9, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data10, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data11, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                { data: data3.data12, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data3.data13, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data3.data14, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data3.data15, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data3.data16, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
                // { data: data3.data17, color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 3 },
            ],
        })

        // if (chartRef.current) {
        //     Highcharts.stockChart(chartRef.current, {

        //         series: 
        //     });
        // }
    }, [data1, data2, data3]);
    return (
        // <>
        //     {data1 || kospi200 ?
        //         <div ref={chartRef} />
        //         : <Skeleton variant="rounded" height={height} animation="wave" />
        //     }
        // </>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
    );
}