import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup, ToggleButton, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';
import TvIcon from '@mui/icons-material/Tv';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { DataGrid, gridClasses, GridColumnGroupingModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from '../util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
import StockChart_MA from '../util/stockChart_MA';
import CrossChart from './crossChart';
import { API, STOCK } from '../util/config';


export default function CrossChartPage({ swiperRef, data }) {

    const [selectedIndustries, setSelectedIndustries] = useState(['']);
    const [category, setCategory] = useState(() => ['매출']);
    const [chartData, setChartData] = useState([]);
    // 키워드 클릭 시 호출되는 함수
    const handleSelectedIndustries = (keyword) => {
        if (selectedIndustries.includes(keyword)) {
            // 이미 선택된 키워드를 다시 클릭한 경우, 배열에서 제거
            setSelectedIndustries(selectedIndustries.filter(k => k !== keyword));
        } else {
            // 선택되지 않은 키워드를 클릭한 경우, 배열에 추가
            setSelectedIndustries([...selectedIndustries, keyword]);
        }
    };
    const handleCategory = (event, newCategory) => {
        if (newCategory.length) {
            setCategory(newCategory);
        }
    };

    const categories = ['매출', '영업이익', '당기순이익', '잠정실적', '전년동분기대비', '분기매출', '분기영업이익', '분기당기순이익', '흑자_매출', '흑자_영업이익', '흑자_당기순이익']

    const getIndustryStockData = async () => {
        const postData = {
            target_category: category, target_industry: selectedIndustries
        }
        const res = await axios.post(`${API}/formula/crossChart`, postData);
        setChartData(res.data);
        console.log(res.data);
        // console.log(field, industry);
    }

    const onCode = (data) => {
        console.log(data);
    }
    useEffect(() => {
        setSelectedIndustries([data[0].업종명]);
    }, [])
    useEffect(() => { getIndustryStockData() }, [selectedIndustries, category])

    return (
        <>
            <Grid container sx={{ mt: 1 }}>
                {/* 업종list */}
                <Grid item xs={1.5}>
                    <TableContainer sx={{ height: 410 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {data && data.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data.map(item => (
                                        <TableRow key={item.업종명} onClick={() => handleSelectedIndustries(item.업종명)}
                                            sx={{
                                                '&:hover': { backgroundColor: '#6E6E6E' }, // 마우스 오버 시 배경색 변경
                                                backgroundColor: selectedIndustries.includes(item.업종명) ? '#6E6E6E' : 'transparent', // 선택된 업종명에 대한 배경색
                                                '.MuiTableCell-root': {
                                                    color: selectedIndustries.includes(item.업종명) ? '#FCAB2F' : '#efe9e9ed', // 선택된 업종명에 대한 글꼴 색상
                                                    fontSize: '10px',
                                                    p: 0.2
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.업종명}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }
                    </TableContainer>
                </Grid>
                <Grid item xs={10.5}>
                    <Grid item container>
                        <ToggleButtonGroup
                            value={category}
                            onChange={handleCategory}
                            size="small"
                        >
                            {categories.map(item => (
                                <StyledToggleButton key={item} value={item} sx={{ fontSize: '9px' }}>
                                    {item}
                                </StyledToggleButton>
                            ))}

                        </ToggleButtonGroup>
                    </Grid>

                    <Grid item container>
                        <CrossChart data={chartData} height={380} onCode={onCode} />
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}

