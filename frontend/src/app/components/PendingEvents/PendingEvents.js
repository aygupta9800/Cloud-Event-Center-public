import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Button, ListItem, Card } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useLocation, Link } from "react-router-dom";
import { backendURL } from "../../../config";

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

export default function PendingEvents(props) {
  const { state } = useLocation();
  const { event } = state;
  const currentUserId = localStorage.getItem("userId");
  const [pendingEventRequest, setPendingEventRequest] = useState([]);
  // Hardcoded
  // const eventId = 13
  // const userId =
  const classes = useStyles();
  useEffect(() => {
    // TODO: pass and read event id from props
    // getEventDetail(69);
    getPendingRequest();
  }, []);

  const getPendingRequest = async () => {
    await axios
      .get(
        `${backendURL}/users/participantsList?userId=${currentUserId}&eventId=${
          event?.eventId
        }&status=${"Pending"}`
      )
      .then((response) => {
        console.log("response:", response.data);
        setPendingEventRequest(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeRequestStatus = async (eventId, participantId, approve) => {
    const body = {
      participantId: parseInt(participantId),
      eventId,
      approve,
    };
    await axios
      .put(`${backendURL}/event/participant/status`, body)
      .then((response) => {
        console.log("response:", response.data);
        // TODO: remove the request from the list
        const newRequest = pendingEventRequest.filter(
          (req) => parseInt(req[0]) !== parseInt(participantId)
        );
        setPendingEventRequest(newRequest);
      })
      .catch((error) => {
        console.log(error);
        // if (error?.message) {
        alert(error?.response?.data?.message || error.message || error);
        // }
      });
  };

  return (
    <>
      <Box component="div" className={classes.container}>
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>Pending Participants Request</h1>
      </div>
        {pendingEventRequest?.length > 0 ? (
          pendingEventRequest.map((request, index) => (
            <ListItem key={index}>
              <Card
                style={{
                  width: "100%",
                  display: "block",
                  marginLeft: "20px",
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
                        width: "50%",
                      }}
                    >
                       <Typography variant="h6" style={{ color: "black", paddingBottom: 10 }}>
                        {`Participant Name: ${request[2]}`}
                      </Typography>
                      <Typography variant="body2" style={{ color: "black" }}>
                        {event?.title}
                      </Typography>
                      <Typography variant="body2" style={{ color: "black", fontWeight: "bold" }}>
                        {`Participant Reputation Score: ${request[4]}`}
                      </Typography>
                    </div>
                  <div style={{display: "flex",flex: 1, flexDirection: "row", justifyContent: "space-around"}}>
                  <Link
                  to="/reviews"
                  // style={{marginLeft: 20}}
                  state={{ userId: parseInt(request[0]), reviewType: "onParticipant", event }}
                >
                    <Button
                    size="small"
                    variant="text"
                    style={{
                      backgroundColor: "rgb(36,36,36)",
                      color: "white",
                      paddingRight: 20,
                      height: 40,
                      width: 150,
                      // marginRight: 30,
                    }}
                  >
                    Browse Reviews
                  </Button>
                  </Link>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      changeRequestStatus(event?.eventId, request[0], true);
                    }}
                    style={{
                      alignSelf: "center",
                      backgroundColor: "green",
                      color: "white",
                      // paddingLeft: 20,
                      paddingRight: 20,
                      marginTop: 10,
                      marginBottom: 10,
                      height: 40,
                      width: 150,
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      changeRequestStatus(event?.eventId, request[0], false);
                    }}
                    style={{
                      backgroundColor: "#CB0C0C",
                      color: "white",
                      paddingRight: 20,
                      height: 40,
                      width: 150,
                    }}
                  >
                    Reject
                  </Button>
                    </div>
                  
                </div>
              </Card>
            </ListItem>
          ))
        ) : (
          <div style={{ textAlign: "center", paddingBottom: 100 }}>
            No Pending Request for this Event
          </div>
        )}
      </Box>
    </>
  );
}
