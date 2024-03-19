import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'


export const getVix = createAsyncThunk("GET/Vix", async () => {
    const response = await axios.get(`${API}/indices/VixMA?last=ture`);
    var tmp = response.data;
    // 최근데이터가 0, 전날이 1
    var 전일대비 = tmp[0].종가 - tmp[1].종가
    var 값 = tmp[0].종가.toFixed(2)
    return { value: 값, net: 전일대비.toFixed(2) };
});
// 오브젝트로 리턴할땐 바꿔줘야함.
export const Vix = createSlice({
    name: "Vix",
    initialState: {},
    reducers: {},
    extraReducers: {
        [getVix.pending]: (state) => {
            state.status = 'loading';
        },
        [getVix.fulfilled]: (state, { payload }) => { state.value = payload.value; state.net = payload.net; },
    },
});

export const getExchange = createAsyncThunk("GET/Exchange", async () => {
    const response = await axios.get(`${API}/exchange`);
    var value = response.data[0].환율
    var net = response.data[0].증감
    var comparison = response.data[0].변동
    return { value: value, comparison: comparison, net: net };
});
// 오브젝트로 리턴할땐 바꿔줘야함.
export const Exchange = createSlice({
    name: "Exchange",
    initialState: {},
    reducers: {},
    extraReducers: {
        [getExchange.pending]: (state) => {
            state.status = 'loading';
        },
        [getExchange.fulfilled]: (state, { payload }) => { state.value = payload.value; state.net = payload.net; state.comparison = payload.comparison; },
    },
});



export const getMarketDetail = createAsyncThunk("GET/MarketDetail", async () => {
    const response = await axios.get(`${API}/MarketDetail`);
    return response.data;
});


// export const VixMA = createSlice({
//     name: "VixMA",
//     initialState: [],
//     reducers: {},
//     extraReducers: {
//         [getVixMA.fulfilled]: (state, { payload }) => [...payload],
//     },
// });


export const MarketDetail = createSlice({
    name: "MarketDetail",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getMarketDetail.pending]: (state) => {
            state.status = 'loading';
        },
        [getMarketDetail.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getMarketDetail.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});
