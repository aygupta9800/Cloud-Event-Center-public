import './App.css';
import React, { useState } from 'react';
import {Route, Routes} from 'react-router-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from './app/components/Home/Home';
import SignUp from './app/components/SignUp/SignUp';
import CreateEvent from './app/components/CreateEvent/CreateEvent';
import Event from './app/components/Events/Event'
import EventDetail from './app/components/EventDetail/EventDetail';
import PendingEvents from './app/components/PendingEvents/PendingEvents'
// import SignIn from './app/components/SignIn/SignIn';
import 'bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './app/components/Sidebar/Sidebar';
import SignIn from './app/components/SignIn/SignIn';
import CustomSideBar from './app/components/CustomSideBar/CustomSideBar';
import SignUpForum from './app/components/Forums/SignUpForum';
import { UserContext } from './user-context';
import UpdateSystemTime from './app/components/UpdateSystemTime/UpdateSystemTime';
import UserReviews from './app/components/UserReviews/UserReviews';
import PostReview from './app/components/PostReview/PostReview';
import EnrolledEvents from './app/components/EnrolledEvents/EnrolledEvents';
import SystemStats from './app/components/SystemStats/SystemStats';
import ParticipationStats from './app/components/Reporting/UserReporting/ParticipationStats';
import OrganizerStats from './app/components/Reporting/UserReporting/OrganizerStats';
import UserStats from './app/components/Reporting/UserReporting/UserStats';

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = 
"https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

function App() {
  const [userData, setuserData] = React.useState({});
  function setUserContext(data){
    setuserData(data) 
   }
  return (
    <UserContext.Provider value={{
      data: userData,
      setUserContext
  }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/createEvent" element={<CreateEvent />}/>
        <Route path ='/event' element = {<Event />}/>
        <Route path ='/forum' element = {<SignUpForum />}/>
        <Route path ='/eventDetail' element={<EventDetail/>}/>
        <Route path ='/pendingEventRequests' element={<PendingEvents/>}/>
        <Route path = '/updateSystemTime' element={<UpdateSystemTime />} />
        <Route path = '/reviews' element={<UserReviews />} />
        <Route path = '/postReview' element={<PostReview />} />
        <Route path = '/enrolledParticipants' element={<EnrolledEvents/>}/>
        <Route path = '/systemstats' element={<SystemStats/>}/>
        <Route path ='/userstats/participant' element= {<ParticipationStats/>} />
        <Route path ='/userstats/organizer' element= {<OrganizerStats/>} />
        <Route path = '/userstats' element = {<UserStats />} />

      </Routes>

    </UserContext.Provider>
  );
}

export default App;
