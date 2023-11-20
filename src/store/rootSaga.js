import { all } from 'redux-saga/effects';
import websocketSaga from './sagas/websocketSaga';
import WA_1 from './sagas/WA_1';
import WA_2 from './sagas/WA_2';

export default function* rootSaga() {
    yield all([
        websocketSaga(),
        WA_1(),
        WA_2(),
        // ... 기타 사가
    ]);
}
