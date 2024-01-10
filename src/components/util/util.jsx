import React, { useEffect, useState } from 'react';
import { Divider, ListItem, ListItemText, ToggleButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export function TitleComponet({ primary, fontSize, textAlign }) {
    return (
        <>
            <ListItem>
                <ListItemText primary={primary} primaryTypographyProps={{ fontSize: fontSize || '11px', fontWeight: '600', lineHeight: '0px', textAlign: textAlign || 'left' }} />
            </ListItem>
            <Divider component="li" style={{ backgroundColor: 'lightgrey', height: 1 }} />
        </>
    )
}

export function numberWithCommas(num) {
    var parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

export const StyledToggleButton = styled(ToggleButton)(({ theme, fontSize, textAlign, color }) => ({
    backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    fontSize: fontSize ? fontSize : '8px',
    textAlign: textAlign ? textAlign : 'center',
    color: '#efe9e9ed', // 비활성화 상태에서의 글자색

    '&.Mui-selected': { // 활성화 상태에서의 스타일
        backgroundColor: '#efe9e9ed', // 활성화 상태에서의 배경색
        color: '#404040', // 활성화 상태에서의 글자색
        '&:hover': { // 마우스 오버 상태에서의 스타일
            backgroundColor: '#d8d8d8', // 마우스 오버 상태에서의 배경색
        },
    },
    '&.Mui-disabled': {
        backgroundColor: '#404040',
        color: '#efe9e9ed',
    },
    '&:hover': { // 비활성화 상태에서의 마우스 오버 스타일
        backgroundColor: '#505050', // 비활성화 상태에서의 마우스 오버 배경색
    },
}));

export const StyledButton = styled(Button)(({ theme, fontSize }) => ({
    backgroundColor: '#404040', // 비활성화 상태에서의 배경색
    fontSize: fontSize ? fontSize : '8px',
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

export const SectorsName15 = (name) => { // 업종명을 15개의 구분으로 전처리
    if (['디스플레이장비및부품', '반도체와반도체장비', '자동차', '자동차부품', '화학'].includes(name)) return '반도체1';
    if (['에너지장비및서비스', '전기장비', '전기제품', '전자장비와기기', '전자제품'].includes(name)) return '반도체2';
    if (['IT서비스', '게임엔터테인먼트', '소프트웨어', '방송과엔터테인먼트', '핸드셋'].includes(name)) return 'IT1';
    if (['컴퓨터와주변기기', '무역회사와판매업체', '무선통신서비스', '다각화된통신서비스', '디스플레이패널'].includes(name)) return 'IT2';
    if (['복합기업', '기타금융', '손해보험', '생명보험'].includes(name)) return '보험';
    if (['석유와가스', '가스유틸리티', '조선', '항공화물운송과물류', '해운사'].includes(name)) return '조선';
    if (['건설', '건축자재', '건축제품', '기계', '철강'].includes(name)) return '건설1';
    if (['운송인프라', '도로와철도운송', '비철금속', '우주항공과국방', '통신장비'].includes(name)) return '건설2';
    if (['부동산', '상업서비스와공급품', '은행', '증권', '창업투자'].includes(name)) return '금융';
    if (['가구', '가정용기기와용품', '인터넷과카탈로그소매', '가정용품', '판매업체'].includes(name)) return 'B2C';
    if (['생명과학도구및서비스', '생물공학', '제약'].includes(name)) return 'BIO1';
    if (['건강관리기술', '건강관리장비와용품', '건강관리업체및서비스'].includes(name)) return 'BIO2';
    if (['식품', '식품과기본식료품소매', '음료', '종이와목재', '포장재'].includes(name)) return '식품';
    if (['광고', '교육서비스', '양방향미디어와서비스', '화장품'].includes(name)) return '아웃도어1';
    if (['레저용장비와제품', '백화점과일반상점', '섬유', '항공사', '호텔'].includes(name)) return '아웃도어2';
    else return '없음';
}


export const DataTableStyleDefault = {
    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '.MuiDataGrid-columnHeaders': {
        minHeight: '30px !important',  // 원하는 높이 값으로 설정
        maxHeight: '30px !important',  // 원하는 높이 값으로 설정
        lineHeight: '30px !important',  // 원하는 높이 값으로 설정
        backgroundColor: 'rgba(230, 230, 230, 0.3)'
    },
}