import React, { useEffect, useState } from 'react';
import './SignUp.css'
// import { withRouter } from 'react-router';
// import { Link, Redirect } from 'react-router-dom'
import { useLocation, useNavigate } from "react-router-dom";
import {makeStyles, withStyles } from '@material-ui/core/styles';
import Dropdown from '../Dropdown/Dropdown';
import { UserContext } from '../../../user-context';
import axios from 'axios';
import { accountType  as accountTypeEnum } from '../../constants';
import { backendURL } from '../../../config';
import NewNavBar from "../NavBar/NewNavBar";

const SignUp = props => {
    const navigate = useNavigate();
    const [fullName, setfullName] = useState('');
    const [screenName, setScreenName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState(accountTypeEnum.person);
    const [gender, setGender] = useState('MALE');
    const [description, setDescription] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [number, setNumber] = useState('');

    const[error, setError] = useState('');
    const userContxt = React.useContext(UserContext);

    const useStyles = makeStyles({
        gridContainer: {
            display: 'flex',
            paddingLeft: '40px',
            paddingRight: '40px',
            overflow: 'auto',
            justifyContent: 'start',
            flexWrap: 'wrap',
          },
          container: {
              backgroundColor: '#FBF5F5',
              
          },
          HeaderContainer: {
            paddingTop: '30px',
          },
          Header: {
            textAlign: 'center',
            paddingBottom: '20px'
          }, 
          datelable: {
            marginTop: '15px',
            marginLeft: '5px',
            fontSize: '16px',
            },
        timeHeading: {
            margin: '5px',
            fontSize: '16px', 
        },
        datetime:{
            color: '#adadad',
            margin: '10px',
            fontSize: '16px',
        }
    })

    useEffect(()=>{
            if(userContxt.data && userContxt.data.user){
                setEmail(userContxt.data.user.email)
            }
            if(userContxt.data && userContxt.data.user){
                setfullName(userContxt.data.user.displayName)
            }
            if(userContxt.data && userContxt.data.user){
                setScreenName(userContxt.data.user.displayName)
            }
            if(userContxt.data && userContxt.data.user){
                setNumber(userContxt.data.user.phoneNumber)
            }
    }, []);

    const classes = useStyles();

    function validateAndGenerateError (validationFn, validationStr)  {
        setError(validationFn() ? validationStr : '');
    }

    const submitForm = (e) => {
        e.preventDefault()
        let payload = {
            'fullName': fullName,
            'screenName': screenName,
            'email': email,
            'password':password,
            'accountType': accountType,
            'gender': gender,
            'description': description,
            'address': {
                'street': street,
                'city': city,
                'state': state,
                'zip': zip,
                'number': number
            }
        }

        if(accountType == accountTypeEnum.organization){
            delete payload.gender;
            payload.screenName = fullName + screenName;
        }

        const signUpApi = async () => {
            await axios
                .post(`${backendURL}/users`, payload)
                .then((response) => {
                    console.log("response:", response.data);
                    alert("SignUp Successful! Please login.")
                    navigate('/signin');
                    // localStorage.setItem("userId", response?.data?.userId)
                    // localStorage.setItem("city", response?.data?.address?.city)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error?.response?.data?.message);
                });
    
        }
        signUpApi();

    }
    
    function handleFullName (event) {
        setfullName(event.target.value);
        validateAndGenerateError(()=> event.target.value.length < 3
        , 'Name should be atleast 3 characters.')
    }

    function handleScreenName(event){
        setScreenName(event.target.value);
        if(accountType === accountTypeEnum.organization){
            return
        }
        validateAndGenerateError(()=> event.target.value.length < 2 
        , 'Screen name should be atleast 3 characters.')
    }
    function handleEmail(event){
        setEmail(event.target.value);

        validateAndGenerateError(()=> !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)
        , 'Please enter a valid email.')
    }
    function handlePassword(event){
        setPassword(event.target.value);
        validateAndGenerateError(()=> !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(event.target.value)
        , 'Password must be minimum eight characters, at least one letter and one number')
        
    }
    function handleConfirmPassword(event){
        setConfirmPassword(event.target.value);
        validateAndGenerateError(()=> event.target.value != password, 
            'Entered password doesnt match with password.')
    }
    function handleAccountType(event){
        setAccountType(event.target.value);
    }
    function handleGender(event){
        setGender(event.target.value);
    }
    function handleDescription(event){
        setDescription(event.target.value);
    }
    function handleStreet(event){
        setStreet(event.target.value);
    }
    function handleCity(event){
        setCity(event.target.value);
    }
    function handleState(event){
        setState(event.target.value);
    }
    function handleZip(event){
        setZip(event.target.value);
    }
    function handleNumber(event){
        
        setNumber(event.target.value);
        // validateAndGenerateError(()=> !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(event.target.value)
        // , 'Please enter a valid mobile number.')
    }

    return ( 
        <div>
            <NewNavBar />
            <div className="signUpCenter">
                <h1> SignUp</h1>
                <p className="errorMessage">{error}</p>
                <form method="post" class='container'>
                <div className="signUptxt_field">
                        <input type="text" onChange={handleFullName} value={fullName} required></input>
                        <label>Full Name</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="email" onChange={handleEmail} value={email} required></input>
                        <label>Email</label>
                    </div>
                    <select onChange={handleAccountType}>
                        <option value="PERSON">Person</option>
                        <option value="ORGANIZATION">Organization</option>
                        </select>
                    <div className="signUptxt_field screen">
                        {accountType === accountTypeEnum.organization ? <span>{fullName}</span> : ''}
                        <input type="text" onChange={handleScreenName} value={screenName}required></input>
                        <label>Screen Name</label>
                    </div>
                    
                    {/* <div className="signUptxt_field">
                        <input type="text" onChange={handleAccountType } required></input>
                        <label>Account Type</label>
                    </div> */}
                    
                    <div className="signUptxt_field">
                        <input type="password" onChange={handlePassword} required></input>
                        <label>Password</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="password" onChange={handleConfirmPassword} required></input>
                        <label>Confirm Password</label>
                    </div>
                    
                     { accountType === accountTypeEnum.person && 
                    <div className='select'>
                        <select onChange={handleGender}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    }
                    <div className="signUptxt_field">
                        <input type="text" onChange={handleDescription} required></input>
                        <label>Description</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="number" onChange={handleNumber} value={number} required></input>
                        <label>House Number</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="text" onChange={handleStreet} required></input>
                        <label>Street</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="text" onChange={handleCity} required></input>
                        <label>City</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="text" onChange={handleState}required></input>
                        <label>State</label>
                    </div>
                    <div className="signUptxt_field">
                        <input type="number" onChange={handleZip}required></input>
                        <label>Zip</label>
                    </div>
                    {/* <div className="signUptxt_field">
                        <input type="text"  required></input>
                        <label>Country Code</label>
                    </div> */}

                    {/* <div className="signUppass">Forgot Password?</div> */}
                    <input type="button" onClick={submitForm} value="SignUp" disabled={error.length}></input>
                    <div className="signup_link_signUp">
                        Already a member? <a href="#" onClick={()=>navigate("/signin")}>SignIn</a>
                    </div>
                </form>
            </div>       
        </div>
     );
}
 
export default SignUp;