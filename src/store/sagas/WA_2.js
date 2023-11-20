import { take, call, put, fork, cancel, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { WEBSOCKET_CONNECT_WA_2, WEBSOCKET_DISCONNECT_WA_2, websocketMessageWA2 } from '../actions/websocketActions';
import { API_WS } from '../../components/util/config'
function createWebSocketChannel(socket) {
    return eventChannel(emit => {
        socket.onmessage = event => {

            var call = [], put = [], kospi200 = [], CallMean = [], PutMean = [], Mean1 = [], Mean2 = [], CTP1 = [], CTP15 = [], CTP2 = [], Min = [], Date = [];
            event.data.slice(-11).forEach((value, index, array) => {
                call.push([value.콜_최소, value.콜_최대])
                put.push([value.풋_최소, value.풋_최대])
                kospi200.push(value.종가)
                CallMean.push(parseFloat(value.콜_가중평균.toFixed(1)))
                PutMean.push(parseFloat(value.풋_가중평균.toFixed(1)))
                Mean1.push(parseFloat(((value.콜_가중평균 + value.풋_가중평균) / 2).toFixed(1)))
                Mean2.push(parseFloat(value.콜풋_가중평균.toFixed(1)))
                CTP1.push(parseFloat(value['1일'].toFixed(1)))
                CTP15.push(parseFloat(value['1_5일'].toFixed(1)))
                CTP2.push(parseFloat(value['2일'].toFixed(1)))
                if (value.콜_최소 > 1) {
                    Min.push(value.콜_최소)
                }
                if (value.풋_최소 > 1) {
                    Min.push(value.풋_최소)
                }
                Date.push(value.최종거래일.substr(2, 2) + '.' + value.최종거래일.substr(5, 2) + '.' + value.최종거래일.substr(8, 2) + '.')
            })
            let Min1 = Math.min(...Min)
            const month1 = {
                series: [
                    { name: "Call", type: "errorbar", color: "#FCAB2F", lineWidth: 2, data: call },
                    { name: "Put", type: "errorbar", color: "#00F3FF", lineWidth: 2, data: put },
                    { name: "Kospi200", type: "spline", color: "#efe9e9ed", data: kospi200, marker: { radius: 5 }, lineWidth: 1.5, zIndex: 5, },
                    { name: "Call_mean", type: "spline", color: "#FCAB2F", data: CallMean, lineWidth: 1, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "Put_mean", type: "spline", color: "#00F3FF", data: PutMean, lineWidth: 0, marker: { symbol: "diamond", radius: 5 }, },
                    { name: "1/2 (단순)", type: "line", color: "tomato", data: Mean1, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "가중", type: "line", color: "greenyellow", data: Mean2, lineWidth: 1, marker: { symbol: "cross", radius: 8, lineColor: null, lineWidth: 2 }, },
                    { name: "1일", type: "spline", color: "pink", data: CTP1, lineWidth: 1, marker: { symbol: "circle", radius: 3 }, },
                    { name: "1.5일", type: "spline", color: "gold", data: CTP15, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                    { name: "2일", type: "spline", color: "magenta", data: CTP2, lineWidth: 0, marker: { symbol: "circle", radius: 3 }, },
                ],
                min: Min1,
                categories: Date
            }

            emit(websocketMessageWA2(JSON.parse(month1)));
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
    const socket = new WebSocket(`${API_WS}/elwMonth2`);
    const socketChannel = yield call(createWebSocketChannel, socket);

    try {
        while (true) {
            const action = yield take(socketChannel);
            yield put(action);
        }
    } finally {
        if (yield cancelled()) {
            socket.close();
        }
    }
}

export default function* WA_2() {
    while (yield take(WEBSOCKET_CONNECT_WA_2)) {
        const websocketTask = yield fork(handleWebSocketConnection);
        yield take(WEBSOCKET_DISCONNECT_WA_2);
        yield cancel(websocketTask);
    }
}
