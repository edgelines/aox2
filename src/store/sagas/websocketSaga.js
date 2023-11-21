import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, websocketMessage } from '../actions/websocketActions';
import { API_WS } from '../../components/util/config'
function createWebSocketChannel(socket) {
    return eventChannel(emit => {
        socket.onmessage = event => {
            emit(websocketMessage(JSON.parse(event.data)));
        };

        socket.onerror = event => {
            // 에러 처리
            console.log(`${socket} : 소켓연결에러`, event)
            socket.close();
        };

        socket.onclose = () => {
            // 연결 종료 처리
            console.log(`${socket} : 소켓연결종료`)
            socket.close();
        };

        return () => {
            socket.close();
        };
    });
}

function* handleWebSocketConnection() {
    const socket = new WebSocket(`${API_WS}/dbName`);
    const socketChannel = yield call(createWebSocketChannel, socket);

    while (true) {
        const action = yield take(socketChannel);
        yield put(action);
    }
}

export default function* websocketSaga() {
    while (yield take(WEBSOCKET_CONNECT)) {
        const websocketTask = yield fork(handleWebSocketConnection);
        yield take(WEBSOCKET_DISCONNECT);
        yield cancel(websocketTask);
    }
}
