import api from './api';

class PersonService {
    findPersonByPhone = async phone => api.get(`/person/${phone}`)

} export default new PersonService()