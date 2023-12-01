import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON, API } from '../components/util/config'

// const JSON = process.env.REACT_APP_API_JSON_URL;
export const getABC = createAsyncThunk("GET/ABC", async () => {
    const response = await axios.get(`${API}/abc/themeBySecByItem`);
    return { data1: response.data[0], data2: response.data[1] };
});
export const ABC = createSlice({
    name: "AxBxC",
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getABC.pending]: (state) => {
            state.status = 'loading';
        },
        [getABC.fulfilled]: (state, { payload }) => {
            state.data1 = payload.data1;
            state.data2 = payload.data2;
            state.status = 'succeeded';
        },
        [getABC.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

// export const getABC1 = createAsyncThunk("GET/ABC1", async () => {
//     const response = await axios.get(`${myJSON}/main1_ThemeBySecByItem_df`);
//     return response.data;
// });
// export const getABC2 = createAsyncThunk("GET/ABC2", async () => {
//     const response = await axios.get(`${myJSON}/main2_ThemeBySecByItem_df`);
//     return response.data;
// });


// export const ABC1 = createSlice({
//     name: "AxBxC1",
//     initialState: [],
//     reducers: {},
//     extraReducers: {
//         [getABC1.fulfilled]: (state, { payload }) => [...payload],
//     },
// });
// export const ABC2 = createSlice({
//     name: "AxBxC2",
//     initialState: [],
//     reducers: {},
//     extraReducers: {
//         [getABC2.fulfilled]: (state, { payload }) => [...payload],
//     },
// });
