import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON } from '../components/util/config'

// const JSON = process.env.REACT_APP_API_JSON_URL;
export const getABC1 = createAsyncThunk("GET/ABC1", async () => {
    const response = await axios.get(`${myJSON}/main1_ThemeBySecByItem_df`);
    return response.data;
});
export const getABC2 = createAsyncThunk("GET/ABC2", async () => {
    const response = await axios.get(`${myJSON}/main2_ThemeBySecByItem_df`);
    return response.data;
});

export const ABC1 = createSlice({
    name: "AxBxC1",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getABC1.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const ABC2 = createSlice({
    name: "AxBxC2",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getABC2.fulfilled]: (state, { payload }) => [...payload],
    },
});
