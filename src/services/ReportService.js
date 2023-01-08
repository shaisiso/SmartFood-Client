import api from './api';

class ReportService {
    getIncomeDaily = async (startDate,endDate) => api.get(`/reports/income/daily/${startDate}/${endDate}`)
    getIncomeMonthly = async (startDate,endDate) => api.get(`/reports/income/monthly/${startDate}/${endDate}`)
    getCanceledItems = async (startDate,endDate) => api.get(`/reports/menu/canceled/${startDate}/${endDate}`)
    getOrderedItems = async (startDate,endDate) => api.get(`/reports/menu/ordered/${startDate}/${endDate}`)
    getOrdersDailyReport = async (startDate,endDate) => api.get(`/reports/orders/daily/${startDate}/${endDate}`)
    getOrdersMonthlyReport  = async (startDate,endDate) => api.get(`/reports/orders/monthly/${startDate}/${endDate}`)
} export default new ReportService()