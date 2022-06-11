import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../../../../config"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { StylesContext } from "@material-ui/styles";
import { style } from "@mui/system";
import { Card } from "semantic-ui-react";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Typography } from "@material-ui/core";
import "./SystemStats.css";


import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);


// Organizer report.
// Number of created events (based on creation time) and the percentage of paid events.
// Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
// Number of finished events (based on finishing time), and the average number of participants of these events.  
// Number of paid events finished (based on finishing time) and total revenue from these events.

//Pie chart for free vs paid events
//Pie chart for created vs canceled events, text stating ratio of participation
//Pie chart for created vs finished events, text stating average number of participants for events
//  Number of paid events finished (based on finishing time) and total revenue from these events.


export default function OrganizerStats(props) {
    const [graphForFreeVsPaid, setGraphForFreeVsPaid] = useState({
        labels: [],
        data: [],
    });

    const [graphForCreatedVsCanceled, setGraphForCreatedVsCanceled] = useState({
        labels: [],
        data: [],
    });

    const [graphForCreatedVsFinished, setGraphForCreatedVsFinished] = useState({
        labels: [],
        data: [],
    });

    const [graphForPaidFinished, setGraphForPaidFinished] = useState({
        labels: [],
        data: [],
    });

    const [canceledEventsParticipation, setCanceledEventsParticipation] = useState(0);

    const [avgParticipation, setAvgParticipation] = useState(0);

    const [systemStats, setSystemStats] = useState({
        finishedEvents: -1,
        paidEvents: -1,
        canceledEvents: -1,
        createdEvents: -1,
        participationRequests: -1,
        totalParticipants: -1,
        minimumParticipants: -1,
        totalFreeFinishedEvents: -1,
        totalPaidFinishedEvents: -1,
        totalRevenue:-1
    });

    const [hover, setHover] = useState(false);
    
    const onHover = () => {
        setHover(true);
    };

    const onLeave = () => {
        setHover(false);
    };
    
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        const labelsForFreeVsPaid = [];
        const dataForFreeVsPaid = [];

        const labelsForCreatedVsCanceled = [];
        const dataForCreatedVsCanceled = [];

        const labelsForCreatedVsFinished = [];
        const dataForCreatedVsFinished = [];

        const labelsForFinishedPaidVsUnpaid = [];
        const dataForFinishedPaidVsUnpaid =[];
        
        
        getSystemStats();

        labelsForFreeVsPaid.push('Free events');
        labelsForFreeVsPaid.push('Paid events');
        
        let freeEvents = Number.parseInt(systemStats.createdEvents) - Number.parseInt(systemStats.paidEvents);
        dataForFreeVsPaid.push(freeEvents);
        dataForFreeVsPaid.push(Number.parseInt(systemStats.paidEvents));

        setGraphForFreeVsPaid({
            labels: labelsForFreeVsPaid,
            data: dataForFreeVsPaid,
        });


        labelsForCreatedVsCanceled.push('Canceled');
        labelsForCreatedVsCanceled.push('Not cancelled');
        
        let nonCanceledEvents = Number.parseInt(systemStats.createdEvents) - Number.parseInt(systemStats.canceledEvents);
        dataForCreatedVsCanceled.push(Number.parseInt(systemStats.canceledEvents));
        dataForCreatedVsCanceled.push(nonCanceledEvents);

        setGraphForCreatedVsCanceled({
            labels: labelsForCreatedVsCanceled,
            data: dataForCreatedVsCanceled,
        });

        let participationRatioForCanceled = (Number.parseInt(systemStats.participationRequests)/Number.parseInt(systemStats.minimumParticipants)).toFixed(2);
        console.log("### ", participationRatioForCanceled);
        setCanceledEventsParticipation(participationRatioForCanceled);

        //////////////

        labelsForCreatedVsFinished.push('Finished');
        labelsForCreatedVsFinished.push('Unfinished');
        
        let unfinishedEvents = Number.parseInt(systemStats.createdEvents) - Number.parseInt(systemStats.finishedEvents);
        dataForCreatedVsFinished.push(Number.parseInt(systemStats.finishedEvents));
        dataForCreatedVsFinished.push(unfinishedEvents);

        dataForFinishedPaidVsUnpaid.push(Number.parseInt(systemStats.totalFreeFinishedEvents));
        dataForFinishedPaidVsUnpaid.push(Number.parseInt(systemStats.totalPaidFinishedEvents));


        setGraphForCreatedVsFinished({
            labels: labelsForCreatedVsFinished,
            data: dataForCreatedVsFinished,
        });
        setGraphForPaidFinished({
            labels: labelsForFreeVsPaid,
            data: dataForFinishedPaidVsUnpaid,
        });
        

        let avgParticipation = (Number.parseInt(systemStats.totalParticipants)/Number.parseInt(systemStats.finishedEvents)).toFixed(2);
        console.log("### ", avgParticipation);
        setAvgParticipation(avgParticipation);
        
    }, [systemStats.finishedEvents]);

    const getSystemStats = async () => {
        const list1 = await axios
        .get(`${backendURL}/stats/user/organizer`,
        
        {
          params: {
            userId: userId,
          }
        }).then((response) => {
                console.log(response.data);
                setSystemStats(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }


    const dataForFreeVsPaid = {
        labels: graphForFreeVsPaid.labels,
        datasets: [
            {

                label: 'Ratio of paid and free events',
                data: graphForFreeVsPaid.data,

                backgroundColor: [
                    'rgba(0, 255, 0, 1.0',
                    'rgba(128, 0, 128, 1.0'
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataForCreatedVsCanceled = {
        labels: graphForCreatedVsCanceled.labels,
        datasets: [
            {

                label: 'Ratio of created and canceled events',
                data: graphForCreatedVsCanceled.data,

                backgroundColor: [
                    'rgba(255, 0, 0, 0.7',
                    'rgba(0, 100, 0, 0.6'
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataForCreatedVsFinished = {
        labels: graphForCreatedVsFinished.labels,
        datasets: [
            {

                label: 'Ratio of created and finished events',
                data: graphForCreatedVsFinished.data,

                backgroundColor: [
                    'rgba(0, 0, 255, 0.8',
                    'rgba(0,255, 255, 0.4'
                ],
                borderWidth: 1,
            },
        ],
    };


    const dataForFinishedPaidVsUnpaid = {
        labels: graphForPaidFinished.labels,
        datasets: [
            {

                label: 'Ratio of created and finished events',
                data: graphForPaidFinished.data,

                backgroundColor: [
                    'rgba(0, 0, 255, 0.8',
                    'rgba(0,255, 255, 0.4'
                ],
                borderWidth: 1,
            },
        ],
    };

    return(
        <>
        <center>
        <Typography>
        <h3 style={{ color: "#05164d" }}>
        <em>Organizer Report</em>
      </h3>
        {systemStats.finishedEvents >= 0 ? (<p class="lead">{systemStats.createdEvents} events have been created in the past 90 days</p>) : (<></>)}</Typography></center>
        
        <div class="container-fluid">
            <div class="row">
            <div class="col-sm">
            <div class="card">
            <h3> Ratio of paid events</h3>
            {systemStats.finishedEvents >= 0 ? (
                <>
            <div className="chart">
                <Pie data={dataForFreeVsPaid}/>
            </div>
            </>
            ) : (<></>)}
            
            </div>
            </div>

            <div class="col-sm">
            <div class="card">
            {systemStats.finishedEvents >= 0 ? (
                <>
            <h3 style={{"textAlign": "center"}}>Ratio of canceled events</h3>
            <div className="chart">
                <Pie data={dataForCreatedVsCanceled}/>

                <h5 style={{"textAlign": "center"}} onMouseEnter={onHover}
                onMouseLeave={onLeave}>{hover ? <Card>Calculated as number of participation requests divided by number of minimum participants</Card> : ""} &#x24D8; Participation ratio: {canceledEventsParticipation} </h5>
            </div>
            
            </>
            ) : (<></>)}
            
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-sm">
            <div class="card">
            <h3> Ratio of finished events</h3>

            {systemStats.finishedEvents >= 0 ? (
            <>
            <div className="chart">
            <Pie data={dataForCreatedVsFinished}/>
            <h5>Average Participation: {isNaN(avgParticipation) ? 0 : avgParticipation}</h5>
           
            </div>
             </>
            ) : (<></>)}

            </div>
            </div>
            <div class="col-sm">
            <div class="card">
            <h3> Ratio of finished paid events</h3>

            {systemStats.finishedEvents > 0 ? (
            <>
            <div className="chart">
                <Pie data={dataForFinishedPaidVsUnpaid}/>
            <h5>Total Revenue: {systemStats.totalRevenue}</h5>
           
            </div>
             </>
           ) : (<> <em>No Finished Events!</em></>)}
            </div>
            </div>
            </div>
        </div>
    
        </>

    );
}
