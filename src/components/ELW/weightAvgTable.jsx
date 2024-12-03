import React from 'react';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, Skeleton } from '@mui/material';
import { useIsMobile } from '../util/config';


export default function MonthTable({ ELW_monthTable, fontSize, ELW_CallPutRatio_Maturity }) {
    const isMobile = useIsMobile();
    const fontSizeStyle = { fontSize: fontSize || isMobile ? '10px' : '0.875rem' }
    const tableStyle = { color: '#efe9e9ed', ...fontSizeStyle }
    const tableBodyStyle = { ...tableStyle, borderBottom: 'none' }
    const tableBodyStyle2 = { borderBottom: 'none', ...fontSizeStyle }
    const tableAvg = { color: 'greenyellow', borderBottom: 'none', borderTop: '1px solid #efe9e9ed', ...fontSizeStyle }
    return (
        <Grid container spacing={1} >
            <Grid item xs={12}>
                {
                    ELW_monthTable && ELW_monthTable.length > 0 ?
                        <>
                            <Table size="small" sx={{ color: '#efe9e9ed', borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding={'none'} sx={tableBodyStyle}></TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>잔존만기 : <span style={{ color: 'greenyellow' }}>{ELW_CallPutRatio_Maturity[0].title}</span></TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>잔존만기 : <span style={{ color: 'greenyellow' }}>{ELW_CallPutRatio_Maturity[1].title}</span></TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>잔존만기 : <span style={{ color: 'greenyellow' }}>{ELW_CallPutRatio_Maturity[2].title}</span></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding={'none'} sx={tableBodyStyle}></TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>
                                            C <span style={{ color: '#FCAB2F' }}>{ELW_CallPutRatio_Maturity[0].콜비율}</span>  : P <span style={{ color: '#00F3FF' }}>{ELW_CallPutRatio_Maturity[0].풋비율}</span>
                                        </TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>
                                            C <span style={{ color: '#FCAB2F' }}>{ELW_CallPutRatio_Maturity[1].콜비율}</span>  : P <span style={{ color: '#00F3FF' }}>{ELW_CallPutRatio_Maturity[1].풋비율}</span>
                                        </TableCell>
                                        <TableCell padding={'none'} sx={tableBodyStyle} align='center' colSpan={2}>
                                            C <span style={{ color: '#FCAB2F' }}>{ELW_CallPutRatio_Maturity[2].콜비율}</span>  : P <span style={{ color: '#00F3FF' }}>{ELW_CallPutRatio_Maturity[2].풋비율}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding={'none'} sx={{ color: 'greenyellow', fontWeight: 'bold' }} align='center'>X 가중</TableCell>
                                        {ELW_monthTable.slice(-3).map((item, index) => (
                                            <TableCell key={index} padding={'none'} sx={tableStyle} align='center' colSpan={2}>
                                                {parseInt(item.최종거래일.slice(5, 7))} 월 만기
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {['WA2', 'WA3', 'WA1'].map((wa, index) => {
                                        const 차이1 = ELW_monthTable[3][wa] - ELW_monthTable[0][wa]
                                        const 차이2 = ELW_monthTable[4][wa] - ELW_monthTable[1][wa]
                                        const 차이3 = ELW_monthTable[5][wa] - ELW_monthTable[2][wa]
                                        const color1 = 차이1 > 0 ? 'tomato' : 'deepskyblue';
                                        const color2 = 차이2 > 0 ? 'tomato' : 'deepskyblue';
                                        const color3 = 차이3 > 0 ? 'tomato' : 'deepskyblue';
                                        const name = ['WA2 - Top7 5일', 'WA3 - Top7 3일', 'WA1 - Top10 2일']
                                        return <TableRow key={index}>
                                            <TableCell sx={tableBodyStyle} align='center'>{name[index]}</TableCell>
                                            <TableCell sx={tableBodyStyle} align='center'>{ELW_monthTable[3][wa].toFixed(2)}</TableCell>
                                            <TableCell sx={{ ...tableBodyStyle2, color: color1 }} align='center'>{차이1.toFixed(2)}</TableCell>
                                            <TableCell sx={tableBodyStyle} align='center'>{ELW_monthTable[4][wa].toFixed(2)}</TableCell>
                                            <TableCell sx={{ ...tableBodyStyle2, color: color2 }} align='center'>{차이2.toFixed(2)}</TableCell>
                                            <TableCell sx={tableBodyStyle} align='center'>{ELW_monthTable[5][wa].toFixed(2)}</TableCell>
                                            <TableCell sx={{ ...tableBodyStyle2, color: color3 }} align='center'>{차이3.toFixed(2)}</TableCell>
                                        </TableRow>
                                    }
                                    )}
                                    <TableRow>
                                        <TableCell sx={tableAvg} align='center'>Avg.</TableCell>
                                        {['3', '4', '5'].map(idx => {
                                            const avg = (ELW_monthTable[idx]['WA2'] + ELW_monthTable[idx]['WA3'] + ELW_monthTable[idx]['WA1']) / 3;
                                            const diffAvg = (ELW_monthTable[idx]['WA2'] - ELW_monthTable[idx - 3]['WA2'] +
                                                ELW_monthTable[idx]['WA3'] - ELW_monthTable[idx - 3]['WA3'] +
                                                ELW_monthTable[idx]['WA1'] - ELW_monthTable[idx - 3]['WA1']) / 3;
                                            return (
                                                <>
                                                    <TableCell sx={tableAvg} align='center'>{avg.toFixed(2)}</TableCell>
                                                    <TableCell sx={tableAvg} align='center'>{diffAvg.toFixed(2)}</TableCell>
                                                </>
                                            );
                                        })}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </>
                        : <Skeleton variant="rectangular" animation="wave" />
                }
            </Grid>
        </Grid>
    )
}

