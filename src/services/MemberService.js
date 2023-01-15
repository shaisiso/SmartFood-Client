import api from './api';

class MemberService {
    getMemberByPhone = async (phoneNumber) => api.get(`/member/${phoneNumber}`)
    addMember = async member => api.post(`/member`,member)
}

export default new MemberService();