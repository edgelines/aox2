import { configureStore } from "@reduxjs/toolkit";
import { StockSectors, Kospi200BubbleCategoryGruop, Kospi200BubbleCategory } from "./stockSectors.js";
import { StockSectorsGR } from "./stockSectorsGR.js";
import { StockPrice, StockSectorsThemes } from "./stockPrice.js";
import { StockThemes } from "./stockThemes.js";
import { ABC1, ABC2 } from "./AxBxC.js";
import { StockThemeByItem, StockSectorByItem, SearchInfo, ScheduleItemEvent } from "./info.js";
import { IndexMA, VixMA, Vix, MarketDetail, Kospi200, Kospi, Kosdaq, Invers, MarketKospi200, Exchange } from "./indexData.js";
import { ELW_monthTable, ELW_CallPutRatio_Maturity, ElwWeightedAvg, ElwWeightedAvgCheck } from "./ELW.js";

export default configureStore({
    reducer: {
        StockSectorsGR: StockSectorsGR.reducer,
        StockSectors: StockSectors.reducer,
        Kospi200BubbleCategoryGruop: Kospi200BubbleCategoryGruop.reducer,
        Kospi200BubbleCategory: Kospi200BubbleCategory.reducer,
        StockPrice: StockPrice.reducer,
        StockSectorsThemes: StockSectorsThemes.reducer,
        StockThemes: StockThemes.reducer,
        ABC1: ABC1.reducer,
        ABC2: ABC2.reducer,
        StockThemeByItem: StockThemeByItem.reducer,
        StockSectorByItem: StockSectorByItem.reducer,
        SearchInfo: SearchInfo.reducer,
        ScheduleItemEvent: ScheduleItemEvent.reducer,
        IndexMA: IndexMA.reducer,
        VixMA: VixMA.reducer,
        Vix: Vix.reducer,

        ELW_monthTable: ELW_monthTable.reducer,
        ELW_CallPutRatio_Maturity: ELW_CallPutRatio_Maturity.reducer,
        ElwWeightedAvg: ElwWeightedAvg.reducer,
        ElwWeightedAvgCheck: ElwWeightedAvgCheck.reducer,

        MarketDetail: MarketDetail.reducer,
        Kospi200: Kospi200.reducer,
        Kospi: Kospi.reducer,
        Kosdaq: Kosdaq.reducer,
        Invers: Invers.reducer,
        MarketKospi200: MarketKospi200.reducer,
        Exchange: Exchange.reducer,

    }
})