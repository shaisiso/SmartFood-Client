import api from './api';

class DiscountsService {
    getDiscountsByDates = async (startDate,endDate) => api.get(`/discount/dates/${startDate}/${endDate}`)
    deleteDiscount = async discount => api.delete(`/discount/${discount.discountId}`)
    addNewDiscount = async discount =>api.post(`/discount`,discount)
} export default new DiscountsService()