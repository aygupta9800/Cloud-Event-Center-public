import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { backendURL } from "../../../config";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NewNavBar from "../NavBar/NewNavBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';
import { Select } from "semantic-ui-react";


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

export default function EventDetail(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(state.event);
  const systemTime = new Date(localStorage.getItem("systemTime"))
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();

  const currentUserId = parseInt(localStorage.getItem("userId"));
  const isCurrentUserOrganizer = currentUserId ===event?.organizer?.userId;
  const accountType = localStorage.getItem("accountType");
  const currentParticipant = event?.participants.filter(
    (x) => x.userId === currentUserId )
  // console.log("currentParticipant", currentParticipant);
  const isUserParticipant = currentParticipant.length > 0;
  const userEventStatus = isUserParticipant ? currentParticipant[0]?.participantStatus: "Not Registered";
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    // TODO: pass and read event id from props
    // getEventDetail(13);
    getEventDetail();
  }, []);

  const getEventDetail = async () => {
    await axios
      .get(`${backendURL}/event/${event.eventId}`)
      .then((response) => {
        console.log("response:", response.data);
        setEvent(response.data);
        // alert("event created");        // navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    const [feeOpen, setFeeOpen] = useState(false);
    const showPostReviewOnOrganizerButton =
      event.participants.filter(
        (x) => x.userId === currentUserId && x.participantStatus === "Enrolled"
      ).length > 0;
    const handleClickOpen = () => {
      setFeeOpen(true);
    };

    const handleClose = () => {
      setFeeOpen(false);
    };

    const registerEventApiCall = async () => {
      try {
        const response = await axios.post(
          `${backendURL}/event/signup`,
          null,
          { params: { eventId: event.eventId, userId: currentUserId} }
        );
       
        console.log("Response for sendMessage function: ", response);
        setEvent(response.data);
        console.log("event after register", event);
        alert("Registered!");
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || err);
      }
    };

    const handleAgreeClose = async () => {
      setFeeOpen(false);
      registerEventApiCall();
    };

    const registerEvent = () => {
      if (performValidations()) {
        if (event.fee > 0) {
          setFeeOpen(true);
          return;
        }
        registerEventApiCall();
        return;
      }
    };

    const performValidations = () => {
      // systemTime must be before deadline
      if (systemTime > new Date(event?.deadline)) {
        alert("You cant register after the deadline")
        return false;
      }
      const participants = event.participants.map(({ userId }) => userId);

      //  console.log(typeof(currentUserId), typeof(participants[0]), currentUserId in participants);

      if (!currentUserId || currentUserId.length === 0) {
        alert("Login to register!");
        navigate("/signin");
        return false;
      }

      if (accountType && accountType != "PERSON") {
        alert("Organizations cant register!");
        return false;
      }
      if (currentUserId === event.organizer.userId) {
        alert("Organizers cannot participate in the event!");
        return false;
      }

      if (event.maxParticipants === event.participants.length) {
        alert("Sorry! No spots left");
        return false;
      }

      if (event.maxParticipants === event.participants.length) {
        alert("Sorry! No spots left");
        return false;
      }

      if (participants.includes(currentUserId)) {
        alert("You are already registered for this event");
        return false;
      }

      return true;
    };
    // const {} = useState();
    return (
      <Card style={{ backgroundColor: "white", paddingTop: 20 }}>
        <Dialog
          open={feeOpen}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ fontWeight: "bold" }}>
            {"Ready for Fee Payment!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Approve auto debit request for the event fee amount: ${event?.fee}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <Button
              onClick={handleAgreeClose}
              autoFocus
              color="primary"
              variant="contained"
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1, paddingBottom: 20 }}>
            <Typography
              variant="h6"
              style={{ marginLeft: "40px", marginBottom: "20px" }}
            >
              {event?.title}
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Event Description"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.description}
                </Typography>
              </div>
            </div>
          
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Registeration Type"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.admissionPolicy === "AR"? "Approval Required": "Auto Approval"}
                </Typography>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Registeration Deadline"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {new Date(event?.deadline).toLocaleString()}
                </Typography>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Event Start Time"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {new Date(event?.startTime).toLocaleString()}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Event End Time"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {new Date(event?.endTime).toLocaleString()}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Fees"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.fee}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Address"}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {`${event?.address?.city}, ${event?.address?.state}, ${event?.address?.number}, ${event?.address?.street}, ${event?.address?.zip}`}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Minimum Participants"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.minParticipants}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Maximum Participants"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.maxParticipants}
                </Typography>
              </div>
            </div>

            {isCurrentUserOrganizer ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Your Role"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Organizer"}
                </Typography>
              </div>
            </div>
            ):
            (
              <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Your Status"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {userEventStatus}
                </Typography>
              </div>
            </div>
            )
            }

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1, height: 40 }}>
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {"Current Participants"}
                </Typography>
              </div>
              <div style={{ flex: 1, height: 40 }}>
                {/* {console.log("events", event)} */}
                <Typography variant="body1" style={{ marginLeft: "40px" }}>
                  {event?.participants?.length}
                </Typography>
              </div>
            </div>

            {!isCurrentUserOrganizer && (
              <>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ flex: 1, height: 40 }}>
                    <Typography variant="body1" style={{ marginLeft: "40px" }}>
                      {`Organizer name`}
                    </Typography>
                  </div>
                  <div style={{ flex: 1, height: 40 }}>
                    {/* {console.log("event", event)} */}
                    <Typography variant="body1" style={{ marginLeft: "40px" }}>
                      {event?.organizer?.fullName}
                    </Typography>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ flex: 1, height: 40 }}>
                    <Typography variant="body1" style={{ marginLeft: "40px" }}>
                      {`Organizer Reputation Score`}
                    </Typography>
                  </div>
                  <div style={{ flex: 1, height: 40 }}>
                    {/* {console.log("event", event)} */}
                    <Typography variant="body1" style={{ marginLeft: "40px" }}>
                      {event?.organizerReputationScore > 0 ? event?.organizerReputationScore: "No Score Given Yet"}
                    </Typography>
                  </div>
                </div>
              </>
            )}

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: 50,
              }}
            >
              {isCurrentUserOrganizer && (
                <Link 
                to={"/enrolledParticipants"} 
                state={{ event: event }}
                style= {{ height: 40, alignSelf: "center",
                paddingRight: "25px",
                flex: 1
              }}
                >
                  <Button
                    variant="outlined"
                    style={{
                      textAlign: "center",
                      backgroundColor: "rgb(36,36,36)",
                      color: "white",
                      
                    }}
                  >
                    Approved Participants
                  </Button>
                </Link>
              )}
              {isCurrentUserOrganizer && event.admissionPolicy === "AR" && (
                <Link to={"/pendingEventRequests"}
                 state={{ event: event }}
                 style={{
                  paddingRight: "25px",
                  height: 40,
                  alignSelf: "center",
                  flex: 1
                 }}
                 >
                  <Button
                    variant="outlined"
                    style={{
                      textAlign: "center",
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    Process Pending Request
                  </Button>
                </Link>
              )}
              {!isCurrentUserOrganizer && showPostReviewOnOrganizerButton &&(
                    <Link
                      to={"/postReview"}
                      state={{
                        givenToUserId: event?.organizer?.userId,
                        reviewType: "onOrganizer",
                        event,
                      }}
                      style={{
                        paddingRight: "25px",
                        height: 40,
                        alignSelf: "center",
                        flex: 1
                      }}
                    >
                      <Button
                        variant="outlined"
                        style={{
                          textAlign: "center",
                          backgroundColor: "red",
                          color: "white",
                          height: 50,
                          paddingRight: 20,
                        }}
                      >
                        Post Review
                      </Button>
                    </Link>
                  )}
                {!isCurrentUserOrganizer && (
                <div style={{
                      height: 40,
                      alignSelf: "center",
                      flex: 1,
                }}>
                  <Button
                    variant="outlined"
                    style={{
                      paddingRight: "25px",
                      textAlign: "center",
                      backgroundColor: "rgb(36,36,36)",
                      color: "white",
                      height: 50,
                      width: 150,
                    }}
                    onClick={() => {
                      registerEvent(event?.eventId);
                    }}
                  >
                    Register
                  </Button>
                </div>

              )}
              {!isCurrentUserOrganizer && (                 
                 <Link
                    to={"/reviews"}
                    state={{
                      userId: event?.organizer?.userId,
                      reviewType: "onOrganizer",
                    }}
                    style={{
                      paddingRight: "25px",
                      height: 50,
                      alignSelf: "center",
                      flex: 1,
                    }}
                  >
                    <Button
                      variant="outlined"

                      style={{
                        textAlign: "center",
                        backgroundColor: "red",
                        color: "white",
                        height: 50,
                        // width: 150,
                      }}
                    >
                      Browse Organiser Reviews
                    </Button>
                  </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const Tab2 = () => {
    // console.log("====event", event);
    const [forumDetails, setForumDetails] = useState({
      forumId: event.forums.SIGNUP.forumId,
      forumType: event.forums.SIGNUP.forumType,
      forumMode: event.forums.SIGNUP.forumMode,
      description: event.forums.SIGNUP.description,
      eventId: event.eventId,
      messages: [],
    });

    // take a state obj
    const [reRender, setReRender] = useState(0);

    const [newMessage, setNewMessage] = useState("");
    const [newImage, setNewImage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
      getForumDetails();
    }, [reRender]);

    let user = {};
    user = JSON.parse(localStorage.getItem("user"));
    console.log("user is: ", user);
    const getForumDetails = async () => {
      // let userId = Number.parseInt(user.userId));
      // let  Number.parseInt(forumDetails.forumId));
      //console.log(Number.parseInt(user.userId));
      console.log("==================234");
      const list1 = await axios
        .get(
          `${backendURL}/forum?forumId=${Number.parseInt(
            forumDetails.forumId)}&userId=${Number.parseInt(user.userId)}`
        )
        .then((response) => {
          console.log(response.data);
          setForumDetails(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    function useForceUpdate() {
      const [value, setValue] = useState(0); // integer state
      return () => setValue((value) => value + 1); // update the state to force render
    }

    const forceUpdate = useForceUpdate();

    const postNewMessage = async (e) => {
      console.log("here");
      e.preventDefault();
      const data = {
        participantID: parseInt(user.userId),
        participantName: user.screenName,
        message: newMessage,
        imageURL: newImage,
        forumId: Number.parseInt(forumDetails.forumId),
      };

      console.log("data is ", JSON.stringify(data));
      const list1 = await axios
        .post(`${backendURL}/forum/postmessage`, data)
        .then((response) => {
          console.log(response.data);
          // window.location.reload(false);
          console.log("=========calling");
          setReRender(reRender + 1);
          //setForumDetails(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fileSelector = (event) => {
      let data = new FormData();
      data.append("file", event.target.files[0], event.target.files[0].name);
      console.log(data);
      console.log("here file select");
      //console.log(this.state.image1);
      axios
        .post(`${backendURL}/forum/upload`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          //console.log(response.data.message);
          //console.log(response.data.message.replace(/['"]+/g, ''));
          setNewImage(response.data.message.replace(/['"]+/g, ""));
        })
        .catch((err) => {
          console.log("Something went wrong " + err);
        });
    };

    return (
      <>
        <div>
          {forumDetails.messages.length > 0 ? (
            forumDetails.messages.map((message) => (
              <div className="container1" key={message.messageId}>
                {message.imageURL !== "" ? (
                 <> <img className="photo-chat" src={message.imageURL}></img><br/></>
                ) : (
                  <p></p>
                )}
              
                <span className="m-0" style={{"font-family": "Open Sans", "fontSize": "15px"}}>{message.message}</span>
                <span style={{"font-family": "Open Sans", "fontSize": "14px"}}>-{message.participantName}</span>
              </div>
            ))
          ) : forumDetails.forumMode === "OPEN" ? (
            <h1>Be the first one to post a message</h1>
          ) : (
            <p class="lead">{forumDetails.description}</p>
          )}

          <br />
          <form
            onSubmit={postNewMessage}
            hidden={forumDetails.forumMode === "OPEN" ? false : true}
          >
            <div>
            <input
              type="text" className="chattextbox"
              placeholder="Enter message"
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />

            
              {/* <input type="file" name="image" className="avatar text-center center-block file-upload" multiple={false} onChange={this.fileSelector} /> */}
              <input
                type="file"
                id="img"
                multiple={false}
                onChange={fileSelector}
                name="img"
                accept="image/*"
              />
           </div>
        <br/>
        <div>
            <button type="submit" className="button1custom">Post</button>
            </div>
          </form>
        </div>
      </>
    );
  };

  const Tab3 = () => {
    // console.log("====event", event);
    const [forumDetails, setForumDetails] = useState({
      forumId: event.forums.PARTICIPANT.forumId,
      forumType: event.forums.PARTICIPANT.forumType,
      forumMode: event.forums.PARTICIPANT.forumMode,
      description: event.forums.PARTICIPANT.description,
      eventId: event.eventId,
      messages: [],
    });

    // take a state obj
    const [reRender, setReRender] = useState(0);
    const [errMessage, setErrMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newImage, setNewImage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
      getForumDetails();
    }, [reRender]);

    let user = {};
    user = JSON.parse(localStorage.getItem("user"));
    console.log("user is: ", user);
    const getForumDetails = async () => {
      // let userId = Number.parseInt(user.userId));
      // let  Number.parseInt(forumDetails.forumId));
      //console.log(Number.parseInt(user.userId));
      console.log("==================234");

      //add condition for checking start date to decide whether to render forum

      const list1 = await axios
        .get(
          `${backendURL}/forum?forumId=${Number.parseInt(
            forumDetails.forumId
          )}&userId=${Number.parseInt(user.userId)}`
        )
        .then((response) => {
          console.log(response.data);
          setForumDetails(response.data);
        })
        .catch((error) => {
          setErrMessage(error.response.data.message);
          //if error is forbidden then show message to user
          console.log(error);
        });
    };

    function useForceUpdate() {
      const [value, setValue] = useState(0); // integer state
      return () => setValue((value) => value + 1); // update the state to force render
    }

    const forceUpdate = useForceUpdate();

    const postNewMessage = async (e) => {
      console.log("here");
      e.preventDefault();
      const data = {
        participantID: parseInt(user.userId),
        participantName: user.screenName,
        message: newMessage,
        imageURL: newImage,
        forumId: Number.parseInt(forumDetails.forumId),
      };

      console.log("data is ", JSON.stringify(data));
      const list1 = await axios
        .post(`${backendURL}/forum/postmessage`, data)
        .then((response) => {
          console.log(response.data);
          // window.location.reload(false);
          console.log("=========calling");
          setReRender(reRender + 1);
          //setForumDetails(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const closeParticipantForum = async (e) => {
      console.log("here");
      e.preventDefault();
      const data = {
        userId: parseInt(user.userId),
        forumId: Number.parseInt(forumDetails.forumId),
      };

      console.log("data is ", JSON.stringify(data));
      const list1 = await axios
        .post(`${backendURL}/forum/closeParticipantForum`, data)
        .then((response) => {
          console.log(response.data);
          // window.location.reload(false);
          console.log("=========calling");
          setReRender(reRender + 1);
          //setForumDetails(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fileSelector = (event) => {
      let data = new FormData();
      data.append("file", event.target.files[0], event.target.files[0].name);
      console.log(data);
      console.log("here file select");
      //console.log(this.state.image1);
      axios
        .post(`${backendURL}/forum/upload`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          //console.log(response.data.message);
          //console.log(response.data.message.replace(/['"]+/g, ''));
          setNewImage(response.data.message.replace(/['"]+/g, ""));
        })
        .catch((err) => {
          console.log("Something went wrong " + err);
        });
    };

    return (
      <>
        <div>
          {
            // errMessage !== '' ?
            forumDetails.messages.length > 0 &&
            forumDetails.forumMode === "OPEN" &&
            errMessage === "" ? (
              forumDetails.messages.map((message) => (
                <div className="container1" key={message.messageId}>
                  {message.imageURL !== "" ? (
                    <img className="photo-chat" src={message.imageURL}></img>
                  ) : (
                    <p></p>
                  )}
                  <span className="m-0">{message.message}</span>
                  <span className="">-{message.participantName}</span>
                </div>
              ))
            ) : forumDetails.forumMode === "OPEN" ? (
              <p class="lead">Be the first one to post a message here!</p>
            ) : 
            (<p class="lead">{errMessage}</p>)
          }

          <br />
          <form
            onSubmit={postNewMessage}
            hidden={forumDetails.forumMode === "OPEN" ? false : true}
          >
            <input
              type="text"
              placeholder="Enter message"
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
            <label>
              Add image
              <br />
              {/* <input type="file" name="image" className="avatar text-center center-block file-upload" multiple={false} onChange={this.fileSelector} /> */}
              <input
                type="file"
                id="img"
                multiple={false}
                onChange={fileSelector}
                name="img"
                accept="image/*"
              />
            </label>
            <br />
            <br />

            <input type="submit"></input>
          </form>

          {isCurrentUserOrganizer && forumDetails.forumMode === "OPEN" ? (<button className="button2custom" onClick={closeParticipantForum}>Close forum</button>) : (<></>)}
        </div>
      </>
    );
  };

  return (
    <>
      {/* <NavBar /> */}
      <Box component="div" className={classes.container}>
        <NewNavBar />
        <div className={classes.HeaderContainer}>
          <h1 className={classes.Header}>Event Detail</h1>
        </div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Details" />
          <Tab label="Signup Forum" />
          <Tab label="Participant Forum" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Tab1 />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Add forum component here */}
          <Tab2 />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Tab3 />
        </TabPanel>
      </Box>
    </>
  );
}
