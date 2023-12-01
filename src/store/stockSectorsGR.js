import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON, API } from '../components/util/config'

export const getStockSectorsGR = createAsyncThunk("GET/STOCKSECTORSGR", async () => {
    const response = await axios.get(`${API}/stockSectorsGR`);
    // const response = await axios.get(`${myJSON}/stockSectorsGR`);
    const data = response.data.map((item) => ({
        업종명: item['업종명'],
        NOW: item['NOW'],
        TOM: item['TOM'],
        B1: item['B-1'],
        B2: item['B-2'],
        data: [item['B-7'], item['B-6'], item['B-5'], item['B-4'], item['B-3'], item['B-2'], item['B-1'], item['TOM'], item['NOW']]
    }))
    return data;
});

export const StockSectorsGR = createSlice({
    name: "StockSectorsGR",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getStockSectorsGR.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getStockSectorsGR.pending]: (state) => {
            state.status = 'loading'; // 로딩 상태 설정
        },
        [getStockSectorsGR.rejected]: (state, action) => {
            state.status = 'failed'; // 실패 상태 설정
            state.error = action.error.message; // 에러 메시지 저장
        }
        // [getStockSectorsGR.fulfilled]: (state, { payload }) => [...payload],
    },
});
