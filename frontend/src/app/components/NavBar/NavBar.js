import React, { Component, useState } from 'react';
import {  Link, Route, Router } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import SideBarList from "./SideBarList";
import { IconContext } from "react-icons";
import { Button, Col } from "react-bootstrap";
import Clock from 'react-live-clock';
import "./NavBar.css"

const NavBar = () => {

    // official system time
    const [systemTime, setSystemTime] = useState(localStorage.getItem("systemTime") || new Date());
    
    const [sidebar, setSidebar] = useState(false);

    const [timeInPicker, setTimeInPicker] = useState(systemTime || new Date())
    // const [date, setDate] = useState(new Date().toLocaleTimeString());

    if(!systemTime) {
        setSystemTime(new Date())
    }

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const changeTime = () => {
        console.log("time in clock", timeInPicker);
        console.log("System Time:", systemTime);
        // console.log("New Time set by date time picker", newTime);
        let changedDateTime = new Date(systemTime);
        // console.log("mimicTime Flag", mimicTime);
        // console.log(changedDateTime);
        
        
        // setTemp(newTime);
        setSystemTime(timeInPicker);
        localStorage.setItem("clock",timeInPicker);
        console.log("systemTime", timeInPicker);
    
        // const newAllotTime = new Date(changedDateTime);
        // setSystemTime(newAllotTime);
        // toggleMimicTime(true);
        // console.log("mimicTime Flag", mimicTime);
      };
    
  const setToCurrentTime = () => {
    const currentTime = new Date();
    setTimeInPicker(currentTime)
    setSystemTime(currentTime)
    localStorage.setItem("clock",currentTime);

  }
    
    return ( 
      <IconContext.Provider value={{ color: "#fff" }}>
          <div className="navbar">
            <Link to="/home" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            {/* <Logo className="logo" /> */}

            <Col md={2}>
              {/* <p style={{ color: "white" }}>Current Time : {date}</p> */}
              <p style={{ color: "white" }}>
                Current Actual Date : {new Date().toLocaleDateString()}
              </p>
            </Col>

            <Col md={2}>
              <p style={{ color: "white" }}>
                System Time : {new Date(systemTime).toLocaleString()}
              </p>
              <p style={{ color: "white" }}>
                {console.log("show time in picker", timeInPicker)}
                Picker Time : {new Date(timeInPicker).toLocaleString()}
              </p>
            </Col>

            <Col md={2}>
              <input
                type="datetime-local"
                id="deptime"
                name="deptime"
                onChange={(e) => {
                  setTimeInPicker(e.target.value);
                }}
                style={{}}
              ></input>
              <button
                onClick={() => {
                  changeTime();
                }}
                style={{
                  backgroundColor: "#7C0200",
                  height: "2rem",
                  color: "#FFF",
                  marginTop: "5px",
                }}
              >
                Update Date and Time
              </button>
            </Col>

            <Col>
              <button
                onClick={() => {
                  setToCurrentTime();
                }}
                style={{ backgroundColor: "#7C0200", color:"white" }}
              >
                Set to Current Date and Time
              </button>
            </Col>
          </div>
          <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
            <ul className="nav-menu-items" onClick={showSidebar}>
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              {SideBarList.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Clock
            // date={`${temp}:00`}
            date={`${systemTime}:00`}
            // format={'dddd, MMMM D, YYYY, h:mm:ss A'}
            ticking={true}
            // onChange={(e) => {
            //   console.log("clocking", e.target.value)
            //   setTimeInPicker(e.target.value)
            // }}
            />

        </IconContext.Provider>
    );
    // const date 
}
// class NavBar extends Component {
//     constructor(props) {
//         super(props);
//     }
//     state = {  }
//     render() { 
//         return ( 
//             <nav>
//                 {/* <input type="checkbox" id="check"></input>
//                 <label for="check" class="checkbtn">
//                     <i class="fas fa-bars"></i>
//                 </label> */}
//                 <label class="logo">Event Center</label>
//                 <ul>
//                     <li class='active'><a href="">Home</a></li>
//                     <li><a href="">About</a></li>
//                     <li><a href="">Services</a></li>
//                     <li><a href="">Feedback</a></li>
//                 </ul>

//             </nav>
//         );
//     }
// }
 
export default NavBar;