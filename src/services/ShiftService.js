import api from './api';

class ShiftService {
    startShift = async employee => api.post(`/shift `, { employee: employee })
    exitShift = async shift => api.put(`/shift `, shift)
    getShiftByEmployeeAndDates = async (employee, startDate, endDate) => api.get(`/shift/${employee.phoneNumber}/${startDate}/${endDate}`)
    getShiftByEmployeeIdAndDates= async (employeeId, startDate, endDate) => api.get(`/shift/id/${employeeId}/${startDate}/${endDate}`)
    getShiftByDates = async ( startDate, endDate) => api.get(`/shift/${startDate}/${endDate}`)
    updateShift = async shift => api.put(`/shift/update`, shift)
    getShiftsToApprove = async () => api.get(`/shift/approve`)
    deleteShift = async shift => api.delete(`/shift/${shift.shiftID}`)
    getDeliveryGuyInShift = async () => api.get(`/shift/active/delivery`)
} export default new ShiftService()