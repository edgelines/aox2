import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { StyledToggleButton } from '../util/util';
import { Grid, Box, TableContainer, IconButton, ToggleButtonGroup, Typography, Stack, Modal } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault } from '../LeadSectors/tableColumns';
import { customTheme, A_columns, B1_columns, Envelope_columns, Short_columns, WhiteBox_columns } from './Columns';
import { CountTable } from '../Motions/CountTable'
import { legend } from '../Motions/legend';
import { blue } from '@mui/material/colors';
import SettingsIcon from '@mui/icons-material/Settings';
// import CloseIcon from '@mui/icons-material/Close';
// import { API } from '../util/config.jsx';

const MotionsChart = ({ dataset, timeLine, height, swiperRef, datasetCount, getInfo, classification, formulaType, handleFormulaType }) => {
    const tableHeight = 410;
    const chartComponent = useRef(null);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'scatter', height: height ? height - 400 : 400, backgroundColor: 'rgba(255, 255, 255, 0)', zoomType: 'xy'
        },
        credits: { enabled: false }, title: { text: null },
        subtitle: { align: 'right', style: { color: '#efe9e9ed', fontSize: '12.5px', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, floating: true, x: 0, y: 30 },
        navigation: { buttonOptions: { enabled: false } },
        xAxis: {
            title: { text: '전일대비거래량', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#404040', fontSize: '11px' }, formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')}</span>`
                }
            },
            gridLineWidth: 0.2,
            tickLength: 0,
            tickAmount: 21,
            plotLines: [
                { value: 40, width: 1, color: 'gold', dashStyle: 'dash', zIndex: 2 }, {
                    value: 90, width: 1, color: 'orange', dashStyle: 'dash', zIndex: 2
                }, {
                    value: 150, width: 1, color: 'tomato', dashStyle: 'dash', zIndex: 2
                }],
            max: 1000,
            min: 0
            // min: 50
        },
        yAxis: {
            title: { text: '등락률 %', style: { color: '#efe9e9ed' } },
            labels: {
                style: { color: '#efe9e9ed', fontSize: '11px' },
                formatter: function () {
                    var color = this.value > 0 ? '#FCAB2F' : this.value < 0 ? '#00F3FF' : '#efe9e9ed';
                    return `<span style="color: ${color}">${this.value.toLocaleString('kr')} %</span>`
                }
            },
            // plotLines: [{ value: 0, width: 1, color: '#fff' },],
            gridLineWidth: 0.2,
            tickAmount: 12,
            max: 30,
            min: -3
        },
        tooltip: {
            split: true, shared: true, crosshairs: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            formatter: function () {
                return `
                    ${this.point.종목명}<br/>
                    등락률 : ${this.point.y} %<br/>
                    전일대비거래량 : ${this.point.전일대비거래량.toLocaleString('kr')} %<br/>
                    `;
            },
        },
        plotOptions: {
            scatter: {
                showInLegend: false,
                animation: false,
                marker: {
                    radius: 3,
                    symbol: 'circle'
                },
                jitter: { x: 0.3 },
            },
            series: {
                animation: {
                    duration: 2000
                },
                point: {
                    events: {
                        click: function () {
                            getInfo(this.options);
                        }
                    }
                }
            }
        },
    })

    const [tableData, setTableData] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [open, setOpen] = useState(false);
    const handleSettingIconClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            // chart.update({
            //     series: getData(dataset, selectedIndustry, selectedThemes),
            // })
            setChartOptions({
                series: getData(dataset, selectedIndustry, selectedThemes),
            })
        }

        // chart = chartComponent.current.chart;
        // if (chart && chart.series && chart.series[0]) {
        //     const newData = getData(dataset, selectedIndustry, selectedThemes, marketGap, reserve);
        //     chart.series[0].update(newData);
        // }

    }, [dataset, selectedIndustry, selectedThemes])

    useEffect(() => {
        let chart
        if (chartComponent.current && dataset.length > 0) {
            chart = chartComponent.current.chart;
            if (timeLine) {
                chart.update({
                    subtitle: {
                        text: timeLine
                    }
                });
            }
        }
    }, [timeLine])

    if (!dataset) return <div>Loading...</div>;

    // handler

    const handleTableData = (dataset) => {
        const tmp = dataset.map((item, index) => ({
            ...item, id: index
        }));
        return tmp
    }

    const getData = (dataset, selectedIndustry, selectedThemes) => {
        // 업종이나 테마를 선택했을때 데이터 필터

        const baseData = dataset[0].data;
        // const baseData = dataset[0].data.filter(item => item.시가총액 >= marketGap && item.유보율 >= reserve);

        const filteredData = selectedIndustry.length > 0 || selectedThemes.length > 0
            ? baseData.filter(item => {
                // ? dataset[0].data.filter(item => {
                if (selectedIndustry.includes(item.업종명)) { return true; }

                // 테마 필터링 - item.테마명이 배열일 경우에만 처리
                if (Array.isArray(item.테마명) && item.테마명.length > 0) {
                    const itemThemes = item.테마명.map(theme => theme.trim());
                    return itemThemes.some(theme => selectedThemes.includes(theme));
                }

                return false;
            })
            : baseData

        const table = handleTableData(baseData)
        setTableData(table);
        const result = { data: filteredData }
        return result;
    }

    const handleClick = (name, category) => {
        if (name === '업종') {
            setSelectedIndustry(prevSelected => {
                if (prevSelected.includes(category)) {
                    return prevSelected.filter(item => item !== category);
                } else {
                    return [...prevSelected, category];
                }
            })
        } else {
            setSelectedThemes(prevSelected => {
                if (prevSelected.includes(category)) {
                    return prevSelected.filter(item => item !== category);
                } else {
                    return [...prevSelected, category];
                }
            })
        }
    };
    const handleReset = (name) => {
        if (name === '업종') {
            setSelectedIndustry([])
        } else {
            setSelectedThemes([])
        }
    }

    return (
        <div>
            {/* Classification */}
            <Box sx={{ position: 'absolute', transform: 'translate(830px, 50px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                {classification ?
                    <>
                        {Object.keys(classification).map(item => (
                            <tr style={{ fontSize: '11.5px' }} key={item}>
                                <td style={{ color: legend[item] }}>
                                    {item}
                                </td>
                                <td style={{ textAlign: 'right', width: 17 }}>{classification[item]}</td>
                            </tr>
                        ))}
                        {/* Classification Sum */}
                        <tr style={{ fontSize: '11.5px' }} >
                            <td style={{ color: '#efe9e9ed' }}>
                                -
                            </td>
                            <td style={{ textAlign: 'right', width: 17 }}>
                                {
                                    Object.values(classification).reduce((sum, value) => sum + value, 0)
                                }
                            </td>
                        </tr>
                    </>

                    : <></>}
            </Box>

            {/* Top Scatter Chart & Industry, Themes Table */}
            <Grid container>
                <Grid item xs={10}>
                    {/* Chart */}
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                        ref={chartComponent}
                    />
                </Grid>

                <Grid item container xs={2}>

                    {
                        datasetCount ?
                            <>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <CountTable name='업종' data={datasetCount.업종} swiperRef={swiperRef} height={height / 4.1}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes} />

                                </Grid>
                                <Grid item xs={12} >
                                    <CountTable name='테마' data={datasetCount.테마} swiperRef={swiperRef} height={height / 4.1}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes} />
                                </Grid>
                            </>
                            : <>Loading</>
                    }


                </Grid>

            </Grid>

            {/* Bottom Table */}
            <Grid container direction='row' sx={{ alignItems: 'center', justifyContent: "space-between" }}>

                {/* Formula Type */}
                <Grid item>
                    <Stack direction='row' alignItems="center" justifyContent="center">
                        <ToggleButtonGroup
                            // orientation="vertical"
                            color='info'
                            exclusive
                            size="small"
                            value={formulaType}
                            onChange={handleFormulaType}
                        >
                            <StyledToggleButton fontSize={11} value="A">A-Type</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="B">B-Type</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="Envelope">Envelope</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="Short">Short</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_17">WB 17</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_10">WB 10</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_3">WB 3</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WAS_WhiteBox">WAS WB</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="Favorite">Favorite</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Stack>


                </Grid>

                {/* Formula Def */}
                <Grid item>
                    <IconButton onClick={handleSettingIconClick} sx={{ color: '#efe9e9ed' }}>
                        <SettingsIcon />
                    </IconButton>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            textAlign: 'left',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                            bgcolor: 'background.paper',
                            // border: '2px solid #000',
                            // boxShadow: 24,
                            p: 1,
                        }}>
                            <TypeMessage type={formulaType} />
                        </Box>

                    </Modal>
                </Grid>

                <TableContainer sx={{ height: tableHeight }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={formulaType === 'A' ? A_columns : formulaType === 'B' ? B1_columns : formulaType === 'Short' ? Short_columns : ['WhiteBox_17', 'WhiteBox_10', 'WhiteBox_3'].includes(formulaType) ? WhiteBox_columns : Envelope_columns}
                            rowHeight={20}
                            onCellClick={(params, event) => {
                                getInfo(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                '[data-field="테마명"]': { fontSize: '9px' },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>


            </Grid>

        </div>
    );
};

export default MotionsChart;


const TypeMessage = (_type) => {
    const __type = _type['type']


    const whiteBox = (num) => (
        <>
            <Typography sx={{ fontSize: '12px' }} >- 당일 등락률 10% 이하</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 1주당 20만원 이하</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 5일평균거래량 2만주 제외</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 전일대비거래량 1000% 이하</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 시총 500억 ~ 30조</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 스팩, 리츠, 우선주 제외</Typography>
            <Typography sx={{ fontSize: '12px' }} >- A-Type, B-Type, Envelope, Short 종목들 중에서 Report Page WhiteBox의 {num}% 이상 상승한 조건</Typography>
            <Typography sx={{ fontSize: '12px' }} >- WillR6 or WillR9 or (WillR14 and WillR14-7 Sig) or (WillR33 and WillR33-7 Sig) WhiteBox 구간 </Typography>
            <Typography sx={{ fontSize: '12px' }} >- DMI3, DMI4, DMI7, DMI9, DMI17 WhiteBox 구간 </Typography>
            <Typography sx={{ fontSize: '12px' }} >- CCI4 (파란선상단 ~ 파란선하단) and CCI4-2 Sig (파란선상단 ~ -120) 구간 </Typography>
            <Typography sx={{ fontSize: '12px' }} >- CCI11 (40 ~ 파란선하단) and CCI11-4 Sig (30 ~ 파란선하단) 구간 </Typography>
            <Typography sx={{ fontSize: '12px' }} >- CCI11이 CCI-11-4 보다 큰 것</Typography>
            <Typography sx={{ fontSize: '12px' }} >- 업종순위 14위 미만</Typography>
        </>
    )

    switch (__type) {
        case 'B':
            return (<>
                <Typography sx={{ fontSize: '12px' }} >고가 또는 종가가 5중가 6중기*3% 이내</Typography>
                <Typography sx={{ fontSize: '12px' }} >당일 등락률 -3% 이상</Typography>
                <Typography sx={{ fontSize: '12px' }} >1주당 20만원 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >5일평균거래량 2만주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량 1000% 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >시총 500억 ~ 30조</Typography>
                <Typography sx={{ fontSize: '12px' }} >스팩, 리츠, 우선주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >D4 10 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >D7 10 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >D9 15 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >D17 30 이하</Typography>
            </>)

        case 'Envelope':
            return (<>
                <Typography sx={{ fontSize: '12px' }} >1주당 20만원 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량 1000% 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >시총 500억 ~ 30조</Typography>
                <Typography sx={{ fontSize: '12px' }} >5일평균거래량 2만주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >스팩, 리츠, 우선주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >종가나 고가가 5저가가중, 5중간값가중, 6저가가중, 6중간값가중 돌파</Typography>
                <Typography sx={{ fontSize: '12px' }} >종가나 고가가 각 Envelope 돌파</Typography>
            </>)

        case 'Short':
            return (<>
                <Typography sx={{ fontSize: '12px' }} >당일 등락률 10% 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >1주당 20만원 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >5일평균거래량 2만주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량 1000% 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >시총 500억 ~ 30조</Typography>
                <Typography sx={{ fontSize: '12px' }} >스팩, 리츠, 우선주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >14, 9, 7 종가지수 역배열 상태</Typography>
                <Typography sx={{ fontSize: '12px' }} >1-2 : 1일선(종가지수)이 2일선(종가지수)보다 높다</Typography>
                <Typography sx={{ fontSize: '12px' }} >1-3 : 1일선(종가지수)이 3일선(종가지수)보다 높다</Typography>
                <Typography sx={{ fontSize: '12px' }} >2-3 : 2일선(종가지수)이 3일선(종가지수)보다 높다</Typography>
                <Typography sx={{ fontSize: '12px' }} >2=3 : 2일선(종가지수)이 3일선(종가지수)보다 낮다</Typography>
                <Typography sx={{ fontSize: '12px' }} >4종지 : 종가와 고가가 4종가지수보다 높을경우 ㅁ, 고가는 4종가지수보다 높지만 종가는 낮을경우 ㅗ </Typography>
                <Typography sx={{ fontSize: '12px' }} >5종지 : 종가와 고가가 5종가지수보다 높을경우 ㅁ, 고가는 5종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={{ fontSize: '12px' }} >6종지 : 종가와 고가가 6종가지수보다 높을경우 ㅁ, 고가는 6종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={{ fontSize: '12px' }} >7종지 : 종가와 고가가 7종가지수보다 높을경우 ㅁ, 고가는 7종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={{ fontSize: '12px' }} >9종지 : 종가와 고가가 9종가지수보다 높을경우 ㅁ, 고가는 7종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={{ fontSize: '12px' }} >1-7 : 종가나 고가가 7시가삼각을 돌파</Typography>
                <Typography sx={{ fontSize: '12px' }} >1-112 : 종가가 112저가지수보다 낮을경우</Typography>
            </>)

        case 'WhiteBox_17':
            return (<>
                {whiteBox(17)}

            </>)
        case 'WhiteBox_10':
            return (<>
                {whiteBox(10)}
            </>)
        case 'WhiteBox_3':
            return (<>
                {whiteBox(3)}
            </>)

        default:
            return (<>
                <Typography sx={{ fontSize: '12px' }} >고가 또는 종가가 5중가 6중기*3% 이내</Typography>
                <Typography sx={{ fontSize: '12px' }} >당일 등락률 -3% 이상</Typography>
                <Typography sx={{ fontSize: '12px' }} >1주당 20만원 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >5일평균거래량 2만주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >전일대비거래량 1000% 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >시총 500억 ~ 30조</Typography>
                <Typography sx={{ fontSize: '12px' }} >스팩, 리츠, 우선주 제외</Typography>
                <Typography sx={{ fontSize: '12px' }} >1. 14시삼 또는 16시삼 돌파</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W9 -40이하 and Dmi7 15 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W9 -40이하 and Dmi17 30 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W14 -60이하 and Dmi7 15 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W14 -60이하 and Dmi17 30 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W33 -60이하 and Dmi7 15 이하</Typography>
                <Typography sx={{ fontSize: '12px' }} >2. W33 -60이하 and Dmi17 30 이하</Typography>
            </>)
    }
}