import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'


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
        [getElwWeightedAvgCheck.fulfilled]: (state, { payload }) => { state.Mean = payload.Mean; state.CTP1 = payload.CTP1; state.CTP15 = payload.CTP15; state.CTP2 = payload.CTP2; state.status = 'succeeded'; },
        [getElwWeightedAvgCheck.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

export const getELW_monthTable = createAsyncThunk("GET/ELW_monthTable", async () => {
    const res = await axios.get(`${API}/elwMonthTable`)
    return res.data.slice(-6);
});
export const ELW_monthTable = createSlice({
    name: "ELW_monthTable",
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getELW_monthTable.pending]: (state) => { state.status = 'loading'; },
        [getELW_monthTable.fulfilled]: (state, { payload }) => { state.data = payload; state.status = 'succeeded'; },
        [getELW_monthTable.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
    initialState: {},
    reducers: {},
});

export const ELW_CallPutRatio_Maturity = createSlice({
    name: "ELW_CallPutRatio_Maturity",
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
        [getELW_CallPutRatio_Maturity.fulfilled]: (state, { payload }) => { state.M1 = payload.M1; state.M2 = payload.M2; state.M3 = payload.M3; state.status = 'succeeded'; },
        [getELW_CallPutRatio_Maturity.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});


export const getElwBarData = createAsyncThunk("GET/elwBarData", async () => {
    const res = await axios.get(`${API}/elwBarData`)
    return res.data
});

export const ElwBarData = createSlice({
    name: "ElwBarData",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getElwBarData.pending]: (state) => {
            state.status = 'loading';
        },
        [getElwBarData.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getElwBarData.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

export const getElwWeightedAvg = createAsyncThunk("GET/elwWeightedAvg", async () => {
    const res = await axios.get(`${API}/elwWeightedAvg`)
    return res.data;
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
        [getElwWeightedAvg.pending]: (state) => { state.status = 'loading'; },
        [getElwWeightedAvg.fulfilled]: (state, { payload }) => { state.data = payload; state.status = 'succeeded' },
        [getElwWeightedAvg.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }

    },
});

