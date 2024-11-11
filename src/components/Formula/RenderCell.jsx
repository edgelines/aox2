import React, { useState, useEffect, useRef } from 'react';

export const williamsColor = (value) => {
    let color = null;
    if (value >= -20) {
        color = 'tomato';
    } else if (value >= -35) {
        color = 'orange';
    } else if (value >= -50) {
        color = 'gold';
    } else if (value >= -65) {
        color = 'yellow';
    } else if (value >= -80) {
        color = '#98da77';
    } else {
        color = 'dodgerblue';
    }
    return color;
}

/**
 * 종가지수 캔들모양 셀 렌더링
 * value가 2 이면 ■, 1이면 ㅗ, -2이면 ■, -1이면 ㅗ
 * 고점==종가, 고점>종가, 저점==종가, 저점<종가 표기
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderMaCell = (params) => {
    if (!params.value || typeof params.value === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    const color = params.value > 0 ? '#FCAB2F' : 'deepskyblue';
    const shape = params.value == 2 ? '■' : params.value == 1 ? 'ㅗ' : params.value == -2 ? '■' : params.value == -1 ? 'ㅗ' : '';
    return <span style={{ color, fontWeight: 'bold' }}> {shape}</span>;
};


/**
 * Williams 셀 렌더링
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderWilliamsCell = (params) => {
    // export const renderWilliamsCell = (params, key, columnsName = 'WillR') => {
    if (!params.value || typeof params.value === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    if (typeof params.value !== 'number') return <span> </span>;
    const color = williamsColor(params.value);
    return <span style={{ backgroundColor: color, width: 55, color: '#404040' }}>{params.value}</span>
    // if (!params.row[columnsName] || typeof params.row[columnsName][key] === 'undefined') {
    //     return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    // }
    // console.log(params.value);
    // const _value = params.row[columnsName][key]
    // if (typeof _value !== 'number') return <span> </span>;
    // const color = williamsColor(_value);
    // return <span style={{ backgroundColor: color, width: 55, color: '#404040' }}>{_value}</span>
}


/**
 * TRIX 셀 렌더링
 * @param {*} params : mui grid params row
 * @param {*} key1 : TRIX value
 * @param {*} key2 : TRIX signal
 * @returns 
 */
export const renderTrixCell = (params, key1, key2) => {
    if (!params.row.TRIX || typeof params.row.TRIX[key1] === 'undefined' || typeof params.row.TRIX[key2] === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }

    const _value = params.row.TRIX[key1]
    const _signal = params.row.TRIX[key2]
    if (typeof _value !== 'boolean') return <span> </span>;
    if (typeof _signal !== 'boolean') return <span> </span>;
    const color = _value === true ? '#FCAB2F' : 'deepskyblue';
    return <>
        <span style={{ color }}> {_value === false ? '▼' : '▲'}</span>
        <span>{_signal === false ? '' : '√'}</span>
    </>
}


/**
 * CCI 전일값 비교
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderCciCell_Keys = (params, key) => {
    if (!params.row.CCI || typeof params.row.CCI[key] === 'undefined' || typeof params.row.CCI[`x_${key}`] === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }

    const _value = params.row.CCI[key]
    const _xValue = params.row.CCI[`x_${key}`]
    if (typeof _value !== 'number') return <span> </span>;
    if (typeof _xValue !== 'number') return <span> </span>;
    const color = _value - _xValue > 0 ? 'tomato' : 'deepskyblue';
    const sub_value = _value - _xValue;
    return <span> {_value} <span style={{ color }}> ({sub_value > 0 ? `+${sub_value}` : sub_value})</span> </span>
}

/**
 * CCI 셀 렌더링
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderCciCell = (params, key) => {
    if (!params.value || typeof params.value === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    if (typeof params.value !== 'number') return <span> </span>;
    return params.value
}

/**
 * DMI 색상 반환
 * @param {*} value : DMI value
 * @returns color
 */
export const dmiColor = (value) => {
    let color = null;
    if (value <= 3) {
        color = '#7F7F7F'
    } else if (value <= 10) {
        color = 'dodgerblue'
    } else if (value <= 20) {
        color = '#658956'
    } else if (value <= 30) {
        color = '#ADC719'
    } else if (value <= 40) {
        color = 'orange'
    } else if (value <= 50) {
        color = '#CA7824'
    } else if (value <= 60) {
        color = '#C7503D'
    } else {
        color = '#F60ECA'
    }
    return color;
}

/**
 * DMI 셀 렌더링
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderDmiCell = (params) => {
    if (typeof params.value !== 'number') return <span> </span>;
    const color = dmiColor(params.value);
    return <span style={{ backgroundColor: color, width: 55, color: '#404040' }}>{params.value}</span>
}

/**
 * Short 셀 렌더링
 * @param {*} params : mui grid params row
 * @param {*} key : Short value
 * @returns 
 */
export const renderShortCell = (params, key) => {
    if (!params.row.Short || typeof params.row.Short[key] === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    const _value = params.row.Short[key]
    if (typeof _value !== 'boolean') return <span> </span>;
    return <span> {_value === false ? '' : '★'}</span>
}


/**
 * 시가삼각가중 돌파 여부
 * @param {*} params : mui grid params row
 * @returns 
 */
export const renderCrossTRIMA = (params) => {
    if (!params.value || typeof params.value === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }

    if (typeof params.value !== 'boolean') return <span> </span>;
    return <span> {params.value === false ? '' : '★'}</span>
}

/**
 * 당일 Envelope 골든/데드/ Env 밑에 있는지 확인 여부
 * @param {*} params : mui grid params row
 * @param {*} key : Envelope 여부
 * @returns boolean
 */
export const renderCrossEnvelope = (params, key) => {
    if (!params.row.Envelope || typeof params.row.Envelope[key] === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    const _value = params.row.Envelope[key]
    if (typeof _value !== 'boolean') return <span> </span>;
    return <span> {_value === false ? '' : '★'}</span>
}

/**
 * 당일 Envelope 골든/데드/ Env 밑에 있는지 확인 여부
 * @param {*} params : mui grid params row
 * @returns boolean
 */
export const renderEnvelopePercent = (params, name) => {
    if (!params.row.Envelope || typeof params.row.Envelope[name] === 'undefined') {
        return <span> </span>; // CROSS가 없거나 key가 없을 경우 빈 span 반환
    }
    const _value = params.row.Envelope[name]['key']
    if (typeof _value !== 'number') return <span>{String(_value)}</span>;
    return <span> {String(_value)}</span>
}

