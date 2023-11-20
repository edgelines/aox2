import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON } from '../components/util/config'

export const getStockSectorsGR = createAsyncThunk("GET/STOCKSECTORSGR", async () => {
    const response = await axios.get(`${myJSON}/stockSectorsGR`);
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
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockSectorsGR.fulfilled]: (state, { payload }) => [...payload],
    },
});