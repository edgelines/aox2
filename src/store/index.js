import { configureStore } from "@reduxjs/toolkit";
// import createSagaMiddleware from 'redux-saga';
// import rootSaga from './rootSaga';
// import websocketReducer from './reducers/websocketReducer';

// import { Kospi200BubbleCategoryGruop, Kospi200BubbleCategory } from "./stockSectors.js";
// import { StockSectorsThemes } from "./stockPrice.js";
// import { ABC } from "./AxBxC.js";
// import { ScheduleItemEvent } from "./info.js";
import { Vix, MarketDetail, Exchange } from "./indexData.js";
import { ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvgCheck } from "./ELW.js";
// import { StockSearch, StockSearchTracking, StockSearchTrackingStatistics } from './stockSearch.js';

// const sagaMiddleware = createSagaMiddleware();

export default configureStore({
    reducer: {
        Vix: Vix.reducer,
        ELW_monthTable: ELW_monthTable.reducer,
        ELW_CallPutRatio_Maturity: ELW_CallPutRatio_Maturity.reducer,
        ElwWeightedAvgCheck: ElwWeightedAvgCheck.reducer,
        MarketDetail: MarketDetail.reducer,
        Exchange: Exchange.reducer,

        // WebSocket: websocketReducer,
    },
    // middleware: [sagaMiddleware]
})