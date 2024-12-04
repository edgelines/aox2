import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/boost')(Highcharts)

export default function IndecesChart({ data, height }) {
    const chartComponent = useRef(null);
    // 초기 차트 옵션
    const [chartOptions, setChartOptions] = useState({
        rangeSelector: {
            selected: 2,
            inputDateFormat: "%Y-%m-%d",
            inputStyle: { color: "#efe9e9ed" },
            labelStyle: { color: "#efe9e9ed" },
            buttons: [
                { type: "month", count: 3, text: "3M", title: "View 3 months" }, { type: "month", count: 5, text: "5M", title: "View 5 months" }, { type: "month", count: 11, text: "11M", title: "View 11 months" },
                { type: "year", count: 1, text: "1Y", title: "View 1 Year" }, { type: "year", count: 2, text: "2Y", title: "View 2 Year" }, { type: "year", count: 3, text: "3Y", title: "View 3 Year" },
                { type: "all", text: "All", title: "View All" },],
        },
        chart: {
            animation: false,
            backgroundColor: "rgba(255, 255, 255, 0)",
            height: height,
        },
        credits: { enabled: false },
        title: { text: null },
        xAxis: {
            labels: {
                style: { color: "#efe9e9ed", fontSize: "11px" },
                format: "{value:%y-%m-%d}",
                y: 40
            },
            tickInterval: 7,
        },
        yAxis: {
            title: { enabled: false },
            labels: {
                align: "left",
                x: 6,
                style: { color: "#efe9e9ed", fontSize: "12px" },
                formatter: function () {
                    return this.value.toLocaleString("ko-KR") + '%';
                },
            },
            gridLineWidth: 0.2,
            plotLines: [{
                color: 'red',
                width: 1,
                value: 80,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: '#efe9e9ed',
                width: 1,
                value: 50,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: 'skyblue',
                width: 1,
                value: 15,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }, {
                color: 'dodgerblue',
                width: 1,
                value: 10,
                dashStyle: 'shortdash',//라인 스타일 지정 옵션
                // zIndex: 5,
            }],
            crosshair: { width: 2, }
        },

        tooltip: {
            crosshairs: true,
            hideDelay: 2,
            formatter: function () {
                // 요일 한글 변환
                const weekDays = {
                    'Sunday': '일요일',
                    'Monday': '월요일',
                    'Tuesday': '화요일',
                    'Wednesday': '수요일',
                    'Thursday': '목요일',
                    'Friday': '금요일',
                    'Saturday': '토요일'
                };
                const dateStr = Highcharts.dateFormat('%m-%d, %A', this.x);
                const [date, engDay] = dateStr.split(', ');
                const korDay = weekDays[engDay];

                let tooltip = `<b>${date}, ${korDay}</b><br/>`;

                // 각 시리즈의 데이터를 순회하며 툴팁 내용 구성
                this.points.forEach(function (point) {
                    tooltip += '<span style="color:' + point.series.color + '">● </span>'
                        + '<b>' + point.series.name + '</b>: '
                        + point.y.toFixed(2) + '%<br/>';
                });

                return tooltip;
                // return "<b>" + Highcharts.dateFormat("%m-%d, %A", this.x) + "</b>";
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
        legend: {
            enabled: true, align: 'left', verticalAlign: 'top', borderWidth: 0, symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17,
            itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }
        },
        series: []
    });

    useEffect(() => {
        setChartOptions(prevOptions => ({
            ...prevOptions,
            rangeSelector: { selected: 2 },
        }));
    }, []);

    // 차트 데이터 업데이트
    useEffect(() => {
        if (!chartComponent.current?.chart) return;

        const chart = chartComponent.current.chart;

        try {
            // 모든 시리즈 업데이트 (캔들스틱 + 이동평균선들)
            data.forEach(seriesData => {
                if (chart.get(seriesData.id)) {
                    // 기존 시리즈가 있으면 업데이트
                    chart.get(seriesData.id).update(seriesData, false);
                } else {
                    // 없으면 새로 추가
                    chart.addSeries(seriesData, false);
                }
            });

            // 변경사항 반영
            chart.redraw();


        } catch (error) {
            console.error('Chart update error:', error);
        }
    }, [data]);

    return (
        <HighchartsReact
            ref={chartComponent}
            highcharts={Highcharts}
            options={chartOptions}
            constructorType={'stockChart'}
        />
    );
}