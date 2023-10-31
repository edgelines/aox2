import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'
export const getELW_monthTable = createAsyncThunk("GET/ELW_monthTable", async () => {
    const res = await axios.get(`${API}/elwMonthTable`)
    return res.data.slice(-6);
});

export const getELWx = createAsyncThunk("GET/ELWx", async () => {
    const res = await axios.get(`${API}/ELWx`)
    var Month1_1일 = [], Month1_2일 = [], Month1_3일 = [], Month1_5일 = [], Month1 = [],
        Month2_1일 = [], Month2_2일 = [], Month2_3일 = [], Month2_5일 = [], Month2 = [],
        Month3_1일 = [], Month3_2일 = [], Month3_3일 = [], Month3_5일 = [], Month3 = [];
    res.data.map((value, index, array) => {
        Month1_1일.push(value['Month1_1일']);
        Month1_2일.push(value['Month1_2일'])
        Month1_3일.push(value['Month1_3일'])
        Month1_5일.push(value['Month1_5일'])
        Month2_1일.push(value['Month2_1일'])
        Month2_2일.push(value['Month2_2일'])
        Month2_3일.push(value['Month2_3일'])
        Month2_5일.push(value['Month2_5일'])
        Month3_1일.push(value['Month3_1일'])
        Month3_2일.push(value['Month3_2일'])
        Month3_3일.push(value['Month3_3일'])
        Month3_5일.push(value['Month3_5일'])
    })
    Month1 = Month1.concat(Month1_1일, Month1_2일, Month1_3일, Month1_5일)
    Month2 = Month2.concat(Month2_1일, Month2_2일, Month2_3일, Month2_5일)
    Month3 = Month2.concat(Month3_1일, Month3_2일, Month3_3일, Month3_5일)
    let Month1Min = Math.min(...Month1)
    let Month2Min = Math.min(...Month2)
    let Month3Min = Math.min(...Month3)
    const M1 = {
        series: [
            {
                zIndex: 3, name: "1일", color: "tomato", data: Month1_1일,
            }, {
                name: "2일", color: "gold", data: Month1_2일,
            }, {
                name: "3일", color: "greenyellow", data: Month1_3일,
            }, {
                name: "5일", color: "dodgerblue", data: Month1_5일, visible: false,
            }
        ], min: Month1Min
    }
    const M2 = {
        series: [
            {
                zIndex: 3, name: "1일", color: "tomato", data: Month2_1일,
            }, {
                name: "2일", color: "gold", data: Month2_2일,
            }, {
                name: "3일", color: "greenyellow", data: Month2_3일,
            }, {
                name: "5일", color: "dodgerblue", data: Month2_5일, visible: false,
            }
        ], min: Month2Min
    }
    const M3 = {
        series: [
            {
                zIndex: 3, name: "1일", color: "tomato", data: Month3_1일,
            }, {
                name: "2일", color: "gold", data: Month3_2일,
            }, {
                name: "3일", color: "greenyellow", data: Month3_3일,
            }, {
                name: "5일", color: "dodgerblue", data: Month3_5일, visible: false,
            }
        ], min: Month3Min
    }
    return { M1: M1, M2: M2, M3: M3, }
});

export const getELW_CallPutRatio_Maturity = createAsyncThunk("GET/ELW_CallPutRatio_Maturity", async () => {
    // const res = await axios.get(API + "ELWx")
    const res = await axios.get(`${API}/elwBarData`)
    var data1 = res.data.filter(item => item.월구분 === '1')
    var data2 = res.data.filter(item => item.월구분 === '2')
    var data3 = res.data.filter(item => item.월구분 === '3')
    const dataFilter = (data) => {
        var tmp1 = [], tmp2 = [], tmp3 = [], tmp4 = [], tmp5 = [], tmp6 = [], tmp7 = []
        data.forEach((value) => {
            tmp1.push(parseFloat(value.콜_5일평균거래대금));
            tmp2.push(parseFloat(value.콜_거래대금));
            tmp3.push(parseFloat(value.풋_5일평균거래대금));
            tmp4.push(parseFloat(value.풋_거래대금));
            tmp5.push(parseFloat(value.행사가));
            tmp6.push(parseFloat(Math.abs(value.콜_거래대금)));
            tmp7.push(parseFloat(Math.abs(value.풋_거래대금)));
        })
        var title = data[0].잔존만기;
        var sum1 = tmp6.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
        var sum2 = tmp7.reduce(function add(sum, currValue) { return sum + currValue; }, 0);
        var 비율 = ' [ C : <span style="color:greenyellow;">' + (sum1 / (sum1 + sum2)).toFixed(2) + '</span>, P : <span style="color:greenyellow;">' + (sum2 / (sum1 + sum2)).toFixed(2) + '</span> ]';
        var 콜범주 = 'Call ( ' + "<span style='color:greenyellow;'>" + parseInt(sum1 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
        var 풋범주 = 'Put ( ' + "<span style='color:greenyellow;'>" + parseInt(sum2 / 100000000).toLocaleString('ko-KR') + "</span>" + ' 억 )';
        return { title: title, 콜5일: tmp1, 콜: tmp2, 풋5일: tmp3, 풋: tmp4, 행사가: tmp5, 비율: 비율, 콜범주: 콜범주, 풋범주: 풋범주, 콜비율: (sum1 / (sum1 + sum2)).toFixed(2), 풋비율: (sum2 / (sum1 + sum2)).toFixed(2) }
    }
    return { M1: dataFilter(data1), M2: dataFilter(data2), M3: dataFilter(data3) }
});

export const getElwWeightedAvgCheck = createAsyncThunk("GET/elwWeightedAvgCheck", async () => {
    const res = await axios.get(`${API}/elwMonth1`)
    const data = res.data.slice(-5)[0]
    return {
        Mean: data.콜풋_가중평균.toFixed(1), CTP1: data['1일'].toFixed(1), CTP15: data['1_5일'].toFixed(1), CTP2: data['1_5일'].toFixed(1),
    }

});
export const ElwWeightedAvgCheck = createSlice({
    name: "elwWeightedAvgCheck",
    initialState: {
        Mean: [], CTP1: [], CTP15: [], CTP2: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getElwWeightedAvgCheck.pending]: (state) => {
            state.status = 'loading';
        },
        [getElwWeightedAvgCheck.fulfilled]: (state, { payload }) => { state.Mean = payload.Mean; state.CTP1 = payload.CTP1; state.CTP15 = payload.CTP15; state.CTP2 = payload.CTP2; },
        [getElwWeightedAvgCheck.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

export const getElwWeightedAvg = createAsyncThunk("GET/elwWeightedAvg", async () => {
    const res = await axios.get(`${API}/elwWeightedAvg`)
    return { data: res.data };
});
export const ElwWeightedAvg = createSlice({
    name: "elwWeightedAvg",
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getElwWeightedAvg.pending]: (state) => {
            state.status = 'loading';
        },
        [getElwWeightedAvg.fulfilled]: (state, { payload }) => { state.data = payload.data; },
        [getElwWeightedAvg.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
        // [getElwWeightedAvg.fulfilled]: (state, { payload }) => { return [...payload] },
    },
});






export const ELW_monthTable = createSlice({
    name: "ELW_monthTable",
    initialState: {},
    reducers: {},
    extraReducers: {
        [getELW_monthTable.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const ELWx = createSlice({
    name: "ELWx",
    initialState: {
        M1: [],
        M2: [],
        M3: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getELWx.pending]: (state) => {
            state.status = 'loading';
        },
        [getELWx.fulfilled]: (state, { payload }) => { state.M1 = payload.M1; state.M2 = payload.M2; state.M3 = payload.M3; },
        [getELWx.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});
export const ELW_CallPutRatio_Maturity = createSlice({
    name: "ELW_monthTable",
    initialState: {
        M1: [],
        M2: [],
        M3: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getELW_CallPutRatio_Maturity.pending]: (state) => {
            state.status = 'loading';
        },
        [getELW_CallPutRatio_Maturity.fulfilled]: (state, { payload }) => { state.M1 = payload.M1; state.M2 = payload.M2; state.M3 = payload.M3; },
        [getELW_CallPutRatio_Maturity.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});
