import HttpSevice from './HttpSevice';

class EmployeeService {
    findEmployeeByPhone = async phone => HttpSevice.GET(`/employee/phone/${phone}`)
} export default new EmployeeService()