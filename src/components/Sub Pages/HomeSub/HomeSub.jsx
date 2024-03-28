import React from 'react';

import { useHistory } from 'react-router-dom';
import LogOutButton from '../../Buttons/LogOutButton/LogOutButton.jsx';
import { useSelector } from 'react-redux';

//import CalendarView from '../Dates/CalendarView/CalendarView.jsx';
import SubLayout from '../../Layouts/SubLayout/SubLayout.jsx';

export default function HomeSub() {
  const history = useHistory();
  const user = useSelector((store) => store.user);

  return (
    <SubLayout>
      <h1>Welcome, {user.first_name}!</h1>
      <div className="container">Home for Subs</div>
      <div>Upcoming Assignments</div>
      {/* {reduxStore.customerFeeling.feeling} */}
      <div>{/* <CalendarView /> */}</div>
      <div>Available Assignments</div>
      <LogOutButton className="btn" />
      {/* <tbody>
        {store.secrets.map((secret, index) => (
          <tr key={index}>
            <td>{secret.secrecy_level}</td>
            <td>{secret.content}</td>
          </tr>
        ))}
      </tbody> */}
    </SubLayout>
  );
}