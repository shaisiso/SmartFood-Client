import api from './api';

class WaitingListService {
    add = async waitingListRequest => api.post(`/waiting-list`,waitingListRequest)
} export default new WaitingListService()