## Script
    - npm run start: "webpack-dev-server --config webpack.dev.js",
    - npm run dev: "webpack --config webpack.dev.js",
    - npm run build: "webpack --config webpack.prod.js"
## Todo / Bug
- util/useInterval.jsx 테스트
  - 모델링페이지 동작여부 확인

### 2023.12.17~18
{dev-api}
- Commit.1
  - modelingPage - re-fetchData 코드 변경
  - FRED Data API 변경
  - PER-PBR API 변경
- Commit.2
  - CPI page 비율 조정
- Commit.3
  - mainPage API 변경
  - fundarmental 간격조절
### 2023.12.16
{dev-api}
- Commit.1
  - weather.jsx
    - API 변경
- Commit.2
  - weather.jsx
    - icon file path 변경

### 2023.12.15
{dev-api}
- Commit.1
  - fundarmental ( CPI )
    - Table Styling
- Commit.2
  - toggle handler if value===null추가 ( fundarmental.jsx 참고)
  - fundarmental ( CPI )
    - Category 클릭시 => SubChart 변경
    - ALL ~ Services 클릭 => 리셋
    - 일부 색상변경
- Commit3.
  - schedulePage.jsx
    - Table, Div, Chart 위치조정
    - API 수정
    - 신규상장 footer 
    - Non Metal 오류 수정

### 2023.12.14
{dev-api}
- Commit.1
  - fundarmental 
    - 좌우 비율, 간격조절
- Commit.2
  - fundarmental 
    - 서브카테고리명 표기
    - Main Chart Width 100%
    - fundarmentalChart 필요없는 부분 제거
- Commit.3
  - fundarmental 
    - Btn 추가
    - 최근5개월 데이터 테이블 추가

### 2023.12.13
{dev-api}
- Commit.1
  - modelingPage.jsx
    - Kospi200, Kospi, Kosdaq Action
  - CPI page.jsx : 가이드 완성
- Commit.2
  - FundarmentalChart 기간수정
  - 웹팩 output수정
- Commit.3
  - Fundarmental.jsx 요청사항
    - Grid 4:6
    - column rounded 1

### 2023.12.12
{dev-api}
- Commit.1
  - sectorSearchPage.jsx 업종차트 요구사항
    - rowHeigh, div Width 조절
- Commit.2
  - sectorSearchPage.jsx
    - columns Width adjust
    - table Heigh adjust
- Commit.3
  - sectorSearchPage.jsx
    - DataGrid FontSize adjust
    - 업종/테마 reduce 정보를 get 요청으로 변경
- Commit.4
  - 중복된 요청, reduce정보들 리팩토링

### 2023.12.09 ~ 2023.12.11
{dev-api}
- Commit.1
  - sectorsSearchPage.jsx
    - useEffect ABC1, ABC2 의존성배열 재정의
    - 전종목 2010년부터 저장, 거래정지된 종목들 0 뜨는 오류 해결
  - modelingPage.jsx
    - 코스피200, 코스피, 코스닥 작업중

### 2023.12.08
{dev-api}
- Commit.1
  - modelingPage.jsx
    - Williams 빨 , 주(14색), 형광색, 파란색, 하얀색
    - 보조지표 로직 수정
- Commit.2
  - sectorsSearchPage.jsx 리뉴얼
  - stockChart => williams API
  - store폴더 정리
  - modelingPage.jsx
    - WillR 5개 수치 수정.

### 2023.12.07
{dev-api}
- Commit.1
  - sectorsSearchPage.jsx
    - 종목코드 에러 해결
- Commit.2
  - fundarmentalPage1.jsx => API 변경
  - weightAvgPage3.jsx => MoneyIndex 이평 로직변경
- Commit.3
  - PBR.jsx, weightAvgPage3.jsx > PBR API 변경
- Commit.4
  - sectorSearchPage.jsx && TreeMap Loading 로직 수정

### 2023.12.06
{dev-api}
- Commit.1
  - stockThemesRank 누락 수정
- Commit.2
  - Vix, 업종명?=> 트리맵부분
- Commit.3
  - stockPrice => stockSectorsThemes API 변경
  - sectorsChartPage > 프레셋 C로 변경
- Commit.4
  - ABC.stockPrice => 티커->종목코드
  - App.jsx : sectorsChartPage > 프레셋 C로 변경
- Commit.5
  - exNow_US 호출 1번으로 변경
  - TreasuryStock fetchData 로직 수정
- Commit.6
  - exNow_US 누락 수정
- Commit.7
  - TreasuryStock.jsx 
    - 맨뒤로
    - Dmi부분 제거
  - schedulePage.jsx, textNews.jsx
    - WorldIndex => API변경
  - 종목 호출시 날짜/시/고/저/종 배열로 변경
  - CallPutPage => Vix 날짜 API 수정
  - indexData => indices로 명칭 변경


### 2023.12.04 ~ 2023.12.05
{dev-api}
- Commit.1
  - API 변경
    - stockSector, ipo, TextNews, Vix
  - sectorSearchPage.jsx 
    - 업종/전일대비 Table 업종 클릭시 테마 반환 API 
    - 업종 Top 10 완성

### 2023.12.01
{dev-api}
- Commit.1
  - Gunicorn Test
- Commit.2
  - StockPage.jsx
    - file => DB
- Commit.3
  - App.jsx : ABC 
- Commit.4
  - file => DB
    - exchange
    - stockItemByTheme
    - stockSectorsThemes
    - stockThemeRankInfo
  - info.js => 업종정보 / 테마정보 json => DB (진행중 sectorSearchPage.jsx에서 크게 바꿔야함)

### 2023.11.30
{dev-api}
- Commit.1
  - Mac Web Test

### 2023.11.28
{dev-api}
- Commit.1
  - CtpPage, detailPage  BarData 원위치

### 2023.11.27
{dev-api}
- Commit.1
  - CtpPage.jsx 
  - CallPutPage.jsx
  - detailPage.jsx
  - weightAvgPage3.jsx
- Commit.2
  - detailPage.jsx
    - exNow API 변경

### 2023.11.24
{master}
- Commit.1
  - StockSearchMonitoringPage, StockSearchPage 주석처리

### 2023.11.22
{master}
- Commit.1
  - StockSearchMonitoring.jsx
    - Text변경

### 2023.11.21
{dev-stock-dmi}
- Commit.1
  - stockSectorsGR.js
    - extraReducers status 추가
  - App.jsx
    - 리팩토링

### 2023.11.20
{dev-stock-dmi}
- Commit.1
  - 웹소켓 실패

### 2023.11.16
{dev-stock-dmi}
- Commit.1
  - StockChart > DMI 추가
- Commit.2
  - StockChart > StockDmiData 조건문 수정
- Commit.3
  - StockChart > Dmi 소수점 정리
- Commit.4
  - Chart Tooltip distance: 55, markerConfig 수정

### 2023.11.15
{master}
- Commit.1
  - StockSearch.jsx
    - Monitoring Table DMI 0 일경우 greenyellow
- Commit.2
  - StockSearch.jsx
    - Monitoring Table DMI 0 일경우 greenyellow > 소숫점 원복
- Commit.3
  - StockSearch.jsx
    - Preset 저장 후 Preset 재호출
- Commit.4
  - StcokSearchMonitoring.jsx
    - Columns Width 조절
- Commit.5
  - stockChart.jsx
    - 주봉에서 일부 이평선 제외
    - 툴팁시 마커제거, distance: 55,

### 2023.11.14
{master}
- Commit.1
  - StcokSearchMonitoring.jsx
    - 보조지표 컬럼 value 오류 수정
- Commit.2
  - StcokSearchMonitoring.jsx
    - 컬럼크기 일부 수정
  - StockSearch.jsx
    - 유보율, 부채비율 색 제거
- Commit.3
  - StockSearch.jsx
    - Preset 기능 추가
    - useMemo 활용.
    - Tracking > 검색일자 선택시 > 등락률 순으로 정렬

### 2023.11.13
{master}
- Commit.1
  - StockSearch.jsx
    - 달력 & 달력클릭시 해당하는 데이터 get
    - 첫로딩시 전체 데이터 처리
- Commit.2
  - NewPage
  |윌리엄스-5|윌리엄스-7|윌리엄스-14|ADR-7|ADR-14|ADR-20|D+Day|검색날짜|현재평균|상승%|상승갯수/전체갯수|
  |-80~-60 |-80~-60 |-80~-60 |100~110|........|Day 4|2023.11.09|0.5%|80%|80/100| 
  윌리엄스, ADR : 지수 보조지표
  범위는 검색당일의 최소값과 최대값의 범위
  D+Day는 검색당일과 현재간의 차이

### 2023.11.12
{master}  
- Commit.1
  - StockSearch.jsx
    - Monitoring Column 추가 ( 유보율, 부채비율 )

### 2023.11.10
{master}
- Commit.1
  - StockSearch.jsx
    - props 누락 수정
- Commit.2
  - StockSearch.jsx
    - Monitoring Column width 조절
    - Tracking Colmn width 조절

### 2023.11.09
{master}
- Commit.1
  - StockSearch.jsx
    - Monitoring | Tracking 구분
    - Tracking 
      - 현재가는 검색당시 종가 비교 후 색 표시
      - 등락률 표시 ( (item.현재가 - item.종가) / item.종가 ) 
    - Hook 조정

### 2023.11.08
{dev-stockSearch2}
- Commit.1
  - 일부 데이터들을 reduce에서 되돌아올때 재랜더링이됨
    - 원인은 status === 'succeeded'의 조건문일때 재랜더링 이슈가 생김
    - 기존처럼 state.data && state.data.lengh > 0  의 조건문일 경우 값만 바뀜
    - Store.js 전체 다 다시 작업
- Commit.2 || MacBook 작업
  - stockSearch.js
    - DMI_6,7 추가
    - 소숫점 1자리
- Commit.3 
  - StockSearch.jsx
    - DMI 3,4,5,6,7 || 0 ~ 10
    - Williams || -100 ~ -90
    -[x] Filter

### 2023.11.07
{master}
- Git 되돌림
  - 일부 데이터들을 reduce에서 되돌아올때 재랜더링이됨
{dev-stockSearch2}
- Store.js
  - indexData.js > MarketDetail ```initialState: { data: [], status: 'idle', error: null },```
  - stockSearch.js > indicators 추가
- StockSearch.jsx 진행중.
  - [x] Chart Copy
  - [x] Table
  - [ ] Filters
    - [x] DMI 
    - [ ] Williams
  - Mac > 종목별 실시간 윌리엄스(3개), DMI (1,2,3) > stock-mac 참고
- marketCurrentValue.jsx > MarketDetil reduce 파라미터 수정

### 2023.11.06
{master}
- Commit.1
  - PutCallPage 
    - TypeError : value.날짜.slice is not a function 해결
- Commit.2
  - Modeling Page 
    - Kospi200 Tooltip Remove
- Commit.3
  - Stock API 변경
  - CtpPage, weightAvgPage : Box vh -> px로 변경

### 2023.11.01
{master}
- 1st Commit
  - marketCurrentValue 
    - 조건문 오타

### 2023.10.31
{master}
- DetailPage : MarketDetail={MarketDetail} 추가
- Highcharts-Stock 마우스 휠로 기간 조절 > 원위치
- 깃 히스토리 삭제
- dist > 서버에서 자동 build
- 모델링페이지
  - 윌리엄스 수치, tooltip 위치조절
- 자기주식취득처분
  - Stock Chart 윌리엄스 수치 표기
  - 클릭이밴트 위치 조정
  - 취득/처분 업종명 마우스 오버 선택자

### 2023.10.30
{main}
- Webpack, Babel config
- 자기주식취득처분
  - 평단 표기 제외
  - 클릭 이벤트 재조정
  - Table 높이 조절
  - 평균단가가 0 이하인것들은 제외.
  - 취득/처분 Top3 -> Top5, 정렬 ( 갯수, 총액 )
  - 5분마다 데이터 새로고침
  - 취득/처분 업종 : 코스피/코스닥 구분
  - 업종삭제, willams 추가
    - 일봉14, 주봉 5,7
- 모델링페이지
  - ADR 조정, 윌리엄스 조정 구분, 현재값 표기
  - Vix, 환율,  지수 숫자 표기
- reduce : Exchange, MarketDetail
- Highcharts-Stock 마우스 휠로 기간 조절

### 2023.10.28
{dev-config}
- 자기주식취득/처분 페이지
  - 최대최소 1px, 점선
  - 평균단가 검은색선
  - 업종Top3 => 선택시 표에 반영
- StockChart - 가로세로 마우스 선
- Modeling Page
  - RSI, DMI 제거 
  - Williams 2개 ( 5,7 ) 한칸에 3개

### 2023.10.27
{dev-config}
- 자기주식취득/처분 페이지
  - 코스닥/코스피 버튼 ( 기본은 코스닥 )
  - 종목별 유보율, 부채비율, PBR (네이버 분기별) 표기  
  - 표에 나온 종목들의 업종들의 총합 Top3
  - 칼럼순서 : 취득처분, 종목명(하이라이트 : 셀 배경 회색), 현재가, 등락, 평균가, 총액, 마지막거래일, 유보율, 부채비율, PBR

### 2023.10.26
{dev-config}
- .env 설정

### 2023.10.25
- 자기주식취득/처분 페이지
  - 현재가 옆에 (평균가 대비 현재가 등락률 %)
  - 총액 => 백만원단위
  - 기본 : 취득
  - 표 넘버링
  - 옆에 차트에 평균가, 최대,최소 라인 표시, 표에서 최대최소 제외
  - 최대,최소 제외
  - 마지막거래일 : YYYY에서 YY로
  - 수익을 빨간색, 손해를 파랑색 ( 현재가, 등락률)
  - 밑 업종명 삭제, 종목명+업종명 차트 왼쪽상단에
  - 가격차트에 전일 : 글자 크게

### 2023.10.23
- TreasuryStock Page
  - 취득/처분 선택
  - 최종거래일 Chart 표기
  - Mui DataGrid 전체 표기가 안되는 부분은 Paging 때문이였음.

### 2023.10.19
- 자기주식 취득처분 거래일 내림차순
- 날씨 Chart 10월일경우 010 되는 부분 수정

### 2023.09.26
- detailPage US Data Axios Column 지난달43 => 지난달42로 바꿈 (오타)
- detailPage US Data Axios Column 지난달42 => 지난달43로 다시 변경

### 2023.09.15
- detailPage US Data Axios Column 지난달6 => 지난달5로 바꿈 (오타)
- 
### 2023.09.14
- GpoChart US5 오타 수정, 위치 살짝 내림

### 2023.09.08
- 창모드 높이로 변경
- MainPage 일별매매동향 최대-최소값 수정