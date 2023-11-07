import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'

export const getStockSearch = createAsyncThunk("GET/STOCKSEARCH", async () => {
    const response = await axios.get(`${API}/StockSearch`);
    const data = response.data.map((item, index) => ({
        ...item,
        id: index,
        willR_5: item.willR_5.toFixed(2),
        willR_7: item.willR_7.toFixed(2),
        willR_14: item.willR_14.toFixed(2),
        willR_20: item.willR_20.toFixed(2),
        willR_33: item.willR_33.toFixed(2),
        DMI_3: item.DMI_3.toFixed(2),
        DMI_4: item.DMI_4.toFixed(2),
        DMI_5: item.DMI_5.toFixed(2),
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

