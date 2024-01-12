import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Grid, Box, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, ThemeProvider, Slider } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StyledToggleButton, StyledButton } from './util/util';
import { renderProgress, StyledTypography, TitleComponent, DataTable, DatePickerTheme, disablePastDatesAndWeekends, FilteredDataTable, renderProgressBar, StockInfo, Financial, EtcInfo } from './util/htsUtil';
import { EstimatedTrading } from './HTS/estimatedTrading'
import { Industry } from './HTS/industry'

export default function HtsPage({ swiperRef, SectorsChartData }) {
    const today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;
    // 상단 선택 Page
    const [page, setPage] = useState('추정매매동향');

    const [market, setMarket] = useState('kosdaq');
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(dateString);
    const [apiReset, setApiReset] = useState(false)
    // 대카테고리
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    // 거래소 선택 ( 코스피/코스닥 )
    const handleMarket = (event, value) => { if (value !== null) { setMarket(value); } }
    const handleTime = (event, value) => { if (value !== null) { setTime(value); } }
    // const handleTime = (event, value) => { if (value !== 'null') { setTime(value); } else { setTime(null); } }
    const handleDate = async (event) => {
        const getDate = `${event.$y}-${event.$M + 1}-${event.$D}`
        setDate(getDate)
    }

    const handleApiReset = () => {
        setApiReset(prevStatus => !prevStatus); setTime(null);
    }


    return (
        <Grid container>
            {/* 상단 */}
            <Grid item container sx={{ pt: 1, pb: 1 }}>
                <Grid item container xs={1} direction="row" alignItems="center">
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={market}
                        onChange={handleMarket}
                        sx={{ pl: 1.3 }}
                    >
                        <StyledToggleButton fontSize={'10px'} value="kospi">Kospi</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="kosdaq">Kosdaq</StyledToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={1.5}>
                    <ThemeProvider theme={DatePickerTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date picker" defaultValue={dayjs(today)} views={['year', 'month', 'day']}
                                    onChange={handleDate} shouldDisableDate={disablePastDatesAndWeekends} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </ThemeProvider>
                </Grid>
                <Grid item container xs={2} direction="row" alignItems="center">
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={time}
                        onChange={handleTime}
                        sx={{ pl: 1.3 }}
                    >
                        <StyledToggleButton fontSize={'10px'} value="9:30">9:30</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="10:00">10:00</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="11:20">11:20</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="13:20">13:20</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="14:30">14:30</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="null">확정</StyledToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                <Grid item container xs={4} direction="row" alignItems="center">
                    <ToggleButtonGroup
                        color='info'
                        exclusive
                        size="small"
                        value={page}
                        onChange={handlePage}
                        sx={{ pl: 1.3 }}
                    >
                        <StyledToggleButton fontSize={'10px'} value="추정매매동향">추정 매매동향</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="업종">업종 65위 이하</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="매출">확정 매출</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="영업이익">확정 영업이익</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="당기순이익">확정 당기순이익</StyledToggleButton>
                        <StyledToggleButton fontSize={'10px'} value="연간실적">연간(잠정)실적</StyledToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                <Grid item container xs={2}>
                    <StyledButton fontSize={'12px'} onClick={() => handleApiReset()}>Reset</StyledButton>
                </Grid>
            </Grid>

            <ContentsComponent swiperRef={swiperRef} page={page} dateString={dateString} market={market} time={time} date={date} SectorsChartData={SectorsChartData} apiReset={apiReset} />



        </Grid>
    )
}



const ContentsComponent = ({ swiperRef, page, market, time, date, SectorsChartData, apiReset }) => {

    switch (page) {
        case '업종':
            return <Industry swiperRef={swiperRef} market={market} time={time} date={date} SectorsChartData={SectorsChartData} apiReset={apiReset} />

        // case '매출':
        //     return <PPI prepareChartData={prepareChartData} swiperRef={swiperRef} />;

        // case '영업이익':
        //     return <PPI prepareChartData={prepareChartData} swiperRef={swiperRef} />;

        // case '당기순이익':
        //     return <PPI prepareChartData={prepareChartData} swiperRef={swiperRef} />;

        // case '연간실적':
        //     return <PPI prepareChartData={prepareChartData} swiperRef={swiperRef} />;

        default:
            return <EstimatedTrading swiperRef={swiperRef} market={market} time={time} date={date} apiReset={apiReset} />
    }


}





// https://api.finance.naver.com/siseJson.naver?symbol=007860&requestType=1&startTime=20220601&endTime=20231228&timeframe=day
// https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:005930|SERVICE_RECENT_ITEM:005930&_callback=window.__jindo2_callback._3495