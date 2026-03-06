import axios from 'axios'

 const apiBusPassages = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 50000, 
});

// apiBusPassages.interceptors.request.use(async config =>{
//     const userData = await localStorage.getItem('buspassages:userData')
//     const token = userData && JSON.parse(userData).token
//     config.headers.authorization = `Bearer ${token}`
//     return config
// })

export default apiBusPassages