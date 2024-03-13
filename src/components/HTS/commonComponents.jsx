import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Skeleton, Table, TableBody, TableRow, TableCell, TableContainer, Slider } from '@mui/material';
import { renderProgress, StyledTypography, TitleComponent, DataTable, FilteredDataTable, renderProgressBar, StockInfo, Financial, EtcInfo } from '../util/htsUtil';
// import { API, STOCK } from '../util/config';
import StockChart from '../util/stockChart';

// 외국계, 기관계, 외국기관 합산, 업종, 테마 Table
export const TrendTables = ({ swiperRef, statistics, data1, data2, data3, data5, data6, consecutiveMax, countBtn, market, date, time,
    getStockCode, handleFilteredTable, handleValueChange
}) => {
    const columns = [
        {
            field: '연속거래일', headerName: ' ', width: 5,
            align: 'center', headerAlign: 'center',
        }, {
            field: '종목명', headerName: '종목명', width: 75,
            align: 'left', headerAlign: 'center',
        }, {
            field: '시가총액', headerName: '시총(억)', width: 60,
            align: 'right', headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `${params.value.toLocaleString('kr')}`;
            },
        }, {
            field: '대비율', headerName: '검색%', width: 40,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '등락률', headerName: '현재%', width: 40,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }, {
            field: '전일대비거래량', headerName: '전일%', width: 45,
            align: 'right', headerAlign: 'center',
        }
    ]
    const columns_data1 = [
        ...columns,
        {
            field: '외국인', headerName: '외국계', width: 45,
            align: 'right', headerAlign: 'center',
            renderCell: (params) => renderProgress(params)
        }
    ]
    const columns_data2 = [...columns,
    {
        field: '기관계', headerName: '기관계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '투신', headerName: '투신', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '보험기타금융', headerName: '보험', width: 35,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '연기금', headerName: '연기금', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '기타법인', headerName: '기타법인', width: 40,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }]
    const columns_data3 = [...columns,
    {
        field: '외국인', headerName: '외국계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    }, {
        field: '기관계', headerName: '기관계', width: 45,
        align: 'right', headerAlign: 'center',
        renderCell: (params) => renderProgress(params)
    },
    ]
    const indicators = [
        { name: 'table1', adjustWidth: '180px' },
        { name: 'table2', adjustWidth: '610px' },
        { name: 'table3', adjustWidth: '1200px' },
        // { name: 'table1', adjustWidth: '22px' },
        // { name: 'table2', adjustWidth: '465px' },
        // { name: 'table3', adjustWidth: '1110px' },
    ]
    const tableHeight = 440

    return (
        <>
            {/* Table */}
            <Grid item container spacing={1}>
                <Grid item xs={2.8}>
                    <TitleComponent title={'외국계'} statistics={statistics[0]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data1} columns={columns_data1} height={tableHeight} onParams={getStockCode} />
                </Grid>
                <Grid item xs={4.1}>
                    <TitleComponent title={'기관계 (#투신)'} statistics={statistics[1]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data2} columns={columns_data2} height={tableHeight} onParams={getStockCode} />
                </Grid>
                <Grid item xs={3.1}>
                    <TitleComponent title={'외국 기관 합산'} statistics={statistics[2]} ></TitleComponent>
                    <DataTable swiperRef={swiperRef} data={data3} columns={columns_data3} height={tableHeight} onParams={getStockCode} />
                </Grid>

                <Grid item xs={1}>
                    <StyledTypography>업종</StyledTypography>
                    <TableContainer sx={{ height: tableHeight - 45 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {data5 && data5.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data5.map(item => (
                                        <TableRow key={item.업종명} onClick={() => handleFilteredTable('업종명', item)}>
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.업종명.slice(0, 10)}</TableCell>
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}>{item.갯수}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }

                    </TableContainer>
                </Grid>

                <Grid item xs={1}>
                    <StyledTypography>테마</StyledTypography>
                    <TableContainer sx={{ height: tableHeight - 45 }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}>
                        {data6 && data6.length > 0 ?
                            <Table size='small'>
                                <TableBody>
                                    {data6.map(item => (
                                        <TableRow key={item.테마명} onClick={() => handleFilteredTable('테마명', item)}>
                                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }} >{item.테마명.slice(0, 11)}</TableCell>
                                            <TableCell size='small' sx={{ color: '#efe9e9ed', fontSize: '10px', p: 0.2 }}>{item.갯수}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            : <Skeleton />
                        }
                    </TableContainer>
                </Grid>
            </Grid>

            {/* Table 하단 컨트롤러 */}
            <Grid item container>
                {
                    Array.isArray(countBtn.table1) ?
                        indicators.map((indicator, index) => (
                            <Box key={indicator.name} sx={{ position: 'absolute', left: indicator.adjustWidth, top: `${tableHeight + 64}px`, zIndex: 90 }}>
                                <Grid container sx={{ width: '130px' }}>
                                    <Grid item xs={1} container direction="row" alignItems="center" sx={{ pr: 2 }}>
                                        {countBtn[indicator.name][0]}
                                    </Grid>
                                    <Grid item xs={8} container>
                                        <Slider
                                            value={countBtn[indicator.name]}
                                            // value={typeof countBtn[indicator.name] === 'number' ? countBtn[indicator.name] : countBtn[indicator.name][0]}
                                            onChange={(event, newValue) => handleValueChange(indicator.name, newValue)}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            min={1}
                                            max={consecutiveMax[indicator.name]}
                                            size="small"
                                            sx={{ color: '#efe9e9ed' }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} container justifyContent="flex-end" alignItems="center" sx={{ pl: 3 }}>
                                        {countBtn[indicator.name][1]}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                        : <Skeleton />
                }

            </Grid>
        </>
    )
}

// 재무, 매출구성, 주요주주, 차트, 기본정보, 

export const StockInfoFinnacial = ({ swiperRef, stock, stockChart, filteredDataTable, getStockCode }) => {
    const filteredDataTableCols = [
        { field: '종목명', headerName: '종목명', width: 73 },
        {
            field: '등락률', headerName: '등락률', width: 30,
            renderCell: (params) => {
                const row = params.row;
                const progress = renderProgressBar({ value: row.changeRate, valueON: true, val2: 5, color: '#e89191' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {params.value} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: '전일대비거래량', headerName: '전일대비', width: 55, renderCell: (params) => {
                const row = params.row;
                const progress = renderProgressBar({ value: row.volume, valueON: true, val2: 5, color: '#91bde8' })
                return (
                    <Box sx={{ position: 'relative', mt: -2 }}>
                        <Box sx={{ position: 'absolute', zIndex: 1 }}>
                            {parseInt(params.value).toLocaleString('kr')} %
                        </Box>
                        <Box sx={{ position: 'absolute', zIndex: 0, width: 100, mt: -0.6, marginLeft: -0.5 }}>
                            {progress}
                        </Box>
                    </Box>
                )
            }
        },
    ]

    return (
        <Grid item container spacing={1}>
            <Grid item container xs={3.5}>
                <Grid container>
                    <Financial annual={stock.연간실적} quarter={stock.분기실적} />
                </Grid>
                <Grid container sx={{ mt: 3 }}>
                    <EtcInfo product={stock.주요제품매출구성} shareholder={stock.주요주주} />
                </Grid>

            </Grid>
            <Grid item xs={4}>
                <StockChart stockItemData={stockChart.price} volumeData={stockChart.volume} timeSeries={stock.종목명} price={stock.현재가} />
            </Grid>
            <Grid item xs={3}>
                {stock.종목코드 === null ? '' :
                    <StockInfo data={stock} />
                }
            </Grid>
            <Grid item xs={1.5}>
                <FilteredDataTable swiperRef={swiperRef} data={filteredDataTable} columns={filteredDataTableCols} height={400} onParams={getStockCode} />
            </Grid>
        </Grid>
    )
}

