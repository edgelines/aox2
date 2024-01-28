import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Grid, ToggleButtonGroup } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StyledToggleButton, StyledButton, DataTableStyleDefault } from './util/util';
import { DatePickerTheme, disablePastDatesAndWeekends, StyledTypography_StockInfo } from './util/htsUtil';
import { EstimatedTrading } from './HTS/estimatedTrading'
import { Industry } from './HTS/industry'
import { Confirmed } from './HTS/confirmed'
import { API } from './util/config';

export default function IpoPulsePage({ swiperRef }) {

    const [high, setHigh] = useState([0, 100]);
    const [start, setStart] = useState([0, 100]);
    const [day, setDay] = useState([0, 100]);

    const [tableData, setTableData] = useState([]);

    const fetchData = async () => {
        const postData = {
            high: high,
            start: start,
            day: day
        }

        const res = await axios.post(`${API}/ipoPulse/data`, postData);

        console.log(res.data);
        setTableData(res.data.table)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const table_columns = [
        {
            field: '종목명', headerName: '종목명', width: 100,
            align: 'left', headerAlign: 'center',
        }, {
            field: '업종명', headerName: '업종명', width: 110,
            align: 'left', headerAlign: 'center',
        }, {
            field: '상장예정일', headerName: '상장일', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '경과일수', headerName: '경과일수', width: 65,
            align: 'right', headerAlign: 'center',
        }, {
            field: '공모가', headerName: '공모가', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '공모가대비', headerName: '공모가대비', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '최고가', headerName: '최고가', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '최고가대비', headerName: '최고가대비', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '최저가', headerName: '최저가', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '현재가', headerName: '현재가', width: 80,
            align: 'right', headerAlign: 'center',
        }, {
            field: '등락률', headerName: '등락률', width: 60,
            align: 'right', headerAlign: 'center',
        }
    ]

    return (
        <>
            <Grid container>
                Chart

            </Grid>
            <Grid container>
                <Grid container sx={{ height: 700, width: "100%" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid
                            rows={tableData}
                            columns={table_columns}
                            hideFooter
                            getRowHeight={() => 'auto'}
                            onCellClick={(params, event) => {
                                if (params.field === 'category') {
                                    onCategory(params.value);
                                }

                            }}
                            sx={{
                                ...DataTableStyleDefault,
                                [`& .${gridClasses.cell}`]: {
                                    py: 1,
                                },

                            }}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>
        </>
    )
}

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10px',
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '9px',
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10px',
                    color: '#efe9e9ed'
                },
            },
            defaultProps: {
                headerHeight: 15,
            },
        },
    },
});