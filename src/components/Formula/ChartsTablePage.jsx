import React, { useState, useEffect, useRef } from 'react';
import { StyledToggleButton } from '../util/util';
import { Grid, Box, TableContainer, IconButton, ToggleButtonGroup, Typography, Stack, Modal } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault } from '../LeadSectors/tableColumns';
import { customTheme, A_columns, B1_columns, Short_columns, DMI_columns, under_envelope_columns, under_envelope_2_columns } from './Columns';
import { CountTable } from '../Motions/CountTable'
import { legend } from '../Motions/legend';
import { blue } from '@mui/material/colors';
import WilliamsLegend from '../Motions/williamsLegend.jsx';
import DmiLegend from '../Formula/DmiLegend.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import Charts from './Charts';

const ChartsTableDataPage = ({ dataset, dataset2, tableData, timeLine, height, swiperRef, datasetCount, getInfo, classification, formulaType, handleFormulaType }) => {
    const chartHeight = 500;
    const tableHeight = 390;
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

    // useEffect(() => {
    //     console.log(tableData);
    // }, [tableData])
    // useEffect(() => {
    //     let chart
    //     if (chartComponent.current && dataset.length > 0) {
    //         chart = chartComponent.current.chart;
    //         // chart.update({
    //         //     series: getData(dataset, selectedIndustry, selectedThemes),
    //         // })
    //         setChartOptions({
    //             series: getData(dataset, selectedIndustry, selectedThemes),
    //         })
    //     }

    //     // chart = chartComponent.current.chart;
    //     // if (chart && chart.series && chart.series[0]) {
    //     //     const newData = getData(dataset, selectedIndustry, selectedThemes, marketGap, reserve);
    //     //     chart.series[0].update(newData);
    //     // }

    // }, [dataset, selectedIndustry, selectedThemes])

    // useEffect(() => {
    //     let chart
    //     if (chartComponent.current && dataset.length > 0) {
    //         chart = chartComponent.current.chart;
    //         if (timeLine) {
    //             chart.update({
    //                 subtitle: {
    //                     text: timeLine
    //                 }
    //             });
    //         }
    //     }
    // }, [timeLine])

    // if (!dataset) return <div>Loading...</div>;

    // handler

    // const handleTableData = (dataset) => {
    //     const tmp = dataset.map((item, index) => ({
    //         ...item, id: index
    //     }));
    //     return tmp
    // }

    // const getData = (dataset, selectedIndustry, selectedThemes) => {
    //     // 업종이나 테마를 선택했을때 데이터 필터

    //     const baseData = dataset[0].data;
    //     // const baseData = dataset[0].data.filter(item => item.시가총액 >= marketGap && item.유보율 >= reserve);

    //     const filteredData = selectedIndustry.length > 0 || selectedThemes.length > 0
    //         ? baseData.filter(item => {
    //             // ? dataset[0].data.filter(item => {
    //             if (selectedIndustry.includes(item.업종명)) { return true; }

    //             // 테마 필터링 - item.테마명이 배열일 경우에만 처리
    //             if (Array.isArray(item.테마명) && item.테마명.length > 0) {
    //                 const itemThemes = item.테마명.map(theme => theme.trim());
    //                 return itemThemes.some(theme => selectedThemes.includes(theme));
    //             }

    //             return false;
    //         })
    //         : baseData

    //     const table = handleTableData(baseData)
    //     setTableData(table);
    //     const result = { data: filteredData }
    //     return result;
    // }

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

    const getColumnsForFormulaType = (type) => {
        const DMI_SERIES = ['DMI_단순_17_DMI_22', 'DMI_14_series', 'DMI_17_series', 'DMI_9_series', 'DMI_22_series'];
        const Short_Series = ['Short', 'Short_2']
        const Envelope_Series = ['under_envelope', 'under_envelope_upper_11_7']

        if (type === 'A') return A_columns;
        if (DMI_SERIES.includes(type)) return DMI_columns;
        if (type === 'B') return B1_columns;
        if (Short_Series.includes(type)) return Short_columns;
        // if (type === 'under_envelope') return under_envelope_columns;
        if (Envelope_Series.includes(type)) return under_envelope_columns;
        if (type === 'under_envelope_2') return under_envelope_2_columns;

        return DMI_columns; // 기본값
    };

    return (
        <div>
            {/* Top Scatter Chart & Industry, Themes Table */}
            <Grid container sx={{ mt: 2 }}>
                {
                    ['under_envelope', 'under_envelope_2', 'under_envelope_upper_11_7'].includes(formulaType) ?

                        <Grid item xs={10}>
                            <Charts
                                dataset={dataset}
                                timeLine={timeLine}
                                getInfo={getInfo}
                                height={chartHeight}
                                xAxisText={'DMI 17 가중,단순 avg'}
                                yAxisText={'Envelope 19'}
                                isSingle={true}
                                isUnderEnvelope={formulaType}
                            />
                        </Grid>

                        : formulaType === 'Short' ?
                            <>
                                <Grid item xs={5}>
                                    {/* Chart */}
                                    <Charts
                                        dataset={dataset}
                                        getInfo={getInfo}
                                        height={chartHeight}
                                        xAxisText={'W9,3 - W14,5 Sig Avg'}
                                        yAxisText={'W9 - W18 Avg'}
                                        isAxisPlotLinesName={'W9,3'}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    {/* Chart */}
                                    <Charts
                                        dataset={dataset2}
                                        timeLine={timeLine}
                                        getInfo={getInfo}
                                        height={chartHeight}
                                        xAxisText={'W6,3 - W14,5 Sig Avg'}
                                        yAxisText={'W26'}
                                        isAxisPlotLinesName={'W9,3'}
                                    />
                                </Grid>
                            </>

                            // : formulaType === 'Short_2' ?
                            //     <>
                            //         <Grid item xs={5}>
                            //             <Charts
                            //                 dataset={dataset}
                            //                 getInfo={getInfo}
                            //                 height={chartHeight}
                            //                 xAxisText={'W9,3 - W14,5 Sig Avg'}
                            //                 yAxisText={'W9 - W18 Avg'}
                            //                 isAxisPlotLinesName={'W9,3'}
                            //             />
                            //         </Grid>
                            //         <Grid item xs={5}>
                            //             <Charts
                            //                 dataset={dataset2}
                            //                 timeLine={timeLine}
                            //                 getInfo={getInfo}
                            //                 height={chartHeight}
                            //                 xAxisText={'주봉 D14'}
                            //                 yAxisText={'주봉 D22'}
                            //                 isAxisPlotLinesName={'주봉DMI'}
                            //             />
                            //         </Grid>
                            //     </>

                            :
                            <>
                                <Grid item xs={5}>
                                    {/* Chart */}
                                    <Charts
                                        dataset={dataset}
                                        getInfo={getInfo}
                                        height={chartHeight}
                                        xAxisText={'Williams R 26'}
                                        yAxisText={'DMI 9, 17 Avg'}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    {/* Chart */}
                                    <Charts
                                        dataset={dataset2}
                                        timeLine={timeLine}
                                        getInfo={getInfo}
                                        height={chartHeight}
                                        xAxisText={'DMI 8 가중 - DMI 8 단순'}
                                        yAxisText={'DMI 9 가중 - DMI 9 단순'}
                                        xAxisPlotLines={true}
                                    />
                                </Grid>
                            </>
                }


                <Grid item container xs={2}>

                    {
                        datasetCount ?
                            <>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <CountTable name='업종' data={datasetCount.업종} swiperRef={swiperRef} height={height / 7}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes}
                                    />

                                </Grid>
                                <Grid item xs={12} >
                                    <CountTable name='테마' data={datasetCount.테마} swiperRef={swiperRef} height={height / 7}
                                        handleClick={handleClick} handleReset={handleReset}
                                        selectedIndustry={selectedIndustry} selectedThemes={selectedThemes}
                                    />
                                </Grid>
                                <Grid item xs={12} container>
                                    <Grid item xs={4}>
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
                                                        전체
                                                    </td>
                                                    <td style={{ textAlign: 'right', width: 17 }}>
                                                        {
                                                            Object.values(classification).reduce((sum, value) => sum + value, 0)
                                                        }
                                                    </td>
                                                </tr>
                                            </>
                                            : <></>}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <DmiLegend />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <WilliamsLegend />
                                    </Grid>
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
                            <StyledToggleButton fontSize={11} value="B">DMI-Type</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="Short">Short</StyledToggleButton>
                            {/* <StyledToggleButton fontSize={11} value="Short_2">주봉D22/D14</StyledToggleButton> */}
                            <StyledToggleButton fontSize={11} value="DMI_단순_17_DMI_22">D17 단순</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="DMI_14_series">D14</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="DMI_17_series">D17</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="DMI_9_series">D9</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="DMI_22_series">D22</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="under_envelope">E-Bottom</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="under_envelope_2">E-Reverse</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="under_envelope_upper_11_7">E-Suckup</StyledToggleButton>
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
                            columns={getColumnsForFormulaType(formulaType)}

                            rowHeight={20}
                            // sortingMode="server"
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

export default ChartsTableDataPage;


const TypeMessage = (_type) => {
    const __type = _type['type']
    const textStyle = { fontSize: '12px' }
    const baseMessages = (
        <>
            <Typography sx={textStyle} >DMI에서 소문자 d는 가중, D는 단순</Typography>
            <Typography sx={textStyle} >--------------------------------</Typography>
            <Typography sx={textStyle} >- 5일평균거래량 3만주 제외</Typography>
            <Typography sx={textStyle} >- 시총 500억 ~ 30조</Typography>
            <Typography sx={textStyle} >- 1주당 20만원 이하</Typography>
            <Typography sx={textStyle} >- 전일대비거래량 1500% 이하</Typography>
            <Typography sx={textStyle} >- 스팩, 리츠, 우선주 제외</Typography>
        </>
    )
    const commonMessages = (
        <>
            <Typography sx={textStyle} >DMI에서 소문자 d는 가중, D는 단순</Typography>
            <Typography sx={textStyle} >--------------------------------</Typography>
            <Typography sx={textStyle} >- 5일평균거래량 2만주 제외</Typography>
            <Typography sx={textStyle} >- 시총 500억 ~ 30조</Typography>
            <Typography sx={textStyle} >- 당일 등락률 -3% 이상</Typography>
            <Typography sx={textStyle} >- 1주당 20만원 이하</Typography>
            <Typography sx={textStyle} >- 전일대비거래량 1000% 이하</Typography>
            <Typography sx={textStyle} >- 스팩, 리츠, 우선주 제외</Typography>
            <Typography sx={textStyle} >- CCI.112 : -135 ~ 150, DMI.4 : 40 이하</Typography>
            <Typography sx={textStyle} >- WillR.6 : -20 이하, WillR.14 : -30 이하</Typography>
        </>
    )



    switch (__type) {
        case 'B':
            return (<>
                {commonMessages}
                <Typography sx={textStyle} >- 고가 또는 종가가 5중가 6중기*3% 이내</Typography>
                <Typography sx={textStyle} >- DMI.4 (미래) : 10 이하</Typography>
                <Typography sx={textStyle} >- DMI.7 (미래) : 10 이하</Typography>
                <Typography sx={textStyle} >- DMI.9 (미래) : 15 이하</Typography>
                <Typography sx={textStyle} >- DMI.17 (미래) : 30 이하</Typography>
                <Typography sx={textStyle} >- WillR.14 가 WillR.14-7 Sig보다 낮아야 한다.</Typography>
            </>)

        case 'Short':
            return (<>
                {commonMessages}
                <Typography sx={textStyle} >- 전일대비거래량 1500% 이하 변경</Typography>
                <Typography sx={textStyle} >- 18고가삼각,18(고저종)삼각 ,18저가삼각,15저가삼각,13저가삼각 역배열 상태</Typography>
                <Typography sx={textStyle} >- 현재 주가는 112 저가지수 보다 낮아야함 </Typography>
                <Typography sx={textStyle} >- 18고가삼각선이 112 저가 지수 보다 낮아야함 </Typography>
                <Typography sx={textStyle} >- Env 10, 13, 16, 19 : 종가, 가중이평 </Typography>
                <Typography sx={textStyle} >- 역배열 : Env 10, 13, 16, 19 </Typography>
                <Typography sx={textStyle} >- 역배열 : 27, 18 종가지수 </Typography>
                <Typography sx={textStyle} >- 종가가 3종가지수보다 크다 </Typography>
                <Typography sx={textStyle} >- 고가가 5종가지수보다 크다 </Typography>
                <Typography sx={textStyle} >- 종가가 (36종가지수+45종가지수)/2 크다 </Typography>

                <Typography sx={textStyle} >- 6종삼 : 종가와 고가가 7종가삼각보다 높을경우 ㅁ, 고가는 7종가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 13저삼 : 종가와 고가가 13저가삼각보다 높을경우 ㅁ, 고가는 13저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 15저삼 : 종가와 고가가 15저가삼각보다 높을경우 ㅁ, 고가는 15저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 18저삼 : 종가와 고가가 18저가삼각보다 높을경우 ㅁ, 고가는 18저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 18종삼 : 종가와 고가가 18(고저종)삼각보다 높을경우 ㅁ, 고가는 18(고저종)삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 18고삼 : 종가와 고가가 18고가삼각보다 높을경우 ㅁ, 고가는 18고가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
            </>)

        case 'under_envelope':
            return (<>
                {baseMessages}
                <Typography sx={textStyle} >- Symbol : 삼각형-등락률이 0 이상일때, 역삼각형-등락률이 0이하일때</Typography>
                <Typography sx={textStyle} >- Color : Red-5분전 대비 상승했을 경우, 역삼각형-5분전 대비 하락했을 경우</Typography>
                <Typography sx={textStyle} >- Env 19 : 종가, 단순이평 </Typography>
                <Typography sx={textStyle} >- 종가가 Env 선 위에 있을 경우 위치한 엔벨로프 표기</Typography>
                <Typography sx={textStyle} >- 주봉 DMI 22 단순이 25보다 작다 </Typography>
                <Typography sx={textStyle} >- Env19, 27.7 이하 Bottom </Typography>
                <Typography sx={textStyle} >- Env19, 8.7 이상 제외 </Typography>
            </>)

        case 'under_envelope_2':
            return (<>
                {baseMessages}
                <Typography sx={textStyle} >- Symbol : 삼각형-등락률이 0 이상일때, 역삼각형-등락률이 0이하일때</Typography>
                <Typography sx={textStyle} >- Color : Red-5분전 대비 상승했을 경우, 역삼각형-5분전 대비 하락했을 경우</Typography>
                <Typography sx={textStyle} >- Env 19, 14, 9 : 종가, 단순이평 </Typography>
                <Typography sx={textStyle} >- 역배열 Env 19-8.7, Env 14-7, Env 9-5  </Typography>
                <Typography sx={textStyle} >- Env9, 7.0 보다 높아야 한다 </Typography>
                <Typography sx={textStyle} >- 종가가 18종가지수보다 작다 </Typography>
                <Typography sx={textStyle} >- 종가는 2일전 가격보다 높다 </Typography>
            </>)

        case 'under_envelope_upper_11_7':
            return (<>
                {baseMessages}
                <Typography sx={textStyle} >- Symbol : 삼각형-등락률이 0 이상일때, 역삼각형-등락률이 0이하일때</Typography>
                <Typography sx={textStyle} >- Color : Red-5분전 대비 상승했을 경우, 역삼각형-5분전 대비 하락했을 경우</Typography>
                <Typography sx={textStyle} >- Env 19 : 종가, 단순이평 </Typography>
                <Typography sx={textStyle} >- 주봉 DMI 22 단순이 25보다 작다 </Typography>
                <Typography sx={textStyle} >- 당일 Env19, 11.7 이하 였다가 그 위로 상승한 종목들</Typography>
                <Typography sx={textStyle} >- 많이 하락한 놈들일수록 파란색 더 짙게</Typography>
                <Typography sx={textStyle} >- 많이 상승한 놈들일수록 빨간색 더 짙게</Typography>
            </>)

        // case 'Short_2':
        //     return (<>
        //         {commonMessages}
        //         <Typography sx={textStyle} >- 전일대비거래량 1500% 이하 변경</Typography>
        //         <Typography sx={textStyle} >- 18고가삼각,18(고저종)삼각 ,18저가삼각,15저가삼각,13저가삼각 역배열 상태</Typography>
        //         <Typography sx={textStyle} >- DMI4 : 55이하 </Typography>
        //         <Typography sx={textStyle} >- Williams 6 : -20 이하, W14: -30이하 </Typography>
        //         <Typography sx={textStyle} >- 현재 주가는 5(저가, 가중) 보다 높아야함 </Typography>
        //         <Typography sx={textStyle} >- 현재 주가는 112 저가지수 보다 낮아야함 </Typography>
        //         <Typography sx={textStyle} >- 현재 주가는 20 고가 삼각보다 낮아야함 </Typography>
        //         <Typography sx={textStyle} >- 18고가삼각선이 112 저가 지수 보다 낮아야함 </Typography>
        //         <Typography sx={textStyle} >- 주봉 DMI 22 단순이 13보다 작다 </Typography>
        //         <Typography sx={textStyle} >- 주봉 DMI 14 단순이 10보다 작다 </Typography>
        //         <Typography sx={textStyle} >- 6종삼 : 종가와 고가가 7종가삼각보다 높을경우 ㅁ, 고가는 7종가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //         <Typography sx={textStyle} >- 13저삼 : 종가와 고가가 13저가삼각보다 높을경우 ㅁ, 고가는 13저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //         <Typography sx={textStyle} >- 15저삼 : 종가와 고가가 15저가삼각보다 높을경우 ㅁ, 고가는 15저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //         <Typography sx={textStyle} >- 18저삼 : 종가와 고가가 18저가삼각보다 높을경우 ㅁ, 고가는 18저가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //         <Typography sx={textStyle} >- 18종삼 : 종가와 고가가 18(고저종)삼각보다 높을경우 ㅁ, 고가는 18(고저종)삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //         <Typography sx={textStyle} >- 18고삼 : 종가와 고가가 18고가삼각보다 높을경우 ㅁ, 고가는 18고가삼각보다 높지만 종가는 낮을경우 ㅗ</Typography>
        //     </>)

        case 'Favorite':
            return (<>
                <Typography sx={textStyle} >관심종목</Typography>
            </>)


        default:
            return (<>
                {commonMessages}
                <Typography sx={textStyle} >- 고가 또는 종가가 5중가 6중기*3% 이내</Typography>
                <Typography sx={textStyle} >1. WillR.9 : -40이하 and WillR.14 : -60이하 and WillR.33 : -60이하 </Typography>
                <Typography sx={textStyle} >1. DMI.7 (미래) : 15 이하 and DMI.17 (미래) : 30 이하</Typography>
                <Typography sx={textStyle} >2. 14시삼 또는 16시삼 돌파</Typography>
            </>)
    }
}