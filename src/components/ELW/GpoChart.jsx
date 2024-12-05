import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { useIsMobile } from '../util/config.jsx';
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/boost')(Highcharts)

export default function GpoChart({ data1, data2, data3, height, kospi200, credit, creditsPositionX, creditsPositionY, yMinValue }) {
    const chartComponent = useRef(null);
    const isMobile = useIsMobile();
    // plotBands 계산을 위한 상수들
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

    // plotBands 계산을 별도의 함수로 분리
    const calculatePlotBands = useCallback((data1, data2) => {
        let plotBands1 = [];
        // Kospi200
        for (let i = 11; i > -1; i--) {
            const days = ['53', '47', '43', '41', '39', '21', '10', '6', '만기']
            days.forEach((item) => {
                const 만기월_key = `지난달${i}_만기월`;
                const value_key = `지난달${i}_${item}`;  // 47을 예로 들었지만, 다른 값들에 대해서도 확장할 수 있습니다

                let yValue;
                switch (item) {
                    case '53': yValue = label41; break;
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
        for (let i = 13; i > -1; i--) {
            const days = ['54', '47', '42', '40', '21', '10', '5', '만기']
            days.forEach((item) => {
                const 만기월_key = `지난달${i}_만기월`;
                const value_key = `지난달${i}_${item}`;  // 47을 예로 들었지만, 다른 값들에 대해서도 확장할 수 있습니다

                let yValue;
                switch (item) {
                    case '54': yValue = labelU42; break;
                    case '47': yValue = labelU48; break;
                    case '42': yValue = labelU42; break;
                    // case '41': yValue = labelU48; break;
                    case '40': yValue = labelU39; break;
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
        return plotBands1;
    }, []); // 의존성 없음

    // plotBands 상태 관리
    const [plotBands, setPlotBands] = useState([]);
    useEffect(() => {
        if (data1 && data2) {
            const newPlotBands = calculatePlotBands(data1, data2);
            setPlotBands(newPlotBands);
        }
    }, [data1, data2, calculatePlotBands]);

    // 초기 차트 옵션
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            selected: 1,
            inputDateFormat: "%Y-%m-%d",
            inputStyle: { color: "#efe9e9ed" },
            labelStyle: { color: "#efe9e9ed" },
            buttons: isMobile ? [
                { type: "month", count: 1, text: "1M", title: "View 1 months" },
            ] : [
                { type: "month", count: 5, text: "5M", title: "View 5 months" },
                { type: "month", count: 7, text: "7M", title: "View 7 months" },
                { type: "month", count: 8, text: "8M", title: "View 8 months" },
            ],
        },
        chart: {
            animation: false,
            backgroundColor: "rgba(255, 255, 255, 0)",
            height: height,
        },
        credits: credit ? {
            enabled: true,
            text: credit,
            style: { fontSize: '0.8em' },
            position: {
                verticalAlign: "top",
                x: creditsPositionX ? creditsPositionX : -12,
                y: creditsPositionY ? creditsPositionY : 40,
                align: 'right'
            }
        } : { enabled: false },
        title: { text: null },
        xAxis: {
            labels: {
                style: { color: "#efe9e9ed", fontSize: "11px" },
                format: "{value:%y-%m-%d}",
                y: 40
            },
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
                return "<b>" + Highcharts.dateFormat("%m-%d, %A", this.x) + "</b>";
            },
            backgroundColor: "#404040",
            style: { color: "#e8e3e3" },
        },
        legend: { enabled: false },
        boost: { useGPUTranslations: true, enabled: true },
        navigator: {
            height: 15,
            margin: 10,
            series: {
                color: Highcharts.getOptions().colors[0],
                lineColor: "dodgerblue",
                lineWidth: 0
            },
        },
        navigation: { buttonOptions: { enabled: false } },
        series: [
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], lineColor: "dodgerblue", color: "dodgerblue", upLineColor: "tomato", upColor: "tomato", yAxis: 1, type: "candlestick", animation: false, zIndex: 4 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "#FCAB2F", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },

            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
            { data: [], color: "forestgreen", yAxis: 0, type: "spline", animation: false, zIndex: 4, lineWidth: 1 },
        ]
    });

    useEffect(() => {
        // 차트가 마운트된 후 한 번만 실행
        if (chartComponent.current?.chart) {
            const chart = chartComponent.current.chart;

            // 약간의 지연을 주어 차트가 완전히 로드된 후 실행
            setTimeout(() => {
                // 7개월 버튼 클릭 효과
                chart.rangeSelector.clickButton(isMobile ? 0 : 1, true);
            }, 1000);
        }
    }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

    // 데이터 필터링 함수 추가
    const filterDataForMobile = useCallback((data) => {
        if (!isMobile || !Array.isArray(data)) return data;

        const now = new Date().getTime();
        const oneMonth = 50 * 24 * 60 * 60 * 1000; // 1달
        const sixMonths = 5 * oneMonth; // 6달

        return data.filter(point => {
            const pointTime = point[0];
            return pointTime <= (now + oneMonth) && pointTime >= (now - sixMonths);
        });
    }, [isMobile]);

    // 차트 데이터 업데이트
    useEffect(() => {
        if (!chartComponent.current?.chart) return;

        const chart = chartComponent.current.chart;

        try {
            // 시리즈 데이터 업데이트
            chart.series.forEach((series, index) => {
                let newData = null;
                if (index === 0) newData = filterDataForMobile(data1?.data0);
                else if (index === 1) newData = filterDataForMobile(kospi200);
                else if (index >= 2 && index <= 14) newData = filterDataForMobile(data1?.[`data${index - 2}`]);
                else if (index >= 15 && index <= 27) newData = filterDataForMobile(data3?.[`data${index - 15}`]);
                // if (index === 0) newData = data1?.data0;
                // else if (index === 1) newData = kospi200;
                // else if (index >= 2 && index <= 14) newData = data1?.[`data${index - 2}`];
                // else if (index >= 15 && index <= 27) newData = data3?.[`data${index - 15}`];

                if (newData) {
                    series.setData(newData, false);
                }
            });

            // plotBands 업데이트
            if (plotBands) {
                chart.xAxis[0].update({
                    plotBands: plotBands
                }, false);
            }

            // yMin 업데이트
            if (yMinValue !== undefined) {
                chart.yAxis[1].update({
                    min: yMinValue
                }, false);
            }

            // 모든 변경사항 한번에 반영
            chart.redraw();

        } catch (error) {
            console.error('Chart update error:', error);
        }
    }, [data1, data2, data3, kospi200, plotBands, yMinValue]);

    return (
        <HighchartsReact
            ref={chartComponent}
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
    );
}
