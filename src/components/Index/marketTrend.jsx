import React from 'react';
import { numberWithCommas } from '../util/util';
import { Box, Skeleton, Table } from '@mui/material';

export default function MarketTrendData({ TrendData }) {
    const 매매동향당일누적스타일 = { borderRight: '1px solid #757575' }
    return (
        <>
            {TrendData.status === 'succeeded' ?
                <Table sx={{ fontSize: '0.8rem', borderBottom: '1px solid #efe9e9ed', }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan={2} style={매매동향당일누적스타일}>외국인</th>
                            <th colSpan={2} style={매매동향당일누적스타일}>기관</th>
                            <th colSpan={2} >개인</th>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #efe9e9ed' }}>
                            <th style={매매동향당일누적스타일} >거래소</th>
                            <th style={매매동향당일누적스타일} >당일</th>
                            <th style={매매동향당일누적스타일} >누적</th>
                            <th style={매매동향당일누적스타일} >당일</th>
                            <th style={매매동향당일누적스타일} >누적</th>
                            <th style={매매동향당일누적스타일} >당일</th>
                            <th >누적</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TrendData.data.map((value, index) => (
                            <tr key={index}>
                                {value.구분 === '코스피200' ?
                                    <td style={{ color: 'greenyellow', ...매매동향당일누적스타일 }}>{value.구분}</td> : <td style={매매동향당일누적스타일}>{String(value.구분).replace('단위:', '')}</td>
                                }
                                {value.외국인 > 0 ?
                                    <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인)}</td>
                                    : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인)}</td>
                                }
                                {value.외국인_누적 > 0 ?
                                    <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인_누적)}</td>
                                    : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.외국인_누적)}</td>
                                }
                                {value.기관 > 0 ?
                                    <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관)}</td>
                                    : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관)}</td>
                                }
                                {value.기관_누적 > 0 ?
                                    <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관_누적)}</td>
                                    : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.기관_누적)}</td>
                                }
                                {value.개인 > 0 ?
                                    <td style={{ color: '#FCAB2F', ...매매동향당일누적스타일 }}>{numberWithCommas(value.개인)}</td>
                                    : <td style={{ color: '#00F3FF', ...매매동향당일누적스타일 }}>{numberWithCommas(value.개인)}</td>
                                }
                                {value.개인_누적 > 0 ?
                                    <td style={{ color: '#FCAB2F' }}>{numberWithCommas(value.개인_누적)}</td>
                                    : <td style={{ color: '#00F3FF' }}>{numberWithCommas(value.개인_누적)}</td>
                                }

                            </tr>
                        )
                        )}
                    </tbody>
                </Table>
                : <Skeleton variant="rounded" height={300} animation="wave" />
            }
            <Box sx={{ textAlign: 'right' }}>단위 : 콜/풋옵션 백만원, 그외 억원</Box>
        </>
    )
}