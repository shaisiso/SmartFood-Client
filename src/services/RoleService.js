
class RoleService {
    isManager = employee => (employee.role === 'MANAGER' || employee.role === 'KITCHEN_MANAGER' ||
        employee.role === 'BAR_MANAGER' || employee.role === 'SHIFT_MANAGER' || employee.role === 'DELIVERY_MANAGER')

} export default new RoleService()