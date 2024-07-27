import React, { useState, useEffect, useRef } from 'react';
import { TableContainer, Table, TableHead, TableBody } from '@mui/material';

export const CountTable = ({ name, data, swiperRef, height, handleClick, handleReset, selectedIndustry, selectedThemes }) => {

    return (
        <div
            onMouseEnter={() => swiperRef.current.mousewheel.disable()}
            onMouseLeave={() => swiperRef.current.mousewheel.enable()}
        >
            <TableContainer sx={{ height: height }}>
                <Table size='small'>
                    <TableHead>
                        <tr style={{ fontSize: '11px' }}>
                            <td style={{}} onClick={() => handleReset(name)} >{name}</td>
                            <td style={{ textAlign: 'left' }} >#</td>
                        </tr>
                    </TableHead>

                    <TableBody>
                        {
                            data && data.length > 0 ?
                                data.map(item => {
                                    const category = name === '업종' ? item.업종명 : item.테마명
                                    const isSelectedIndustry = selectedIndustry.includes(category)
                                    const isSelectedThemes = selectedThemes.includes(category)
                                    return (
                                        <tr style={{ fontSize: '11px', p: 2 }} key={`${category}_${item.갯수}`}>
                                            <td style={{ width: '120px', color: isSelectedIndustry || isSelectedThemes ? 'tomato' : '#efe9e9ed' }} onClick={() => handleClick(name, category)}>
                                                {name == '업종' ? item.업종명.slice(0, 8) : item.테마명}
                                            </td>
                                            <td style={{ width: '40px', textAlign: 'left' }}>{item.갯수}</td>
                                        </tr>
                                    )
                                })
                                : <>Loading</>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}