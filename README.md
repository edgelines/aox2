## Script
    - npm run start: "webpack-dev-server --config webpack.dev.js",
    - npm run dev: "webpack --config webpack.dev.js",
    - npm run build: "webpack --config webpack.prod.js"

## Todo / Bug
- 새 검색식
  - BackEnd : 종목별 실시간 윌리엄스(3개), DMI (1,2,3)ß
- 자기주식취득처분
  - 취득/처분 업종명 마우스 오버 선택자

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