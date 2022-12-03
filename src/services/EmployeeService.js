import { API_URL } from '../utility/Utils'
import Axios from 'axios';

class EmployeeService {
    findEmployeeByPhone = async phone => {
        let response;
        await Axios.get(`${API_URL}/api/employee/phone/${phone}`)
            .then(res => response = res)
            .catch(err => { throw err })
        return response
    }
} export default new EmployeeService()