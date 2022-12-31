import api from './api';

class OrderService {
    addOrderOfTable = async (orderOfTable) => api.post(`/orderoftable`, orderOfTable)
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
        let orders = deliveries.concat(takeAways)
        orders.sort((o1, o2) => o1.hour.localeCompare(o2.hour))
        return orders
    }
    updateOrderStatus = async (order) => api.put(`/order/status/${order.id}/${order.status}`)
    updateDelivery = async delivery => api.put(`/delivery`, delivery)
    updateTakeAway = async takeAway => api.put(`/takeaway`, takeAway)
    updateOrderComment = async (orderId, comment) => api.put(`/order/comment/${orderId}`, comment)
    payment = async (orderId, amount) => api.put(`/order/pay/${orderId}/${amount}`)
    addNewDelivery = async (delivery) => api.post(`/delivery`, delivery)
    addNewTakeAway = async (takeAway) => api.post(`takeaway`, takeAway)
    addNewOrderOfTable = async order => api.post(`/orderoftable/`, order)
    deleteOrder = async (order) => api.delete(`/order/${order.id}`)
    getOrderById = async orderId => api.get(`/order/${orderId}`)
    addItemsListToOrder = async (orderId, itemsList) => api.post(`/order/item/list/${orderId}`, itemsList)
    deleteItemsListById = async (idList) => api.delete(`/order/item/list`, idList)
    deleteItemById = async (itemId) => api.delete(`/order/item/${itemId}`)
    getActiveOrderOfTable = async tableId => api.get(`/orderoftable/active/${tableId}`)
    addRequestForCancelItem = async (cancelRequest) => api.post(`/orderoftable/cancel/item`, cancelRequest)
    addCancelItemRequestAndDeleteItem = async (cancelRequest) => api.post(`/orderoftable/cancel/item/delete`, cancelRequest)
    handleRequestForCancelItem = async cancelRequest => api.put(`/orderoftable/cancel/item`, cancelRequest)
    getItemInOrderOfTableForCancel = async tableId => api.get(`/orderoftable/cancel/item/${tableId}`)
    getAllCancelRequests = async () => {
        let requests = []
        await api.get(`/orderoftable/cancel`)
            .then(res => {
                requests = [...res.data]
                // .map(cr => {
                //     let orderOfTable = {}
                //     this.getOrderById(cr.orderOfTable)
                //         .then(res => {
                //             orderOfTable = { ...res.data }
                //         }).catch(err => {
                //             console.log(err)
                //         })
                //     let cancelRequest = { ...cr, orderOfTable: { ...orderOfTable } }
                //     return cancelRequest
                // })
                //   console.log(requests)
                // requests = [...requestsPromise]
                //     requestsPromise.forEach(p => {
                //         p.then(r => {
                //             console.log('pr',r)
                //             requests.push({...r})
                //         })
                //     })
                // 
            }).catch(err => console.log(err))

        return requests
    }
}

export default new OrderService();