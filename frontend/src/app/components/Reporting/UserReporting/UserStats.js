import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Tab,
  Tabs,

} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NewNavBar from "../../NavBar/NewNavBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ParticipationStats from "./ParticipationStats";
import OrganizerStats from "./OrganizerStats";

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
});

export default function UserStats(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
   
  }, []);

  
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  const Tab1 = () => {
 
    return (

        <ParticipationStats/>
    
    )};

    const Tab2 = () => {
 
        return (
    
            <OrganizerStats/>
        
        )};

  

  return (
    <>
      {/* <NavBar /> */}
      <Box component="div" className={classes.container}>
        <NewNavBar />
        <div className={classes.HeaderContainer}>
          <h1 className={classes.Header}>User Reporting</h1>
        </div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Participant Report" />
          <Tab label="Organizer Report" />
       
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Tab1 />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Add forum component here */}
          <Tab2 />
        </TabPanel>

      </Box>
    </>
  );
}
