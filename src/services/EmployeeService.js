import api from './api';

class EmployeeService {
    findEmployeeByPhone = async phone => api.get(`/employee/phone/${phone}`)
} export default new EmployeeService()