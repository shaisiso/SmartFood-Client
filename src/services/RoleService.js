
class RoleService {
    isManager = employee => employee && employee.role && (employee.role === 'MANAGER' || employee.role === 'KITCHEN_MANAGER' ||
        employee.role === 'BAR_MANAGER' || employee.role === 'SHIFT_MANAGER' || employee.role === 'DELIVERY_MANAGER')
    isGeneralManager = employee => employee && employee.role && employee.role === 'MANAGER'

} export default new RoleService()