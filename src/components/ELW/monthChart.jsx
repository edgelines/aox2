import React, { useEffect, useRef, useState } from 'react';
// import { Skeleton } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)
export default function ELW_MonthChart({ data, height, categories, min, credit }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: "xy" },
        title: null,
        credits: credit ? { enabled: true, text: credit, style: { fontSize: '0.8em' }, position: { verticalAlign: "top", x: -10, y: 36 } } : { enabled: false },
        exporting: { enabled: false },
        plotOptions: { series: { animation: false } },
        tooltip: { shared: true, crosshairs: true, hideDelay: 1, distance: 55, backgroundColor: "rgba(64, 64, 64, 0.25)", style: { color: "#e8e3e3" }, },
        xAxis: [{ labels: { style: { color: "#efe9e9ed", fontSize: "11px" } }, plotBands: { color: "rgba(111,111,111,0.3)", from: 4.5, to: 5.5, } },],
        yAxis: [{ title: { enabled: false }, labels: { style: { color: "#efe9e9ed", fontSize: "12px" } }, gridLineWidth: 0.2, tickInterval: 5 },],
        legend: { align: "left", borderWidth: 0, margin: 0.8, verticalAlign: "top", symbolRadius: 0, symbolWidth: 10, symbolHeight: 10, itemDistance: 17, itemStyle: { color: "#efe9e9ed", fontSize: "12px" }, itemHiddenStyle: { color: "#000000" }, itemHoverStyle: { color: "gold" }, x: 30, y: 5, },
    })
    // const chartRef = useRef(null)
    // const credits = 
    useEffect(() => {
        setChartOptions({
            series: data,
            xAxis: [{
                categories: categories,
            }],
            yAxis: [{
                min: min - 15,
            }]
        })
    }, []);
    useEffect(() => {
        setChartOptions({
            series: data,
            xAxis: [{
                categories: categories,
            }],
            yAxis: [{
                min: min - 15,
            }]
        })
        // series: data,
        // if (chartRef.current) {
        //     Highcharts.chart(chartRef.current, {

        //     });
        // }
    }, [data, categories, min]);
    return (
        // <>
        //     {data ?
        //         <div ref={chartRef} />
        //         : <Skeleton variant="rounded" height={height} animation="wave" />
        //     }
        // </>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        // constructorType={'stockChart'}
        />
    )
}


Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
    return ["M", x, y, "L", x + w, y + h, "M", x + w, y, "L", x, y + h, "z"];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}