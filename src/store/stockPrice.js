import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { myJSON, API } from '../components/util/config'

export const getStockPrice = createAsyncThunk("GET/STOCKPRICE", async () => {
    // const response = await axios.get(`${API}/abc/stockPrice`);
    // console.log(response.data);
    // return response.data
    const response = await axios.get(`${myJSON}/stockPrice`);
    const data = response.data.map((item, index) => ({
        ...item,
        전일대비거래량: parseInt(item['거래량평균%']),
        id: index,
    }))
    return data;
});

export const getStockSectorsThemes = createAsyncThunk("GET/STOCKSECTORSTHEMES", async () => {
    const response = await axios.get(`${myJSON}/stockSectorsThemes`);
    return response.data;
});

export const StockPrice = createSlice({
    name: "StockSectors",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockPrice.fulfilled]: (state, { payload }) => [...payload],
    },
});

export const StockSectorsThemes = createSlice({
    name: "StockSectorsThemes",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getStockSectorsThemes.fulfilled]: (state, { payload }) => [...payload],
    },
});
