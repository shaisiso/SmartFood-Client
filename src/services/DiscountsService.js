import api from './api';
import MemberService from './MemberService';

class DiscountsService {
    getDiscountsByDates = async (startDate, endDate) => api.get(`/discount/dates/${startDate}/${endDate}`)
    deleteDiscount = async discount => api.delete(`/discount/${discount.discountId}`)
    addNewDiscount = async discount => api.post(`/discount`, discount)
    getRelevantDiscountsForCurrentOrder = async order => api.get(`/discount/today/order/${order.id}`)
    getRelevantMemberDiscountsForCurrentOrder = async order => api.get(`/discount/today/order/member/${order.id}`)

    getAllDiscountsAppliedToOrder = async (order) => {
        let isMember
        if (order.person && order.person.phoneNumber) {
            await MemberService.getMemberByPhone(order.person.phoneNumber)
                .then(res => isMember = true).catch(err => isMember = false)
        }
        let discountsMember = []
        if (isMember) {
            await this.getRelevantMemberDiscountsForCurrentOrder(order)
                .then(result => {
                    discountsMember = [...result.data]
                })
        }
        let discountsRegular = []
        await this.getRelevantDiscountsForCurrentOrder(order)
            .then(result => {
                discountsRegular = [...result.data]
            })
        return [...discountsRegular, ...discountsMember]
    }

} export default new DiscountsService()