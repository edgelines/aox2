import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, ToggleButtonGroup, IconButton, Table, TableBody, TableContainer } from '@mui/material';
// import { StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import StockChart_MA from '../util/stockChart_MA';


// import { API, API_WS } from './util/config.jsx';
// import { StyledToggleButton } from './util/util.jsx';
// import { formatDateString } from './util/formatDate.jsx'


export default function StockInfoPage({ stock, stockChart, handleFavorite, handleInvest, swiperRef }) {
    const baseStyle = { fontSize: '10px', p: 0.1, textAlign: 'right' }

    return (
        <Grid container>
            {/* Top Stock Name */}
            <Grid item container sx={{ minHeight: 36, maxHeight: 36 }}>
                {stock.종목명 ?
                    <StockInfo data={stock} handleFavorite={handleFavorite} handleInvest={handleInvest} />
                    : <></>
                }
            </Grid>

            {/* Stock Chart */}
            <Grid item container sx={{ mt: 1 }}>
                <StockChart_MA height={670} boxTransform={`translate(10px, 53px)`}
                    stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} stockName={stock.종목명} price={stock.현재가} net={stockChart.net}
                    willR={stockChart.willR} treasuryPrice={stockChart.treasuryPrice} treasury={stockChart.treasury} MA={stockChart.MA} volumeRatio={stockChart.volumeRatio}
                    DMI={stockChart.DMI}
                />
            </Grid>

            {/* Bottom Infomation */}
            <Grid item container sx={{ mt: 1 }}>


                <Grid item container>
                    {/* 주요제품 매출 구성, 사업내용, 테마 */}
                    <Grid item xs={4.5}>

                        {
                            Array.isArray(stock.주요제품매출구성) ?
                                <TableContainer sx={{ height: 220 }}
                                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                >

                                    <Table sx={{ mt: 1, borderBottom: '1px solid #fff' }}>
                                        <TableBody>
                                            {stock.주요제품매출구성.map(item => (
                                                <tr key={item.제품명}>
                                                    <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{item.제품명}</td>
                                                    <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{parseInt(item.구성비)} %</td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <Grid container sx={{ mt: 1, borderBottom: '1px solid #fff' }}>
                                        <Stack direction='column' spacing={1} >
                                            {Array.isArray(stock.기업개요) ? stock.기업개요.map(item => (
                                                <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                            )) : <></>}
                                        </Stack>
                                    </Grid>


                                    <Grid container sx={{ mt: 1 }}>
                                        <Stack direction='row' spacing={1} useFlexGap flexWrap="wrap" >
                                            {Array.isArray(stock.테마명) ? stock.테마명.map(item => (
                                                <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                            )) : <></>}
                                        </Stack>
                                    </Grid>


                                </TableContainer>

                                :
                                <></>
                        }

                    </Grid>

                    {/* 간지 */}
                    <Grid item xs={0.3}></Grid>

                    {/* 재무 / 사업내용 / 테마  */}
                    <Grid item xs={7}>

                        <Grid item container sx={{ minHeight: 210 }}>
                            {Array.isArray(stock.연간실적) ?
                                <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                                : <></>
                            }


                            {/* <ContentsComponent page={page} annual={stock.연간실적} quarter={stock.분기실적} summary={stock.기업개요} themes={stock.테마명} product={stock.주요제품매출구성} shareholder={stock.주요주주} /> */}
                        </Grid>


                    </Grid>


                </Grid>


            </Grid>


        </Grid>
    )

}


export const StockInfo = ({ data, handleFavorite, handleInvest }) => {

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
                <Grid item xs={1}>
                    <IconButton size="small" color='error' onClick={() => handleInvest()}>
                        {data.Invest ?
                            <PaidIcon /> : <AttachMoneyIcon />
                        }
                    </IconButton>
                </Grid>

                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2}><StyledTypography_StockInfo textAlign='center' >{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo></Grid>
                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>




        </Grid>
    )
}
