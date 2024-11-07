import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Stack, ToggleButtonGroup, TableBody, Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { numberWithCommas, StyledToggleButton } from './util'
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)
require('highcharts/modules/boost')(Highcharts)
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});


const StockChart = ({ stockName, height, price, boxTransform, info, series, selectedChartType, handleSelectedChartType, selectedSubChartType, handleSelectedSubChartType, baseStockName, getInfo }) => {
    const [value, setValue] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        chart: { animation: false, height: height ? height : 360, },
        credits: { enabled: false }, title: { text: null },
        legend: {
            enabled: true,
            align: 'left', verticalAlign: 'top',
            symbolWidth: 0, itemDistance: 3,
            itemStyle: { fontSize: '10.5px' },
            labelFormatter: function () {
                var series = this.chart.series,
                    color = '',
                    exclude = ['candlestick', 'volume']; // 제외할 항목들
                if (exclude.indexOf(this.name) === -1) {
                    for (var i = 0; i < series.length; i++) {
                        if (series[i].name === this.name) {
                            color = series[i].color;
                            break;
                        }
                    }
                    return '<span style="color: ' + color + '">' + this.name + '</span>';
                } else {
                    return null; // 제외할 항목은 null 반환
                }
            }
        },
        navigation: { buttonOptions: { enabled: false }, },
        xAxis: {
            labels: {
                style: { fontSize: '9px' }, y: 15,
            },
            tickLength: 6,
            crosshair: { width: 2, }
        },
        time: { timezone: 'Asia/Seoul', timezoneOffset: -540, }, // KST offset from UTC in minutes
        navigator: {
            height: 15, margin: 12, series: { color: Highcharts.getOptions().colors[0], lineColor: "dodgerblue", lineWidth: 0 },
            xAxis: {
                events: {
                    afterSetExtremes: function (e) {
                        if (e.trigger === 'navigator') return;
                        const chart = this.chart;
                        const dataMax = chart.xAxis[0].dataMax;
                        const range = e.max - e.min;
                        chart.xAxis[0].setExtremes(dataMax - (range / 1.8), dataMax);
                    }
                }
            }
        },
        tooltip: {
            crosshairs: true,
            hideDelay: 2,
            distance: 55,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            style: { fontSize: '10px', },
            formatter: function () {
                return [Highcharts.dateFormat('%y.%m.%d %H %M', this.x)].concat(
                    this.points ?
                        this.points.map(function (point) {
                            if (point.series.options.isCandle) {
                                return `종가 : ${numberWithCommas(point.point.close)}`;
                            } else if (point.series.options.isPercent) {
                                return `${point.series.name} : ${parseInt(point.y)} %`;
                            } else if (point.series.options.isIndicator) {
                                return `${point.series.name} : ${parseInt(point.y)}`;
                            } else {
                                return ''
                            }

                        }) : []
                );
            },
        },
        plotOptions: {
            series: {
                showInLegend: true,
                boostThreshold: 50, // Boost 모듈 사용을 위한 boostThreshold 옵션 활성화
                // turboThreshold: 1,
            }
        },
        boost: {
            enabled: true, // Boost 모듈 사용 활성화
            useGPUTranslations: true,
            usePreallocated: true,
            seriesThreshold: 10
        },
        rangeSelector: { enabled: false }
    })

    const yAxis_A = [{
        enabled: true,
        height: '60%',
        labels: {
            x: 30,
            style: { fontSize: '11px' }, formatter: function () {
                return (this.value).toLocaleString('ko-KR');
            },
        },
    }, {
        top: '60%',
        height: '20%',
        offset: 0,
        labels: {
            align: 'right',
            x: -3,
            style: { fontSize: '0px' },
        },
        title: { text: 'Volume' },
        gridLineWidth: 0,
    }, {
        // Williams R
        title: { enabled: false },
        gridLineWidth: 0.2,
        top: '60%',
        opposite: false,
        height: '20%',
        labels: {
            style: { fontSize: '0px' }
        },
        plotLines: [{
            color: 'black',
            width: 0.5,
            value: -100,
            label: {
                align: 'left', y: 0, x: -5,
                text: '-100',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: -90,
            label: {
                align: 'left', y: 0, x: -5,
                text: '-90',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 1,
            value: -80,
            dashStyle: 'shortdash',
            label: {
                align: 'left', y: 0, x: -5,
                text: '-80',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: -50,
            dashStyle: 'shortdash',
            label: {
                align: 'left', y: 0, x: -5,
                text: '-50',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'red',
            width: 1,
            value: -20,
            label: {
                align: 'left', align: 'left', y: 0, x: -5,
                text: '-20',
                style: { fontSize: '10px' }
            },
        }],
        crosshair: { width: 2, }
    }, {
        // DMI
        title: { text: 'DMI' },
        gridLineWidth: 0.2,
        offset: 0,
        top: '80%',
        height: '20%',
        labels: {
            align: 'right',
            x: 5,
            style: { fontSize: '0px' }
        },
        plotLines: [{
            color: 'red',
            width: 1,
            value: 80,
            label: {
                align: 'left', y: 0, x: -5,
                text: '80',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: 50,
            label: {
                align: 'left', y: 0, x: -5,
                text: '50',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'red',
            width: 0.5,
            value: 20,
            dashStyle: 'shortdash',
            label: {
                align: 'left', y: 0, x: -5,
                text: '20',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 0.5,
            value: 10,
            dashStyle: 'shortdash',
            label: {
                align: 'left', y: 0, x: -5,
                text: '10',
                style: { fontSize: '10px' }
            },
        }, {
            color: 'black',
            width: 0.5,
            value: 5,
            label: {
                align: 'left', y: 0, x: -5,
                text: '5',
                style: { fontSize: '10px' }
            },
        }],
        crosshair: { width: 2, },
    }, {
        top: '80%',
        height: '20%',
        offset: 0,
        opposite: false,
        labels: {
            align: 'right',
            x: -3,
            style: { fontSize: '0px' },
        },
        gridLineWidth: 0,
        plotLines: [{
            color: 'red',
            width: 1,
            value: -90,
            dashStyle: 'shortdash',
            label: {
                align: 'left',
                text: 'w-90',
                x: -10, y: 0,
                style: { fontSize: '10px' }
            },
        }, {
            color: 'blue',
            width: 1,
            value: -80,
            dashStyle: 'shortdash',
            label: {
                align: 'left',
                text: 'w-80',
                x: -10, y: 0,
                style: { fontSize: '10px' }
            },
        }]
    }]

    const yAis_B = [
        {
            enabled: true,
            height: '100%',
            labels: {
                x: 30,
                style: { fontSize: '11px' }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
        }
    ]
    const yAis_Short = [
        {
            enabled: true,
            height: '80%',
            labels: {
                x: 30,
                style: { fontSize: '11px' }, formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            },
        }, {
            top: '80%',
            height: '20%',
            offset: 0,
            labels: {
                align: 'right',
                x: -3,
                style: { fontSize: '0px' },
            },
            title: { text: 'DMI' },
            gridLineWidth: 0,
        }
    ]

    useEffect(() => {
        setChartOptions({
            series: series,
            yAxis: selectedChartType == 'A' ? yAxis_A : selectedChartType == 'Short' ? yAis_Short : yAis_B,
            // tooltip: {
            //     formatter: selectedChartType === 'A' ? tooltip('%y.%m.%d') : selectedChartType === 'B' ? tooltip('%y.%m.%d') : tooltip('%y.%m.%d %H:%M')
            // }
        })
    }, [series]);


    const typographyStyle = { color: 'black', fontWeight: 600, textAlign: 'left', fontSize: '14px' }

    return (
        <Grid container direction='row' sx={{ alignItems: 'center', justifyContent: "space-between" }}>
            <Grid item>
                <Stack direction='row' alignItems="center" justifyContent="center">
                    <ToggleButtonGroup
                        // orientation="vertical"
                        color='info'
                        exclusive
                        size="small"
                        value={selectedChartType}
                        onChange={handleSelectedChartType}
                    >
                        {/* <StyledToggleButton fontSize={10} value="5" >5분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="10">10분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="30">30분봉</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="60">60분봉</StyledToggleButton> */}
                        <StyledToggleButton fontSize={10} value="A">A-Type</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="B">B-Type</StyledToggleButton>
                        <StyledToggleButton fontSize={10} value="Envelope">Envelope</StyledToggleButton>
                        {/* <StyledToggleButton fontSize={10} value="Short">Short</StyledToggleButton> */}
                    </ToggleButtonGroup>
                </Stack>
            </Grid>

            <Grid item >
                <StyledAutocomplete
                    disableClearable
                    getOptionLabel={(option) => option.종목명} // 옵션을 어떻게 표시할지 결정합니다. 객체의 속성에 따라 조정해야 합니다.
                    options={baseStockName}
                    // sx={{ width: 300 }}
                    value={value}
                    onChange={async (event, newValue) => {
                        setValue(newValue);
                        getInfo(newValue);
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="종목명 검색"
                            variant="filled"
                            sx={{ fontSize: '10px' }}
                        />}
                />

            </Grid>

            {/* 보조지표 */}
            <Grid item >
                <StyledToggleButton
                    value='check'
                    selected={selectedSubChartType}
                    onChange={handleSelectedSubChartType}
                    fontSize={10}
                >
                    보조차트
                </StyledToggleButton>
            </Grid>
            {/* Charts */}
            <Grid item xs={11.9}>
                <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: boxTransform ? boxTransform : `translate(10px, 300px)`, zIndex: 100 }}>
                    {(Array.isArray(series)) && series.length > 0 ?
                        <>
                            <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }} useFlexGap flexWrap="wrap">
                                <Typography sx={typographyStyle}>{stockName}</Typography>
                                <Typography sx={typographyStyle}>
                                    {(parseInt(price)).toLocaleString('KR-KO')} 원
                                </Typography>
                                <Typography sx={{ ...typographyStyle, color: info.net > 0 ? 'red' : 'blue' }}>
                                    {info.net ? info.net : '-'} %
                                </Typography>
                                <Typography sx={{ ...typographyStyle, color: info.volumeRatio > 100 ? 'red' : 'blue' }}>
                                    / {info.volumeRatio ? info.volumeRatio.toLocaleString('KR-KO') : '-'} %
                                </Typography>
                            </Stack>
                            <Grid item container sx={{ pl: 2 }}>
                                <TableBody>
                                    <tr>
                                        <td style={{ ...typographyStyle, width: 40 }}>W.33</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{info.willR.w33}</td>
                                        <td style={{ width: 30 }}></td>
                                        <td style={{ ...typographyStyle, width: 40 }}>D.22</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{info.DMI.dmi_22}</td>
                                        <td style={{ width: 30 }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...typographyStyle, color: 'forestgreen', width: 40 }}>W.14</td>
                                        <td style={{ ...typographyStyle, color: 'forestgreen', width: 30, textAlign: 'right' }}>{info.willR.w14}</td>
                                        <td style={{ width: 30 }}></td>
                                        <td style={{ ...typographyStyle, width: 40 }}>D.17</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{info.DMI.dmi_17}</td>
                                        <td style={{ width: 30 }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...typographyStyle, color: 'tomato', width: 40 }}>W.9</td>
                                        <td style={{ ...typographyStyle, color: 'tomato', width: 30, textAlign: 'right' }}>{info.willR.w9}</td>
                                        <td style={{ width: 30 }}></td>
                                        <td style={{ ...typographyStyle, width: 40 }}>D.7</td>
                                        <td style={{ ...typographyStyle, width: 30, textAlign: 'right' }}>{info.DMI.dmi_7}</td>
                                    </tr>


                                </TableBody>
                            </Grid>
                        </>
                        : <></>
                    }
                </Box>

                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={'stockChart'}
                />
            </Grid>
        </Grid>
    );
};

export default StockChart;

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-inputRoot': {
        color: '#efe9e9ed',
        fontSize: '12px',
        '&.Mui-focused .MuiAutocomplete-input': {
            color: '#efe9e9ed',
        },
    },
    '& .MuiAutocomplete-option': {
        color: '#efe9e9ed',
    },
    '& .MuiAutocomplete-option.Mui-focused': {
        backgroundColor: '#d8d8d8',
    },
    '& .MuiAutocomplete-option.Mui-selected': {
        backgroundColor: '#404040',
        color: '#efe9e9ed',
    },
    '& .MuiInputLabel-root': {
        color: '#efe9e9ed',
        fontSize: '11px',
    },
}));
