import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import { DateTime } from 'luxon';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
} from '@mui/material';

import SubLayout from '../../Layouts/SubLayout/SubLayout.jsx';

import '../../App/App.css';

export default function ScheduleSub() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const acceptedRequests = useSelector((store) => store.acceptedRequest);
  const pastAcceptedRequest = useSelector((store) => store.pastAcceptedRequest);

  useEffect(() => {
    dispatch({ type: 'FETCH_ACCEPTED_REQUESTS' });
    dispatch({ type: 'FETCH_PAST_ACCEPTED_REQUESTS' });
  }, []);

  const handleCancel = (requestId) => {
    console.log(`Request ID:${requestId} canceled by User ID:${user.id}`);
    dispatch({
      type: 'CANCEL_REQUEST',
      payload: { requestId, userId: user.id },
    });
  };

  const handleAvailability = () => {
    history.push('/availabilitysub');
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const gridHeight = acceptedRequests.length * 120;

  return (
    <SubLayout>
      <div className="frame">
        <h2>Schedule</h2>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Item>
                <div className="schedule-nav">
                  <div className="nav-item">
                    <button onClick={handleAvailability}>
                      Manage Availability
                    </button>
                  </div>
                  <div className="nav-item">
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      ></path>
                    </svg>
                    <button
                      type="button"
                      className="btn btn_asLink black"
                      onClick={() => {
                        history.push('/schedulesubcal');
                      }}
                    >
                      Calendar View
                    </button>

                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      ></path>
                    </svg>

                    <button
                      type="button"
                      className="btn btn_asLink black"
                      onClick={() => {
                        history.push('/scheduleteacher');
                      }}
                    >
                      List View
                    </button>
                  </div>
                </div>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <h4>Current & Upcoming Assignments</h4>
                <div className="request-container">
                  <TableContainer component={Paper} className="request-table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Request ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>School</TableCell>
                          <TableCell>Teacher</TableCell>
                          <TableCell>Grade</TableCell>
                          <TableCell>Notes</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {acceptedRequests.length > 0 ? (
                          acceptedRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.id}</TableCell>
                              <TableCell>
                                {DateTime.fromISO(
                                  request.request_start_date
                                ).toFormat('MMMM dd')}
                                <div>
                                  {DateTime.fromISO(
                                    request.request_start_date
                                  ).toFormat('EEEE')}
                                </div>
                              </TableCell>
                              <TableCell>{request.school}</TableCell>
                              <TableCell>
                                {request.first_name} {request.last_name}
                              </TableCell>
                              <TableCell>{request.grade}</TableCell>
                              <TableCell>{request.sub_notes}</TableCell>
                              <TableCell>
                                <button
                                  className="btn-sm"
                                  onClick={() => handleCancel(request.id)}
                                >
                                  Cancel
                                </button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5}>
                              No Current Assignments
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Item>
            </Grid>
            <Grid item xs={12} style={{ height: `${gridHeight}px` }}>
              <Item>
                <h4>Past Assignments</h4>
                <div className="request-container">
                  <TableContainer component={Paper} className="request-table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Request ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>School</TableCell>
                          <TableCell>Teacher</TableCell>
                          <TableCell>Grade</TableCell>
                          <TableCell>Notes</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pastAcceptedRequest.length > 0 ? (
                          pastAcceptedRequest.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.id}</TableCell>
                              <TableCell>
                                {DateTime.fromISO(
                                  request.request_start_date
                                ).toFormat('MMMM dd')}
                                <div>
                                  {DateTime.fromISO(
                                    request.request_start_date
                                  ).toFormat('EEEE')}
                                </div>
                              </TableCell>
                              <TableCell>{request.school}</TableCell>
                              <TableCell>
                                {request.first_name} {request.last_name}
                              </TableCell>
                              <TableCell>{request.grade}</TableCell>
                              <TableCell>{request.sub_notes}</TableCell>
                              <TableCell>Complete</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              No Past Assignments
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </SubLayout>
  );
}
