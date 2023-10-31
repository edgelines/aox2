import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { JSON } from '../components/util/config'

export const getStockThemes = createAsyncThunk("GET/STOCKTHEMES", async () => {
    const response = await axios.get(`${JSON}/stockThemeRankInfo`);
    return response.data;
});

export const StockThemes = createSlice({
    name: "StockThemes",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockThemes.fulfilled]: (state, { payload }) => [...payload],
    },
});