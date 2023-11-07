import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'

export const getStockSearch = createAsyncThunk("GET/STOCKSEARCH", async () => {
    const response = await axios.get(`${API}/StockSearch`);
    const data = response.data.map((item, index) => ({
        ...item,
        id: index,
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

