import api from './api';

class TableReservationService {
    getCurrentReservations = async () => api.get(`/reservation/current `)
    getTableReservationsByDates = async (startDate,endDate) => api.get(`/reservation/date/${startDate}/${endDate || ''}`)
    addTableReservation = async reservation=> api.post(`/reservation`, reservation)
} export default new TableReservationService()