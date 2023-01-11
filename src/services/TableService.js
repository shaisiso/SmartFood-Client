import api from './api';

class TableService {
    getTableByTableId = tableId => api.get(`/table/${tableId}`)
    getAllTables = () => api.get(`/table`)
    changeTableBusy = (tableId, isBusy) => api.put(`/table/busy/${tableId}/${isBusy}`)
    updateTable = (table) => api.put(`/table`, table)
    deleteTable = (table) => api.delete(`/table/${table.tableId}`)
    addTable = (table) => api.post(`/table`,table)
} export default new TableService()