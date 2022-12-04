import HttpSevice from './HttpSevice';

class PersonService {
    findPersonByPhone = async phone => HttpSevice.GET(`/person/${phone}`)

} export default new PersonService()