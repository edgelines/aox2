import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Skeleton } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { JSON } from '../util/config';

export default function FlixPatrol({ swiperRef }) {

    const [netflix, setNetflix] = useState([]);
    const [disney, setDisney] = useState([]);
    const [hbo, setHbo] = useState([]);
    const [amazon, setAmazon] = useState([]);

    const getData = async (name) => {
        try {
            const res = await axios.get(`${JSON}/${name}`);
            const data = res.data.map((item, index) => ({
                ...item,
                id: index
            }))
            const order = 'asc';
            const orderBy = 'Rank'
            let sortedRows = [...data].sort((a, b) => {
                if (order === 'asc') {
                    return a[orderBy] < b[orderBy] ? -1 : 1;
                } else {
                    return a[orderBy] > b[orderBy] ? -1 : 1;
                }
            });
            return sortedRows
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData('netflix').then((data) => {
            setNetflix(data)
        })
        getData('disney').then((data) => {
            setDisney(data)
        })
        getData('hbo').then((data) => {
            setHbo(data)
        })
        getData('amazon').then((data) => {
            setAmazon(data)
        })
    }, []);

    const tableCols = [
        { field: 'Rank', headerName: 'Rank', width: 50 },
        { field: 'Title', headerName: 'Title', flex: 1.8 },
        { field: 'Score', headerName: 'Score', flex: 1 },
        { field: 'Date', headerName: 'Date', flex: 1.1 },
        { field: 'Nation', headerName: 'Nation', flex: 1.8 },
        { field: 'Genre', headerName: 'Genre', flex: 2 },
        { field: 'IMDB', headerName: 'IMDB', flex: 1 },
        {
            field: 'Rotten tomatoes', flex: 1,
            renderHeader: () => (
                <>
                    <strong style={{ lineHeight: 1, fontWeight: 400 }}>
                        Rotten<br />tomatoes
                    </strong>
                </>
            ),
        },
    ]
    return (
        <>
            <Grid container spacing={1} sx={{ marginLeft: '5px' }}>
                <Grid item xs={6}>
                    <Table tableData={netflix} tableCols={tableCols} Name="Netflix" swiperRef={swiperRef} />
                </Grid>
                <Grid item xs={6}>
                    <Table tableData={disney} tableCols={tableCols} Name="Disney" swiperRef={swiperRef} />
                </Grid>
                <Grid item xs={6}>
                    <Table tableData={hbo} tableCols={tableCols} Name="HBO" swiperRef={swiperRef} />
                </Grid>
                <Grid item xs={6}>
                    <Table tableData={amazon} tableCols={tableCols} Name="Amazon" swiperRef={swiperRef} />
                </Grid>
            </Grid>
        </>
    )
}

const Table = ({ tableData, tableCols, Name, swiperRef }) => {
    return (
        <>
            {tableData ?
                <>
                    <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>{Name}</h4>
                    <div style={{ height: "42vh", width: "97%", marginTop: '10px' }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        <ThemeProvider theme={customTheme}>
                            <DataGrid rows={tableData} hideFooter columns={tableCols}
                                getRowHeight={() => 'auto'}
                                getEstimatedRowHeight={() => 70}
                                sx={{
                                    '.MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },
                                    border: 0,
                                    '.MuiDataGrid-columnHeaders': {
                                        minHeight: '60px !important',  // 원하는 높이 값으로 설정
                                        maxHeight: '60px !important',  // 원하는 높이 값으로 설정
                                        lineHeight: '60px !important',  // 원하는 높이 값으로 설정
                                        // backgroundColor: 'rgba(230, 230, 230, 0.3)'
                                    },
                                    '.MuiInput-input': { color: 'white' },
                                    '.MuiSvgIcon-root': { color: '#efe9e9ed' },
                                    [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                    },
                                }} />
                        </ThemeProvider>
                    </div>
                </> : <Skeleton variant="rectangular" height={400} animation="wave" />
            }
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
                columnHeader: {
                    fontSize: '14px', // 헤더 폰트 크기를 원하는 값으로 설정합니다.
                    fontWeight: 'bold',
                    color: '#efe9e9ed',
                    textAlign: 'center'
                },
            },
        },
    },
});