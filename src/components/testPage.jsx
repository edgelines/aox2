import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, ToggleButtonGroup, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './Motions/MotionsColumns';
import { DataTableStyleDefault } from './LeadSectors/tableColumns';
import { blue } from '@mui/material/colors';
import { API, API_WS, STOCK } from './util/config.jsx';
// import { StyledToggleButton } from './util/util.jsx';

import { monthColumns, dayColumns } from './Report/columns.jsx';
import TestChart from './Test/TestChart.jsx'


export default function TestPage({ swiperRef }) {


    // state
    const [_date, set_Date] = useState({ year: null, month: null });
    const [monthData, setMonthData] = useState([]);
    const [dayData, setDayData] = useState([]);
    const [statistics, setStatistics] = useState(null);


    const get_data = async (_date) => {
        const postData = {
            year: _date.year,
            month: _date.month
        }
        const res = await axios.post('http://localhost:2440/api/test/getMonthData', postData);
        setMonthData(res.data.data);
        setStatistics(res.data.statistics);
    }

    const fetchData = async () => {
        var today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = { year: year, month: month }
        set_Date(date)
        get_data(date);

    }

    // handler
    const getCellClick = async (row) => {
        const res = await axios.post('http://localhost:2440/api/test/getDayData', { 날짜: row.날짜.split('T')[0] });
        setDayData(res.data);
    }



    useEffect(() => { fetchData(); }, [])
    // useEffect(() => { fetchData(); }, [])

    const tableCellStyle = { color: '#efe9e9ed', fontSize: '11px' }


    return (
        <Grid container spacing={1}>
            <Grid item container xs={12}>
                <Typography>Report Page</Typography>
            </Grid>

            {/* Month Stats Data */}
            <Grid item container xs={3}>
                <TableContainer sx={{ height: 600 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={monthData}
                            columns={monthColumns}
                            rowHeight={20}
                            hideFooter
                            onCellClick={(params, event) => {
                                getCellClick(params.row);
                            }}
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '[data-field="테마명"]': { fontSize: '9px' },

                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>
            </Grid>

            {/* Chart, Day Stats Data */}
            <Grid item container xs={5.5}>
                <TableContainer sx={{ height: 600 }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={dayData}
                            columns={dayColumns}
                            rowHeight={20}
                            hideFooter
                            getRowId={(row) => row.id} // id 필드를 고유 식별자로 사용
                            sx={{
                                color: 'white', border: 'none',
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: { py: 1, },
                                // '[data-field="테마명"]': { fontSize: '9px' },

                                '& .MuiDataGrid-row.Mui-selected': {
                                    backgroundColor: blue['A200'], // 원하는 배경색으로 변경
                                },
                            }}
                        />
                    </ThemeProvider>
                </TableContainer>
            </Grid>

            {/* Statistics */}

            <Grid item container xs={3.5}>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableCellStyle} >보조지표</TableCell>
                                <TableCell sx={tableCellStyle} >min</TableCell>
                                <TableCell sx={tableCellStyle} >max</TableCell>
                                <TableCell sx={tableCellStyle} >avg</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {Object.keys(statistics).map(item => {
                                const columns = ['w9', 'w14', 'w33', 'd7', 'd17']
                                const columns2 = ['T14', 'T16', 'T18', 'T20']
                                if (columns.includes(item)) {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell sx={tableCellStyle}>{item}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['min']}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['max']}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]['avg']}</TableCell>
                                        </TableRow>
                                    )
                                } else if (columns2.includes(item)) {
                                    return (
                                        <TableRow key={item}>
                                            <TableCell sx={tableCellStyle}>{item}</TableCell>
                                            <TableCell sx={tableCellStyle}>{statistics[item]} / {statistics['종목갯수']}</TableCell>
                                        </TableRow>
                                    )
                                }

                            })} */}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>


        </Grid>

    )
}
