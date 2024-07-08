import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock'
import { Table, TableBody, TableCell, TableHead, TableRow, Grid, ToggleButton, ToggleButtonGroup, Skeleton, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { API } from '../util/config';
require('highcharts/modules/accessibility')(Highcharts)

const NaverDataLabPage = ({ swiperRef }) => {
    const [cid, setCid] = useState('50000002');
    const [timeUnit, setTimeUnit] = useState('date');
    const [getKey, setGetKey] = useState('Keyword');
    const [tableData, setTableData] = useState([]);

    const [mapping, setMapping] = useState([])
    const [chartData, setChartData] = useState([]);
    // 랜더링 변수
    const [loading, setLoading] = useState(true);
    // const [renderNum, setRenderNum] = useState(0);
    // ToggleButtonGroup
    const handleChange = (event, newAlignment, sectors) => {
        if (sectors === '섹터') {
            setCid(newAlignment);
        } else if (sectors === '일주월') {
            setTimeUnit(newAlignment);
        } else if (sectors === '구분') {
            setGetKey(newAlignment);
        }
    };
    // Table 클릭시
    const handleTableClick = async (keyword) => {
        const key = getKeywordNum(keyword) // { keyword : '', number : ''}

        // chartData에 keyword가 있는지 확인
        const checking = chartData.find(data => data.name === key.keyword)
        if (checking) {
            setChartData(chartData.filter(data => data.name !== key.keyword))
        } else {
            try {
                const res = await axios.get(`${API}/NaverDataLab/${getKey}/${timeUnit}/${key.number}`)
                const data = res.data.map(d => [new Date(d.date).getTime(), d.rank])
                setChartData([...chartData, { name: key.keyword, data: data }])
            } catch (error) {
                console.log('handleTableClick : ', error)
            }
        }
    }
    // 키워드를 mapping DB에서 Num으로 반환
    const getKeywordNum = (keyword) => {
        return mapping.find(data => data.keyword === keyword)
    }
    const fetchData = async () => {
        try {
            const mappingRes = await axios.get(`${API}/NaverDataLab/${getKey}/${timeUnit}/mapping`)
            setMapping(mappingRes.data);
            setLoading(false);

            if (!loading) {
                // console.log('mapping : ', mapping);
                const response = await axios.get(`${API}/NaverDataLab_Detail/${getKey}_${timeUnit}_${cid}`);
                // const response = await axios.get(`${myJSON}/naverDataLab_${getKey}_${timeUnit}_${cid}`);
                setTableData(response.data);
                // console.log('response.data[11].ranks[0].keyword : ', response.data[11].ranks[0].keyword);
                // var key0 = getKeywordNum(response.data[11].ranks[0].keyword);
                // var key1 = getKeywordNum(response.data[11].ranks[1].keyword);
                // var key2 = getKeywordNum(response.data[11].ranks[2].keyword);
                var key0 = mapping.find(data => data.keyword === response.data[11].ranks[0].keyword);
                var key1 = mapping.find(data => data.keyword === response.data[11].ranks[1].keyword);
                var key2 = mapping.find(data => data.keyword === response.data[11].ranks[2].keyword);
                const requests = [key0, key1, key2].map(key =>
                    axios.get(`${API}/NaverDataLab/${getKey}/${timeUnit}/${key.number}`)
                );
                const responses = await Promise.all(requests);
                const newChartData = responses.map(response =>
                    response.data.map(d => [new Date(d.date).getTime(), d.rank])
                );

                const chartData = [key0, key1, key2].map((key, index) => ({
                    name: key.keyword,
                    data: newChartData[index],
                }));
                setChartData(chartData);
                // console.log('fetchData > chartData : ', chartData);
            }
        } catch (error) {
            console.log(error);
        }
        // finally {
        //     console.log('finally > chartData : ', chartData);
        // }
    };


    useEffect(() => {
        fetchData();
    }, [cid, timeUnit, getKey, loading]);


    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={5}>
                        <ToggleButtonGroup
                            size="small"
                            value={cid}
                            exclusive
                            onChange={(event, newAlignment) => handleChange(event, newAlignment, '섹터')}
                            aria-label="Platform"
                        >
                            <StyledToggleButton value="50000002">화장품</StyledToggleButton>
                            <StyledToggleButton value="50000006">식품</StyledToggleButton>
                            <StyledToggleButton value="50000003">디지털/가전</StyledToggleButton>
                            <StyledToggleButton value="50000007">스포츠/레저</StyledToggleButton>
                            <StyledToggleButton value="50000008">생활건강</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={2}>
                        <ToggleButtonGroup
                            size="small"
                            value={getKey}
                            exclusive
                            onChange={(event, newAlignment) => handleChange(event, newAlignment, '구분')}
                            aria-label="Platform"
                        >
                            <StyledToggleButton value="Keyword">분야별 인기 검색어</StyledToggleButton>
                            <StyledToggleButton value="Category">인기분야</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={3}>
                        <ToggleButtonGroup
                            size="small"
                            value={timeUnit}
                            exclusive
                            onChange={(event, newAlignment) => handleChange(event, newAlignment, '일주월')}
                            aria-label="Platform"
                        >
                            <StyledToggleButton value="date">일간</StyledToggleButton>
                            <StyledToggleButton value="week">주간</StyledToggleButton>
                            <StyledToggleButton value="month">월간</StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                </Grid>
                <Grid item xs={12}>
                    {chartData ?
                        <NaverDataLabChart chartData={chartData} /> : <Skeleton variant="rectangular" height={400} animation="wave" />}
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: '43vh', marginLeft: '1vw' }}
                        onMouseEnter={() => swiperRef.current.mousewheel.disable()}
                        onMouseLeave={() => swiperRef.current.mousewheel.enable()}
                    >
                        <TableContainer sx={{ height: '43vh', overflowY: 'scroll', borderBottom: '1px solid #ccc ' }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead >
                                    <TableRow >
                                        <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }}>Date</TableCell>
                                        {tableData.map((data, index) => (
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }} key={index}>{data.date}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {Array.from({ length: 10 }).map((_, rankIndex) => (
                                        <TableRow key={rankIndex}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }}>{rankIndex + 1}</TableCell>
                                            {tableData.map((data, index) => (
                                                <TableCell sx={{ color: '#efe9e9ed', fontSize: '12px' }} key={index}
                                                    onClick={() => handleTableClick(data.ranks[rankIndex].keyword)}
                                                >{data.ranks[rankIndex].keyword}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    color: '#efe9e9ed', // 비활성화 상태에서의 글자색
    '&.Mui-selected': { // 활성화 상태에서의 스타일
        backgroundColor: '#efe9e9ed', // 활성화 상태에서의 배경색
        color: '#404040', // 활성화 상태에서의 글자색
        '&:hover': { // 마우스 오버 상태에서의 스타일
            backgroundColor: '#d8d8d8', // 마우스 오버 상태에서의 배경색
        },
    },
    '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
        backgroundColor: '#505050', // 비활성화 상태에서의 마우스 오버 배경색
    },
}));


export default NaverDataLabPage;


const NaverDataLabChart = ({ chartData }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            Highcharts.stockChart(chartRef.current, {
                chart: { animation: false, type: 'spline', height: 450, backgroundColor: '#404040' },
                credits: { enabled: false },
                rangeSelector: {
                    enabled: false,
                },
                title: { text: null },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        style: { fontSize: '9px', color: '#efe9e9ed' }, y: 15, formatter: function () {
                            return Highcharts.dateFormat('%m.%d', this.value);
                        }
                    },
                },
                yAxis: {
                    title: { text: null },
                    reversed: true,
                    labels: {
                        // y: 20,
                        style: {
                            color: '#efe9e9ed',
                            fontSize: '12px'
                        },
                    },
                },
                navigation: { buttonOptions: { enabled: false } },
                navigator: { enabled: false, },
                legend: {
                    enabled: true, align: 'left', verticalAlign: 'top',
                    symbolRadius: 4,
                    symbolWidth: 25,
                    symbolHeight: 15,
                    itemDistance: 25,
                    itemStyle: { color: '#efe9e9ed', fontSize: '12px', fontWeight: '400' },
                    itemHiddenStyle: { color: "#000000" },
                    itemHoverStyle: { color: "gold" },
                },
                tooltip: { shared: true, crosshairs: true },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        marker: {
                            symbol: 'circle',
                            radius: 6,
                        },
                        animation: false,
                        lineWidth: 2.4,
                    },
                },
                series: chartData.map((item, index) => {
                    const colors = ['magenta', 'gold', 'greenyellow', 'aqua', 'honeydew'];
                    return {
                        name: item.name,
                        data: item.data,
                        color: colors[index],
                    };
                })
            });
        }
    }, [chartData])

    return (
        <div ref={chartRef} />
    )
}
