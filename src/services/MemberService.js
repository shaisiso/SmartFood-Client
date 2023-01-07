import api from './api';

class MemberService {
    getMemberByPhone = async (phoneNumber) => api.get(`/member/${phoneNumber}`)
}

export default new MemberService();