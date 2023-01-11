import api from './api';

class QRService {
    getTokenForTableQR = async (tableId,daysForExpiration) => api.get(`/qr?tableId=${tableId}&daysForExpiration=${daysForExpiration}`)
    verifyToken = async (token) => api.post(`/qr`,token,{ headers: {'Content-Type': 'text/plain'} })
} export default new QRService()