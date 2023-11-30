import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API, myJSON, API_FILE } from '../components/util/config'

// IndexMA : MA50, MA112
export const getIndexMA = createAsyncThunk("GET/IndexMA", async () => {

    const res = await axios.get(`${API}/indexData/IndexMA`);

    const MA50 = [{
        name: '코스피 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kospi_MA50, type: 'spline', color: 'tomato', yAxis: 0, zIndex: 3, lineWidth: 1
    }, {
        name: '코스닥 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kosdaq_MA50, type: 'spline', color: 'dodgerblue', yAxis: 0, zIndex: 3, lineWidth: 1
    }, {
        name: '코스피200 MA50 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kospi200_MA50, type: 'spline', color: 'gold', yAxis: 0, zIndex: 3, lineWidth: 1
    }]
    const MA112 = [{
        name: '코스피 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kospi_MA112, type: 'spline', color: 'magenta', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
    }, {
        name: '코스닥 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kosdaq_MA112, type: 'spline', color: 'greenyellow', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
    }, {
        name: '코스피200 MA112 %', isPercent: true, marker: { enabled: false, states: { hover: { enabled: false } } },
        data: res.data.Kospi200_MA112, type: 'spline', color: '#efe9e9ed', yAxis: 0, zIndex: 3, dashStyle: 'ShortDash', lineWidth: 1
    }]
    return { MA50: MA50, MA112: MA112 };
});
export const IndexMA = createSlice({
    name: "IndexMA",
    initialState: {
        MA50: [],
        MA112: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [getIndexMA.pending]: (state) => {
            state.status = 'loading';
        },
        [getIndexMA.fulfilled]: (state, { payload }) => { state.MA50 = payload.MA50; state.MA112 = payload.MA112; },
        [getIndexMA.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

// MarketADR 
export const getMarketKospi200 = createAsyncThunk("GET/MarketKospi200", async () => {
    const res = await axios.get(`${API}/MarketKospi200`);
    return { data: res.data };
});
export const MarketKospi200 = createSlice({
    name: "MarketKospi200",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getMarketKospi200.pending]: (state) => {
            state.status = 'loading';
        },
        [getMarketKospi200.fulfilled]: (state, { payload }) => { state.data = payload.data; },
        [getMarketKospi200.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});

export const getVixMA = createAsyncThunk("GET/VixMA", async () => {
    const res = await axios.get(`${API_FILE}/indexData/VixMA`);
    const lineStyle = { type: 'spline', yAxis: 0, animation: false, zIndex: 3, marker: { enabled: false, states: { hover: { enabled: false } } }, }
    const hidenStyle = { dashStyle: 'shortdash', visible: false }
    return [{
        name: 'Vix',
        data: res.data.VIX,
        type: 'candlestick',
        yAxis: 0,
        upLineColor: "orangered",
        upColor: "orangered",
        lineColor: "dodgerblue",
        color: "dodgerblue",
        zIndex: 2,
        animation: false, isCandle: true,

    }, {
        ...lineStyle, ...hidenStyle, name: '2D', color: '#efe9e9ed', data: res.data.MA2, lineWidth: 1.5,
    }, {
        ...lineStyle, name: '3D', color: 'tomato', data: res.data.MA3, lineWidth: 1.5
    }, {
        ...lineStyle, ...hidenStyle, name: '4D', color: 'coral', data: res.data.MA4, lineWidth: 1.5,
    }, {
        ...lineStyle, name: '5D', color: 'gold', data: res.data.MA5, lineWidth: 1.5
    }, {
        ...lineStyle, ...hidenStyle, name: '6D', color: 'orange', data: res.data.MA6, lineWidth: 1.5,
    }, {
        ...lineStyle, ...hidenStyle, name: '9D', color: 'lime', data: res.data.MA9, lineWidth: 1.5,
    }, {
        ...lineStyle, ...hidenStyle, name: '10D', color: 'greenyellow', data: res.data.MA10, lineWidth: 1,
    }, {
        ...lineStyle, name: '12D', color: 'mediumseagreen', data: res.data.MA12, lineWidth: 1
    }, {
        ...lineStyle, ...hidenStyle, name: '15D', color: 'limegreen', data: res.data.MA15, lineWidth: 1,
    }, {
        ...lineStyle, name: '18D', color: 'skyblue', data: res.data.MA18, lineWidth: 1
    }, {
        ...lineStyle, ...hidenStyle, name: '20D', color: 'cadetblue', data: res.data.MA20, lineWidth: 1,
    }, {
        ...lineStyle, ...hidenStyle, name: '25D', color: 'violet', data: res.data.MA25, lineWidth: 1,
    }, {
        ...lineStyle, name: '27D', color: 'dodgerblue', data: res.data.MA27, lineWidth: 1
    }, {
        ...lineStyle, name: '36D', color: 'orchid', data: res.data.MA36, lineWidth: 1
    }, {
        ...lineStyle, name: '45D', color: 'pink', data: res.data.MA45, lineWidth: 1
    }, {
        ...lineStyle, name: '60D', color: 'magenta', data: res.data.MA60, lineWidth: 1
    }, {
        ...lineStyle, name: '112D', color: 'brown', data: res.data.MA112, lineWidth: 1
    }, {
        ...lineStyle, name: '224D', color: '#efe9e9ed', data: res.data.MA224, lineWidth: 1
    }];
});

export const getVix = createAsyncThunk("GET/Vix", async () => {
    const response = await axios.get(`${myJSON}/vix`);
    var tmp = response.data;
    var 전일대비 = tmp[tmp.length - 1].Close - tmp[tmp.length - 2].Close
    var 값 = tmp[tmp.length - 1].Close.toFixed(2)
    return { value: 값, net: 전일대비.toFixed(2) };
});
// 오브젝트로 리턴할땐 바꿔줘야함.
export const Vix = createSlice({
    name: "Vix",
    initialState: {},
    reducers: {},
    extraReducers: {
        [getVix.pending]: (state) => {
            state.status = 'loading';
        },
        [getVix.fulfilled]: (state, { payload }) => { state.value = payload.value; state.net = payload.net; },
    },
});

export const getExchange = createAsyncThunk("GET/Exchange", async () => {
    const response = await axios.get(`${myJSON}/exchange`);
    var value = response.data[0].환율
    var net = response.data[0].증감
    var comparison = response.data[0].변동
    return { value: value, comparison: comparison, net: net };
});
// 오브젝트로 리턴할땐 바꿔줘야함.
export const Exchange = createSlice({
    name: "Exchange",
    initialState: {},
    reducers: {},
    extraReducers: {
        [getExchange.pending]: (state) => {
            state.status = 'loading';
        },
        [getExchange.fulfilled]: (state, { payload }) => { state.value = payload.value; state.net = payload.net; state.comparison = payload.comparison; },
    },
});



export const getMarketDetail = createAsyncThunk("GET/MarketDetail", async () => {
    const response = await axios.get(`${API}/MarketDetail`);
    return response.data;
});
export const getInvers = createAsyncThunk("GET/Invers", async () => {
    const response = await axios.get(`${API}/Invers`);
    var Invers = []
    response.data.forEach((value, index, array) => {
        Invers.push([new Date(value.날짜).getTime(), value.시가, value.고가, value.저가, value.종가]);
    })
    return [{
        name: '인버스', id: 'candlestick', isCandle: true,
        data: Invers, type: 'candlestick', yAxis: 1, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: '#efe9e9ed',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '3 저지',
        lineWidth: 1,
        params: { index: 2, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'coral',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '9',
        lineWidth: 1,
        params: { index: 2, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'dodgerblue',
        name: '18',
        lineWidth: 1,
        params: { index: 2, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'skyblue',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '27',
        lineWidth: 1,
        params: { index: 2, period: 27 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'mediumseagreen',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '36',
        lineWidth: 1,
        params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'red',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '66',
        lineWidth: 1,
        params: { index: 2, period: 66 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "orange",
        name: '112',
        lineWidth: 2,
        params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "forestgreen",
        name: '224',
        lineWidth: 2,
        params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "pink",
        name: '336',
        lineWidth: 2,
        params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "magenta",
        name: '448',
        lineWidth: 2,
        params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "skyblue",
        name: '560',
        lineWidth: 2,
        params: { index: 2, period: 560 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }];
});
export const Invers = createSlice({
    name: "Invers",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getInvers.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const getKospi = createAsyncThunk("GET/Kospi", async () => {
    const response = await axios.get(`${API}/Kospi`);
    var Kospi = []
    response.data.forEach((value, index, array) => {
        Kospi.push([new Date(value.날짜).getTime(), value.시가, value.고가, value.저가, value.종가]);
    })
    return [{
        name: '코스피', id: 'candlestick', isCandle: true,
        data: Kospi, type: 'candlestick', yAxis: 1, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: '#efe9e9ed',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '3 저지',
        lineWidth: 1,
        params: { index: 2, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'coral',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '9',
        lineWidth: 1,
        params: { index: 2, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'dodgerblue',
        name: '18',
        lineWidth: 1,
        params: { index: 2, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'skyblue',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '27',
        lineWidth: 1,
        params: { index: 2, period: 27 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'mediumseagreen',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '36',
        lineWidth: 1,
        params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'red',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '66',
        lineWidth: 1,
        params: { index: 2, period: 66 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "orange",
        name: '112',
        lineWidth: 2,
        params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "forestgreen",
        name: '224',
        lineWidth: 2,
        params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "pink",
        name: '336',
        lineWidth: 2,
        params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "magenta",
        name: '448',
        lineWidth: 2,
        params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "skyblue",
        name: '560',
        lineWidth: 2,
        params: { index: 2, period: 560 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }];
});
export const Kospi = createSlice({
    name: "Kospi",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKospi.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const getKosdaq = createAsyncThunk("GET/Kosdaq", async () => {
    const response = await axios.get(`${API}/Kosdaq`);
    var Kosdaq = []
    response.data.forEach((value, index, array) => {
        Kosdaq.push([new Date(value.날짜).getTime(), value.시가, value.고가, value.저가, value.종가]);
    })
    return [{
        name: '코스닥', id: 'candlestick', isCandle: true,
        data: Kosdaq, type: 'candlestick', yAxis: 1, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: '#efe9e9ed',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '3 저지',
        lineWidth: 1,
        params: { index: 2, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'coral',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '9',
        lineWidth: 1,
        params: { index: 2, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'dodgerblue',
        name: '18',
        lineWidth: 1,
        params: { index: 2, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'skyblue',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '27',
        lineWidth: 1,
        params: { index: 2, period: 27 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'mediumseagreen',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '36',
        lineWidth: 1,
        params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'red',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '66',
        lineWidth: 1,
        params: { index: 2, period: 66 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "orange",
        name: '112',
        lineWidth: 2,
        params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "forestgreen",
        name: '224',
        lineWidth: 2,
        params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "pink",
        name: '336',
        lineWidth: 2,
        params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "magenta",
        name: '448',
        lineWidth: 2,
        params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "skyblue",
        name: '560',
        lineWidth: 2,
        params: { index: 2, period: 560 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }];
});
export const Kosdaq = createSlice({
    name: "Kosdaq",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKosdaq.fulfilled]: (state, { payload }) => [...payload],
    },
});
export const getKospi200 = createAsyncThunk("GET/Kospi200", async () => {
    const response = await axios.get(`${API}/Kospi200`);
    var Kospi200 = []
    response.data.forEach((value, index, array) => {
        Kospi200.push([new Date(value.날짜).getTime(), value.시가, value.고가, value.저가, value.종가]);
    })
    return [{
        name: '코스피200', id: 'candlestick', isCandle: true,
        data: Kospi200, type: 'candlestick', yAxis: 1, lineColor: 'dodgerblue', color: 'dodgerblue', upLineColor: 'orangered', upColor: 'orangered', zIndex: 2, animation: false, isCandle: true,
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: '#efe9e9ed',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '3 저지',
        lineWidth: 1,
        params: { index: 2, period: 3 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'coral',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '9',
        lineWidth: 1,
        params: { index: 2, period: 9 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'dodgerblue',
        name: '18',
        lineWidth: 1,
        params: { index: 2, period: 18 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true, visible: false,
        color: 'skyblue',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '27',
        lineWidth: 1,
        params: { index: 2, period: 27 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'mediumseagreen',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '36',
        lineWidth: 1,
        params: { index: 2, period: 36 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: 'red',
        dashStyle: 'shortdash',//라인 스타일 지정 옵션
        name: '66',
        lineWidth: 1,
        params: { index: 2, period: 66 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "orange",
        name: '112',
        lineWidth: 2,
        params: { index: 2, period: 112 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "forestgreen",
        name: '224',
        lineWidth: 2,
        params: { index: 2, period: 224 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "pink",
        name: '336',
        lineWidth: 2,
        params: { index: 2, period: 336 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "magenta",
        name: '448',
        lineWidth: 2,
        params: { index: 2, period: 448 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }, {
        type: 'ema', animation: false, yAxis: 1, linkedTo: 'candlestick', marker: { enabled: false, states: { hover: { enabled: false } } }, showInLegend: true,
        color: "skyblue",
        name: '560',
        lineWidth: 2,
        params: { index: 2, period: 560 }, // 시가, 고가, 저가, 종가 의 배열순서를 찾음
    }];
});
export const Kospi200 = createSlice({
    name: "Kospi200",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKospi200.fulfilled]: (state, { payload }) => [...payload],
    },
});



export const VixMA = createSlice({
    name: "VixMA",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getVixMA.fulfilled]: (state, { payload }) => [...payload],
    },
});


export const MarketDetail = createSlice({
    name: "MarketDetail",
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [getMarketDetail.pending]: (state) => {
            state.status = 'loading';
        },
        [getMarketDetail.fulfilled]: (state, { payload }) => {
            state.data = payload; // payload로 배열 데이터를 업데이트
            state.status = 'succeeded'; // 상태를 성공으로 변경
        },
        [getMarketDetail.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    },
});
