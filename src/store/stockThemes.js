import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON } from '../components/util/config'

export const getStockThemes = createAsyncThunk("GET/STOCKTHEMES", async () => {
    const response = await axios.get(`${myJSON}/stockThemeRankInfo`);
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