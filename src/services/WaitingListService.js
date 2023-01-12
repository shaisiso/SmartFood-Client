import api from './api';

class WaitingListService {
    add = async waitingListRequest => api.post(`/waiting-list`,waitingListRequest)
    approveTokenForReservation = async token=> api.post(`/waiting-list/approve/token`,token,{ headers: {'Content-Type': 'text/plain'}})
} export default new WaitingListService()