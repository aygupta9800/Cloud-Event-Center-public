import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../../../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { StylesContext } from "@material-ui/styles";
import { style } from "@mui/system";
import { Card } from "semantic-ui-react";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Box } from "@material-ui/core";
import "./SystemStats.css";
import NewNavBar from "../NavBar/NewNavBar";

//Pie chart for free vs paid events
//Pie chart for created vs canceled events, text stating ratio of participation
//Pie chart for created vs finished events, text stating average number of participants for events


export default function SystemStats(props) {
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

    const [canceledEventsParticipation, setCanceledEventsParticipation] = useState(0);

    const [avgParticipation, setAvgParticipation] = useState(0);

    const [systemStats, setSystemStats] = useState({
        finishedEvents: -1,
        paidEvents: -1,
        canceledEvents: -1,
        createdEvents: -1,
        participationRequests: -1,
        totalParticipants: -1,
        minimumParticipants: -1
    });

    const [hover, setHover] = useState(false);
    
    const onHover = () => {
        setHover(true);
    };

    const onLeave = () => {
        setHover(false);
    };
    
    useEffect(() => {
        const labelsForFreeVsPaid = [];
        const dataForFreeVsPaid = [];

        const labelsForCreatedVsCanceled = [];
        const dataForCreatedVsCanceled = [];

        const labelsForCreatedVsFinished = [];
        const dataForCreatedVsFinished = [];
        
        
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
        labelsForCreatedVsCanceled.push('Not canceled');
        
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

        setGraphForCreatedVsFinished({
            labels: labelsForCreatedVsFinished,
            data: dataForCreatedVsFinished,
        });

        let avgParticipation = (Number.parseInt(systemStats.totalParticipants)/Number.parseInt(systemStats.finishedEvents)).toFixed(2);
        console.log("### ", avgParticipation);
        setAvgParticipation(avgParticipation);
        
    }, [systemStats.finishedEvents]);

    const getSystemStats = async () => {
        const list1 = await axios.get(
            `${backendURL}/stats/system`
        
            ).then((response) => {
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

    const useStyles = makeStyles({
        container: {
            backgroundColor: 'white',
            
        },
        HeaderContainer: {
          paddingTop: '30px',
        },
        Header: {
          textAlign: 'center',
          paddingBottom: '20px'
        }, 
    })

    const classes = useStyles();

    return(
        <Box component="div" className={classes.container}>
        <center>
        
            <NewNavBar />
            <div className={classes.HeaderContainer}>
              <h1 className={classes.Header}>System Report</h1>
            </div>
        
        <Typography>
        {systemStats.finishedEvents >= 0 ? (<p class="lead">{systemStats.createdEvents} events have been created in the past 90 days</p>) : (<></>)}</Typography></center>
        
        <div class="container-fluid">
            <div class="row">
            <div class="col-sm">
            <div class="card">
            {systemStats.finishedEvents >= 0 ? (
                <>
            <h3> Ratio of paid events</h3>
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
            {systemStats.finishedEvents >= 0 ? (
            <>
            <h3> Ratio of finished events</h3>
            <div className="chart">
            <Pie data={dataForCreatedVsFinished}/>
            <h5>Average Participation: {isNaN(avgParticipation) ? 0 : avgParticipation}</h5>
           
            </div>
             </>
            ) : (<></>)}

            </div>
            </div>
            <div class="col-sm"></div>

            </div>
        </div>
        </Box>

    );
}
