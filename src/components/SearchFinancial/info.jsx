import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, Typography, ToggleButtonGroup } from '@mui/material';
import { StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import StockChart_MA from '../util/stockChart_MA';

export default function SearchFinancialInfo({ swiperRef, stock, stockChart, timeframe, handleTimeframe }) {
    const [page, setPage] = useState('재무');

    // Handler
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    return (
        <>

            <Grid item container sx={{ minHeight: 200 }}>
                {Array.isArray(stock.기업개요) ?
                    <StockInfo data={stock} />
                    : <></>
                }

            </Grid>
            <Grid item container sx={{ mt: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="재무">재무</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="사업내용">사업내용</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="테마">테마</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="주요">주요제품/주요주주</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item container sx={{ minHeight: 210 }}>
                <ContentsComponent page={page} annual={stock.연간실적} quarter={stock.분기실적} summary={stock.기업개요} themes={stock.테마명} product={stock.주요제품매출구성} shareholder={stock.주요주주} />
            </Grid>

            <Grid item container sx={{ mt: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={timeframe}
                    onChange={handleTimeframe}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="day">일봉</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="week">주봉</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>

            <Grid item container sx={{ mt: 1 }}>
                {Array.isArray(stockChart.price) ?
                    <StockChart_MA height={400} stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} boxTransform={`translate(10px, -170px)`} treasury={stockChart.treasury} />
                    : <></>
                }
            </Grid>

        </>
    )
}

const StockInfo = ({ data }) => {
    return (
        <Grid container>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={5} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">시가총액</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">상장주식수</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.상장주식수 ? data.상장주식수.toLocaleString('kr') : ''}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">K_PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PER}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">EPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.EPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">N_PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.N_PER}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">BPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.BPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">K_PBR</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PBR}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">N_PBR</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.N_PBR}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={2} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">동일업종 PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.동일업종PER}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">보호예수</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px" sx={{ color: '#FCAB2F' }}>{data.보호예수}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">이벤트</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.이벤트}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
        </Grid>
    )
}

const ContentsComponent = ({ page, annual, quarter, summary, themes, product, shareholder }) => {

    switch (page) {
        case '사업내용':
            if (Array.isArray(summary)) {
                return <Grid container sx={{ mt: 3 }}>
                    <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                        {summary.map(item => (
                            <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                        ))}
                    </Stack>
                </Grid>
            }

        case '테마':
            if (Array.isArray(themes)) {
                return <Grid container sx={{ mt: 3 }}>
                    <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                        {themes.map(item => (
                            <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                        ))}
                    </Stack>
                </Grid>
            }

        case '주요':
            if (Array.isArray(themes)) {
                return <Grid container sx={{ mt: 3 }}>
                    <EtcInfo product={product} shareholder={shareholder} />
                </Grid>
            }

        default:
            if (Array.isArray(annual)) {
                return <Financial annual={annual} quarter={quarter} />
            }
    }


}
