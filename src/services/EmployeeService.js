import api from './api';

class EmployeeService {
    findEmployeeByPhone = async phone => api.get(`/employee/phone/${phone}`)
    getAll = async () => api.get(`/employee`)
    getAllRoles = async ()=> api.get(`/employee/roles`)
    addEmployee = async (employee)=> api.post(`/employee`,employee)
} export default new EmployeeService()