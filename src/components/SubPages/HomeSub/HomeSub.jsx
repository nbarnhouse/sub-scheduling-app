import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import dayjs from 'dayjs';
import SubLayout from '../../Layouts/SubLayout/SubLayout.jsx';
import RequestData from '../../DataComponents/RequestData/RequestData.jsx';
import CalendarView from '../../DateWidgets/CalendarView/CalendarView.jsx';

import '../../App/App.css';

export default function HomeSub() {
  const user = useSelector((store) => store.user);
  const acceptedRequests = useSelector((store) => store.acceptedRequest);
  //const request = useSelector((store) => store.request);
  const currentDate = dayjs();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_ACCEPTED_REQUESTS' });
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '340px',
  }));

  const gridHeight = acceptedRequests.length * 120;

  return (
    <SubLayout>
      <div className="frame">
        <h2>Welcome, {user.first_name}!</h2>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Item>
              <div className="textLeft">
                <h4>Upcoming Assignments</h4>
                {acceptedRequests.length > 0 ? (
                  acceptedRequests.slice(0, 1).map((request) => (
                    <div key={request.id}>
                      {console.log('Request:', request)}
                      <p>
                        {DateTime.fromISO(request.request_start_date).toFormat(
                          'EEEE'
                        )}{' '}
                        {DateTime.fromISO(request.request_start_date).toFormat(
                          'MMMM dd'
                        )}
                      </p>
                      <p>{request.school}</p>
                      <p>
                        Sub for: {request.first_name} {request.last_name}
                      </p>
                      <p>Room: {request.room_number}</p>
                    </div>
                  ))
                ) : (
                  <p>No Current Assignments</p>
                )}
              </div>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <CalendarView />
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <CalendarView referenceDate={dayjs().add(1, 'month')} />
            </Item>
          </Grid>
          <Grid item xs={12} style={{ height: `${gridHeight}px` }}>
            <Item>
              <h4>Available Assignments</h4>
              <RequestData />
            </Item>
          </Grid>
        </Grid>
      </div>
    </SubLayout>
  );
}
