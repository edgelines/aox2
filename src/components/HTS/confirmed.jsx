import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { API, STOCK } from '../util/config';
import { TrendTables, StockInfoFinnacial } from './commonComponents'

export function Confirmed({ swiperRef, market, time, date, apiReset, keywordPage }) {

    // Post Params
    const [paramsType, setParamsType] = useState('null');
    const [paramsName, setParamsName] = useState('null');

    // Table State
    const [dataOrigin, setDataOrigin] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [consecutiveMax, secConsecutiveMax] = useState({})
    const [countBtn, setCountBtn] = useState({
        table1: null, table2: null, table3: null
    })

    // Table Click > Filtered Table
    const [filteredDataTable, setFilteredDataTable] = useState([])

    // Infomation State
    const [stock, setStock] = useState({
        종목명: null, 종목코드: null,
    })
    const [stockChart, setStockChart] = useState({
        price: [], volume: []
    })


    const handleFilteredTable = async (type, item) => {
        setParamsType(type);
        const name = type === '업종명' ? item.업종명 : item.테마명
        setParamsName(name);
    }
    const handleValueChange = (type, newValue) => {
        setCountBtn(prev => ({
            ...prev,
            [type]: newValue

        }))
    };

    const getStockCode = async (params) => {
        // 시가총액, 상장주식수, PER, EPS, PBR, BPS
        const res = await axios.get(`${API}/info/stockEtcInfo/${params.종목코드}`);
        // console.log(res.data);
        setStock({
            종목명: params.종목명, 종목코드: params.종목코드, 업종명: params.업종명, 현재가: res.data.현재가,
            시가총액: res.data.시가총액, 상장주식수: res.data.상장주식수, PER: res.data.PER, EPS: res.data.EPS, PBR: res.data.PBR, BPS: res.data.BPS, 시장: res.data.시장,
            최고가52주: res.data.최고가52주, 최저가52주: res.data.최저가52주, 기업개요: res.data.기업개요, 분기실적: res.data.분기실적, 연간실적: res.data.연간실적,
            주요제품매출구성: res.data.주요제품매출구성, 주요주주: res.data.주요주주
        })
    }

    const getStockChartData = async (code) => {
        const res = await axios.get(`${STOCK}/get/${code}`);
        setStockChart({ price: res.data.price, volume: res.data.volume })
    }

    const fetchData = async (market, date, time, paramsType, paramsName, keywordPage) => {
        try {
            const postData = {
                type: paramsType,
                split: keywordPage,
                name: paramsName,
                market: market,
                date: date ? date : 'null',
                time: time ? time : 'null'
            }

            const res = await axios.post(`${API}/hts/findData`, postData)

            setDataOrigin(res.data);
            setData5(res.data.industry);
            setData6(res.data.themes);
            setStatistics(res.data.statistics);
            setCountBtn({
                table1: [res.data.consecutive[0].min, res.data.consecutive[0].max],
                table2: [res.data.consecutive[1].min, res.data.consecutive[1].max],
                table3: [res.data.consecutive[2].min, res.data.consecutive[2].max]
            })
            secConsecutiveMax({
                table1: res.data.consecutive[0].max,
                table2: res.data.consecutive[1].max,
                table3: res.data.consecutive[2].max
            })

            if (res.data.filtered && res.data.filtered.length > 0) {
                setFilteredDataTable(res.data.filtered);
            }

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    // 데이터 업데이트
    useEffect(() => { if (market != null && date != null) { fetchData(market, date, time, paramsType, paramsName, keywordPage); } }, [market, date, time, paramsType, paramsName, keywordPage]);
    useEffect(() => { setParamsType('null'); setParamsName('null'); }, [apiReset]);
    // useEffect(() => { if (market != null && date != null) { fetchData(market, date, time); } }, [market, date, time])

    // 외국계
    useEffect(() => {
        if (dataOrigin && dataOrigin.df1) {
            const filteredData = dataOrigin.df1.filter(item => (item['연속거래일'] >= countBtn.table1[0] && item['연속거래일'] <= countBtn.table1[1]));
            setData1(filteredData);
        }
    }, [countBtn.table1])

    // 기관계
    useEffect(() => {
        if (dataOrigin && dataOrigin.df2) {
            const filteredData = dataOrigin.df2.filter(item => (item['연속거래일'] >= countBtn.table2[0] && item['연속거래일'] <= countBtn.table2[1]));
            setData2(filteredData);
        }
    }, [countBtn.table2])

    // 외국기관 합산
    useEffect(() => {
        if (dataOrigin && dataOrigin.df3) {
            const filteredData = dataOrigin.df3.filter(item => (item['연속거래일'] >= countBtn.table3[0] && item['연속거래일'] <= countBtn.table3[1]));
            setData3(filteredData);
        }
    }, [countBtn.table3])

    // 5분 주기 업데이트
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        let delay;
        if (hour < 9 || (hour === 9 && minutes < 35)) {
            delay = ((9 - hour - 1) * 60 + (61 - minutes)) * 60 - seconds;
        } else {
            // 이미 9시 1분 이후라면, 다음 5분 간격 시작까지 대기 (예: 9시 3분이라면 9시 6분까지 대기)
            delay = (5 - (minutes - 1) % 5) * 60 - seconds;
        }
        // 9시 정각이나 그 이후의 다음 분 시작부터 1분 주기로 데이터 업데이트
        let intervalId;
        const startUpdates = () => {
            intervalId = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                const dayOfWeek = now.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6 && hour >= 9 && hour < 16) {
                    fetchData(market, date, time, paramsType, paramsName, keywordPage);
                } else if (hour >= 16) {
                    // 3시 30분 이후라면 인터벌 종료
                    clearInterval(intervalId);
                }
            }, 1000 * 60 * 5);
            return intervalId;
        };
        // 첫 업데이트 시작
        const timeoutId = setTimeout(() => {
            startUpdates();
        }, delay * 1000);

        // return () => clearTimeout(timeoutId);
        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [])

    // ChartData
    useEffect(() => {
        if (stock.종목코드 != null) { getStockChartData(stock.종목코드); }
    }, [stock])



    return (
        <Grid container>
            <TrendTables swiperRef={swiperRef} statistics={statistics} data1={data1} data2={data2} data3={data3} data5={data5} data6={data6} consecutiveMax={consecutiveMax} countBtn={countBtn}
                market={market} date={date} time={time}
                getStockCode={getStockCode} handleFilteredTable={handleFilteredTable} handleValueChange={handleValueChange} />

            {/* Information */}
            <StockInfoFinnacial swiperRef={swiperRef} stock={stock} stockChart={stockChart} filteredDataTable={filteredDataTable} getStockCode={getStockCode} />

        </Grid>
    )
}






// https://api.finance.naver.com/siseJson.naver?symbol=007860&requestType=1&startTime=20220601&endTime=20231228&timeframe=day
// https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:005930|SERVICE_RECENT_ITEM:005930&_callback=window.__jindo2_callback._3495