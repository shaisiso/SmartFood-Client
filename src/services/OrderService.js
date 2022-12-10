import api from './api';

class OrderService {
    addOrderOfTable = async (orderOfTable) => api.post(`/table-order`, orderOfTable)
}

export default new OrderService();