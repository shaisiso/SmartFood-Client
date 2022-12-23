import api from './api';

class OrderService {
    addOrderOfTable = async (orderOfTable) => api.post(`/table-order`, orderOfTable)
    getAllStatuses = async () => api.get(`/order/statuses`)
    getActiveExternalOrders = async () => {
        let deliveries = []
        let takeAways = []
        await api.get(`/delivery/active`).then(res => {
            res.data.forEach(d => {
                deliveries.push({ ...d, type: 'D' })
            })
        }).catch(err => console.log(err))
        await api.get(`/takeaway/active`).then(res => {
            res.data.forEach(t => takeAways.push({ ...t, type: 'TA' }))
        }).catch(err => console.log(err))
        return deliveries.concat(takeAways)
    }
    updateOrderStatus = async (order) => api.put(`/order/status/${order.id}/${order.status}`)
    updateDelivery = async delivery => api.put(`/delivery`, delivery)
    updateTakeAway = async takeAway=> api.put(`takeaway`,takeAway)
    updateOrderComment = async (orderId,comment)=> api.put(`/order/comment/${orderId}`,comment)
    payment = async (orderId,amount) => api.put(`/order/pay/${orderId}/${amount}`)
    addNewDelivery = async (delivery)=>api.post(`/delivery`,delivery)
    addNewTakeAway = async (takeAway) => api.post(`takeaway`,takeAway)
}

export default new OrderService();