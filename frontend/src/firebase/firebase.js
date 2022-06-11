import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { backendURL } from '../config';

// add your credentials here
const firebaseConfig = {
    apiKey: "xyz",
    authDomain: "xyz",
    projectId: "xyz",
    storageBucket: "xyz",
    messagingSenderId: "xyz",
    appId: "xyz"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = (callback) =>{
    signInWithPopup(auth,provider).then((result)=>{
        console.log(result._tokenResponse.email);
        // console.log(payload)
        const requestOptions = {
            method : "POST", 
            headers : {'Content-Type' : "application/json"},
            body : result._tokenResponse.email
        }
        fetch(`${backendURL}/users/signingmail`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("userId", data.userId)
            localStorage.setItem("city", data.address.city)
            callback(true,data);
        })
        .catch(error => {
            console.log("error", error)
            callback(false, result);
        })
    }).catch((error)=>{
        console.log(error)
        callback(false);
    });
}
