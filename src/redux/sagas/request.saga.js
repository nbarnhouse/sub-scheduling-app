import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
//import { DateTime } from 'luxon'; // Import DateTime from luxon

// Saga for getting all requests
function* fetchRequests() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get('/api/request/all', config);

    yield put({ type: 'SET_REQUESTS', payload: response.data });
  } catch (error) {
    console.log('Requests GET request failed', error);
  }
}

// Saga for accepting a request
function* acceptRequest(action) {
  try {
    const { requestId, userId } = action.payload;
    console.log('Request ACCEPT Saga Process - Request ID:', requestId);
    console.log('Request ACCEPT Saga Process - User ID:', userId);

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Send PUT request with userId in the request body
    yield call(
      axios.put,
      `/api/request/${requestId}`,
      { user_id: userId },
      config
    );

    yield put({
      type: 'SHOW_ALERT',
      payload: { message: 'Request Accepted!', type: 'success' },
    });

    yield put({ type: 'FETCH_REQUESTS' }); // Refetch available requests after Accept
  } catch (error) {
    console.error('Error accepting request:', error);
  }
}

function* fetchAcceptedRequests() {
  try {
    const response = yield axios.get(`/api/request/accepted`);
    yield put({ type: 'SET_ACCEPTED_REQUESTS', payload: response.data });
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
  }
}

function* fetchPastAcceptedRequests() {
  try {
    const response = yield axios.get(`/api/request/accepted/past`);
    yield put({ type: 'SET_PAST_ACCEPTED_REQUESTS', payload: response.data });
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
  }
}

function* fetchSubmittedRequests() {
  try {
    const response = yield axios.get(`/api/request/submitted`);
    yield put({ type: 'SET_SUBMITTED_REQUESTS', payload: response.data });
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
  }
}

function* fetchPastSubmittedRequests() {
  try {
    const response = yield axios.get(`/api/request/submitted/past`);
    yield put({ type: 'SET_PAST_SUBMITTED_REQUESTS', payload: response.data });
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
  }
}

// Saga for accepting a request
function* cancelAcceptedRequest(action) {
  try {
    const { requestId, userId } = action.payload;

    console.log('Request CANCEL Saga Process - Request ID:', requestId);
    console.log('Request CANCEL Saga Process - User ID:', userId);

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Send PUT request with userId in the request body
    yield call(
      axios.put,
      `/api/request/cancel/${requestId}`,
      { user_id: userId },
      config
    );

    yield put({ type: 'FETCH_ACCEPTED_REQUESTS' }); // Refetch available requests after Accept
  } catch (error) {
    console.error('Error canceling request:', error);
  }
}

function* deleteRequest(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const itemId = action.payload;

    yield axios.delete(`/api/request/${itemId}`, config);

    yield put({ type: 'FETCH_SUBMITTED_REQUESTS' }); // Refetch request after Deletion
  } catch (error) {
    console.log('Availability delete request failed', error);
  }
}

function* requestsSaga() {
  yield takeLatest('FETCH_REQUESTS', fetchRequests);
  yield takeLatest('ACCEPT_REQUEST', acceptRequest);
  yield takeLatest('CANCEL_REQUEST', cancelAcceptedRequest);
  yield takeLatest('FETCH_ACCEPTED_REQUESTS', fetchAcceptedRequests);
  yield takeLatest('FETCH_PAST_ACCEPTED_REQUESTS', fetchPastAcceptedRequests);
  yield takeLatest('FETCH_SUBMITTED_REQUESTS', fetchSubmittedRequests);
  yield takeLatest('FETCH_PAST_SUBMITTED_REQUESTS', fetchPastSubmittedRequests);

  yield takeLatest('DELETE_REQUEST_ITEM', deleteRequest);
}

export default requestsSaga;
