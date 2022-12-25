import api from './api';

class TableService {
    getTableByTableId = tableId => api.get(`/table/${tableId}`)
    getAllTables = () => api.get(`/table`)
    updateTable = (table) =>api.put(`/table`,table)
    changeTableBusy= (tableId,isBusy) => api.put(`/table/busy/${tableId}/${isBusy}`)
} export default new TableService()