import { API_URL } from '../utility/Utils'
import Axios from 'axios';

class HttpSevice {
    GET = async relativeUrl => {
        let response;
        await Axios.get((`${API_URL}/api${relativeUrl}`))
            .then(res => {
                response = res
            })
            .catch(err => {
                //console.log(err)
                throw err
            })
        return response
    }
    POST = async (relativeUrl, body) => {
        let response;
        await Axios.post(`${API_URL}/api${relativeUrl}`, body)
            .then(res => {
                response = res
            })
            .catch(err => { throw err })
        return response
    }
}
export default new HttpSevice();