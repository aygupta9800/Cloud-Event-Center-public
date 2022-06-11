import React from 'react';
// import NavigationBar from './navigationbar.js';
// import Dashboard from './Dashboard.js';
import CustomSideBar from '../CustomSideBar/CustomSideBar';
import './Home.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    let navigate = useNavigate();    
    useEffect(() => {
        navigate('/event');
    }, []);
    return (
       <>
       </>
    )
}

export default Home;