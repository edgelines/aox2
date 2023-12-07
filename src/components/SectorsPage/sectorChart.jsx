import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock'
require('highcharts/modules/accessibility')(Highcharts)
// 업종그래프
// 데이터 업데이트시 오류 반환
// Cannot assign to read only property '8' of object '[object Array]'
// TypeError: Cannot assign to read only property '8' of object '[object Array]'
//     at g (http://localhost:3000/static/js/bundle.js:121161:21)
//     at w.update (http://localhost:3000/static/js/bundle.js:121174:20)
//     at http://localhost:3000/static/js/bundle.js:123930:50
//     at Array.forEach (<anonymous>)
//     at G.updateData (http://localhost:3000/static/js/bundle.js:123929:137)
//     at G.setData (http://localhost:3000/static/js/bundle.js:123972:140)
//     at G.update (http://localhost:3000/static/js/bundle.js:124720:87)
//     at http://localhost:3000/static/js/bundle.js:123391:37
//     at Array.forEach (<anonymous>)
//     at http://localhost:3000/static/js/bundle.js:123386:24
// 'highcharts-react-official' 사용안함

const SectorChart = ({ data, sectorName }) => {
    const chartRef = useRef(null);
    sectorName = sectorName || null;
    useEffect(() => {
        if (chartRef.current) {

            const defaultData = { 업종명: null, data: null }
            while (data.length < 5) {
                data.push(defaultData)
            }

            Highcharts.chart(chartRef.current, {
                chart: { animation: false, type: 'spline', height: 165, backgroundColor: '#404040' },
                credits: { enabled: false },
                title: { text: null },
                xAxis: {
                    categories: ['B7', 'B6', 'B5', 'B4', 'B3', 'B2', 'B1', 'TOM', 'NOW'],
                    labels: { y: 20, style: { color: '#efe9e9ed', fontSize: '9px' }, },
                    plotBands: [{ color: 'rgba(111,111,111,0.4)', from: -1, to: 6 }], type: 'category', lineColor: '#efe9e9ed', gridLineWidth: 0, tickWidth: 0, tickColor: '#cfcfcf', tickPosition: 'inside'
                },
                yAxis: { title: { text: '', }, gridLineWidth: 0, reversed: true, gridLineColor: '#404040', lineColor: '#404040', max: 80, min: 0, labels: { enabled: false }, plotLines: [{ color: '#efe9e9ed', width: 1, value: 0, dashStyle: 'Solid', }, { color: '#efe9e9ed', width: 1, value: 14, dashStyle: 'shortdash', label: { text: '14', align: 'right', x: 10, y: 0, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: '#efe9e9ed', width: 1, value: 20, dashStyle: 'shortdash', label: { text: '20', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: 'orange', width: 1, value: 29, dashStyle: 'shortdash', label: { text: '29', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: 'limegreen', width: 1, value: 40, dashStyle: 'shortdash', label: { text: '40', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: 'lightblue', width: 1, value: 50, dashStyle: 'shortdash', label: { text: '50', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: 'skyblue', width: 1, value: 60, dashStyle: 'shortdash', label: { text: '60', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } }, { color: 'dodgerblue', width: 1, value: 70, dashStyle: 'shortdash', label: { text: '70', align: 'right', x: 10, y: 2, style: { color: '#efe9e9ed', fontSize: '7.5px' } } },], },
                navigation: { buttonOptions: { enabled: false } },
                legend: {
                    align: 'right', borderWidth: 0, verticalAlign: 'top', symbolRadius: 0, symbolWidth: 6, symbolHeight: 10, itemDistance: 6, itemStyle: { color: '#efe9e9ed', fontSize: '10px', }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 5, y: -9,
                    // labelFormatter: function () { // 범례별 글자색
                    //     return '<span style="color:' + this.color + '">' + this.name + '</span>';
                    // },
                    // useHTML: true
                },
                tooltip: { shared: true, crosshairs: true, hideDelay: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)' },
                plotOptions: { series: { cursor: 'pointer', marker: { lineWidth: 0, symbol: 'circle' }, animation: false, }, },
                series: data.map((item, index) => {
                    const colors = ['magenta', 'gold', 'greenyellow', 'aqua', 'honeydew'];
                    // const isHighlighted = sectorName ? item.업종명 === sectorName : false;
                    const isHighlighted = item.업종명 === sectorName; // sectorName과 일치하는지 확인
                    // console.log(item.업종명, sectorName);
                    return {
                        name: item.업종명 || `Series${index + 1}`,
                        data: item.data,
                        color: colors[index],
                        lineWidth: sectorName ? (isHighlighted ? 3 : 0.4) : 1, // sectorName이 제공되지 않았을 때 모든 선의 굵기를 2로 설정
                        // lineWidth: isHighlighted ? 3.5 : 0.4, // 일치하면 굵기를 3으로, 아니면 1로 설정
                        showInLegend: item.data !== null,
                    };
                })
            });
        }
    }, [data]);

    return (
        <div ref={chartRef} />
    );
};

export default SectorChart;