import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API } from '../util/config';

export default function IpoPage({ swiperRef }) {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        axios.get(`${API}/schedule/ipo`).then(response => {
            const data = response.data.map((item, index) => ({
                ...item,
                id: index
            }))
            const order = 'desc';
            const orderBy = '상장일'
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
        { field: '종목명', headerName: '종목명', width: 200 },
        { field: '업종명', headerName: '업종명', flex: 1 },
        { field: '상장일', headerName: '상장일', flex: 0.5 },
        { field: '간단사업내용', headerName: '간단사업내용', flex: 2 },
    ]
    return (
        <>
            <Grid container spacing={2} sx={{ marginLeft: '5px' }}>
                <Grid item xs={12}>
                    <h4 style={{ textAlign: 'left' }}>신규 상장 종목</h4>
                </Grid>
                <div style={{ height: "37vh", width: "50%", marginLeft: '20px' }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={tableData} hideFooter rowHeight={25} columns={tableCols}
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
                                '.MuiSvgIcon-root': { color: '#efe9e9ed' }
                            }} />
                    </ThemeProvider>

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
                        color: '#efe9e9ed'
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '14px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    fontWeight: 'bold',
                    textAlign: 'center',
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