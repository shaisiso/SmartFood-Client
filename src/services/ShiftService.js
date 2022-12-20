import api from './api';

class ShiftService {
    startShift = employee => api.post(`/shift `,{employee: employee})
    exitShift = shift => api.put(`/shift `,shift)
    getShiftByEmployeeAndDates = (employee,startDate,endDate)=> api.get(`/shift/${employee.phoneNumber}/${startDate}/${endDate}`)
    updateShift = shift => api.put(`/shift/update`,shift)
    getShiftsToApprove = () =>api.get(`/shift/approve`)
    deleteShift = shift => api.delete(`/shift/${shift.shiftID}`)
} export default new ShiftService()