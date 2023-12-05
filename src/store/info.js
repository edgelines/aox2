import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API, myJSON } from '../components/util/config'

// 테마에 속한 종목정보 가져오기
export const getStockThemeByItem = createAsyncThunk("GET/StockThemeByItem", async () => {
    // const response = await axios.get(`${myJSON}/stockThemeByItem`);
    const response = await axios.get(`${API}/info/ThemeStocksCollection`);
    return response.data;
});

export const StockThemeByItem = createSlice({
    name: "StockThemeByItem",
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getStockThemeByItem.pending]: (state) => {
            state.status = 'loading';
        },
        [getStockThemeByItem.fulfilled]: (state, { payload }) => {
            state.data = payload;
            state.status = 'succeeded';
        },
        [getStockThemeByItem.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

// 업종에 속한 종목정보 가져오기
export const getStockSectorByItem = createAsyncThunk("GET/StockSectorByItem", async () => {
    const response = await axios.get(`${API}/info/stockSectorByItem`);
    return response.data;
});

export const StockSectorByItem = createSlice({
    name: "StockSectorByItem",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockSectorByItem.fulfilled]: (state, { payload }) => [...payload],
    },
});

// 검색 정보 가져오기 [{search : '이지홀딩스', 'separator' : '종목'}, {search : '돼지', 'separator' : '테마'} ... ]
export const getSearchInfo = createAsyncThunk("GET/StockSearchInfo", async () => {
    const response = await axios.get(`${API}/formula/stockSearchInfo`);
    // const response = await axios.get(`${myJSON}/stockSearchInfo`);
    return response.data;
});

export const SearchInfo = createSlice({
    name: "SearchInfo",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getSearchInfo.fulfilled]: (state, { payload }) => [...payload],
    },
});

// 날짜별 종목별 이벤트 정보 가져오기 [{"date":"2023-07-03","item":"KC코트렐","event":"권리락(유상증자)"},{"date":"2023-07-03","item":"큐라티스","event":"추가상장(CB전환 및 주식전환)"},{"date":"2023-07-03","item":"한일단조","event":"추가상장(CB전환)"},{"date":"2023-07-03","item":"인산가","event":"추가상장(CB전환)"},{"date":"2023-07-03","item":"소프트센","event":"추가상장(CB전환)"}
export const getScheduleItemEvent = createAsyncThunk("GET/ScheduleItemEvent", async () => {
    const response = await axios.get(`${API}/schedule/StockEvent`);
    return response.data;
});

export const ScheduleItemEvent = createSlice({
    name: "ScheduleItemEvent",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getScheduleItemEvent.fulfilled]: (state, { payload }) => [...payload],
    },
});