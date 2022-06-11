import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import axios from "axios";
import { Card, Input, Button, Dropdown, Icon } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router";
import NewNavBar from "../NavBar/NewNavBar";
import { backendURL } from "../../../config";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [organizerList, setOrganizerList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [organizer, setOrganizer] = useState("");


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
      // backgroundColor: "#FBF5F5",
    },
    HeaderContainer: {
      paddingTop: "30px",
    },
    Header: {
      textAlign: "center",
      paddingBottom: "20px",
    },
  });

  const classes = useStyles();
  useEffect(async () => {
    let response = await getEvent();

    setEvents(response.data);

    var locations = new Set(response.data.map((item) => item.address.city));
    locations.add("All");
    var organizers = new Set(
      response.data.map((item) => item.organizer.fullName)
    );
    organizers.add("All");
    var statuses = new Set(response.data.map((item) => item.status));
    statuses.add("All");
    var location_dropdown = [];
    var organizer_dropdown = [];
    var status_dropdown = [];

    console.log("locations", locations);

    locations.forEach((a) => {
      var location_option_item = {};
      location_option_item["key"] = a;
      location_option_item["text"] = a;
      location_option_item["value"] = a;

      location_dropdown.push(location_option_item);
    });

    organizers.forEach((a) => {
      var organizer_option_item = {};
      organizer_option_item["key"] = a;
      organizer_option_item["text"] = a;
      organizer_option_item["value"] = a;

      organizer_dropdown.push(organizer_option_item);
    });

    statuses.forEach((a) => {
      var status_dropdown_item = {};
      status_dropdown_item["key"] = a;
      status_dropdown_item["text"] = a;
      status_dropdown_item["value"] = a;

      status_dropdown.push(status_dropdown_item);
    });
    setLocationList(location_dropdown);
    setOrganizerList(organizer_dropdown);
    setStatusList(status_dropdown);

    console.log("display event in 1st useEffect", displayEvents);
  }, []);

  useEffect(() => {
    getEvent();
    console.log("display event in 2nd useEffect", displayEvents);
  }, [location, status, startDate, endDate, organizer]);

  const getEvent = async () => {
    console.log("location in getEvent", location);

    let response = await axios.get(
      `${backendURL}/event`,

      {
        params: {
          status: status,
          location: location,
          startDate: startDate,
          endDate: endDate,
          organizer: organizer,
        },
      }
    );

    console.log(response.data);
    setDisplayEvents(response.data);
    return response;
  };

  const searchEvent = (keyword) => {
    setKeyword(keyword);
    if (keyword !== "") {
      const filteredData = events.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(keyword.toLowerCase());
      });
      setDisplayEvents(filteredData);
    } else {
      setDisplayEvents(events);
    }
  };

  const locationChange = (event, data) => {
    setLocation(data.value);
  };

  const organizerChange = (event, data) => {
    setOrganizer(data.value);
  };


  const statusChange = (event, data) => {
    setStatus(data.value);
  };

  return (
    <Box component="div" className={classes.container}>
      <NewNavBar />
      <div className={classes.HeaderContainer}>
        <h1 className={classes.Header}>Event Detail</h1>
      </div>
      <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
        <div>
          <Input
            icon="search"
            placeholder="Search..."
            onChange={(e) => searchEvent(e.target.value)}
          />

          <Dropdown
            placeholder="Search City"
            search
            selection
            clearable
            options={locationList}
            onChange={locationChange}
          />

          <Dropdown
            placeholder="Search Organizer"
            search
            selection
            clearable
            options={organizerList}
            onChange={organizerChange}
          />
          <Dropdown
            placeholder="Search Status"
            search
            selection
            clearable
            options={statusList}
            onChange={statusChange}
          />
          <Input
            label = "Start Date"
            type="date"
            placeholder ="Start Date"
            onChange ={(e) => setStartDate(e.target.value)}
          />

        <Input
            label = "End Date"
            type="date"
            placeholder ="End Date"
            onChange ={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <Card.Group itemsPerRow={3} style={{ marginTop: 20 }}>
            {displayEvents.map((item) => {
              return (
                <>
                  <Card
                    key={item.eventId}
                    header={item.title}
                    meta={"Organized By :"+item.organizer.fullName}
                    description={item.description}
                    extra={
                      <div>
                        <div>
                          {"Location :"+ item.address.city}
                          <br />
                          {item.status}
                          <br />
                          {item.status === "OPEN" && (
                            <>
                              {item?.participants?.length <
                              item.maxParticipants ? (
                                <Typography color="primary">Available</Typography>
                              ) : (
                                <Typography color="secondary">No spot left</Typography>
                              )}
                            </>
                          )}
                        
                          {"Deadline to Register:"+item.deadline.split("T")[0]}
                          <br/>
                          {"Event Starts on:"+item.startTime.split("T")[0]}
                          <br/>
                          {"Event Ends on:"+item.endTime.split("T")[0]}
                          <br/>

                        </div>
                        <Link to={"/eventDetail"} state={{ event: item }}>
                          <Button
                            primary
                            //   onClick={() => registerEvent(item.eventId)}
                          >
                            {"Check Details"}
                          </Button>
                        </Link>
                      </div>
                    }
                    key={item.eventId}
                  />

                  {/* <Card>
                                <Card.Content>
                                <Image
                                    floated='right'
                                    size='mini'
                                    src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                                    wrapped ui={false}/>
                                    <Card.Header>{item.title}</Card.Header>
                                    <Card.Description>
                                        {item.description}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                    <Button basic color='green'>
                                        Approve
                                    </Button>
                                    <Button basic color='red'>
                                        Decline
                                    </Button>
                                    </div>
                                </Card.Content>
                            </Card> */}
                </>
              );
            })}
          </Card.Group>
        </div>
      </div>
    </Box>
  );
}
