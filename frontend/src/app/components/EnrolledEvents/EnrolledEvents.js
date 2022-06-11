import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Button, ListItem, Card } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useLocation, Link } from "react-router-dom";
import { backendURL } from "../../../config";
import { Rating } from "@mui/material";

const useStyles = makeStyles({
  gridContainer: {
    display: "flex",
    paddingLeft: "40px",
    paddingRight: "40px",
    overflow: "auto",
    justifyContent: "start",
    flexWrap: "wrap",
  },
  container: {
    backgroundColor: "#FCFCFC",
    // marginTop: '160px',
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

export default function EnrolledEvents(props) {
  const { state } = useLocation();
  const { event } = state;
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const [enrolledEventRequest, setEnrolledEventRequest] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    getEnrolledRequest();
  }, []);

  const getEnrolledRequest = async () => {
    await axios
      .get(
        `${backendURL}/users/participantsList?userId=${currentUserId}&eventId=${
          event?.eventId
        }&status=${"Enrolled"}`
      )
      .then((response) => {
        console.log("response:", response.data);
        setEnrolledEventRequest(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Box component="div" className={classes.container}>
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>Approved Participants</h1>
      </div>
        {enrolledEventRequest?.length > 0 ? (
          enrolledEventRequest.map((request, index) => (
            <ListItem key={index}>
              <Card
                style={{
                  width: "100%",
                  display: "block",
                  // marginLeft: "20px",
                  paddingLeft: 10,
                  paddingRight: "40px",
                }}
              >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        justifyContent: "space-between",
                        paddingTop: 0,
                        paddingBottom: 0,
                        width: "60%",
                      }}
                    >
                      <Typography variant="h6" style={{ color: "black", paddingBottom: 10 }}>
                        {`Participant Name: ${request[2]}`}
                      </Typography>
                      <Typography variant="body2" style={{ color: "black" }}>
                        Event: {event?.title}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" style={{ color: "black", fontWeight: "bold" }}>
                          {`Participant Reputation Score: ${request[4]}`}
                        </Typography>
                      </div>
                    </div>
                    <Link
                  to="/postReview"
                  state={{
                    givenToUserId: parseInt(request[0]),
                    reviewType: "onParticipant",
                    event,
                  }}
                >
                    <Button
                    size="small"
                    variant="text"
                    style={{
                      backgroundColor: "#CB0C0C",
                      color: "white",
                      paddingRight: 20,
                    }}
                  >
                    Post Review
                  </Button>
                  </Link>
                  <Link
                  to="/reviews"
                  style={{marginLeft: 20}}
                  state={{ userId: parseInt(request[0]), reviewType: "onParticipant", event }}
                >
                    <Button
                    size="small"
                    variant="text"
                    style={{
                      backgroundColor: "rgb(36,36,36)",
                      color: "white",
                      paddingRight: 20,
                    }}
                  >
                    Browse Reviews
                  </Button>
                  </Link>
                  </div>
                
              </Card>
            </ListItem>
          ))
        ) : (
          <div style={{ textAlign: "center", paddingBottom: 100 }}>
            No Enrolled Participants for the event
          </div>
        )}
      </Box>
    </>
  );
}
