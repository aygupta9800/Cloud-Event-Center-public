import React, { Component } from 'react';
import './Sidebar.css'

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return ( 
            <div>
                <input type="checkbox" id="check"></input>
                <label for="check">
                    <i className="fas fa-bars" id="btn"></i>
                    <i className="fas fa-times" id="cancel"></i>
                </label>
                <div class='mainDiv'>
                        <header> Navigate </header>
                    <ul>
                        <li><a href=""><i className="fas fa-qrcode"></i>Dashboard</a></li>
                        <li><a href=""><i className="fas fa-stream"></i>Overview</a></li>
                        <li><a href=""><i className="fas fa-calendar-week"></i>Events</a></li>
                        <li><a href=""><i className="far fa-question-circle"></i>About</a></li>
                        <li><a href=""><i className="far fa-envelope"></i>Contact</a></li>
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Sidebar;