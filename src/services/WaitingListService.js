import api from './api';

class WaitingListService {
    add = async waitingListRequest => api.post(`/waitinglist`,waitingListRequest)
} export default new WaitingListService()