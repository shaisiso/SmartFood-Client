import { API_URL } from '../utility/Utils'
import Axios from 'axios';

class PersonService{
    findPersonByPhone = async phone => {
        let response;
       await Axios.get(`${API_URL}/api/person/${phone}`)
            .then(res => response = res)
            .catch(err => response=err)
            return response
    }
}export default new PersonService()