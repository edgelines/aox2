import React, { useEffect, useState, useRef } from 'react';
import { Grid, Stack, IconButton, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
// import { StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import StockChart_MA from '../util/stockChart_MA';
import StockChart_Sub from '../util/StockChart_Sub.jsx';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { yellow } from '@mui/material/colors';
import { STOCK, API_KAKAO } from '../util/config.jsx';
// import SendToMobileIcon from '@mui/icons-material/SendToMobile';
import { RiKakaoTalkFill } from "react-icons/ri";


export default function StockInfoPage({ stock, stockChart, handleFavorite, handleInvest, handleInvestCancel, swiperRef, selectedChartType, handleSelectedChartType, baseStockName, getInfo }) {
    const baseStyle = { fontSize: '10px', p: 0.1, textAlign: 'right' }
    const [subChartData, setSubChartData] = useState();
    const [selectedSubChartType, setSelectedSubChartType] = useState(false);
    const [sendKakao, setSendKakao] = useState(false);

    const handleSelectedSubChartType = () => {
        setSelectedSubChartType(prevStock => (!prevStock));
    }

    const getSubChartData = async () => {
        const res = await axios.get(`${STOCK}/sub/${stock.종목코드}`);
        // const res = await axios.get(`http://localhost:2440/stockData/sub/${stock.종목코드}`);
        setSubChartData(res.data);
    }

    const handleSendChatRoom = async () => {
        await axios.get(`${API_KAKAO}/${stock.종목코드}`);
        setSendKakao(true);
    }

    useEffect(() => {
        if (selectedSubChartType) {
            getSubChartData();
        }
    }, [selectedSubChartType, stock])

    useEffect(() => {
        setSendKakao(false);
    }, [stock])


    return (
        <Grid container>
            {/* Top Stock Name */}
            <Grid item container sx={{ minHeight: 36, maxHeight: 36 }}>
                {stock.종목명 ?
                    <StockInfo data={stock} handleFavorite={handleFavorite} handleInvest={handleInvest} handleInvestCancel={handleInvestCancel}
                        handleSendChatRoom={handleSendChatRoom} sendKakao={sendKakao} />
                    : <></>
                }
            </Grid>

            {/* Stock Chart */}
            <Grid item container sx={{ mt: 1 }}>
                <StockChart_MA height={640} boxTransform={`translate(10px, 53px)`}
                    // stockItemData={stockChart.price ? stockChart.price : []} volumeData={stockChart.volume ? stockChart.volume : []} MA={stockChart.MA}
                    stockName={stock.종목명} price={stock.현재가}
                    info={stockChart.info} series={stockChart.series}
                    selectedChartType={selectedChartType} handleSelectedChartType={handleSelectedChartType}
                    selectedSubChartType={selectedSubChartType} handleSelectedSubChartType={handleSelectedSubChartType}
                    baseStockName={baseStockName} getInfo={getInfo}
                />
            </Grid>

            {/* Bottom Infomation */}
            <Grid item container sx={{ mt: 1 }}>

                {
                    !selectedSubChartType ?
                        <Grid item container>
                            {/* 주요제품 매출 구성, 사업내용, 테마 */}
                            <Grid item xs={4.5}>

                                {
                                    Array.isArray(stock.주요제품매출구성) ?
                                        <TableContainer sx={{ height: 200 }}
                                            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                                            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                                        >
                                            <Grid container>
                                                <Table sx={{ mt: 1, borderBottom: '1px solid #fff' }}>
                                                    <TableBody>
                                                        {Array.isArray(stock.주요주주) ? stock.주요주주.map(item => (
                                                            <tr key={item.주요주주}>
                                                                <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{item.주요주주}</td>
                                                                <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{item['보유주식수(보통)'].toLocaleString('KR')} 주</td>
                                                                <td sx={{ color: '#efe9e9ed', ...baseStyle }} >{parseInt(item['보유지분(%)'])} %</td>
                                                            </tr>
                                                        )) : <></>}
                                                    </TableBody>
                                                </Table>
                                            </Grid>

                                            <Grid container sx={{ mt: 1, mb: 1, borderBottom: '1px solid #fff' }}>
                                                <Stack direction='row' spacing={1} useFlexGap flexWrap="wrap" >
                                                    {Array.isArray(stock.테마명) ? stock.테마명.map(item => (
                                                        <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                                                    )) : <></>}
                                                </Stack>
                                            </Grid>

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

                                            <Grid container sx={{ mt: 1 }}>
                                                <Stack direction='column' spacing={1} >
                                                    {Array.isArray(stock.기업개요) ? stock.기업개요.map(item => (
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


                        </Grid> :
                        <Grid item container>
                            {
                                Array.isArray(subChartData) ?
                                    <StockChart_Sub
                                        series={subChartData}
                                    /> : <></>
                            }
                        </Grid>
                }


            </Grid>


        </Grid>
    )

}


export const StockInfo = ({ data, handleFavorite, handleInvest, handleInvestCancel, handleSendChatRoom, sendKakao }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: yellow[500],
            },
            secondary: {
                main: '#f44336',
            },
        },
    });
    return (
        <Grid container>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }} direction='row' alignItems="center" justifyContent="center">
                <Grid item xs={0.6}>
                    <IconButton size="small" color='error' onClick={() => handleFavorite()}>
                        {data.Favorite ?
                            <FavoriteIcon /> : <FavoriteBorderIcon />
                        }
                    </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                    <IconButton size="small" color={sendKakao ? 'primary' : 'error'} onClick={() => handleSendChatRoom()}>
                        <RiKakaoTalkFill />
                    </IconButton>
                </Grid>
                <Grid item xs={0.6}>
                    <ThemeProvider theme={theme}>
                        <IconButton size="small" color={data.Invest ? 'primary' : 'error'} onClick={() => handleInvest()} >
                            {data.Invest ?
                                <PaidIcon /> : <AttachMoneyIcon />
                            }
                        </IconButton>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={0.4}>
                    <Typography>
                        {data.InvestCount > 0 ? data.InvestCount : ''}
                    </Typography>
                </Grid>
                <Grid item xs={0.4}>
                    <IconButton size="small" color='error' onClick={() => handleInvestCancel()}>
                        <CancelOutlinedIcon />
                    </IconButton>
                </Grid>


                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' sx={{ color: data.시장 === 'K' ? '#FCAB2F' : 'greenyellow' }}>{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={1.5}><StyledTypography_StockInfo textAlign='center' >{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo></Grid>
                <Grid item xs={3}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>




        </Grid>
    )
}
