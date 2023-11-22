import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function StockSearchMonitoringPage({ swiperRef, StockSearchTrackingStatistics }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (StockSearchTrackingStatistics.status === 'succeeded') { setData(StockSearchTrackingStatistics.data); }
    }, [StockSearchTrackingStatistics])


    // Etc.
    const StockColumns = [
        { field: 'D_Day', headerName: 'D+Day', width: 55, align: 'right' },
        {
            field: '조건일', headerName: '조건일', width: 85, align: 'right',
            renderCell: (params) => params.value.split('T')[0]
        },
        {
            field: '현재평균', headerName: '현재평균', width: 62, align: 'right',
            renderCell: (params) => {
                const 현재가 = params.value.toFixed(2);
                let color, fontWeight;
                if (현재가 < 0) {
                    color = 'dodgerblue';
                } else { color = 'tomato'; }
                return (
                    <span style={{ color: color, fontWeight: fontWeight }}>
                        {`${현재가} %`}
                    </span>
                );
            }
        },
        {
            field: '상승', headerName: '상승', width: 50, align: 'right',
            renderCell: (params) => `${params.value} %`
        },
        {
            field: '상승갯수', headerName: '상승/전체', width: 80, align: 'right',
        },
        { field: '윌리엄스_5', headerName: 'W-R-5', width: 80, align: 'right', },
        { field: '윌리엄스_7', headerName: 'W-R-7', width: 80, align: 'right', },
        { field: '윌리엄스_14', headerName: 'W-R-14', width: 80, align: 'right', },
        { field: '코스피200_7', headerName: 'ADR-7', width: 80, align: 'right', },
        { field: '코스피200_14', headerName: 'ADR-14', width: 80, align: 'right', },
        { field: '코스피200_20', headerName: 'ADR-20', width: 80, align: 'right', },
    ]

    const text = `유보율 > 100%, 부채비율 < 500%,  500원 < 현재가 < 10만`

    return (
        <Grid container>
            <Grid item xs={7} sx={{ paddingRight: '30px' }}>
                <div style={{ height: "45svh" }}
                    onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                    onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                >
                    <Typography align='start' sx={{ mt: 1 }}>
                        DMI 3,4,5 : 3, 4, 5
                    </Typography>
                    <Typography align='start' sx={{ mt: 1 }}>
                        DMI 6,7 : 0 ~ 10
                    </Typography>
                    <Typography align='start' sx={{ mt: 1 }}>
                        윌리엄스 5,7,14,20,33 : -100 ~ -90
                    </Typography>
                    <Typography align='start' sx={{ mb: 3 }}>
                        {text}
                    </Typography>
                    <ThemeProvider theme={customTheme}>
                        <DataGrid rows={data} rowHeight={25} columns={StockColumns}
                            sx={{
                                color: '#efe9e9ed', border: 'none',
                                '.MuiDataGrid-columnHeaders': {
                                    minHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                                    backgroundColor: 'rgba(230, 230, 230, 0.1)'
                                },
                                '.MuiDataGrid-columnSeparator': { display: 'none', },
                                '.MuiTablePagination-root': { color: '#efe9e9ed' },
                                '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', marginBottom: '5px' },
                                '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                                '[data-field="종목명"]': { backgroundColor: '#6E6E6E' },
                            }}
                        />
                    </ThemeProvider>
                </div>

            </Grid>
        </Grid>
    )
}




const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '10.5px', // 전체 폰트 크기를 원하는 값으로 설정합니다.
                    },
                },
                columnHeaderWrapper: {
                    minHeight: '10px', // 헤더 높이를 원하는 값으로 설정합니다.
                    // lineHeight: '20px',
                },
                columnHeader: {
                    fontSize: '10.5px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                },
            },
            defaultProps: {
                headerHeight: 20,
            },
        },
    },
});
