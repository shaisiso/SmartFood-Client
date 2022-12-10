import api from './api';

class MenuService {
    getCategories = async () => api.get(`/menu/categories`)
    getMenu = async () => api.get(`/menu`)
    addItem = async (itemForAPI) => api.post(`/menu`, itemForAPI)
    deleteItem = async (item) => api.delete(`/menu/${item.itemId}`)
    updateItem = async (item) => api.put(`/menu`, item)
}

export default new MenuService();