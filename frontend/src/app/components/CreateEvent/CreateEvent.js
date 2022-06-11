import React, { useState } from "react";
import NewNavBar from "../NavBar/NewNavBar";
import "./CreateEvent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Typography,
  Box,
  Button, Tab, Tabs, Card
} from '@material-ui/core';
import {makeStyles, withStyles } from '@material-ui/core/styles';
import { backendURL } from "../../../config";

const useStyles = makeStyles({
    container: {
        backgroundColor: 'white',
        
    },
    HeaderContainer: {
      paddingTop: '30px',
    },
    Header: {
      textAlign: 'center',
      paddingBottom: '20px'
    }, 
})

const CreateEvent = () => {
  const currentUserId = localStorage.getItem("userId");
  const systemTime = localStorage.getItem("systemTime");
  const [eventInfo, setEventInfo] = useState({
    title: "",
    description: "",
    startTime: systemTime,
    endTime: "",
    deadline: "",
    street: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    maxParticipants: 1,
    minParticipants: 1,
    fee: 0,
    status: "",
    admissionPolicy: "FCFS",
  });
  const classes = useStyles();
  const navigate = useNavigate();

  const validateEventPayload = () => {
    // check if startTime is greater than current time
    const startDate = new Date(eventInfo.startTime);
    const endDate = new Date(eventInfo.endTime);
    const deadlineDate = new Date(eventInfo.deadline)
    const systemDate = new Date(systemTime); 
    if (startDate< systemDate) {
      alert("Start Time of the event must be after the System Time");
      return false;
    }
    if (startDate<deadlineDate) {
      alert("deadline cannot be greater than start date");
      return false;
    }

    if (endDate && endDate <= startDate) {
      alert("endDate must be greater than start date");
      return false;
    }

    if (eventInfo.minParticipants <= 0) {
      alert("atleast 1 min participant should be allowed");
      return false;
    }

    if (eventInfo.minParticipants > eventInfo.maxParticipants) {
      alert("max participant should be more than min participant");
      return false
    }
    return true

  }

  const onCreateEventApi = async (e) => {
    e.preventDefault();
    // performaing validation
    if (!validateEventPayload()) {
      return;
    }

    const startTimeDate = new Date(eventInfo.startTime)
    const optionalEndtime = new Date(startTimeDate.getFullYear()+1, startTimeDate.getMonth(), startTimeDate.getDate());
    const data = {
      // TODO: hardcoded organizer id
      organizerId: currentUserId,
    //   email: "player14@gmail.com",
      title: eventInfo.title,
      description: eventInfo.description,
      startTime: eventInfo.startTime,
      endTime: eventInfo.endTime || optionalEndtime,
      deadline: eventInfo.deadline,
      minParticipants: parseInt(eventInfo.minParticipants),
      maxParticipants: parseInt(eventInfo.maxParticipants),
      admissionPolicy: eventInfo.admissionPolicy,
      fee: parseInt(eventInfo.fee),
      status: "OPEN",
      address: {
        street: eventInfo.street,
        number: eventInfo.number,
        city: eventInfo.city,
        state: eventInfo.state,
        zipcode: eventInfo.zip,
      },
    };
    console.log("data", data);
    await axios
      .post(`${backendURL}/event/`, data)
      .then((response) => {
        console.log("success===created-event")
        console.log(response.data);
        alert("event created");
        navigate("/event");
      })
      .catch((error) => {
        console.log(error);
      });
    
    // createEventApi();
    };

  const handleChange = (event) => {
    setEventInfo({ ...eventInfo, [event.target.name]: event.target.value });
  };
  return (
    <>
        <Box component="div" className={classes.container}>
            <NewNavBar />
            <div className={classes.HeaderContainer} >
              <h1 className={classes.Header}>Create Event</h1>
            </div>
            <form onSubmit={onCreateEventApi} style={{paddingLeft: 30, paddingRight: 30}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <div style={{flex: 1, paddingRight: 20}}>
                  <div className="txt_field">
                      <input id="title" type="text" name="title" value={eventInfo.title} onChange={handleChange} required />
                      <label>Event Title</label>
                  </div>
                  <div className="txt_field">
                      <input id="desc" type="text" name="description" value={eventInfo.description} onChange={handleChange} required />
                      <label>Description</label>
                  </div>
                  <div className="txt_field">
                      <input id="street" type="text" name="street" value={eventInfo.street} onChange={handleChange} required />
                      <label>Street</label>
                  </div>
                  <div className="txt_field">
                      <input id="number" type="text" name="number" value={eventInfo.number} onChange={handleChange} required />
                      <label>Apt No.</label>
                  </div>
                  <div className="txt_field">
                      <input id="city" type="text" name="city" value={eventInfo.city} onChange={handleChange} required />
                      <label>City</label>
                  </div>
                  <div className="txt_field">
                      <input id="state" type="text" name="state" value={eventInfo.state} onChange={handleChange} required />
                      <label>State</label>
                  </div>
                  <div className="txt_field">
                      <input id="zip" type="text" name="zip" value={eventInfo.zip} onChange={handleChange} required />
                      <label>Zip</label>
                  </div>
                  
                  </div>
                  <div style={{flex: 1}}>
                  <div>
                  {/* <label>admissionPolicy</label> */}
                      {/* <input id="policy" type="text" name="admissionPolicy" value={eventInfo.admissionPolicy} onChange={handleChange} required /> */}
                      <select
                        id="policy"
                        name="admissionPolicy"
                        onChange={handleChange}
                        value={eventInfo.admissionPolicy}
                        title={'Admission Policy'}
                        style={{paddingTop: -15}}
                        required
                      >
                        <option value="FCFS">Auto Approved</option>
                        <option value="AR">Approval Required</option>
                      </select>
                  </div>
                  <label className="datelable" style={{paddingTop: 5}}>Start Date Time</label>
                  <div className="date_time">
                      <input id="start" type="datetime-local" name="startTime" value={eventInfo.startTime} onChange={handleChange} required />
                  </div>
                  <label className="datelable" style={{paddingTop: 5}}>End Date Time   </label>
                  {/* Removing required in endTime */}
                  <div className="date_time">
                      <input id="end" type="datetime-local" name="endTime" value={eventInfo.endTime} onChange={handleChange} />
                  </div>
                  <label className="datelable" style={{paddingTop: 5}}>Deadline Date Time</label>
                  <div className="date_time">
                      <input id="deadline" type="datetime-local" name="deadline" value={eventInfo.deadline} onChange={handleChange} required />
                  </div>
                  <div className="txt_field">
                      <input id="minParticipants" type="number" min={1} name="minParticipants" value={eventInfo.minParticipants} onChange={handleChange} required />
                      <label>Min Participants</label>
                  </div>
                  <div className="txt_field">
                      <input id="maxParticipants" type="number" min={eventInfo.minParticipants} name="maxParticipants" value={eventInfo.maxParticipants} onChange={handleChange} required />
                      <label>Max Participants</label>
                  </div>
                  <div className="txt_field">
                      <input id="fee" type="text" name="fee" value={eventInfo.fee} onChange={handleChange} required />
                      <label>Fees</label>
                  </div>
                 
                  </div>

                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
                  <input style={{ width: 300}} type="submit"></input>
                </div>
            </form>
        </Box>
    </>
  );
};

export default CreateEvent;
