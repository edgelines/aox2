import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API, myJSON } from '../components/util/config'

export const getStockSectors = createAsyncThunk("GET/STOCKSECTORS", async () => {
    const response = await axios.get(`${myJSON}/stockSectors`);
    const data = response.data.map((item, index) => ({
        업종명: item.업종명,
        전일대비: item.전일대비,
        id: index,
    }))
    return data;
});

export const getKospi200BubbleCategory = createAsyncThunk("GET/Kospi200BubbleCategory", async () => {
    const res = await axios.get(`${API}/BubbleDataCategory`);
    return res.data;
});

export const getKospi200BubbleCategoryGruop = createAsyncThunk("GET/Kospi200BubbleCategoryGruop", async () => {
    const res = await axios.get(`${API}/BubbleDataCategoryGroup`);
    return res.data;
});

export const StockSectors = createSlice({
    name: "StockSectors",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockSectors.fulfilled]: (state, { payload }) => [...payload],
    },
});

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
