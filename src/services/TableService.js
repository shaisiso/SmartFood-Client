import api from './api';

class TableService {
    getTableByTableId = tableId => api.get(`/table/${tableId}`)
    getAllTables = () => api.get(`/table`)
    updateTable = (table) =>api.put(`/table`,table)
} export default new TableService()