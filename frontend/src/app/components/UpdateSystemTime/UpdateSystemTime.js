import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Button, Tab, Tabs, Card } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import NewNavBar from "../NavBar/NewNavBar";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { updateSystemTimeApi } from "../../Utilities/apis";

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
    backgroundColor: "#FBF5F5",
  },
  HeaderContainer: {
    paddingTop: "30px",
  },
  Header: {
    textAlign: "center",
    paddingBottom: "20px",
  },
  datelable: {
    marginTop: "15px",
    marginLeft: "20px",
    fontSize: "16px",
  },
  timeHeading: {
    marginLeft: "20px",
    fontSize: "16px",
  },
  datetime: {
    color: "#adadad",
    marginLeft: "20px",
    marginTop: "5px",
    fontSize: "16px",
  },
});

export default function UpdateSystemTime(props) {
  // take value from storage
  const [systemTime, setSystemTime] = useState(
    localStorage.getItem("systemTime") ||
      moment(new Date()).format("yyyy-MM-DDTHH:MM")
  );
  const [timeInPicker, setTimeInPicker] = useState(systemTime);

  const classes = useStyles();

  const handleChange = (e) => {
    setTimeInPicker(e.target.value);
  };

  const UpdateSystemTime = (reset) => {
    if (reset) {
      const time = moment(new Date()).format("yyyy-MM-DDTHH:mm");
      setTimeInPicker(time);
      localStorage.setItem("systemTime", time);
      setSystemTime(time);
      updateSystemTimeApi(time);
      return;
    }
    // set time in picker to system time if not null
    if (!timeInPicker) {
      return;
    }
    localStorage.setItem("systemTime", timeInPicker);
    setSystemTime(timeInPicker);
    updateSystemTimeApi(timeInPicker);
    //
  };

  return (
    <Box component="div" className={classes.container}>
      <NewNavBar />
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>{"Update System Time"}</h1>
      </div>
      <div style={{ display: "flex", flexDirection:'column', flex: 1, alignItems: 'center', justifyContent: "center" }}>
        <label className={classes.timeHeading}>
          Current System Time: {`${new Date(systemTime).toLocaleString()}`}{" "}
        </label>
        <label className={classes.datelable}>Select New Date Time </label>
        <div className={classes.datetime}>
          <input
            id="end"
            type="datetime-local"
            name="endTime"
            value={timeInPicker}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          paddingTop: 80,
          paddingBottom: 300,
        }}
      >
        <Button
          variant="outlined"
          style={{
            paddingRight: "25px",
            height: 40,
            textAlign: "center",
            backgroundColor: "green",
            color: "white",
            alignSelf: "center",
          }}
          onClick={() => {
            UpdateSystemTime(false);
          }}
        >
          Update System Time
        </Button>
        <Button
          variant="outlined"
          style={{
            paddingRight: "25px",
            height: 40,
            textAlign: "center",
            backgroundColor: "red",
            color: "white",
            alignSelf: "center",
          }}
          onClick={() => {
            UpdateSystemTime(true);
          }}
        >
          Reset System Time
        </Button>
      </div>
    </Box>
  );
}
