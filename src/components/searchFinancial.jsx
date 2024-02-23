import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Stack, Typography, ToggleButtonGroup, Input, InputAdornment, Checkbox, FormControlLabel, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DataGrid, gridClasses, GridColumnGroupingModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledButton, DataTableStyleDefault, StyledToggleButton } from './util/util';
import { StyledTypography_StockInfo, Financial, EtcInfo } from './util/htsUtil';
import SearchFinancialTable from './SearchFinancial/table';
import StockChart_MA from './util/stockChart_MA';
import { API, STOCK } from './util/config';


export default function SearchFinancial({ swiperRef }) {

    const [page, setPage] = useState('Table');
    const [tableData, setTableData] = useState([]);
    const handlePage = (event, value) => { if (value !== null) { setPage(value); } }

    const fetchData = async () => {
        const res = await axios.get(`${API}/formula/searchFinancial`);
        setTableData(res.data);
    }


    useEffect(() => { fetchData() }, [])


    return (
        <Grid container>
            <Grid item container sx={{ mt: 1 }}>
                <ToggleButtonGroup
                    color='info'
                    exclusive
                    size="small"
                    value={page}
                    onChange={handlePage}
                    sx={{ pl: 1.3 }}
                >
                    <StyledToggleButton fontSize={'10px'} value="Table">Table</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="Tree">Tree</StyledToggleButton>
                    <StyledToggleButton fontSize={'10px'} value="Cross">Cross</StyledToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item container>
                <ContentsComponent swiperRef={swiperRef} page={page} tableData={tableData} />
            </Grid>
        </Grid>
    )
}

const ContentsComponent = ({ swiperRef, page, tableData }) => {

    switch (page) {
        // case '사업내용':
        //     if (Array.isArray(summary)) {
        //         return <Grid container sx={{ mt: 3 }}>
        //             <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
        //                 {summary.map(item => (
        //                     <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
        //                 ))}
        //             </Stack>
        //         </Grid>
        //     }

        default:
            return <SearchFinancialTable swiperRef={swiperRef} tableData={tableData} tableTree={page} />

    }


}