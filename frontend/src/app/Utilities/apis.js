import moment from "moment";
import axios from 'axios';
import { backendURL } from "../../config";

const updateSystemTimeApi = async (time) => {
    await axios
    .put(`${backendURL}/event/updateDbEvent?currentTime=${moment(time).format("yyyy-MM-DD HH:mm:ss")}`)
    .then((response) => {
        console.log("response:", response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}

export {
    updateSystemTimeApi,
}
