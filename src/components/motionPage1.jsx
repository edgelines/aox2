import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PowerVolumeChart from './Motions/powerVolumeChart';
import IndustrykChart from './Motions/IndustryChart';
import { API, API_WS } from './util/config';


export default function MotionPage({ }) {
    const [dataset, setDataset] = useState({ time: [], data: [] });
    const [datasetIndustry, setDatasetIndustry] = useState({ time: [], data: [] });
    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    const [loadingPower, setLoadingPower] = useState(false);
    const [loadingIndustry, setLoadingIndustry] = useState(false);

    const getDataPower = async (date) => {
        setLoadingPower(true);
        try {
            const res = await axios.get(`${API}/stockMotion/getPowerVolumeChart/${date}`)
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }))
            setDataset(tmp);
            setTimeLine(res.data.시간);
        } catch (error) {
            console.error("Error fetching data : ", error);
        } finally {
            setLoadingPower(false);
        }
    }
    const getDataIndustry = async (date) => {
        setLoadingIndustry(true);
        try {
            const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }))
            setDatasetIndustry(tmp);
            setTimeLine(res.data.시간);
        } catch (error) {
            console.error("Error fetching data : ", error);
        } finally {
            setLoadingIndustry(false);
        }
    }

    const fetchData = async () => {
        const res = await axios.get(`${API}/stockMotion/getBusinessDay`);
        setDateList(res.data);
        setDate(res.data[0])
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (date !== null) {
            getDataPower(date);
            getDataIndustry(date);
        }
    }, [date])

    return (
        <Grid container spacing={1}>
            <Grid item xs={0.8}>
                <FormControl variant="standard" sx={{ minWidth: 100 }}>
                    <Select value={date} sx={{ color: '#efe9e9ed', fontSize: '12px' }}>
                        {datelist && datelist.length > 0 ?
                            datelist.map(item => (
                                <MenuItem value={item}>{item}</MenuItem>
                            )) : <></>
                        }
                    </Select>
                </FormControl>

            </Grid>
            <Grid item xs={6}>
                {
                    loadingIndustry ?
                        <Skeleton animation="wave" height={930} /> :
                        <IndustrykChart dataset={datasetIndustry} timeLine={timeLine} height={890} />
                }
            </Grid>
            <Grid item xs={5.2}>
                {
                    loadingPower ?
                        <Skeleton animation="wave" height={600} /> :
                        <PowerVolumeChart dataset={dataset} timeLine={timeLine} date={date} datelist={datelist} />
                }
            </Grid>


        </Grid>

    )
}
