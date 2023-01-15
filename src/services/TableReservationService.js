import api from './api';

class TableReservationService {
    addTableReservation = async reservation => api.post(`/reservation`, reservation)
    updateTableReservation = async reservation => api.put(`/reservation`, reservation)
    delete = async (reservation) => api.delete(`/reservation/${reservation.reservationId}`)
    getCurrentReservations = async () => api.get(`/reservation/current `)
    getTableReservationsByDates = async (startDate, endDate) => api.get(`/reservation/date/${startDate}/${endDate || ''}`)
    getAvailableHoursByDateAndDiners = async (date, numberOfDiners) => api.get(`/reservation/hours/${date}/${numberOfDiners}`)
    getTableReservationsByCustomer= async  phoneNumber=>api.get(`/reservation/phoneNumber/${phoneNumber}`)
} export default new TableReservationService()