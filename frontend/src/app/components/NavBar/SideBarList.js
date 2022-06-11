import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
// import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";

// to show 
// for all: 0, for signed in : 1, for not signed in 2

const SideBarList = [
    {
        itemText: 'Sign Up',
        itemPath: '/signup',
        itemStatus: 2,
    },
    {
        itemText: 'Sign In',
        itemPath: '/signin',
        itemStatus: 2,
    },
    {
        // itemIcon: <Home />,
        itemText: 'Browse Events',
        itemPath: '/event',
        itemStatus: 0,
    },
    {
        itemText: 'Create Event',
        itemPath: '/createEvent',
        itemStatus: 1,
    },
    {
        itemText: 'Change System Time',
        itemPath: '/updateSystemTime',
        itemStatus: 0,
    },

    {
        itemText: 'User Report',
        itemPath: '/userstats',
        itemStatus: 1,
    },
    {
        itemText: 'System Report',
        itemPath: '/systemstats',
        itemStatus: 1,
    }
];

export default SideBarList;