import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Skeleton } from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { myJSON } from '../util/config';

export default function Coex({ swiperRef }) {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        axios.get(`${myJSON}/coex`).then(response => {
            const data = response.data.map((item, index) => ({
                ...item,
                id: index
            }))
            const order = 'asc';
            const orderBy = 'Date'
            let sortedRows = [...data].sort((a, b) => {
                if (order === 'asc') {
                    return a[orderBy] < b[orderBy] ? -1 : 1;
                } else {
                    return a[orderBy] > b[orderBy] ? -1 : 1;
                }
            });

            setTableData(sortedRows);
        })
    }, []);

    const tableCols = [
        { field: 'Sector', headerName: 'Sector', width: 150 },
        { field: 'Title', headerName: 'Title', width: 300, flex: 2 },
        { field: 'Date', headerName: 'Date', flex: 1.2 },
        { field: 'Hall', headerName: 'Hall', width: 200, flex: 1 },
        { field: 'Item', headerName: 'Item', width: 900, flex: 5 },
    ]
    return (
        <>
            <Grid container spacing={2} sx={{ marginLeft: '5px' }}>
                <Grid item>
                    <h4 style={{ textAlign: 'left' }}>COEX Schedule</h4>
                </Grid>
                <div style={{ height: "90vh", width: "96%", marginTop: '10px', marginLeft: '20px' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    {tableData ?
                        <ThemeProvider theme={customTheme}>
                            <DataGrid rows={tableData} hideFooter columns={tableCols}
                                getRowHeight={() => 'auto'}
                                getEstimatedRowHeight={() => 70}
                                slots={{ toolbar: GridToolbar }}
                                disableColumnFilter
                                disableColumnSelector
                                disableDensitySelector
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                        quickFilterProps: { debounceMs: 500 },
                                        csvOptions: { disableToolbarButton: true },
                                        printOptions: { disableToolbarButton: true },
                                    },
                                }}
                                sx={{
                                    '.MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },
                                    border: 0,
                                    '.MuiDataGrid-columnHeaders': {
                                        minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                        // backgroundColor: 'rgba(230, 230, 230, 0.3)'
                                    },
                                    '.MuiInput-input': { color: 'white' },
                                    '.MuiSvgIcon-root': { color: '#efe9e9ed' },
                                    [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                    },
                                }} />
                        </ThemeProvider> : <Skeleton variant="rectangular" height={400} animation="wave" />
                    }

                </div>
            </Grid>

        </>
    )
}

// css


const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '12px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                        color: '#efe9e9ed',
                        textAlign: 'left'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '14px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    fontWeight: 'bold',
                    color: '#efe9e9ed',
                },
                search: {
                    color: '#efe9e9ed',
                }
            },
            defaultProps: {
                headerHeight: 20,
            },
        },
    },
});