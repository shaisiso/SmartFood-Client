import api from './api';

class DiscountsService {
    getDiscountsByDates = async (startDate,endDate) => api.get(`/discount/dates/${startDate}/${endDate}`)
    deleteDiscount = async discount => api.delete(`/discount/${discount.discountId}`)
    addNewDiscount = async discount =>api.post(`/discount`,discount)
    getRelevantDiscountsForCurrentOrder = async order=>api.get(`/discount/today/order/${order.id}`)
    getRelevantMemberDiscountsForCurrentOrder = async order=>api.get(`/discount/today/order/member/${order.id}`)
} export default new DiscountsService()