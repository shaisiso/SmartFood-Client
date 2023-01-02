import api from './api';

class EmployeeService {
    findEmployeeByPhone = async phone => api.get(`/employee/phone/${phone}`)
    getAll = async () => api.get(`/employee`)
    getAllRoles = async ()=> api.get(`/employee/roles`)
    addEmployee = async (employee)=> api.post(`/employee`,employee)
    deleteEmployee = async employee => api.delete(`/employee/${employee.id}`)
    updateEmployee = async employee => api.put(`/employee`,employee)
    updatePassowrd = async changePassordRequest => api.put(`/employee/password`,changePassordRequest)
} export default new EmployeeService()