import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
import { Grid, Box } from '@mui/material';
import ELW_BarChart from './BarChart.jsx';
// import { API } from '../util/config.jsx';


export default function CtpPage({ swiperRef, ElwBarData, ElwWeightedAvg }) {

    const [ELW_data1, setELW_data1] = useState([])
    const [ELW_data2, setELW_data2] = useState([])
    const [ELW_data3, setELW_data3] = useState([])
    const [ELW_data4, setELW_data4] = useState([])
    const [ELW_data5, setELW_data5] = useState([])
    const [ELW_data6, setELW_data6] = useState([])
    const [elwWeightedAvg, setElwWeightedAvg] = useState([])
    const ELW_data = [ELW_data1, ELW_data2, ELW_data3, ELW_data4, ELW_data5, ELW_data6]

    useEffect(() => {
        if (ElwBarData.data && ElwBarData.data.length > 0) {
            setELW_data1(ElwBarData.data[0]);
            setELW_data2(ElwBarData.data[1]);
            setELW_data3(ElwBarData.data[2]);
            setELW_data4(ElwBarData.data[3]);
            setELW_data5(ElwBarData.data[4]);
            setELW_data6(ElwBarData.data[5]);
        }
        if (ElwWeightedAvg.data && ElwWeightedAvg.data.length > 0) {
            setElwWeightedAvg(ElwWeightedAvg.data)
        }
    }, [ElwBarData, ElwWeightedAvg])

    return (
        <Grid container spacing={1}>
            {ELW_data.map((data, index) => (
                <React.Fragment key={index}>
                    <Grid item xs={4}>
                        <ELW_BarChart data={data} height={465} />
                        <Box sx={{ fontSize: '1.2rem', fontWeight: 600, position: 'absolute', transform: 'translate(2.8vw, -200px)', textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.2)', p: 1 }}>
                            {
                                elwWeightedAvg && elwWeightedAvg.length > index ?
                                    <>
                                        <Box>C: {data.콜비율} / P: {data.풋비율}</Box>
                                        <Box sx={{ color: '#FCAB2F' }}>C (가중): {elwWeightedAvg[index].콜.toFixed(2)}</Box>
                                        <Box sx={{ color: 'greenyellow' }}>X (가중) : {elwWeightedAvg[index].전체.toFixed(2)}</Box>
                                        <Box sx={{ color: 'tomato' }}>1/2 (단순) : {((elwWeightedAvg[index].콜 + elwWeightedAvg[index].풋) / 2).toFixed(2)}</Box>
                                        <Box sx={{ color: '#00F3FF' }}>P (가중): {elwWeightedAvg[index].풋.toFixed(2)}</Box>
                                    </>
                                    : ''
                            }
                        </Box>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    )
}
