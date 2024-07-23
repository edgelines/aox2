import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, Typography, ToggleButtonGroup, IconButton, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StockChart_MA from '../util/stockChart_MA';


// import { API, API_WS } from './util/config.jsx';
// import { StyledToggleButton } from './util/util.jsx';
// import { formatDateString } from './util/formatDate.jsx'


export default function StockInfoPage({ industryName, stock, stockChart, handleFavorite }) {
    const [page, setPage] = useState('재무');
    const baseStyle = { fontSize: '10px', p: 0.1, textAlign: 'right' }
    // Handler
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    return (
        <Grid container>
            {/* Top Stock Name */}
            <Grid item container sx={{ minHeight: 20 }}>
                {stock.종목명 ?
                    <StockInfo data={stock} handleFavorite={handleFavorite} />
                    : <></>
                }
            </Grid>

            {/* Stock Chart */}
            <Grid item container sx={{ mt: 1 }}>
                <StockChart_MA height={600} boxTransform={`translate(10px, 53px)`}
                    stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} stockName={stock.종목명} price={stock.현재가} net={stockChart.net}
                    willR={stockChart.willR} treasuryPrice={stockChart.treasuryPrice} treasury={stockChart.treasury} MA={stockChart.MA} />
            </Grid>

            {/* Bottom Infomation */}
            <Grid item container sx={{ mt: 1 }}>


                <Grid item container>
                    {/* 주요제품 매출 구성, 사업내용 */}
                    <Grid item xs={4.2}>

                        {
                            Array.isArray(stock.주요제품매출구성) ?
                                <>
                                    <StyledTypography_StockInfo fontSize="12px" textAlign='center'>주요제품 매출구성</StyledTypography_StockInfo>
                                    <Table sx={{ mt: 1 }}>
                                        <TableBody>
                                            {stock.주요제품매출구성.map(item => (
                                                <tr key={item.제품명}>
                                                    <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{item.제품명}</td>
                                                    <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{parseInt(item.구성비)} %</td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <StyledTypography_StockInfo fontSize="12px" textAlign='center' sx={{ mt: 2 }}>사업내용</StyledTypography_StockInfo>
                                    <Grid container sx={{ mt: 1 }}>
                                        <Stack direction='column' spacing={1} >
                                            {stock.기업개요.map(item => (
                                                <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                            ))}
                                        </Stack>
                                    </Grid>
                                </>
                                :
                                <></>
                        }

                    </Grid>

                    {/* 간지 */}
                    <Grid item xs={0.3}></Grid>

                    {/* 재무 / 사업내용 / 테마  */}
                    <Grid item xs={7.5}>
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
                                {/* <StyledToggleButton fontSize={'10px'} value="사업내용">사업내용</StyledToggleButton> */}
                                <StyledToggleButton fontSize={'10px'} value="테마">테마</StyledToggleButton>
                                {/* <StyledToggleButton fontSize={'10px'} value="주요">주요제품/주요주주</StyledToggleButton> */}
                            </ToggleButtonGroup>
                        </Grid>
                        <Grid item container sx={{ minHeight: 210 }}>
                            <ContentsComponent page={page} annual={stock.연간실적} quarter={stock.분기실적} summary={stock.기업개요} themes={stock.테마명} product={stock.주요제품매출구성} shareholder={stock.주요주주} />
                        </Grid>


                    </Grid>


                </Grid>


            </Grid>


        </Grid>
    )

}


export const StockInfo = ({ data, handleFavorite }) => {

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

                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2}><StyledTypography_StockInfo textAlign='center' >{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo></Grid>
                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
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
