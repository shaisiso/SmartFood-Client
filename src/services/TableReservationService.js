import api from './api';

class TableReservationService {
    getCurrentReservations = async () => api.get(`/reservation/current `)
    getTableReservationsByDates = async (startDate, endDate) => api.get(`/reservation/date/${startDate}/${endDate || ''}`)
    addTableReservation = async reservation => api.post(`/reservation`, reservation)
    updateTableReservation = async reservation => api.put(`/reservation`, reservation)
    getAvailableHoursByDateAndDiners = async (date, numberOfDiners) => api.get(`/reservation/hours/${date}/${numberOfDiners}`)
    delete = async (reservation) => api.delete(`/reservation/${reservation.reservationId}`)
} export default new TableReservationService()