import SetRole from '../console/commands/SetRole';
import UnsetRole from '../console/commands/UnsetRole';
import SetRolePermission from '../console/commands/SetRolePermission';
import SeedData from '../console/commands/SeedData';

export default {
    'set:role': SetRole,
    'unset:role': UnsetRole,
    'set:permission': SetRolePermission,
    'migration:seed': SeedData,
};