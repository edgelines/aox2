import useMediaQuery from '@mui/material/useMediaQuery';
export const API = process.env.REACT_APP_API_URL;
export const STOCK = process.env.REACT_APP_API_URL_STOCK;
export const API_WS = process.env.REACT_APP_API_URL_WS;
export const API_KAKAO = process.env.REACT_APP_API_KAKAO_SEND;


// Hook을 사용하는 커스텀 Hook으로 변경
export const useIsMobile = () => {
    return useMediaQuery('(max-width:600px)');
};