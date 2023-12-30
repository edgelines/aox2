import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styledComponents from 'styled-components';
import { DataTableStyleDefault } from './util';


export const renderProgress = (params) => {
    let color;
    if (params.value > 0) {
        color = '#FCAB2F';  // 값이 증가했다면 빨간색
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
                    <Grid item xs={5}>
                        <StyledTypography>{title}</StyledTypography>
                    </Grid>
                    <Grid item container xs={7}
                        direction="row"
                        justifyContent="center"
                    >
                        <StyledTypography>{statistics.up} / {statistics.total} ( {statistics.per} % , Av.{statistics.avg} %  )</StyledTypography>
                        {/* <Grid item xs={6}>
                        </Grid> */}

                    </Grid>
                </>
                : <Skeleton />
            }
        </Grid>
    )
}

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
export const DataTable = ({ swiperRef, data, columns, height, onParams }) => {

    return (
        <Grid container sx={{ height: height ? height : 800, width: "100%" }}
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
                        '.MuiTablePagination-root': { color: '#efe9e9ed', fontSize: '0px' },
                        '.MuiTablePagination-selectLabel': { color: '#efe9e9ed', fontSize: '0px' },
                        '.MuiTablePagination-displayedRows': { color: '#efe9e9ed', marginBottom: '1px', fontSize: '9px' },
                        '.MuiDataGrid-selectedRowCount': { fontSize: '0px' },
                        [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                    }}
                    onCellClick={(params, event) => onParams(params.row)}
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

export function disablePastDatesAndWeekends(date) {
    // 오늘 날짜 구하기
    const today = dayjs().startOf('day'); // 'day'를 사용하여 시간을 00:00으로 설정
    // 2023년 12월 25일 이전의 날짜 와 내일 이후 날짜 비활성화
    const startDate = dayjs(new Date(2023, 11, 25));

    if (date <= startDate || date > today) {
        return true;
    }

    // 토요일(6)과 일요일(0) 비활성화
    const day = date.day();
    if (day === 0 || day === 6) {
        return true;
    }

    return false;
}

export const FilteredDataTable = ({ swiperRef, data, columns, height, onParams }) => {

    return (
        <Grid container sx={{ height: height ? height : 800, width: "100%" }}
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <ThemeProvider theme={customTheme}>
                <DataGrid rows={data} columns={columns} hideFooter rowHeight={16}
                    onCellClick={(params, event) => onParams(params.row)}
                    sx={DataTableStyleDefault} />
            </ThemeProvider>
        </Grid>
    )
}

const ProgressBar = styled('div')(({ theme, value, val2, color }) => {
    const valueInPercent = value * (val2 || 50);

    return {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: '2px',
        height: 26,
        borderRadius: 2,
        '& .value': {
            position: 'absolute',
            lineHeight: '24px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },
        '& .bar': {
            height: '100%',
            backgroundColor: (() => {
                if (valueInPercent < 0) {
                    return 'dodgerblue';
                }
                if (valueInPercent >= 50) {
                    return color || '#088208a3';
                }
                return color || '#088208a3';
            })(),
            maxWidth: `${Math.abs(valueInPercent)}%`,
        },
    };
});

const CustomProgressBar = React.memo(function CustomProgressBar(props) {
    const { value, valueON = false, color = '#91bde8', val2 } = props;
    return (
        valueON === true ?
            <ProgressBar value={value} val2={val2 || 0.1} color={color} >
                <div className="bar" />
            </ProgressBar>
            : <ProgressBar value={value} val2={3} color={color} >
                <div className="value">{`${value.toLocaleString('ko-kr')} %`}</div>
                <div className="bar" />
            </ProgressBar>
    );
});

export function renderProgressBar(params) {
    const { valueON, color, val2 } = params;
    return <CustomProgressBar value={Number(params.value)} valueON={valueON} color={color} val2={val2} />;
}