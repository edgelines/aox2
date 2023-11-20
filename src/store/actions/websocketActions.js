export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT';
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT';

export const websocketConnect = () => ({ type: WEBSOCKET_CONNECT });
export const websocketDisconnect = () => ({ type: WEBSOCKET_DISCONNECT });
export const websocketMessage = message => ({ type: WEBSOCKET_MESSAGE, payload: message });

export const WEBSOCKET_CONNECT_WA_1 = 'WEBSOCKET_CONNECT_WA_1';
export const WEBSOCKET_CONNECT_WA_2 = 'WEBSOCKET_CONNECT_WA_2';
export const WEBSOCKET_MESSAGE_WA_1 = 'WEBSOCKET_MESSAGE_WA_1';
export const WEBSOCKET_MESSAGE_WA_2 = 'WEBSOCKET_MESSAGE_WA_2';
export const WEBSOCKET_DISCONNECT_WA_1 = 'WEBSOCKET_DISCONNECT_WA_1';
export const WEBSOCKET_DISCONNECT_WA_2 = 'WEBSOCKET_DISCONNECT_WA_2';

export const websocketConnectWA1 = () => ({ type: WEBSOCKET_CONNECT_WA_1 });
export const websocketConnectWA2 = () => ({ type: WEBSOCKET_CONNECT_WA_2 });
export const websocketDisconnectWA1 = () => ({ type: WEBSOCKET_DISCONNECT_WA_1 });
export const websocketDisconnectWA2 = () => ({ type: WEBSOCKET_DISCONNECT_WA_2 });
export const websocketMessageWA1 = message => ({ type: WEBSOCKET_MESSAGE_WA_1, payload: message });
export const websocketMessageWA2 = message => ({ type: WEBSOCKET_MESSAGE_WA_2, payload: message });
