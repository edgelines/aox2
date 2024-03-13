import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'

// export const getStockSectors = createAsyncThunk("GET/STOCKSECTORS", async () => {
//     const res = await axios.get(`${API}/industry/stockSectors`);
//     return res.data;
// });

export const getKospi200BubbleCategory = createAsyncThunk("GET/Kospi200BubbleCategory", async () => {
    const res = await axios.get(`${API}/BubbleDataCategory`);
    return res.data;
});

export const getKospi200BubbleCategoryGruop = createAsyncThunk("GET/Kospi200BubbleCategoryGruop", async () => {
    const res = await axios.get(`${API}/BubbleDataCategoryGroup`);
    return res.data;
});

// export const StockSectors = createSlice({
//     name: "StockSectors",
//     initialState: [],
//     reducers: {},
//     extraReducers: {
//         [getStockSectors.fulfilled]: (state, { payload }) => [...payload],
//     },
// });

export const Kospi200BubbleCategory = createSlice({
    name: "Kospi200BubbleCategory",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKospi200BubbleCategory.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const Kospi200BubbleCategoryGruop = createSlice({
    name: "Kospi200BubbleCategoryGruop",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKospi200BubbleCategoryGruop.fulfilled]: (state, { payload }) => [...payload],
    },
});
