import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Button, Tab, Tabs, Card, TextField } from "@material-ui/core";
import Rating from "@mui/material/Rating";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { backendURL } from "../../../config";

const useStyles = makeStyles({
  container: {
    backgroundColor: "white",
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 100,
  },
  HeaderContainer: {
    paddingTop: "30px",
    paddingBottom: 30,
  },
  Header: {
    textAlign: "center",
    paddingBottom: 50,
  },
});

const PostReview = () => {
  const { state } = useLocation();
  const { givenToUserId, reviewType, event } = state;
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const systemTime = localStorage.getItem("systemTime");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const classes = useStyles();
  const navigate = useNavigate();

  const validateEventPayload = () => {
    if (!rating) {
      alert("Please provide rating in range of 1 to 5");
      return false;
    }
    // check if startTime is greater than current time
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    // const deadlineDate = new Date(event.deadline);
    const systemDate = new Date(systemTime);

    if (startDate > systemDate) {
      alert("You cant review before the start of the event");
      return false;
    }
    const nextWeekDate = new Date(endDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    if (systemDate > nextWeekDate) {
      alert("You cant review 1 week after the end of the event");
      return false;
    }
    const eventParticipants = event?.participants;

    if (
        reviewType === "onOrganizer" &&
        !eventParticipants.filter(
          (x) =>
            x.userId === currentUserId && x.participantStatus === "Enrolled"
        ).length > 0
    ) {
      alert("Current User is not an enrolled participant of the event");
      return false;
    }

    if (
        reviewType === "onParticipant" &&
        !eventParticipants.filter(
          (x) =>
            x.userId === givenToUserId && x.participantStatus === "Enrolled"
        ).length > 0
    ) {
      alert("Participant is no longer an enrolled participant of the event");
      return false;
    }
    return true;
  };

  const onPostReviewApi = async (e) => {
    e.preventDefault();

    // performaing validation
    if (!validateEventPayload()) {
      return;
    }

    // const startTimeDate = new Date(eventInfo.startTime);
    // const optionalEndtime = new Date(
    //   startTimeDate.getFullYear() + 1,
    //   startTimeDate.getMonth(),
    //   startTimeDate.getDate()
    // );
    const data = {
      reviewText,
      rating,
      givenByUserId: currentUserId,
      givenToUserId: givenToUserId,
      reviewType: reviewType,
      reviewTime: moment(new Date(systemTime)).format("yyyy-MM-DD HH:mm:ss"),
      eventId: event.eventId,
    };
    console.log("data", data);
    await axios
      .post(`${backendURL}/review`, data)
      .then((response) => {
        console.log("success===created-event");
        console.log(response.data);
        alert("review posted");
        navigate("/event");
      })
      .catch((error) => {
        console.log(error);
        alert(error?.response?.data?.message || error.message || error);
      });

    // createEventApi();
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };
  return (
    <>
      <Box component="div" className={classes.container}>
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>Post Review</h1>
      </div>
        <form
          onSubmit={onPostReviewApi}
          style={{ paddingLeft: 30, paddingRight: 30 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, paddingRight: 20 }}>
              <div style={{display: "flex", flexDirection: 'row'}}>
                <Typography style={{fontWeight: "bold", fontSize: 18}}>Rate {reviewType === "onParticipant"? "Participant" : "Organizer"}</Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </div>
              <div className="txt_field">
                <TextField
                  id="outlined-textarea"
                  placeholder="Write your review here"
                  multiline
                  maxRows={4}
                  rows={4}
                  style={{backgroundColor: "#FCFCFC"}}
                  type="text"
                  fullWidth
                  value={reviewText}
                  onChange={handleReviewChange}
                  required
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 40,
            }}
          >
            <input style={{ width: 300 }} type="submit"></input>
          </div>
        </form>
      </Box>
    </>
  );
};

export default PostReview;
