import React, { useState } from "react";
// import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { backendURL } from "../../../config";
import { CameraAlt } from "@material-ui/icons";
import { Send } from "@material-ui/icons";
import "./Forums.css";

const SignUpForum = (props) => {
    const [forumDetails, setForumDetails] = useState({
        forumId: 0,
        forumType: "",
        forumMode: "",
        description: "",
        eventId: 0,
        messages: []
    });


    const [newMessage, setNewMessage] = useState('');
    const [newImage, setNewImage] = useState('');    

    const navigate = useNavigate();

    useEffect(() => {
        getForumDetails();
      }, []);
    
      const getForumDetails = async () => {
        //console.log("here");
        const list1 = await axios
          .get(`${backendURL}/forum/2/1`)
          .then((response) => {
            console.log(response.data);
            setForumDetails(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      function useForceUpdate(){
        const [value, setValue] = useState(0); // integer state
        return () => setValue(value => value + 1); // update the state to force render
    };

    const forceUpdate = useForceUpdate();

      const postNewMessage = async (e) => {
        console.log("here");
        e.preventDefault();
        const data = {
          participantID: 15,
          participantName: "Mugdha",
          message: newMessage,
          imageURL: newImage,
          forumId: 2
        };
        console.log(data)
        const list1 = await axios
          .post(`${backendURL}/forum/postmessage`, data)
          .then((response) => {
            console.log(response.data);
            window.location.reload(false);
            //setForumDetails(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const fileSelector = (event) => {
        let data = new FormData();
        data.append('file', event.target.files[0], event.target.files[0].name)
        console.log(data)
        console.log("here file select");
        //console.log(this.state.image1);
        axios.post(`${backendURL}/forum/upload`,
            data, {
            headers: { "Content-Type": "multipart/form-data", }
            ,
        })
            .then(response => {
                //console.log(response.data.message);
                //console.log(response.data.message.replace(/['"]+/g, ''));
               setNewImage(response.data.message.replace(/['"]+/g, ''))
            })
            .catch(err => {
                console.log('Something went wrong ' + err);
            });
    }



      return(
        <>
          <div>
          {forumDetails.messages.length > 0 ? (
              forumDetails.messages.map((message) => (
                <div className="container1" key={message.messageId}>

                {(message.imageURL!=="") ?

                  <img className="photo-chat" src={message.imageURL}></img>
                  :<p></p>
              }
                  <span className="m-0">{message.message}</span>
                  <span className="">-{message.participantName}</span>
                
                </div>
              ))
            ) : (
              <h1>No messages here</h1>
            )}


            <br/>
            <form onSubmit={postNewMessage}>
      
              <input type="text" placeholder="Enter message" onChange={(e) => setNewMessage(e.target.value)} required/>
              <label>Add image
                <br/>
                {/* <input type="file" name="image" className="avatar text-center center-block file-upload" multiple={false} onChange={this.fileSelector} /> */}
                <input type="file" id="img" className= {CameraAlt} multiple={false} onChange={fileSelector} name="img" accept="image/*"/>
                </label>
                
              
                <input type="submit"></input>


            </form>

          </div>
        </>
      )
};

export default SignUpForum;