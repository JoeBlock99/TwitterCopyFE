import {
    call,
    takeEvery,
    select,
    put,
}from 'redux-saga/effects';

import * as types from '../types/events';
import * as actions from '../actions/events';
import * as selectors from '../reducers';
import { normalize } from 'normalizr';
import * as http from '../utils/http';
import * as schemas from './../schemas/events'
import {
    API_BASE_URL,
} from '../settings';

function* fetchEvents(action){
    try{
        const isAuth = yield select(selectors.isAuthenticated)
        if(isAuth){
            const token = yield select(selectors.getAuthToken)
            const response = yield call(
                fetch,
                `${API_BASE_URL}/events/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    }
                }
            )
            //Lo obtuve de tutos
            if(http.isSuccessful(response.status)){
                const jsonResult = yield response.json();
                const {
                    entities:{events},
                    result,
                } = normalize(jsonResult, schemas.events);
                yield put(actions.completeFetchingEvents(events, result));
            }else{
                const {non_field_errors} = yield response.json;
                yield put(actions.failFetchingEvents(non_field_errors[0]));
            }
        }
    } catch (error){
        yield put(actions.failFetchingEvents('Connection failed!'))
    }

}
export function* watchFetchEvents(){
    yield takeEvery(
        types.EVENTS_FETCH_STARTED,
        fetchEvents,
    )
}

function* addEvent(action){
    try{
        const isAuth = yield select(selectors.isAuthenticated)
        if(isAuth){
            const token = yield select(selectors.getAuthToken)
            const response = yield call(
                fetch,
                `${API_BASE_URL}/events/`,
                {
                    method: 'POST',
                    body: JSON.stringify(action.payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    }
                }
            )
            if(http.isSuccessful(response.status)){
                const jsonResult = yield response.json();
                yield put(actions.completeAddingEvent(
                    action.payload.Event.id, 
                    jsonResult,
                    ));
            }else{
                const {non_field_errors} = yield response.json;
                yield put(actions.failAddingEvent(non_field_errors[0]));
            }
        }
    } catch (error){
        yield put(actions.failAddingEvent('Connection failed!'))
    }
}

export function* watchAddEvent(){
    yield takeEvery(
        types.EVENT_ADD_STARTED,
        addEvent,
    )
}

function* removeEvent(action){
    try{
        const isAuth = yield select(selectors.isAuthenticated)
        if(isAuth){
            const token = yield select(selectors.getAuthToken)
            const response = yield call(
                fetch,
                `${API_BASE_URL}/events/${action.payload.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    }
                }
            )
            if(http.isSuccessful(response.status)){
                yield put(actions.completeRemovingEvent());
            }else{
                const {non_field_errors} = yield response.json;
                yield put(actions.failRemovingEvent(non_field_errors[0]));
            }
        }
    } catch (error){
        yield put(actions.failRemovingEvent('Connection failed!'))
    }
}

export function* watchRemoveEvent(){
    yield takeEvery(
        types.EVENT_REMOVE_STARTED,
        removeEvent,
    )
}