import api from './api';

class ShiftService {
    startShift = employee => api.post(`/shift `,{employee: employee})
    exitShift = shift => api.put(`/shift `,shift)
    getShiftByEmployeeAndDates = (employee,startDate,endDate)=> api.get(`/shift/${employee.phoneNumber}/${startDate}/${endDate}`)
} export default new ShiftService()