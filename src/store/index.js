import { configureStore } from "@reduxjs/toolkit";
// import createSagaMiddleware from 'redux-saga';
// import rootSaga from './rootSaga';
// import websocketReducer from './reducers/websocketReducer';

import { Kospi200BubbleCategoryGruop, Kospi200BubbleCategory } from "./stockSectors.js";
// import { StockSectorsThemes } from "./stockPrice.js";
// import { ABC } from "./AxBxC.js";
// import { ScheduleItemEvent } from "./info.js";
import { IndexMA, Vix, MarketDetail, Kospi200, Kospi, Kosdaq, Invers, Exchange } from "./indexData.js";
import { ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck } from "./ELW.js";
// import { StockSearch, StockSearchTracking, StockSearchTrackingStatistics } from './stockSearch.js';

// const sagaMiddleware = createSagaMiddleware();

export default configureStore({
    reducer: {
        Kospi200BubbleCategoryGruop: Kospi200BubbleCategoryGruop.reducer,
        Kospi200BubbleCategory: Kospi200BubbleCategory.reducer,
        IndexMA: IndexMA.reducer,

        Vix: Vix.reducer,

        ELW_monthTable: ELW_monthTable.reducer,
        ELW_CallPutRatio_Maturity: ELW_CallPutRatio_Maturity.reducer,
        // ElwWeightedAvg: ElwWeightedAvg.reducer,
        ElwWeightedAvgCheck: ElwWeightedAvgCheck.reducer,
        // ElwBarData: ElwBarData.reducer,

        MarketDetail: MarketDetail.reducer,
        Kospi200: Kospi200.reducer,
        Kospi: Kospi.reducer,
        Kosdaq: Kosdaq.reducer,
        Invers: Invers.reducer,
        // MarketKospi200: MarketKospi200.reducer,
        Exchange: Exchange.reducer,

        // WebSocket: websocketReducer,
    },
    // middleware: [sagaMiddleware]
})