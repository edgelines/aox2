import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'

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

