import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Button, ListItem, Card } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
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
    paddingBottom: 100,
  },
  HeaderContainer: {
    paddingTop: "30px",
    paddingBottom: 30,
  },
  Header: {
    textAlign: "center",
    paddingBottom: 30,
  },
});

export default function UserReviews(props) {
  const { state } = useLocation();
  const { userId, reviewType } = state;
//   console.log("state"+ state);
  const [reviews, setReviews] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    await axios
      .get(`${backendURL}/user/${userId}/reviews?reviewType=${reviewType}`)
      .then((response) => {
        console.log("response:", response.data);
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Box component="div" className={classes.container}>
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>Reviews</h1>
      </div>
        {reviews?.length > 0 ? (
          reviews.map((review, index) => (
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
                      width: "60%",
                      justifyContent: "space-between",
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Typography variant="body2" color="black" style={{fontWeight: "bold"}}>
                      {`Rating: ${review.rating}`}
                    </Typography>
                    <Typography variant="body2" style={{}}>
                      {`For event: ${review?.event?.title}`}
                    </Typography>
                    <Typography variant="body2" style={{}}>
                      {`Review Text: ${review.reviewText}`}
                    </Typography>
                    <Typography variant="body2" style={{}}>
                      {`Review Time: ${new Date(review.reviewTime).toLocaleString()}`}
                    </Typography>
                  </div>
                </div>
              </Card>
            </ListItem>
          ))
        ) : (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            No reviews for the{" "}
            {reviewType == "onParticipant" ? "participant" : "organizer"}
          </div>
        )}
      </Box>
    </>
  );
}
