import React, { useState, useEffect, useRef } from 'react';
import { StyledToggleButton } from '../util/util';
import { Grid, Box, TableContainer, IconButton, ToggleButtonGroup, Typography, Stack, Modal } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { DataTableStyleDefault } from '../LeadSectors/tableColumns';
import { customTheme, A_columns, B1_columns, Envelope_columns, Short_columns, WhiteBox_columns, TRIX_columns, Rainbow_columns } from './Columns';
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
    // const chartComponent = useRef(null);
    // const [tableData, setTableData] = useState([]);
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

    const handleTableData = (dataset) => {
        const tmp = dataset.map((item, index) => ({
            ...item, id: index
        }));
        return tmp
    }

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

    return (
        <div>
            {/* Box */}
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(980px, 288px)`, zIndex: 10 }}>
                <DmiLegend />
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.13)', position: 'absolute', transform: `translate(1035px, 288px)`, zIndex: 10 }}>
                <WilliamsLegend />
            </Box>
            {/* Classification */}
            {/* <Box sx={{ position: 'absolute', transform: 'translate(830px, 50px)', zIndex: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
                
            </Box> */}

            {/* Top Scatter Chart & Industry, Themes Table */}
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={5}>
                    {/* Chart */}
                    <Charts
                        dataset={dataset}
                        // timeLine={timeLine}
                        getInfo={getInfo}
                        height={chartHeight}
                        xAxisText={'Williams R 14'}
                        yAxisText={'DMI 7'}
                    />
                </Grid>
                <Grid item xs={5}>
                    {/* Chart */}
                    <Charts
                        dataset={dataset2}
                        timeLine={timeLine}
                        getInfo={getInfo}
                        height={chartHeight}
                        xAxisText={'CCI 112 대신'}
                        yAxisText={'Williams R 6 (종가)'}
                        xAxisPlotLines={true}
                    />
                </Grid>

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
                                <Grid item xs={12} >
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
                            <StyledToggleButton fontSize={11} value="Envelope">Envelope</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="Short">Short</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_17">WB 17</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_10">WB 10</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WhiteBox_3">WB 3</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="WAS_WhiteBox">WAS WB</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="TRIX_1">TRIX</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="RAINBOW_1">Rainbow A</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="RAINBOW_2">Rainbow B</StyledToggleButton>
                            {/* <StyledToggleButton fontSize={11} value="TRIX_1">TRIX -100 이하</StyledToggleButton> */}
                            {/* <StyledToggleButton fontSize={11} value="TRIX_2">TRIX ~ 0</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="TRIX_3">TRIX ~ 100</StyledToggleButton>
                            <StyledToggleButton fontSize={11} value="TRIX_4">TRIX 100 이상</StyledToggleButton> */}
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
                            columns={
                                formulaType === 'A' ? A_columns :
                                    formulaType === 'B' ? B1_columns :
                                        formulaType === 'Short' ? Short_columns :
                                            ['WhiteBox_17', 'WhiteBox_10', 'WhiteBox_3'].includes(formulaType) ? WhiteBox_columns :
                                                ['TRIX_1', 'TRIX_2', 'TRIX_3', 'TRIX_4'].includes(formulaType) ? TRIX_columns :
                                                    ['RAINBOW_1', 'RAINBOW_2'].includes(formulaType) ? Rainbow_columns :
                                                        Envelope_columns}
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

export default ChartsTableDataPage;


const TypeMessage = (_type) => {
    const __type = _type['type']
    const textStyle = { fontSize: '12px' }
    const commonMessages = (
        <>
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

    const whiteBox = (num) => (
        <>
            <Typography sx={{ ...textStyle, mb: 2 }} >A-Type, B-Type, Envelope, Short 종목들 중에서 Report Page 전체기간 통계로 WhiteBox의 {num}% 이상 상승한 조건</Typography>
            {commonMessages}
            <Typography sx={textStyle} >- WillR.6 or WillR.9 or (Will.R14 and WillR.14-7 Sig) or (WillR.33 and WillR.33-7 Sig) WhiteBox 구간 </Typography>
            <Typography sx={textStyle} >- DMI.3, DMI.4, DMI.7, DMI.9, DMI.17 (미래) WhiteBox 구간 </Typography>
            <Typography sx={textStyle} >- CCI.4 (파란선상단 ~ 파란선하단) and CCI.4-2 Sig (파란선상단 ~ -120) 구간 </Typography>
            <Typography sx={textStyle} >- CCI.11 (40 ~ 파란선하단) and CCI.11-4 Sig (30 ~ 파란선하단) 구간 </Typography>
            <Typography sx={textStyle} >- CCI.11이 CCI-11-4 보다 큰 것</Typography>
            <Typography sx={textStyle} >- 업종순위 14위 미만</Typography>
        </>
    )

    const trix = (num) => {
        const trixCommon = (
            <>
                <Typography sx={textStyle} >- 5일평균거래량 2만주 제외</Typography>
                <Typography sx={textStyle} >- 시총 500억 ~ 30조</Typography>
                <Typography sx={textStyle} >- 당일 등락률 -3% 이상</Typography>
                <Typography sx={textStyle} >- 1주당 20만원 이하</Typography>
                <Typography sx={textStyle} >- 전일대비거래량 1000% 이하</Typography>
                <Typography sx={textStyle} >- 스팩, 리츠, 우선주 제외</Typography>
                <Typography sx={textStyle} >- CCI.112 : -135 ~ 150</Typography>
                <Typography sx={textStyle} >- WillR.6 : -20 이하, WillR.14 : -30 이하</Typography>
                <Typography sx={textStyle} >- 고가 또는 종가가 5중가 6중기*3% 이내</Typography>


                <Typography sx={textStyle} >- WillR.14-7 Sig 가 -50보다 작다</Typography>
                <Typography sx={textStyle} >- DMI.7 (미래)은 전날값보다 작다</Typography>
                <Typography sx={textStyle} >- DMI.7 (미래)은 15 이하</Typography>
                <Typography sx={textStyle} >- DMI 2와 3 (대신) 은 역배열</Typography>
                <Typography sx={textStyle} >- DMI 2 (대신)은 16 이하 </Typography>
                <Typography sx={textStyle} >- CCI.4는 CCI.4-2 Sig보다 크다</Typography>
                <Typography sx={textStyle} >- CCI.11은 CCI.11-4 Sig보다 크다</Typography>
                <Typography sx={textStyle} >- CCI.4는 CCI.11보다 크다</Typography>

                <Typography sx={textStyle} >- OR 조건</Typography>

                <Typography sx={textStyle} >- TRIX 15가 전일 대비 상승, 또는 TRIX 15가 TRIX 15-5 Sig보다 크다 </Typography>
                <Typography sx={textStyle} >- CCI.33은 전날보다 상승하고, CCI.33-7 Sig보다 크다 </Typography>
                <Typography sx={textStyle} >- CCI.112은 전날보다 상승하고, CCI.112-18 Sig보다 크다 </Typography>
            </>
        )

        switch (num) {
            case '1':
                return (
                    <>
                        {/* <Typography sx={{ ...textStyle, mb: 2 }} >CCI-112 : -100 미만</Typography> */}
                        {trixCommon}
                    </>)
            case '2':
                return (
                    <>
                        <Typography sx={{ ...textStyle, mb: 2 }} >CCI-112 : -100 ~ 0 미만</Typography>
                        {trixCommon}
                    </>)
            case '3':
                return (
                    <>
                        <Typography sx={{ ...textStyle, mb: 2 }} >CCI-112 : 0 ~ 100 미만</Typography>
                        {trixCommon}
                    </>
                )
            default:
                return (
                    <>
                        <Typography sx={{ ...textStyle, mb: 2 }} >CCI-112 : 100 이상</Typography>
                        {trixCommon}
                    </>
                )
        }
    }

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

        case 'Envelope':
            return (<>
                {commonMessages}
                <Typography sx={textStyle} >- 종가나 고가가 5저가가중, 5중간값가중, 6저가가중, 6중간값가중 돌파</Typography>
                <Typography sx={textStyle} >- 종가나 고가가 각 Envelope 돌파</Typography>
            </>)

        case 'Short':
            return (<>
                {commonMessages}
                <Typography sx={textStyle} >- 14, 9, 7 종가지수 역배열 상태</Typography>
                <Typography sx={textStyle} >- 1-2 : 1일선(종가지수)이 2일선(종가지수)보다 높다</Typography>
                <Typography sx={textStyle} >- 1-3 : 1일선(종가지수)이 3일선(종가지수)보다 높다</Typography>
                <Typography sx={textStyle} >- 2-3 : 2일선(종가지수)이 3일선(종가지수)보다 높다</Typography>
                <Typography sx={textStyle} >- 2=3 : 2일선(종가지수)이 3일선(종가지수)보다 낮다</Typography>
                <Typography sx={textStyle} >- 4종지 : 종가와 고가가 4종가지수보다 높을경우 ㅁ, 고가는 4종가지수보다 높지만 종가는 낮을경우 ㅗ </Typography>
                <Typography sx={textStyle} >- 5종지 : 종가와 고가가 5종가지수보다 높을경우 ㅁ, 고가는 5종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 6종지 : 종가와 고가가 6종가지수보다 높을경우 ㅁ, 고가는 6종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 7종지 : 종가와 고가가 7종가지수보다 높을경우 ㅁ, 고가는 7종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 9종지 : 종가와 고가가 9종가지수보다 높을경우 ㅁ, 고가는 7종가지수보다 높지만 종가는 낮을경우 ㅗ</Typography>
                <Typography sx={textStyle} >- 1-7 : 종가나 고가가 7시가삼각을 돌파</Typography>
                <Typography sx={textStyle} >- 1-112 : 종가가 112저가지수보다 낮을경우</Typography>
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

        case 'WAS_WhiteBox':
            return (<>
                <Typography sx={{ ...textStyle, mb: 2 }} >WB 17, WB 10, WB 3 에서 빠진 종목들</Typography>
                {commonMessages}
            </>)

        case 'Favorite':
            return (<>
                <Typography sx={textStyle} >관심종목</Typography>
            </>)

        case 'TRIX_1':
            return (<>
                {trix('1')}
            </>)
        case 'TRIX_2':
            return (<>
                {trix('2')}
            </>)
        case 'TRIX_3':
            return (<>
                {trix('3')}
            </>)
        case 'TRIX_4':
            return (<>
                {trix('4')}
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