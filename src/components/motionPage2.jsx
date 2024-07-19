import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Skeleton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import RatioVolumeTrendScatterChart from './Motions/ratioVolumeTrendScatterChart.jsx'
import { API } from './util/config.jsx';


export default function MotionPage2({ swiperRef }) {

    // config
    const chartHeight = 900

    // state
    const [dataset1Count, setDataset1Count] = useState(null);
    const [dataset1, setDataset1] = useState({ time: [], data: [] });
    const [datelist, setDateList] = useState(null);
    const [date, setDate] = useState(null);
    const [timeLine, setTimeLine] = useState(null);
    // const [timeLineIndustry, setTimeLineIndustry] = useState(null);
    // const [loadingPower, setLoadingPower] = useState(false);
    const [loadingRatio1, setLoadingRatio1] = useState(false);
    // const [loadingRatio2, setLoadingRatio2] = useState(false);
    // const [loadingRatio3, setLoadingRatio3] = useState(false);


    const getDataRatio = async (num, date, setLoading, setDataset, setDatasetCount) => {
        setLoading(true);
        try {
            // const res = await axios.get(`http://localhost:2440/api/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);
            const res = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterChart/${num}/${date}`);
            const tmp = res.data.Data.map(item => ({
                time: item.time,
                data: item.data,
            }));
            setDataset(tmp);
            setTimeLine(res.data.시간);
            const count = await axios.get(`${API}/stockMotion/getRatioVolumeTrendScatterCount/${num}/${date}`);
            setDatasetCount(count.data.Data);
            // if (num === 3) {

            // }
        } catch (error) {
            console.log("Error fetching data : ", error);
        } finally {
            setLoading(false)
        }
    }

    const handleEventChange = (event) => { if (event !== null) { setDate(event.target.value); } }

    const fetchData = async () => {
        const res = await axios.get(`${API}/stockMotion/getBusinessDay`);
        setDateList(res.data);
        setDate(res.data[0])
        // console.log(dayjs(res.data[0]))
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (date !== null) {
            // getDataRatio(3, date, setLoadingRatio3, setDataset3);
            // getDataRatio(2, date, setLoadingRatio2, setDataset2);
            getDataRatio(1, date, setLoadingRatio1, setDataset1, setDataset1Count);
        }
    }, [date])

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                {
                    loadingRatio1 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart
                            dataset={dataset1} timeLine={timeLine} height={chartHeight} title={'중복 1개'} swiperRef={swiperRef}
                            datasetCount={dataset1Count}
                        />
                }



                {/* {
                    loadingRatio3 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset3} timeLine={timeLine} height={chartHeight} title={'중복 3개 이상'} />
                } */}

                <Grid item container direction="row" justifyContent="flex-start" sx={{ height: 100, mt: 2 }}>
                    <FormControl variant="standard" sx={{ minWidth: 100 }}>
                        <Select
                            onChange={handleEventChange}
                            value={date} sx={{ color: '#efe9e9ed', fontSize: '12px' }}>
                            {datelist && datelist.length > 0 ?
                                datelist.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                )) : <></>
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                {/* {
                    loadingRatio2 ?
                        <Skeleton animation="wave" height={chartHeight} /> :
                        <RatioVolumeTrendScatterChart dataset={dataset2} timeLine={timeLine} height={chartHeight} title={'중복 2개'} />
                } */}
            </Grid>

        </Grid>

    )
}
