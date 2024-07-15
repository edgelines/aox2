import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PowerVolumeChart from './Motions/powerVolumeChart';
import IndustryChart from './Motions/IndustryChart';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import { API } from './util/config';


export default function MotionPage({ }) {
    const [dataset1, setDataset1] = useState({ time: [], data: [] });
    const [dataset2, setDataset2] = useState({ time: [], data: [] });
    const [dataset3, setDataset3] = useState({ time: [], data: [] });
    const [datasetIndustry, setDatasetIndustry] = useState({ time: [], data: [] });


    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    const [timeLineIndustry, setTimeLineIndustry] = useState(null);
    const [loadingPower, setLoadingPower] = useState(false);
    const [loadingRatio1, setLoadingRatio1] = useState(false);
    const [loadingRatio2, setLoadingRatio2] = useState(false);
    const [loadingRatio3, setLoadingRatio3] = useState(false);

    // const getDataPower = async (date) => {
    //     setLoadingPower(true);
    //     try {
    //         const res = await axios.get(`${API}/stockMotion/getPowerVolumeChart/${date}`)
    //         const tmp = res.data.Data.map(item => ({
    //             name: item.time,
    //             data: item.data,
    //         }))
    //         setDataset(tmp);
    //         setTimeLine(res.data.시간);
    //     } catch (error) {
    //         console.error("Error fetching data : ", error);
    //     } finally {
    //         setLoadingPower(false);
    //     }
    // }
    // const getDataIndustry = async (date) => {
    //     setLoadingIndustry(true);
    //     try {
    //         const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
    //         const tmp = res.data.Data.map(item => ({
    //             name: item.time,
    //             data: item.data,
    //         }))
    //         setDatasetIndustry(tmp);
    //         console.log(tmp);
    //         console.log(res.data.시간);
    //         setTimeLineIndustry(res.data.시간);
    //     } catch (error) {
    //         console.error("Error fetching data : ", error);
    //     } finally {
    //         setLoadingIndustry(false);
    //     }
    // }

    const getDataRatio = async (num, date, setLoading, setDataset) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }));
            setDataset(tmp);
            if (num === 3) {
                setTimeLine(res.data.시간);
            }
        } catch (error) {
            console.log("Error fetching data : ", error);
        } finally {
            setLoading(false)
        }
    }

    const getDataRatio3 = async (date) => {
        setLoadingRatio3(true);
        try {
            // const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
            const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/3/${date}`)
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }));
            setDataset3(tmp);
            setTimeLine(res.data.시간);
        } catch (error) {
            console.error("Error fetching data : ", error);
        } finally {
            setLoadingRatio3(false);
        }
    }
    const getDataRatio2 = async (date) => {
        setLoadingRatio2(true);
        try {
            // const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
            const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/2/${date}`)
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }));
            setDataset2(tmp);
            // setTimeLine(res.data.시간);
        } catch (error) {
            console.error("Error fetching data : ", error);
        } finally {
            setLoadingRatio2(false);
        }
    }
    const getDataRatio1 = async (date) => {
        setLoadingRatio1(true);
        try {
            // const res = await axios.get(`${API}/stockMotion/getIndustryChart/${date}`)
            const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/1/${date}`)
            const tmp = res.data.Data.map(item => ({
                name: item.time,
                data: item.data,
            }));
            setDataset1(tmp);
            // setTimeLine(res.data.시간);
        } catch (error) {
            console.error("Error fetching data : ", error);
        } finally {
            setLoadingRatio1(false);
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
            getDataRatio(3, date, setLoadingRatio3, setDataset3);
            getDataRatio(2, date, setLoadingRatio2, setDataset2);
            getDataRatio(1, date, setLoadingRatio1, setDataset1);
            // getDataPower(date);
            // getDataRatio3(date);
            // getDataRatio2(date);
            // getDataRatio1(date);
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
            <Grid item xs={5.6}>
                {
                    loadingRatio3 ?
                        <Skeleton animation="wave" height={415} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset3} timeLine={timeLine} height={415} title={'중복 3개 이상'} />
                }
                {
                    loadingRatio2 ?
                        <Skeleton animation="wave" height={415} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset2} timeLine={timeLine} height={415} title={'중복 2개'} />
                }
            </Grid>
            <Grid item xs={5.6}>
                {
                    loadingRatio1 ?
                        <Skeleton animation="wave" height={415} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset1} timeLine={timeLine} height={415} title={'중복 1개'} />
                }
            </Grid>
            {/* <Grid item xs={5.2}>
                {
                    loadingPower ?
                        <Skeleton animation="wave" height={600} /> :
                        <PowerVolumeChart dataset={dataset} timeLine={timeLine} date={date} datelist={datelist} />
                }
            </Grid> */}


        </Grid>

    )
}
