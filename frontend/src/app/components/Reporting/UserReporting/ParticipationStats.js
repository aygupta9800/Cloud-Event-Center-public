import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Row, Col } from "reactstrap";
import { backendURL } from "../../../../config"

import { SignedUpChart } from "./charts/SignedUpChart";
import { EnrolledRejectedEventChart} from "./charts/EnrolledRejectedEventChart"
import { FinishedEventChart } from "./charts/FinishedEventChart";

export default function ParticipationStats() {

  const [signedupEvents, setSignedupEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [finishedEvents, setFinishedEvents] = useState([])
  const userId = localStorage.getItem("userId");



  useEffect(() => {
    async function fetchData() {

      const participantStats = await axios
      .get(`${backendURL}/stats/user/participation`,
      
      {
        params: {
          userId: userId,
        }
      })
      .then((response) => {
        setSignedupEvents(response.data.signedupEvents);
        setEnrolledEvents(response.data.enrolledEvents);
        setRejectedEvents(response.data.rejectedEvents);
        setFinishedEvents(response.data.finishedEvents);

        console.log("response:", response.data);
        // alert("event created");        // navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
     
    }
    fetchData();
    console.log(signedupEvents);
  }, []);
  return (
    <div>
      <h3 style={{ color: "#05164d" }}>
        <em>Participant Report</em>
      </h3>
      <Container fluid className="content-wrapper">
        <Row
          md="auto"
          style={{
            justifyContent: "space-evenly",
          }}
        >
          <Col className="review-per-day" md="auto">
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "20px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.3)",
                margin: "10px",
                padding: "20px",
                animation: "fade 3s",
                backgroundColor: "#ffffff",
                animation: "alternate 2sec",
              }}
            >
              {signedupEvents ? (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <SignedUpChart signedup={signedupEvents} />
                </div>
              ) : (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <SignedUpChart signedup={[]} />
                </div>
              )}
            </Card>
          </Col>
          <Col className="top-5-reviewed-companies" md="auto">
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "20px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.3)",
                margin: "10px",
                padding: "20px",
                animation: "fade 3s",
                backgroundColor: "#ffffff",
                animation: "alternate 2sec",
              }}
            >
              {rejectedEvents && enrolledEvents ?  (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <EnrolledRejectedEventChart rejected={rejectedEvents} approved = {enrolledEvents}/>
                </div>
              ) : rejectedEvents ? (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <EnrolledRejectedEventChart rejected={[rejectedEvents]} approved = {[]} />
                </div>
              ): enrolledEvents? (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <EnrolledRejectedEventChart rejected={[]} approved = {[]}/>
                </div>
              ):
              <div style={{ font: "1.475rem", fontWeight: "bold" }}>
              <EnrolledRejectedEventChart rejected={[]} approved ={[]} />
            </div>
            }

            </Card>
          </Col>
          <Col className="top-10-companies-views-pday" md="auto">
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "20px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.3)",
                margin: "10px",
                padding: "20px",
                animation: "fade 3s",
                backgroundColor: "#ffffff",
                animation: "alternate 2sec",
              }}
            >
              {finishedEvents ? (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <FinishedEventChart finished={finishedEvents} />
                </div>
              ) : (
                <div style={{ font: "1.475rem", fontWeight: "bold" }}>
                  <FinishedEventChart companies={[]} />
                </div>
              )}
            </Card>
          </Col>
         
        </Row>
      </Container>
    </div>
  );
}