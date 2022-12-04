import HttpSevice from './HttpSevice';

class TableService {
    getTableByTableId = tableId => HttpSevice.GET(`/table/${tableId}`)
    getAllTables = () => HttpSevice.GET(`/table`)
} export default new TableService()