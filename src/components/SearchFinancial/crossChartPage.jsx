import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup, ToggleButton, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
// import LaptopIcon from '@mui/icons-material/Laptop';
// import TvIcon from '@mui/icons-material/Tv';
// import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
// import { DataGrid, gridClasses, GridColumnGroupingModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from '../util/util';
// import { StyledTypography_StockInfo, Financial, EtcInfo } from '../util/htsUtil';
// import StockChart_MA from '../util/stockChart_MA';
import CrossChart from './crossChart';
import { customTheme } from './util';
import { API } from '../util/config';


export default function CrossChartPage({ swiperRef, data }) {

    const [selectedIndustries, setSelectedIndustries] = useState(data[0].업종명);
    const [category, setCategory] = useState(() => ['흑자', '집계', '분기', '전년동분기대비', '매출', '영업이익', '당기순이익']);
    const [chartData, setChartData] = useState([]);

    // 키워드 클릭 시 호출되는 함수
    const handleSelectedIndustries = (keyword) => {
        setSelectedIndustries(keyword);
    };
    const handleCategory = (event, newCategory) => {
        if (newCategory.length) {
            setCategory(newCategory);
        }
    };

    const categories = ['흑자', '집계', '분기', '전년동분기대비', '매출', '영업이익', '당기순이익']

    const getIndustryStockData = async () => {
        const postData = {
            target_category: category, target_industry: [selectedIndustries]
        }
        console.log(postData);
        const res = await axios.post(`${API}/formula/crossChart`, postData);
        setChartData(res.data);
        console.log(res.data);
        // console.log(field, industry);
    }

    const onCode = (data) => {
        console.log(data);
    }
    // useEffect(() => {
    //     setSelectedIndustries(data[0].업종명);
    // }, [])
    useEffect(() => { getIndustryStockData() }, [selectedIndustries, category])

    return (
        <>
            <Grid container sx={{ mt: 1 }}>
                {/* 업종list */}
                <Grid item xs={5}>
                    <Grid item container sx={{ height: 410 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        <ThemeProvider theme={customTheme}>
                            <DataGrid
                                rows={data}
                                columns={table_columns}
                                rowHeight={25}
                                onCellClick={(params, event) => {
                                    handleSelectedIndustries(params.row.업종명);
                                }}
                                disableRowSelectionOnClick
                                sx={{
                                    color: 'white', border: 'none',
                                    ...DataTableStyleDefault,
                                    [`& .${gridClasses.cell}`]: { py: 1, },
                                    '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                    '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                    '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                    '[data-field="업종명"]': { borderRight: '1.5px solid #ccc' },
                                    '[data-field="전체종목수"]': { borderLeft: '1.5px solid #ccc', borderRight: '1.5px solid #ccc' },
                                    '[data-field="흑자기업"]': { borderRight: '1.5px solid #ccc' },
                                }}
                            />
                        </ThemeProvider>
                    </Grid>
                </Grid>
                <Grid item xs={7}>
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

const table_columns = [
    {
        field: 'id', headerName: '순번', width: 20,
        align: 'center', headerAlign: 'center',
        valueFormatter: (params) => {
            return parseInt(params.value) + 1;
        }
    }, {
        field: '순위', headerName: '업종순위', width: 60,
        align: 'center', headerAlign: 'left',
    }, {
        field: '업종명', headerName: '업종명', width: 120,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전일대비', headerName: '전일대비', width: 60,
        align: 'left', headerAlign: 'center',
    }, {
        field: '전체종목수', headerName: '전체종목수', width: 65,
        align: 'right', headerAlign: 'center',
    }, {
        field: '흑자기업', headerName: '흑자기업', width: 60,
        align: 'right', headerAlign: 'center',
    }, {
        field: '미집계', headerName: '미집계', width: 60,
        align: 'right', headerAlign: 'center',
    }
]