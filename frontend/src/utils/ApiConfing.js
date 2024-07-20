import axios from "axios";

const api = axios.create({

 withCredentials: true,
//  baseURL:'http://localhost:5125/api/checkBusiness'


});

export default api;