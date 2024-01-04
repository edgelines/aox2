import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Grid, Box, Typography, ToggleButtonGroup, Skeleton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Stack, Divider } from '@mui/material';
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
                        <StyledTypography_StockInfo>{title}</StyledTypography_StockInfo>
                    </Grid>
                    <Grid item container xs={7}
                        direction="row"
                        justifyContent="center"
                    >
                        <StyledTypography_StockInfo>{statistics.up} / {statistics.total} ( {statistics.per} % , Av.{statistics.avg} %  )</StyledTypography_StockInfo>
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


const StyledTypography_StockInfo = styledComponents(Typography)`    
        font-size: ${props => props.fontSize ? props.fontSize : '12px'};
        text-align : ${props => props.textAlign ? props.textAlign : 'left'};
    `;

export const StockInfo = ({ data }) => {

    return (
        <Grid container spacing={2}>
            <Grid item container sx={{ borderBottom: '2px solid #efe9e9ed' }}>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{data.종목명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={4.7}><StyledTypography_StockInfo textAlign='center' >{data.업종명}</StyledTypography_StockInfo></Grid>
                <Grid item xs={2.6}><StyledTypography_StockInfo textAlign='center' >{data.시장 === 'K' ? 'Kospi' : 'Kosdaq'}</StyledTypography_StockInfo></Grid>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={5} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">시가총액</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{parseInt((parseInt(data.시가총액) / 100000000).toFixed(0)).toLocaleString('kr')} 억</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">상장주식수</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.상장주식수.toLocaleString('kr')}</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">PER</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PER}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">PBR</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.PBR}</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">EPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.EPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">BPS</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.BPS.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>
            <Grid item container sx={{ borderBottom: '1px solid #efe9e9ed' }}>

            </Grid>

            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">52주 최고가</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.최고가52주.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">52주 최저가</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.최저가52주.toLocaleString('kr')} 원</StyledTypography_StockInfo>
                </Stack>
            </Grid>

            <Grid item container>
                <Stack direction='row' spacing={3} sx={{ pl: 2, pr: 2 }}>
                    <StyledTypography_StockInfo fontSize="12px">현재가</StyledTypography_StockInfo>
                    <StyledTypography_StockInfo fontSize="12px">{data.현재가.toLocaleString('kr')} 원</StyledTypography_StockInfo>

                </Stack>
            </Grid>

            <Grid item container>
                <Stack direction='column' spacing={1} sx={{ pl: 2, pr: 2 }}>
                    {data.기업개요.map(item => (
                        <StyledTypography_StockInfo key={item} fontSize="12px">{item}</StyledTypography_StockInfo>
                    ))}
                </Stack>
            </Grid>

        </Grid>
    )
}

const FinancialTable = ({ data1, data2 }) => {
    const dataRows = ["매출액", "영업이익", "당기순이익", "부채비율", "유보율"]
    const baseStyle = { fontSize: '11px', p: 0.2, textAlign: 'right' }
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    {data1.map(item => (
                        <TableCell key={item.날짜} size='small' sx={{ color: '#efe9e9ed', ...baseStyle }}  >{item.날짜.slice(2)}</TableCell>
                    ))}
                    <TableCell></TableCell>
                    {data2.map(item => (
                        <TableCell key={item.날짜} size='small' sx={{ color: '#efe9e9ed', ...baseStyle }}  >{item.날짜.slice(2)}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    dataRows.map(item => (
                        <TableRow key={item}>
                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}  >{item}</TableCell>
                            {data1.map(row => (
                                <TableCell key={row[item]} size='small' sx={{ color: row[item] < 0 ? '#00F3FF' : '#efe9e9ed', ...baseStyle, fontWeight: 'bold' }} >{parseInt(row[item]).toLocaleString('KR')} </TableCell>
                            ))}
                            <TableCell></TableCell>
                            {data2.map(row => (
                                <TableCell key={row[item]} size='small' sx={{ color: row[item] < 0 ? '#00F3FF' : '#efe9e9ed', ...baseStyle, fontWeight: 'bold' }} >{parseInt(row[item]).toLocaleString('KR')} </TableCell>
                            ))}
                        </TableRow>
                    ))
                }
                <TableRow></TableRow>
            </TableBody>
        </Table>

    )
}

export const Financial = ({ annual, quarter }) => {
    return (
        <Grid container>
            {annual && annual.length > 0 ?
                <Grid container>
                    <FinancialTable data1={annual} data2={quarter} />
                </Grid>
                : <Grid container></Grid>
            }
        </Grid>
    )
}

export const EtcInfo = ({ product, shareholder }) => {
    const baseStyle = { fontSize: '11px', p: 0.2, textAlign: 'right' }
    return (
        <Grid container>
            {Array.isArray(product) ?
                <Grid item container spacing={1}>
                    <Grid item xs={4}>
                        <StyledTypography_StockInfo fontSize="12px" textAlign='center'>주요제품 매출구성</StyledTypography_StockInfo>
                        <Table sx={{ mt: 1 }}>
                            <TableBody>
                                {product.map(item => (
                                    <TableRow key={item.제품명}>
                                        <TableCell sx={{ color: '#efe9e9ed', ...baseStyle }} >{item.제품명}</TableCell>
                                        <TableCell sx={{ color: '#efe9e9ed', ...baseStyle }} >{item.구성비} %</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={8}>
                        <StyledTypography_StockInfo fontSize="12px" textAlign='center'>주요 주주</StyledTypography_StockInfo>
                        <Table sx={{ mt: 1 }}>
                            <TableBody>
                                {shareholder.map(item => (
                                    <TableRow key={item.주요주주}>
                                        <TableCell sx={{ color: '#efe9e9ed', ...baseStyle }}>{item.주요주주}</TableCell>
                                        <TableCell sx={{ color: '#efe9e9ed', ...baseStyle }}>{item['보유주식수(보통)'].toLocaleString('KR')} 주</TableCell>
                                        <TableCell sx={{ color: '#efe9e9ed', ...baseStyle }}>{item['보유지분(%)']} %</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
                :
                <></>}
        </Grid>
    )
}