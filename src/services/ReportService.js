import api from './api';

class ReportService {
    getIncomeDaily = async (startDate,endDate) => api.get(`/reports/daily/${startDate}/${endDate}`)

} export default new ReportService()