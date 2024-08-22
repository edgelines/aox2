import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, Typography, ToggleButtonGroup, IconButton, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StockChart_MA from '../util/stockChart_MA';

export default function SearchFinancialInfo({ swiperRef, stock, stockChart, handleFavorite, timeframe, handleTimeframe }) {
    const [page, setPage] = useState('재무');

    // Handler
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    return (
        <>

            <Grid item container sx={{ minHeight: 170 }}>
                {stock.종목명 ?
                    <StockInfo data={stock} handleFavorite={handleFavorite} />
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
                <StockChart_MA height={470} boxTransform={`translate(10px, 53px)`}
                    stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} stockName={stock.종목명} price={stock.현재가} net={stockChart.net}
                    willR={stockChart.willR} treasuryPrice={stockChart.treasuryPrice} treasury={stockChart.treasury} MA={stockChart.MA} volumeRatio={stockChart.volumeRatio}
                    DMI={stockChart.DMI}
                />
            </Grid>

        </>
    )
}

export const StockInfo = ({ data, handleFavorite }) => {
    const tableCellStyle = { textAlign: 'left', fontSize: '12px', height: 22 }
    return (
        <Grid container>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }} direction='row' alignItems="center" justifyContent="center">
                <Grid item xs={1}>
                    <IconButton size="small" color='error' onClick={() => handleFavorite()}>
                        {data.Favorite ?
                            <FavoriteIcon /> : <FavoriteBorderIcon />
                        }
                    </IconButton>
                </Grid>

                <Grid item xs={4.2}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={4.2}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>

            <Grid item container sx={{ pl: 2 }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}>시가총액</td>
                            <td style={tableCellStyle}>{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</td>
                            <td style={tableCellStyle}>상장주식수</td>
                            <td style={tableCellStyle} colSpan={3}>{data.상장주식수 ? data.상장주식수.toLocaleString('kr') : ''}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>K_PER</td>
                            <td style={tableCellStyle}>{data.PER}</td>
                            <td style={tableCellStyle}>K_PBR</td>
                            <td style={tableCellStyle}>{data.PBR}</td>
                            <td style={tableCellStyle}>EPS</td>
                            <td style={tableCellStyle}>{data.EPS.toLocaleString('kr')} 원</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>N_PER</td>
                            <td style={tableCellStyle}>{data.N_PER}</td>
                            <td style={tableCellStyle}>N_PBR</td>
                            <td style={tableCellStyle}>{data.N_PBR}</td>
                            <td style={tableCellStyle}>BPS</td>
                            <td style={tableCellStyle}>{data.BPS.toLocaleString('kr')} 원</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>동일업종 PER</td>
                            <td style={tableCellStyle}>{data.동일업종PER}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>보호예수</td>
                            <td style={{ ...tableCellStyle, color: '#FCAB2F' }} colSpan={5}>{data.보호예수}</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>이벤트</td>
                            <td style={tableCellStyle} colSpan={5}>{data.이벤트}</td>
                        </tr>
                    </tbody>
                </table>

            </Grid>
        </Grid>
    )
}

export const StockInfoSimple = ({ data, handleFavorite }) => {
    const tableCellStyle = { textAlign: 'left', fontSize: '12px', height: 22 }
    return (
        <Grid container>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }} direction='row' alignItems="center" justifyContent="center">
                <Grid item xs={1}>
                    <IconButton size="small" color='error' onClick={() => handleFavorite()}>
                        {data.Favorite ?
                            <FavoriteIcon /> : <FavoriteBorderIcon />
                        }
                    </IconButton>
                </Grid>

                <Grid item xs={4.2}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={4.2}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>

            <Grid item container sx={{ pl: 2 }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}>시가총액</td>
                            <td style={tableCellStyle}>{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</td>
                            <td style={tableCellStyle}>상장주식수</td>
                            <td style={tableCellStyle} colSpan={3}>{data.상장주식수 ? data.상장주식수.toLocaleString('kr') : ''}</td>
                        </tr>
                    </tbody>
                </table>

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
            if (Array.isArray(product)) {
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
