import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styledComponents from 'styled-components';
import { StyledToggleButton, DataTableStyleDefault } from './util';


export const renderProgress = (params) => {
    let color;
    if (params.value > 0) {
        color = 'tomato';  // 값이 증가했다면 빨간색
    }

    if (params.value == null) {
        return '';
    } else {
        return (
            // <div style={{ color: color }}> {`${params.value}`} </div>
            <div style={{ color: color }}> {`${params.value.toLocaleString('kr')}`} </div>
        );
    }
}

export const StyledTypography = styledComponents(Typography)`    
    font-size: 12px;
    // text-align : start;
    // color: ;
    // line-height: calc(var(--base-space) * 6) !important;
    // margin-top: calc(var(--base-space) * 1) !important;
`;


export const TitleComponent = ({ title, statistics }) => {

    return (
        <Grid container>
            {statistics ?
                <>
                    <Grid item xs={7}>
                        <StyledTypography>{title}</StyledTypography>
                    </Grid>
                    <Grid item container xs={5}
                        direction="row"
                        justifyContent="center"
                    >
                        <StyledTypography>{statistics.up} / {statistics.total}</StyledTypography>
                        {/* <Grid item xs={6}>
                        </Grid> */}

                    </Grid>
                </>
                : <Skeleton />
            }
        </Grid>
    )
}

export const DataTable = ({ swiperRef, data, columns }) => {

    // const columns = [
    //       {
    //         field: '보험기타금융', headerName: '보험기타금융', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '연기금', headerName: '연기금', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '은행', headerName: '은행', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '개인', headerName: '개인', width: 45,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }, {
    //         field: '국가지자체', headerName: '국가', width: 10,
    //         align: 'right', headerAlign: 'center',
    //         renderCell: (params) => renderProgress(params)
    //     }

    // ];




    const customTheme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        '& .MuiDataGrid-row': {
                            fontSize: '10px',
                            color: '#efe9e9ed',
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

    return (
        <Grid container sx={{ height: 800, width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <ThemeProvider theme={customTheme}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    rowHeight={20}
                    sx={{
                        ...DataTableStyleDefault,
                        border: 0,
                        '.MuiInput-input': { color: 'white' },
                        '.MuiSvgIcon-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-root': { color: '#efe9e9ed' },
                        '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', fontSize: '0px' },
                        '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px' },
                        [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                    }}
                />
            </ThemeProvider>
        </Grid>
    );
};

export const DatePickerTheme = createTheme({
    components: {
        MuiDatePicker: {
            styleOverrides: {
                root: {
                    color: '#efe9e9ed',
                },
            },
        },

        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: '#efe9e9ed'
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: '#efe9e9ed',
                    fontSize: '10px'
                },
                notchedOutline: {
                    color: '#efe9e9ed',
                }
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    color: '#efe9e9ed'
                },
            },
        }
    },
})