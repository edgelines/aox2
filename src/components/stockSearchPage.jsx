import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Slider, Grid, IconButton, Switch, FormControl, FormControlLabel, Paper, Box, Divider, Stack, ListItem, ListItemText, Typography, TextField, useMediaQuery, ListSubheader, Popper,
    Accordion, AccordionSummary, AccordionDetails, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// import PropTypes from 'prop-types';
// import { VariableSizeList } from 'react-window';
import StockChart from './SectorsPage/stockChart';
import SectorChart from './SectorsPage/sectorChart';
import TreeMap from './SectorsPage/treeMap';
import ColumnChart from './SectorsPage/columnChart';
import { API, STOCK, TEST } from './util/config';
import { SectorsName15 } from './util/util';
import useInterval from './util/useInterval';

export default function StockSearchPange({ swiperRef }) {

    const [baseStockName, setBaseStockName] = useState([]);

    // hanlder
    const handleSearchChange = (value) => {
        console.log(value);
        // const { value } = event.target;
        // console.log(value.종목코드);
    }

    const fetchData = async () => {
        const res = await axios.get(`${TEST}/stockName`);
        setBaseStockName(res.data);

    }
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Grid container spacing={1} >
            <Autocomplete
                disablePortal
                getOptionLabel={(option) => option.종목명} // 옵션을 어떻게 표시할지 결정합니다. 객체의 속성에 따라 조정해야 합니다.
                options={baseStockName}
                sx={{ width: 300 }}
                renderInput={(params) =>
                    <TextField
                        {...params} label="종목명 검색"
                        variant="filled" color="info"
                        onChange={async (event, newValue) => {
                            console.log(event);
                            // handleSearchChange(newValue)
                        }}
                    />}
            />
        </Grid>

    );
}
