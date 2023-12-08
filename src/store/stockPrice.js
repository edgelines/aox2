import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API } from '../components/util/config'

// export const getStockPrice = createAsyncThunk("GET/STOCKPRICE", async () => {
//     const response = await axios.get(`${API}/abc/stockPrice`);
//     return response.data
// });

export const getStockSectorsThemes = createAsyncThunk("GET/STOCKSECTORSTHEMES", async () => {
    const response = await axios.get(`${API}/abc/stockSectorsThemes`);
    return response.data;
});

// export const StockPrice = createSlice({
//     name: "StockSectors",
//     initialState: [],
//     reducers: {},
//     extraReducers: {
//         [getStockPrice.fulfilled]: (state, { payload }) => [...payload],
//     },
// });

export const StockSectorsThemes = createSlice({
    name: "StockSectorsThemes",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockSectorsThemes.fulfilled]: (state, { payload }) => [...payload],
    },
});
