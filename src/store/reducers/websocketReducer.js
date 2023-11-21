import { WEBSOCKET_MESSAGE, WEBSOCKET_MESSAGE_WA_1, WEBSOCKET_MESSAGE_WA_2 } from '../actions/websocketActions';

const initialState = {
    data: [],
    WA_1: [],
    WA_2: [],
    isConnected: false,
};

const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        // case WEBSOCKET_MESSAGE:
        //     return {
        //         ...state,
        //         data: [...state.data, action.payload]
        //     };
        case WEBSOCKET_MESSAGE_WA_1:
            return { ...state, WA_1: [...state.WA_1, action.payload] };
        case WEBSOCKET_MESSAGE_WA_2:
            return { ...state, WA_2: [...state.WA_2, action.payload] };
        // ... 기타 액션 처리
        default:
            return state;
    }
};

export default websocketReducer;
