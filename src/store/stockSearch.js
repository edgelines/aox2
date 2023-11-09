import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API, MAC } from '../components/util/config'

export const getStockSearch = createAsyncThunk("GET/STOCKSEARCH", async () => {
    const response = await axios.get(`${API}/StockSearch`);
    const data = response.data.map((item, index) => ({
        ...item,
        id: index,
        willR_5: item.willR_5.toFixed(1),
        willR_7: item.willR_7.toFixed(1),
        willR_14: item.willR_14.toFixed(1),
        willR_20: item.willR_20.toFixed(1),
        willR_33: item.willR_33.toFixed(1),
        DMI_3: item.DMI_3.toFixed(1),
        DMI_4: item.DMI_4.toFixed(1),
        DMI_5: item.DMI_5.toFixed(1),
        DMI_6: item.DMI_6.toFixed(1),
        DMI_7: item.DMI_7.toFixed(1),
    }))
    return data;
});

export const StockSearch = createSlice({
    name: "StockSectors",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getStockSearch.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getStockSearch.pending]: (state) => {
            state.status = 'loading'; // 로딩 상태 설정
        },
        [getStockSearch.rejected]: (state, action) => {
            state.status = 'failed'; // 실패 상태 설정
            state.error = action.error.message; // 에러 메시지 저장
        }
    },
});

export const getStockSearchTracking = createAsyncThunk("GET/STOCKSEARCHTRACKING", async () => {
    const response = await axios.get(`${MAC}/StockSearch/Tracking`);
    const data = response.data.map((item, index) => ({
        ...item,
        id: index,
        등락률: ((item.현재가 - item.종가) / item.종가 * 100).toFixed(1),
    }))
    return data;
});

export const StockSearchTracking = createSlice({
    name: "StockSearchTracking",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getStockSearchTracking.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getStockSearchTracking.pending]: (state) => {
            state.status = 'loading'; // 로딩 상태 설정
        },
        [getStockSearchTracking.rejected]: (state, action) => {
            state.status = 'failed'; // 실패 상태 설정
            state.error = action.error.message; // 에러 메시지 저장
        }
    },
});
