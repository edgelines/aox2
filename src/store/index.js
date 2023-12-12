import { configureStore } from "@reduxjs/toolkit";
// import createSagaMiddleware from 'redux-saga';
// import rootSaga from './rootSaga';
// import websocketReducer from './reducers/websocketReducer';

import { StockSectors, Kospi200BubbleCategoryGruop, Kospi200BubbleCategory } from "./stockSectors.js";
// import { StockSectorsThemes } from "./stockPrice.js";
import { ABC } from "./AxBxC.js";
import { SearchInfo, ScheduleItemEvent } from "./info.js";
import { IndexMA, VixMA, Vix, MarketDetail, Kospi200, Kospi, Kosdaq, Invers, MarketKospi200, Exchange } from "./indexData.js";
import { ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvg, ElwWeightedAvgCheck, ElwBarData } from "./ELW.js";
// import { StockSearch, StockSearchTracking, StockSearchTrackingStatistics } from './stockSearch.js';

// const sagaMiddleware = createSagaMiddleware();

export default configureStore({
    reducer: {
        StockSectors: StockSectors.reducer,
        Kospi200BubbleCategoryGruop: Kospi200BubbleCategoryGruop.reducer,
        Kospi200BubbleCategory: Kospi200BubbleCategory.reducer,
        // StockPrice: StockPrice.reducer,
        // StockSectorsThemes: StockSectorsThemes.reducer,
        ABC: ABC.reducer,
        // ABC1: ABC1.reducer,
        // ABC2: ABC2.reducer,
        // StockThemeByItem: StockThemeByItem.reducer,
        // StockSectorByItem: StockSectorByItem.reducer,
        // StockSearch: StockSearch.reducer,
        // StockSearchTracking: StockSearchTracking.reducer,
        // StockSearchTrackingStatistics: StockSearchTrackingStatistics.reducer,
        SearchInfo: SearchInfo.reducer,
        ScheduleItemEvent: ScheduleItemEvent.reducer,
        IndexMA: IndexMA.reducer,
        VixMA: VixMA.reducer,
        Vix: Vix.reducer,

        ELW_monthTable: ELW_monthTable.reducer,
        ELW_CallPutRatio_Maturity: ELW_CallPutRatio_Maturity.reducer,
        ElwWeightedAvg: ElwWeightedAvg.reducer,
        ElwWeightedAvgCheck: ElwWeightedAvgCheck.reducer,
        ElwBarData: ElwBarData.reducer,

        MarketDetail: MarketDetail.reducer,
        Kospi200: Kospi200.reducer,
        Kospi: Kospi.reducer,
        Kosdaq: Kosdaq.reducer,
        Invers: Invers.reducer,
        MarketKospi200: MarketKospi200.reducer,
        Exchange: Exchange.reducer,

        // WebSocket: websocketReducer,
    },
    // middleware: [sagaMiddleware]
})